"""
VisionX Real-Time YOLO Inference Backend
FastAPI server serving YOLO11n fine-tuned on municipal waste detection.
Enhanced with class-agnostic NMS, containment deduplication, and max-confidence ranking.
"""

import io
import sys
import time
from pathlib import Path
from typing import Optional, Dict, Any, List

# Ensure parent directory is in sys.path for direct script execution
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
from ultralytics import YOLO

from backend.waste_knowledge import resolve_waste_item, WASTE_KNOWLEDGE_BASE

# Initialize FastAPI App
app = FastAPI(
    title="VisionX Real-Time Waste Detection API",
    description="Live object detection and structured waste intelligence for VisionX",
    version="1.1.0"
)

# Enable CORS for local Vite development & cloud preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate Model Weights Path
WEIGHTS_CANDIDATES = [
    BASE_DIR / "weights" / "best.pt",
    BASE_DIR / "YOLO Project - Copy" / "weights" / "best.pt",
    Path("weights/best.pt")
]

MODEL_PATH: Optional[Path] = None
for candidate in WEIGHTS_CANDIDATES:
    if candidate.exists():
        MODEL_PATH = candidate
        break

if not MODEL_PATH:
    raise FileNotFoundError(
        f"Could not locate YOLO weights file. Searched candidates: {[str(c) for c in WEIGHTS_CANDIDATES]}"
    )

print(f"[VisionX Backend] Loading YOLO model from: {MODEL_PATH}")
device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO(str(MODEL_PATH))
print(f"[VisionX Backend] Model loaded successfully on device: {device}")
print(f"[VisionX Backend] Supported classes ({len(model.names)}): {model.names}")


def compute_box_overlap(box1: List[float], box2: List[float]) -> float:
    """
    Computes maximum of standard Intersection-over-Union (IoU)
    and containment ratio between two bounding boxes [x1, y1, x2, y2].
    """
    xA = max(box1[0], box2[0])
    yA = max(box1[1], box2[1])
    xB = min(box1[2], box2[2])
    yB = min(box1[3], box2[3])

    inter_w = max(0.0, xB - xA)
    inter_h = max(0.0, yB - yA)
    inter_area = inter_w * inter_h

    if inter_area <= 0.0:
        return 0.0

    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])

    if area1 <= 0.0 or area2 <= 0.0:
        return 0.0

    union_area = area1 + area2 - inter_area
    iou = inter_area / union_area if union_area > 0 else 0.0
    containment1 = inter_area / area1
    containment2 = inter_area / area2

    return max(iou, containment1, containment2)


def deduplicate_boxes(raw_detections: List[Dict[str, Any]], overlap_threshold: float = 0.35) -> List[Dict[str, Any]]:
    """
    Suppresses duplicate overlapping detections for the same physical object.
    Strictly preserves ONLY the single detection with the maximum confidence.
    """
    if len(raw_detections) <= 1:
        return raw_detections

    # Sort primarily by confidence descending
    sorted_dets = sorted(raw_detections, key=lambda d: d["confidence"], reverse=True)
    kept_dets: List[Dict[str, Any]] = []

    for candidate in sorted_dets:
        cand_coords = candidate["raw_coords"]
        is_duplicate = False

        for kept in kept_dets:
            kept_coords = kept["raw_coords"]
            overlap = compute_box_overlap(cand_coords, kept_coords)
            if overlap >= overlap_threshold:
                # Candidate overlaps significantly with a higher-confidence detection
                is_duplicate = True
                break

        if not is_duplicate:
            kept_dets.append(candidate)

    return kept_dets


@app.get("/api/health")
async def health_check():
    """Health check endpoint confirming model status, device, and supported classes."""
    return {
        "status": "healthy",
        "service": "VisionX YOLO Inference Engine",
        "model_file": str(MODEL_PATH.name),
        "device": device,
        "classes_count": len(model.names),
        "supported_classes": model.names,
        "default_conf_threshold": 0.18
    }


@app.get("/api/knowledge-base")
async def get_knowledge_base():
    """Returns the complete structured waste knowledge base."""
    return {
        "count": len(WASTE_KNOWLEDGE_BASE),
        "classes": list(WASTE_KNOWLEDGE_BASE.keys()),
        "knowledge": WASTE_KNOWLEDGE_BASE
    }


@app.post("/api/detect")
async def detect_waste_objects(
    file: UploadFile = File(...),
    conf: float = Query(0.18, ge=0.05, le=1.0, description="Confidence threshold for YOLO filtering")
):
    """
    Run YOLO waste detection on an uploaded image or camera frame.
    Processes:
      1. Image decoding & validation
      2. YOLO inference with agnostic_nms=True
      3. Strict containment & IoU deduplication (keeps max confidence per physical item)
      4. Normalization of bounding boxes to [0..1] range
      5. Knowledge enrichment & structured disposal mapping
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Please upload a valid image (JPEG, PNG, WEBP)."
        )

    start_time = time.perf_counter()

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        # Ensure image is in RGB format
        if image.mode != "RGB":
            image = image.convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image file: {str(e)}")

    orig_width, orig_height = image.size

    # Run real YOLO inference with class-agnostic NMS and optimized IoU
    try:
        results = model.predict(
            source=image,
            conf=conf,
            iou=0.35,
            agnostic_nms=True,
            imgsz=640,
            verbose=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"YOLO inference error: {str(e)}")

    inference_ms = round((time.perf_counter() - start_time) * 1000, 2)
    raw_detections: List[Dict[str, Any]] = []

    result = results[0]
    boxes = result.boxes

    if boxes is not None and len(boxes) > 0:
        for box in boxes:
            class_id = int(box.cls[0].item())
            confidence = float(box.conf[0].item())
            class_name = model.names.get(class_id, f"Class_{class_id}")

            coords = box.xyxy[0].tolist()
            raw_detections.append({
                "class_id": class_id,
                "confidence": confidence,
                "class_name": class_name,
                "raw_coords": coords
            })

    # Apply strict deduplication to ensure each physical object is shown ONLY once with max confidence
    filtered_detections = deduplicate_boxes(raw_detections, overlap_threshold=0.35)

    final_detections: List[Dict[str, Any]] = []
    class_instance_counts: Dict[str, int] = {}

    for det in filtered_detections:
        class_name = det["class_name"]
        confidence = det["confidence"]
        class_id = det["class_id"]
        x1, y1, x2, y2 = det["raw_coords"]

        # Calculate normalized [0..1] coordinates relative to original image
        norm_x = max(0.0, min(1.0, x1 / orig_width))
        norm_y = max(0.0, min(1.0, y1 / orig_height))
        norm_w = max(0.0, min(1.0, (x2 - x1) / orig_width))
        norm_h = max(0.0, min(1.0, (y2 - y1) / orig_height))

        norm_box = {
            "x": round(norm_x, 4),
            "y": round(norm_y, 4),
            "width": round(norm_w, 4),
            "height": round(norm_h, 4)
        }

        # Track instance count for multiple objects of the same category
        current_instance = class_instance_counts.get(class_name, 0) + 1
        class_instance_counts[class_name] = current_instance

        # Enrich with domain disposal intelligence
        enriched_item = resolve_waste_item(
            model_class_name=class_name,
            confidence=confidence,
            class_id=class_id,
            box=norm_box,
            instance_index=current_instance
        )

        final_detections.append(enriched_item)

    return {
        "success": True,
        "inference_time_ms": inference_ms,
        "image_width": orig_width,
        "image_height": orig_height,
        "confidence_threshold": conf,
        "detections_count": len(final_detections),
        "detections": final_detections
    }


class ChatRequest(BaseModel):
    session_id: Optional[str] = "default-session"
    user_question: str
    selected_detection_id: Optional[str] = None
    selected_object: Optional[Dict[str, Any]] = None
    all_detections: Optional[List[Dict[str, Any]]] = None
    history: Optional[List[Dict[str, str]]] = None
    locality: Optional[str] = "General Municipal"


@app.post("/api/visionx/chat")
async def visionx_chat(req: ChatRequest):
    """
    Strands Agents post-detection conversational endpoint.
    Retrieves grounded context, applies safety/disposal tools,
    and returns structured answers with dynamic follow-up chips.
    """
    try:
        from backend.agent.strands_agent import execute_agent_chat
        response = await execute_agent_chat(
            session_id=req.session_id or "default-session",
            user_question=req.user_question,
            selected_object=req.selected_object,
            all_detections=req.all_detections,
            history=req.history,
            locality=req.locality
        )
        return {
            "success": True,
            **response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    print("[VisionX Backend] Starting FastAPI server on http://127.0.0.1:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000)

