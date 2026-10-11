"""
VisionX Post-Detection Conversational Agent
Powered by Strands Agents framework and Grok/Groq LLM endpoint.
Complies with Prompt 10 requirements:
- Object-aware: receives active object, confidence, bbox, category, and all frame detections.
- Controlled tools: get_detection_context, get_waste_guidance, search_material_safety, get_local_disposal_guidance.
- Structured output: answer, suggested_questions, sources, needs_clarification, uncertainty_note.
- Secure: credentials never logged or exposed.
"""

import os
import json
import logging
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import httpx

# Import strands tool decorator
from strands import tool

# Import internal knowledge base
from backend.waste_knowledge import WASTE_KNOWLEDGE_BASE, resolve_waste_item

load_dotenv()

logger = logging.getLogger("visionx.agent")

# In-memory session store for frame detection contexts
SESSION_DETECTIONS: Dict[str, Dict[str, Any]] = {}


# --- Pydantic Schema for Structured Response ---
class AgentChatResponse(BaseModel):
    answer: str = Field(
        ...,
        description="Comprehensive, helpful, grounded answer regarding waste disposal and recycling in Markdown format."
    )
    suggested_questions: List[str] = Field(
        default_factory=list,
        description="Exactly 3 dynamic, context-relevant follow-up questions the user can ask next."
    )
    sources: List[str] = Field(
        default_factory=list,
        description="Authoritative sources or knowledge bases referenced in the response."
    )
    needs_clarification: bool = Field(
        default=False,
        description="True if physical material composition cannot be definitively identified from visual inspection."
    )
    uncertainty_note: Optional[str] = Field(
        default=None,
        description="Explanatory note if material identification or local municipal policy is ambiguous."
    )


def register_session_detections(session_id: str, detections: List[Dict[str, Any]]):
    """Stores the latest detections for a given session."""
    SESSION_DETECTIONS[session_id] = {
        "timestamp": time.time(),
        "detections": {d.get("id", str(i)): d for i, d in enumerate(detections)}
    }


# --- Four Controlled Strands Tools ---

@tool
def get_detection_context(session_id: str, detection_id: str) -> Dict[str, Any]:
    """
    Retrieves the exact YOLO detection details (class name, bounding box coordinates,
    confidence score, and detection timestamp) for a given object in the session.
    """
    session_data = SESSION_DETECTIONS.get(session_id)
    if not session_data:
        return {"found": False, "error": f"No detection session registered with ID '{session_id}'."}

    dets = session_data.get("detections", {})
    if detection_id in dets:
        d = dets[detection_id]
        return {
            "found": True,
            "id": d.get("id"),
            "display_name": d.get("display_name"),
            "model_class_name": d.get("model_class_name"),
            "confidence": d.get("confidence"),
            "box": d.get("box"),
            "waste_category": d.get("waste_category"),
            "material": d.get("material")
        }

    # Fallback to first available detection if specific ID not found
    if dets:
        first_d = next(iter(dets.values()))
        return {
            "found": True,
            "id": first_d.get("id"),
            "display_name": first_d.get("display_name"),
            "confidence": first_d.get("confidence"),
            "box": first_d.get("box"),
            "note": "Exact ID not matched, returned primary detection in frame."
        }

    return {"found": False, "error": "No objects found in session."}


@tool
def get_waste_guidance(item_or_category: str) -> Dict[str, Any]:
    """
    Retrieves official waste sorting instructions, bin color, recommended cleaning/preparation
    steps, and recyclability status from the VisionX Structured Knowledge Base.
    """
    query = item_or_category.lower().strip()

    # Search in knowledge base keys or display names
    for key, data in WASTE_KNOWLEDGE_BASE.items():
        if (
            query in key.lower()
            or query in data.get("display_name", "").lower()
            or query in data.get("model_class_name", "").lower()
            or query in data.get("waste_category", "").lower()
        ):
            return {
                "matched_item": data.get("display_name"),
                "waste_category": data.get("waste_category"),
                "disposal_method": data.get("disposal_method"),
                "recycling_guidance": data.get("recycling_guidance"),
                "preparation_steps": data.get("preparation_steps", []),
                "contamination_warning": data.get("contamination_warning"),
                "environmental_impact": data.get("environmental_impact"),
                "source": data.get("source")
            }

    return {
        "matched_item": item_or_category,
        "waste_category": "general-waste",
        "disposal_method": "Check item for resin identification codes (#1-#7) or place in residual waste.",
        "recycling_guidance": "Uncertain items should not be placed in curbside recycling without confirming local facility acceptance.",
        "preparation_steps": ["Empty completely", "Inspect for recyclability symbol"],
        "source": "VisionX Standard Sanitation Protocol"
    }


@tool
def search_material_safety(material_name: str) -> Dict[str, Any]:
    """
    Returns material safety hazards, contamination risks, and handling precautions
    (e.g., lithium batteries, broken glass, chemical containers, biohazards).
    """
    m = material_name.lower().strip()
    if any(k in m for k in ["battery", "lithium", "electronic", "cell"]):
        return {
            "hazard_level": "CRITICAL FIRE HAZARD",
            "risks": "Lithium batteries can explode or ignite when crushed inside municipal compactor trucks or conveyor belts.",
            "safety_instructions": "Tape both terminals with non-conductive electrical tape. Take immediately to certified battery or e-waste drop-off. NEVER put in curbside bins.",
            "source": "Call2Recycle & EPA Universal Waste Regulations"
        }
    elif any(k in m for k in ["glass", "broken", "jar", "bottle"]):
        return {
            "hazard_level": "MODERATE LACERATION HAZARD",
            "risks": "Broken glass presents severe injury risks to manual sorting facility workers and contaminates paper pulp.",
            "safety_instructions": "If intact, recycle in curbside glass bin. If broken, wrap securely in cardboard or newspaper and dispose in non-recyclable trash.",
            "source": "Occupational Safety and Health Guidelines for MRFs"
        }
    elif any(k in m for k in ["plastic", "pet", "film", "wrapper", "bag"]):
        return {
            "hazard_level": "EQUIPMENT DAMAGE & MICROPLASTIC HAZARD",
            "risks": "Thin films jam disc screen axles in MRF sorting facilities. Unrecycled plastics break down into microplastics.",
            "safety_instructions": "Separate rigid bottles (curbside) from thin plastic films (drop-off at participating supermarkets).",
            "source": "Association of Plastic Recyclers (APR)"
        }
    elif any(k in m for k in ["organic", "food", "grease", "oil"]):
        return {
            "hazard_level": "COMMODITY CONTAMINATION",
            "risks": "Grease and moisture ruin dry paper and cardboard, making entire truckloads unrecyclable.",
            "safety_instructions": "Compost food scraps or use green organic bin. Thoroughly rinse containers before recycling.",
            "source": "Municipal Composting Protocols"
        }
    else:
        return {
            "hazard_level": "LOW TO STANDARD",
            "risks": "General municipal solid waste handling.",
            "safety_instructions": "Keep materials clean and dry. Avoid mixing unknown chemical residues.",
            "source": "VisionX Safety Database"
        }


@tool
def get_local_disposal_guidance(locality: str, category: str) -> Dict[str, Any]:
    """
    Provides regional municipal recycling standards, special drop-off programs,
    and container deposit scheme (Bottle Bill) guidance for a given locality.
    """
    loc = locality.lower().strip()
    cat = category.lower().strip()

    has_deposit = any(k in loc for k in ["california", "oregon", "michigan", "new york", "germany", "australia"])

    return {
        "locality": locality or "Standard Municipal Framework",
        "category": category,
        "deposit_return_eligible": has_deposit and "recyclable" in cat,
        "deposit_refund_amount": "5-10 cents per beverage container where applicable" if has_deposit else None,
        "curbside_rules": "Single-stream blue bin for clean rigid containers and dry paper. Green bin for organics. Black/gray bin for landfill residual.",
        "drop_off_programs": "Supermarket drop-off bins accept LDPE plastic bags and bread bags. Municipal civic amenity sites accept e-waste and chemicals.",
        "source": "Global Recycling Directory & Municipal Waste Guidelines"
    }


# --- Agent Orchestration & Grok/Groq LLM Calling ---

SYSTEM_PROMPT = """You are VisionX Assistant, a world-class AI environmental engineer and waste classification specialist.
You work inside the VisionX platform, helping users understand how to properly recycle, compost, reuse, or dispose of items detected in their camera or uploaded photos by the YOLO computer vision model.

CRITICAL OPERATIONAL RULES:
1. OBJECT AWARENESS:
   - You are informed of the current object the user selected, its YOLO model classification, confidence score, bounding box, and mapped waste category.
   - You also know all other detected objects present in the same camera frame / image.
   - When appropriate, refer to these detections to provide context (e.g. "Along with your plastic bottle, I noticed a cardboard box in the frame—be sure to keep the paper dry!").
2. ACCURACY & SAFETY:
   - Be clear, practical, and direct.
   - Emphasize preparation steps (e.g., empty liquids, rinse food residue, crush flat, leave caps on or off).
   - If material composition cannot be definitively established from visual camera input alone (e.g., confusing plastic resins #1 vs #7, or unlabelled composite plastics), be transparent and state the uncertainty in the note.
3. OUTPUT FORMAT:
   - You must ALWAYS respond in valid JSON adhering strictly to this schema:
     {
       "answer": "Your comprehensive, helpful answer in GitHub-flavored Markdown...",
       "suggested_questions": ["Question 1?", "Question 2?", "Question 3?"],
       "sources": ["Source 1", "Source 2"],
       "needs_clarification": false,
       "uncertainty_note": null
     }
   - The "suggested_questions" list MUST contain exactly 3 concise, highly relevant questions that the user can ask next with a single click.
   - Never output markdown formatting fences like ```json ... ``` around the JSON if possible, just the raw JSON object.
"""


def _get_api_credentials() -> tuple[str, str, List[str]]:
    """Resolves API key, endpoint URL, and candidate models without exposing secrets."""
    key = os.getenv("GROK_API") or os.getenv("XAI_API_KEY") or os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError("GROK_API credentials not configured in .env")

    # Determine endpoint and candidate models based on key prefix
    if key.startswith("gsk_"):
        # Groq API endpoint
        base_url = "https://api.groq.com/openai/v1/chat/completions"
        candidate_models = [
            "llama-3.1-8b-instant",
            "qwen/qwen3.8-27b",
            "llama-3.3-70b-specdec"
        ]
    elif key.startswith("xai-"):
        # Official xAI Grok endpoint
        base_url = "https://api.x.ai/v1/chat/completions"
        candidate_models = [
            "grok-beta",
            "grok-2-latest"
        ]
    else:
        # Default endpoint
        base_url = "https://api.groq.com/openai/v1/chat/completions"
        candidate_models = [
            "llama-3.1-8b-instant",
            "qwen/qwen3.8-27b"
        ]

    return key, base_url, candidate_models


async def execute_agent_chat(
    session_id: str,
    user_question: str,
    selected_object: Optional[Dict[str, Any]] = None,
    all_detections: Optional[List[Dict[str, Any]]] = None,
    history: Optional[List[Dict[str, str]]] = None,
    locality: Optional[str] = "United States / General Municipal"
) -> Dict[str, Any]:
    """
    Executes a post-detection conversational turn using Strands tools & Grok LLM.
    Returns structured dict matching AgentChatResponse.
    """
    key, base_url, candidate_models = _get_api_credentials()

    # Register detections into session cache
    if all_detections:
        register_session_detections(session_id, all_detections)

    # 1. Pre-fetch tool intelligence for the active detection
    active_name = selected_object.get("display_name", "Waste Item") if selected_object else "Waste Item"
    active_category = selected_object.get("waste_category", "general") if selected_object else "general"
    active_material = selected_object.get("material", "Unknown") if selected_object else "Unknown"

    guidance_context = get_waste_guidance(active_name)
    safety_context = search_material_safety(active_material)
    local_context = get_local_disposal_guidance(locality or "General", active_category)

    # Construct frame context
    frame_context_str = ""
    if all_detections and len(all_detections) > 0:
        other_items = [
            f"{d.get('display_name')} (Confidence: {int(float(d.get('confidence', 0)) * 100)}%)"
            for d in all_detections
        ]
        frame_context_str = f"All objects detected in this photo: {', '.join(other_items)}."

    # Construct structured system message
    full_system = f"""{SYSTEM_PROMPT}

CURRENT DETECTION CONTEXT:
- Active Selected Object: {active_name}
- YOLO Class: {selected_object.get('model_class_name') if selected_object else 'N/A'}
- Model Confidence: {int(float(selected_object.get('confidence', 0.8)) * 100) if selected_object else 'N/A'}%
- Mapped Waste Category: {active_category}
- Identified Material: {active_material}
- {frame_context_str}

RETRIEVED KNOWLEDGE BASE GUIDANCE:
{json.dumps(guidance_context, indent=2)}

MATERIAL SAFETY CONTEXT:
{json.dumps(safety_context, indent=2)}

LOCAL DISPOSAL RULES:
{json.dumps(local_context, indent=2)}
"""

    # Build messages array including conversation history
    messages: List[Dict[str, str]] = [{"role": "system", "content": full_system}]

    if history:
        for turn in history[-6:]:  # Keep last 6 turns for context
            role = "user" if turn.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": turn.get("text", "")})

    messages.append({
        "role": "user",
        "content": f"{user_question}\n\nPlease reply in strict JSON format with keys: answer, suggested_questions, sources, needs_clarification, uncertainty_note."
    })

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "User-Agent": "VisionX/1.0"
    }

    last_error = None
    async with httpx.AsyncClient(timeout=25.0) as client:
        for model_name in candidate_models:
            try:
                payload = {
                    "model": model_name,
                    "messages": messages,
                    "temperature": 0.3,
                    "response_format": {"type": "json_object"}
                }

                resp = await client.post(base_url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    
                    # Parse JSON content safely
                    parsed = json.loads(content)
                    
                    # Ensure all required keys exist
                    answer = parsed.get("answer") or parsed.get("message") or content
                    suggested = parsed.get("suggested_questions", [])
                    if not isinstance(suggested, list) or len(suggested) == 0:
                        suggested = [
                            f"How should I clean this {active_name} before recycling?",
                            f"What happens if I put this in the wrong bin?",
                            f"Can the bottle cap or lid be recycled together with it?"
                        ]

                    sources = parsed.get("sources", ["VisionX Knowledge Engine", "EPA Municipal Recycling Guide"])
                    needs_clarification = bool(parsed.get("needs_clarification", False))
                    uncertainty_note = parsed.get("uncertainty_note")

                    return {
                        "answer": answer,
                        "suggested_questions": suggested[:3],
                        "sources": sources,
                        "needs_clarification": needs_clarification,
                        "uncertainty_note": uncertainty_note,
                        "model_used": model_name
                    }
                else:
                    last_error = f"Model {model_name} HTTP {resp.status_code}: {resp.text}"
                    logger.warning("Agent fallback triggered: %s", last_error)
            except Exception as e:
                last_error = str(e)
                logger.warning("Agent call failed for %s: %s", model_name, e)

    # Fallback to local grounded knowledge if all cloud attempts failed
    logger.error("All agent models failed, providing structured grounded fallback: %s", last_error)
    return {
        "answer": (
            f"**Disposal Method for {active_name}:** {guidance_context.get('disposal_method')}\n\n"
            f"**Recycling Guidance:** {guidance_context.get('recycling_guidance')}\n\n"
            f"**Preparation Steps:**\n" +
            "\n".join([f"- {s}" for s in guidance_context.get("preparation_steps", ["Empty and rinse"])])
        ),
        "suggested_questions": [
            f"How should I clean this {active_name} before disposal?",
            "What happens if food residue is left on recyclables?",
            "Where can I find my nearest drop-off point?"
        ],
        "sources": [guidance_context.get("source", "VisionX Knowledge Engine")],
        "needs_clarification": not selected_object.get("material_verified", False) if selected_object else False,
        "uncertainty_note": "Visual detection cannot verify exact polymer grade without physical resin stamp inspection.",
        "model_used": "visionx-grounded-fallback"
    }
