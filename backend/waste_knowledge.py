"""
VisionX Knowledge Mapping Engine
Maps YOLO model detections (10 superclasses + 60 TACO classes) to structured waste management intelligence.
Complies with Prompt 3 Section 4 schema specifications.
"""

from typing import Dict, Any, List, Optional

# Structured waste knowledge repository
WASTE_KNOWLEDGE_BASE: Dict[str, Dict[str, Any]] = {
    "PlasticBottle": {
        "class_id": 0,
        "model_class_name": "PlasticBottle",
        "display_name": "Plastic Beverage Bottle",
        "waste_category": "recyclable",
        "material": "Polyethylene Terephthalate (PET #1)",
        "material_verified": False,
        "disposal_method": "Recycle in curbside plastic recycling bin",
        "recycling_guidance": "Clear and translucent PET bottles are among the most recycled consumer items worldwide. Empty liquids completely and leave the cap screwed on tightly.",
        "preparation_steps": [
            "Empty all liquid contents completely into a sink",
            "Give a quick rinse with clean water to remove sticky residues",
            "Crush the bottle flat to conserve collection and bin space",
            "Screw the plastic cap back on tightly before placing in the bin"
        ],
        "contamination_warning": "Leftover sugary liquids leak during compression in collection trucks, contaminating dry paper bundles and ruining entire recyclables bales.",
        "reusability": "Can be repurposed for storage or refilled if food-grade, though repeated reuse of single-use PET bottles is discouraged due to bacterial buildup.",
        "environmental_impact": "Recycling 1 ton of PET plastic saves approximately 3.8 barrels of crude oil and cuts CO2 emissions by up to 67% compared to virgin plastic manufacturing.",
        "special_handling": None,
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "Association of Plastic Recyclers (APR) & EPA Recycling Guidelines",
        "source_url": "https://plasticsrecycling.org"
    },

    "PlasticWrapper": {
        "class_id": 1,
        "model_class_name": "PlasticWrapper",
        "display_name": "Flexible Plastic Film & Wrapper",
        "waste_category": "special-handling",
        "material": "Low-Density Polyethylene (LDPE #4) / Polypropylene Film",
        "material_verified": False,
        "disposal_method": "Drop off at grocery store soft-plastic collection points",
        "recycling_guidance": "Flexible plastic films cannot be sorted in municipal curbside single-stream bins. They wrap around the spinning disc screens at sorting facilities, causing mechanical failures.",
        "preparation_steps": [
            "Empty all food crumbs and residues completely",
            "Ensure the wrapper is clean and dry",
            "Perform the scrunch test: if it scrunches into a ball and bounces back slowly, take to a soft-plastic drop-off depot",
            "Do NOT place in standard curbside mixed recycling"
        ],
        "contamination_warning": "MAJOR SORTING HAZARD: Flexible films tangle in mechanical trommels and conveyor bearings, forcing facilities to perform emergency manual shutdowns.",
        "reusability": "Low reusability for single-use snack wrappers; clean ziplock bags can be washed and reused multiple times.",
        "environmental_impact": "Plastic films take up to 500 years to decompose in landfills and fragment into toxic microplastics that leach into aquatic ecosystems.",
        "special_handling": "Store drop-off collection only (e.g. NexTrex / RedCycle drop-off points).",
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "EPA Municipal Solid Waste Guide & Wrap UK Flexible Film Roadmap",
        "source_url": "https://www.epa.gov/recycle"
    },

    "PaperCardboard": {
        "class_id": 2,
        "model_class_name": "PaperCardboard",
        "display_name": "Paper & Cardboard Packaging",
        "waste_category": "recyclable",
        "material": "Corrugated Cardboard / Cellulose Paperboard",
        "material_verified": True,
        "disposal_method": "Recycle in dry paper & cardboard bin",
        "recycling_guidance": "High-value recyclable material for domestic paper mills. Keep clean, dry, and flattened. Heavily food-soiled or greasy sections must be detached and placed in residual waste.",
        "preparation_steps": [
            "Remove plastic shipping tape, bubble wrap, and polystyrene foam inserts",
            "Flatten all boxes completely to maximize transport efficiency",
            "Keep dry and protected from rain or liquid spills",
            "Tear off and discard greasy sections (e.g. pizza oil stains) into general trash"
        ],
        "contamination_warning": "Grease and moisture ruin paper pulping. Oil molecules cannot be separated from cellulose fibers and create large holes in new recycled paper rolls.",
        "reusability": "Sturdy cardboard boxes can be reused multiple times for storage or moving.",
        "environmental_impact": "Recycling 1 ton of cardboard saves 17 mature trees, 7,000 gallons of water, and 4,000 kilowatts of electricity.",
        "special_handling": None,
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "American Forest & Paper Association (AF&PA)",
        "source_url": "https://www.afandpa.org"
    },

    "MetalWaste": {
        "class_id": 3,
        "model_class_name": "MetalWaste",
        "display_name": "Metal Can & Beverage Container",
        "waste_category": "recyclable",
        "material": "Aluminium / Tin-plated Steel",
        "material_verified": True,
        "disposal_method": "Recycle in metals / dry recyclables bin",
        "recycling_guidance": "Metals are 100% infinitely recyclable without any degradation of material properties. Aluminium beverage cans can be recycled, remelted, and returned to store shelves in 60 days.",
        "preparation_steps": [
            "Empty any remaining liquids or foods",
            "Quick rinse with cold water (no need for soap)",
            "Push metal lids inside food cans to eliminate sharp edges",
            "No need to crush aluminium cans if your local MRF uses optical sorters"
        ],
        "contamination_warning": "Pressurized aerosol cans must be completely empty before disposal; do not puncture or incinerate.",
        "reusability": "Durable metal containers can be upcycled for organization, planters, or tool storage.",
        "environmental_impact": "Recycling aluminium saves 95% of the energy needed to produce new metal from bauxite ore.",
        "special_handling": None,
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "The Aluminum Association & Can Manufacturers Institute",
        "source_url": "https://www.aluminum.org"
    },

    "GlassWaste": {
        "class_id": 4,
        "model_class_name": "GlassWaste",
        "display_name": "Glass Bottle & Food Jar",
        "waste_category": "recyclable",
        "material": "Soda-Lime Container Glass",
        "material_verified": True,
        "disposal_method": "Recycle in dedicated glass recycling bin or bottle bank",
        "recycling_guidance": "Container glass is 100% infinitely recyclable. Empty and rinse containers. Do not mix drinking glasses, Pyrex, ceramics, or window glass into bottle bins.",
        "preparation_steps": [
            "Empty all liquids and scrape sauces",
            "Rinse container clean with water",
            "Separate metal screw lids (recycle lids in metal bin)",
            "Do NOT include broken mirrors, drinking cups, or heat-resistant cookware"
        ],
        "contamination_warning": "Treated glassware (Pyrex, crystal, window panes) melts at higher temperatures and ruins entire batches of melted container glass cullet.",
        "reusability": "Glass jars make ideal reusable food storage containers and drinking vessels.",
        "environmental_impact": "Using recycled cullet in glass manufacturing lowers furnace temperatures, reducing CO2 emissions by up to 20% and preserving sand reserves.",
        "special_handling": "Wrap broken glass in newspaper or cardboard to protect sanitation workers.",
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "Glass Packaging Institute (GPI)",
        "source_url": "https://www.gpi.org"
    },

    "DisposableContainer": {
        "class_id": 5,
        "model_class_name": "DisposableContainer",
        "display_name": "Takeaway & Food Container",
        "waste_category": "residual",
        "material": "Mixed Polymer / Polystyrene (PS #6) / Poly-coated Paper",
        "material_verified": False,
        "disposal_method": "Inspect resin stamp; dispose in residual waste if greasy or polystyrene",
        "recycling_guidance": "Takeout food containers are frequently contaminated with food grease and oils. Unless thoroughly washed and stamped with #1 (PET) or #5 (PP), they belong in general waste.",
        "preparation_steps": [
            "Scrape all organic food scraps into compost or organic bin",
            "Inspect the bottom for the chasing arrows resin code",
            "If greasy, foam (#6 EPS), or black plastic: discard into residual/landfill waste",
            "If clean, clear, and stamped #1 or #5: place in plastic recycling"
        ],
        "contamination_warning": "Food oils, gravies, and fats permanently degrade recycled plastic flakes during mechanical recycling.",
        "reusability": "Durable takeout containers can be reused for non-hot food storage; never microwave damaged single-use containers.",
        "environmental_impact": "Polystyrene takeaway packaging persists in landfills for centuries, breaking down into toxic microplastic beads.",
        "special_handling": None,
        "policy_status": "general-guidance",
        "mapping_status": "conditional",
        "source": "Waste Management MRF Guidelines",
        "source_url": "https://www.wm.com"
    },

    "Clothing": {
        "class_id": 6,
        "model_class_name": "Clothing",
        "display_name": "Textile, Fabric & Apparel",
        "waste_category": "special-handling",
        "material": "Cotton / Polyester / Blended Textile",
        "material_verified": False,
        "disposal_method": "Donate if wearable, or use dedicated textile collection bank",
        "recycling_guidance": "Never put clothing or textiles in household curbside recycling bins. Textiles cause severe mechanical tangling in sorting machines.",
        "preparation_steps": [
            "Ensure garments are clean and dry",
            "Donate intact wearable items to charity shops or thrift stores",
            "Deliver torn or stained fabrics to a textile recycling drop-off bin",
            "Do NOT toss loose into municipal recycling carts"
        ],
        "contamination_warning": "TEXTILE TANGLER: Garments wrap around MRF conveyor shafts, creating dangerous friction and fire hazards.",
        "reusability": "High reusability: mend, donate, or cut into household cleaning rags.",
        "environmental_impact": "Textile manufacturing is the 2nd most water-intensive industry on Earth. Reusing 1kg of cotton clothing saves up to 20,000 liters of fresh water.",
        "special_handling": "Dedicated textile drop-off bank or clothing donation drive.",
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "Textile Recycling Association & Ellen MacArthur Foundation",
        "source_url": "https://ellenmacarthurfoundation.org"
    },

    "OrganicWaste": {
        "class_id": 7,
        "model_class_name": "OrganicWaste",
        "display_name": "Organic Biomass & Food Waste",
        "waste_category": "organic",
        "material": "Biodegradable Organic Matter",
        "material_verified": True,
        "disposal_method": "Deposit in compost bin or municipal green organics collection",
        "recycling_guidance": "Organic waste should be composted rather than landfilled. When buried in landfills without oxygen, organic matter undergoes anaerobic decomposition, releasing potent methane gas.",
        "preparation_steps": [
            "Remove all plastic packaging, rubber bands, and produce stickers (PLU stickers)",
            "Place in kitchen countertop compost caddy or backyard compost bin",
            "Never enclose in standard polyethylene plastic bags; use certified compostable liners if required by your municipality",
            "Layer with brown carbon materials (leaves, paper) if home composting"
        ],
        "contamination_warning": "Non-compostable plastic bags and PLU produce stickers do not biodegrade and contaminate municipal compost batches.",
        "reusability": "Transforms into nutrient-rich humus and natural fertilizer for gardens and agriculture.",
        "environmental_impact": "Diverting organics from landfills prevents methane emissions, which trap heat in the atmosphere 28x more effectively than carbon dioxide over a 100-year scale.",
        "special_handling": None,
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "US Composting Council & EPA Food Recovery Hierarchy",
        "source_url": "https://www.epa.gov/sustainable-management-food"
    },

    "EWaste": {
        "class_id": 8,
        "model_class_name": "EWaste",
        "display_name": "Electronic Waste & Battery",
        "waste_category": "special-handling",
        "material": "Circuitry / Lithium-ion / Heavy Metals",
        "material_verified": False,
        "disposal_method": "Deliver to authorized e-waste collection depot or retailer take-back",
        "recycling_guidance": "E-waste contains hazardous heavy metals (lead, cadmium, mercury) and valuable precious metals (gold, copper, lithium). Never place in general trash or curbside recycling.",
        "preparation_steps": [
            "Disconnect power cords and remove detachable batteries",
            "Cover battery contact terminals with clear adhesive tape to prevent short circuits",
            "Wipe personal data from digital storage devices prior to disposal",
            "Transport safely to an authorized municipal e-waste recycling depot"
        ],
        "contamination_warning": "CRITICAL HAZARD: Damaged or crushed lithium-ion batteries cause explosive fires in waste collection trucks and sorting facilities.",
        "reusability": "Functional electronics should be repaired, refurbished, or donated.",
        "environmental_impact": "Recycling e-waste recovers precious rare-earth elements and prevents toxic neurotoxins from leaching into groundwater tables.",
        "special_handling": "Certified e-Stewards or R2 certified recycling facility.",
        "policy_status": "general-guidance",
        "mapping_status": "verified",
        "source": "EPA Electronics Donation and Recycling / Call2Recycle",
        "source_url": "https://www.call2recycle.org"
    },

    "Other": {
        "class_id": 9,
        "model_class_name": "Other",
        "display_name": "Unclassified Litter / Mixed Waste",
        "waste_category": "uncertain",
        "material": "Unspecified / Multi-Material",
        "material_verified": False,
        "disposal_method": "Inspect physical material or dispose of in general residual waste",
        "recycling_guidance": "The visual model detected an unclassified object. When material composition cannot be determined with certainty, visual inspection is required before sorting.",
        "preparation_steps": [
            "Handle with protective gloves if handling discarded litter",
            "Inspect for recycling resin codes or manufacturer material marks",
            "If composition is composite or unknown, place into general residual waste",
            "Do not 'wishcycle' (tossing unknown items into recycling in hopes they will be recycled)"
        ],
        "contamination_warning": "Wishcycling non-recyclable materials damages processing machinery and contaminates otherwise clean recyclables.",
        "reusability": "Inspect condition to determine if item can be repurposed or repaired.",
        "environmental_impact": "Proper segregation prevents non-recyclables from degrading high-grade recycled commodities.",
        "special_handling": "Physical inspection required.",
        "policy_status": "general-guidance",
        "mapping_status": "unverified",
        "source": "VisionX Deterministic Guardrails",
        "source_url": "https://visionx.example.com"
    }
}


def resolve_waste_item(
    model_class_name: str,
    confidence: float,
    class_id: int,
    box: Dict[str, float],
    instance_index: int = 1
) -> Dict[str, Any]:
    """
    Enriches a YOLO bounding box detection with comprehensive waste management intelligence.
    Returns schema complying with Prompt 3 Section 4.
    """
    # 1. Exact lookup in knowledge base
    knowledge = WASTE_KNOWLEDGE_BASE.get(model_class_name)

    # 2. Case-insensitive or normalized fallback
    if not knowledge:
        norm = model_class_name.strip().lower()
        for k, v in WASTE_KNOWLEDGE_BASE.items():
            if k.lower() == norm:
                knowledge = v
                break

    # 3. Keyword heuristic if unexpected class
    if not knowledge:
        knowledge = _heuristic_lookup(model_class_name, class_id)

    # Generate stable instance ID e.g. "plasticbottle-1"
    stable_id = f"{model_class_name.lower()}-{instance_index}"

    return {
        "id": stable_id,
        "instance_index": instance_index,
        "class_id": class_id,
        "model_class_name": model_class_name,
        "display_name": f"{knowledge['display_name']} #{instance_index}" if instance_index > 1 else knowledge['display_name'],
        "confidence": round(confidence, 4),
        "box": box,
        "waste_category": knowledge["waste_category"],
        "material": knowledge["material"],
        "material_verified": knowledge["material_verified"],
        "disposal_method": knowledge["disposal_method"],
        "recycling_guidance": knowledge["recycling_guidance"],
        "preparation_steps": knowledge["preparation_steps"],
        "contamination_warning": knowledge.get("contamination_warning"),
        "reusability": knowledge.get("reusability"),
        "environmental_impact": knowledge["environmental_impact"],
        "special_handling": knowledge.get("special_handling"),
        "policy_status": knowledge["policy_status"],
        "mapping_status": knowledge["mapping_status"],
        "source": knowledge["source"],
        "source_url": knowledge.get("source_url")
    }


def _heuristic_lookup(class_name: str, class_id: int) -> Dict[str, Any]:
    c_lower = class_name.lower()
    if any(k in c_lower for k in ["bottle", "jug", "pet", "hdpe"]):
        return WASTE_KNOWLEDGE_BASE["PlasticBottle"]
    elif any(k in c_lower for k in ["film", "wrap", "bag", "pouch"]):
        return WASTE_KNOWLEDGE_BASE["PlasticWrapper"]
    elif any(k in c_lower for k in ["paper", "cardboard", "box", "carton"]):
        return WASTE_KNOWLEDGE_BASE["PaperCardboard"]
    elif any(k in c_lower for k in ["can", "tin", "foil", "metal"]):
        return WASTE_KNOWLEDGE_BASE["MetalWaste"]
    elif any(k in c_lower for k in ["glass", "jar"]):
        return WASTE_KNOWLEDGE_BASE["GlassWaste"]
    elif any(k in c_lower for k in ["container", "cup", "tub", "clamshell"]):
        return WASTE_KNOWLEDGE_BASE["DisposableContainer"]
    elif any(k in c_lower for k in ["cloth", "textile", "shirt", "shoe"]):
        return WASTE_KNOWLEDGE_BASE["Clothing"]
    elif any(k in c_lower for k in ["organic", "food", "peel", "banana", "fruit"]):
        return WASTE_KNOWLEDGE_BASE["OrganicWaste"]
    elif any(k in c_lower for k in ["battery", "electronic", "wire", "cable"]):
        return WASTE_KNOWLEDGE_BASE["EWaste"]
    else:
        return {
            "class_id": class_id,
            "model_class_name": class_name,
            "display_name": f"{class_name} (Unmapped Object)",
            "waste_category": "uncertain",
            "material": "Unspecified / Multi-Material",
            "material_verified": False,
            "disposal_method": "Inspect physically and check local municipal rules",
            "recycling_guidance": f"No pre-configured disposal rule found for class '{class_name}'. Verify the item material before sorting.",
            "preparation_steps": ["Inspect material for resin/recycling stamps", "Follow local sanitation rules"],
            "contamination_warning": None,
            "reusability": None,
            "environmental_impact": "Proper segregation prevents non-recyclables from degrading high-grade recycled commodities.",
            "special_handling": "Needs manual verification",
            "policy_status": "unknown",
            "mapping_status": "unverified",
            "source": "VisionX Deterministic Guardrails",
            "source_url": None
        }
