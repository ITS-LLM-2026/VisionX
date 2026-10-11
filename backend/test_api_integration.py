"""
VisionX End-to-End API Integration Test
Uses FastAPI TestClient to test endpoints without needing a running network port.
"""

import sys
from pathlib import Path
import io
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from backend.server import app

client = TestClient(app)


def test_health_endpoint():
    print("[1/4] Testing GET /api/health ...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["status"] == "healthy"
    assert data["classes_count"] == 10
    print("      -> Health check passed! Supported classes:", data["supported_classes"])


def test_knowledge_base_endpoint():
    print("[2/4] Testing GET /api/knowledge-base ...")
    res = client.get("/api/knowledge-base")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 10
    assert "PlasticBottle" in data["classes"]
    print("      -> Knowledge base endpoint passed! Classes count:", data["count"])


def test_detect_endpoint_valid_image():
    print("[3/4] Testing POST /api/detect with valid image ...")
    # Create a dummy RGB image
    img = Image.new("RGB", (640, 640), color=(180, 200, 220))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    res = client.post(
        "/api/detect?conf=0.15",
        files={"file": ("test.jpg", buf, "image/jpeg")}
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["success"] is True
    assert "inference_time_ms" in data
    assert "detections" in data
    assert isinstance(data["detections"], list)
    print(f"      -> Detection endpoint passed! Inference time: {data['inference_time_ms']}ms, Detections: {data['detections_count']}")


def test_detect_endpoint_invalid_file():
    print("[4/4] Testing POST /api/detect with invalid file ...")
    res = client.post(
        "/api/detect",
        files={"file": ("test.txt", io.BytesIO(b"not an image"), "text/plain")}
    )
    assert res.status_code == 400
    print("      -> Rejected invalid file as expected (400 Bad Request)")


if __name__ == "__main__":
    print("=== Running VisionX API Integration Tests ===")
    test_health_endpoint()
    test_knowledge_base_endpoint()
    test_detect_endpoint_valid_image()
    test_detect_endpoint_invalid_file()
    print("=== ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ===")
