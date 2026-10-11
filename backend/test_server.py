"""
VisionX Backend & Knowledge Mapping Unit Tests
Tests schema compliance, multi-object resolution, instance tracking, and knowledge retrieval.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.waste_knowledge import resolve_waste_item, WASTE_KNOWLEDGE_BASE


def test_all_10_classes_mapped():
    expected_classes = [
        "PlasticBottle", "PlasticWrapper", "PaperCardboard", "MetalWaste",
        "GlassWaste", "DisposableContainer", "Clothing", "OrganicWaste",
        "EWaste", "Other"
    ]
    for cls_name in expected_classes:
        assert cls_name in WASTE_KNOWLEDGE_BASE, f"Missing {cls_name} in WASTE_KNOWLEDGE_BASE"
        info = WASTE_KNOWLEDGE_BASE[cls_name]
        assert "waste_category" in info
        assert "material" in info
        assert "disposal_method" in info
        assert "preparation_steps" in info
        assert len(info["preparation_steps"]) > 0
        assert "environmental_impact" in info


def test_resolve_waste_item_instance_index():
    box = {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4}
    item1 = resolve_waste_item("PlasticBottle", 0.92, 0, box, instance_index=1)
    item2 = resolve_waste_item("PlasticBottle", 0.85, 0, box, instance_index=2)

    assert item1["id"] == "plasticbottle-1"
    assert item2["id"] == "plasticbottle-2"
    assert item1["confidence"] == 0.92
    assert item1["waste_category"] == "recyclable"
    assert "Bottle #2" in item2["display_name"]


def test_resolve_unmapped_class():
    box = {"x": 0.0, "y": 0.0, "width": 1.0, "height": 1.0}
    item = resolve_waste_item("AlienDebris", 0.50, 99, box, instance_index=1)
    assert item["waste_category"] == "uncertain"
    assert item["mapping_status"] == "unverified"
    assert "Unmapped" in item["display_name"]


if __name__ == "__main__":
    print("Running backend tests...")
    test_all_10_classes_mapped()
    test_resolve_waste_item_instance_index()
    test_resolve_unmapped_class()
    print("All backend tests passed successfully!")
