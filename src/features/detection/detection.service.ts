import type { DetectionApiResponse } from '../../types';
import { DEMO_SCENARIOS } from '../../data/demoScenarios';

export class YoloDetectionService {
  /**
   * Calls the real backend YOLO inference endpoint with an image blob (from camera still or file upload).
   */
  public static async detectObjects(
    imageBlob: Blob,
    confidenceThreshold: number = 0.15
  ): Promise<DetectionApiResponse> {
    const formData = new FormData();
    // Provide a file name with proper extension based on blob type
    const filename = imageBlob.type === 'image/png' ? 'capture.png' : 'capture.jpg';
    formData.append('file', imageBlob, filename);

    try {
      const response = await fetch(`/api/detect?conf=${confidenceThreshold}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.detail) errMessage = errData.detail;
        } catch {
          // ignore json parse error
        }
        return {
          success: false,
          inference_time_ms: 0,
          image_width: 0,
          image_height: 0,
          confidence_threshold: confidenceThreshold,
          detections_count: 0,
          detections: [],
          error: `Inference failed: ${errMessage}`,
        };
      }

      const data: DetectionApiResponse = await response.json();
      return data;
    } catch (networkErr: any) {
      console.warn('[YoloDetectionService] Could not connect to YOLO backend:', networkErr);
      return {
        success: false,
        inference_time_ms: 0,
        image_width: 0,
        image_height: 0,
        confidence_threshold: confidenceThreshold,
        detections_count: 0,
        detections: [],
        error:
          'Could not connect to the VisionX YOLO inference server at http://127.0.0.1:8000. Please ensure the backend is running (`python backend/server.py`).',
      };
    }
  }

  /**
   * Checks the health and loaded model status of the YOLO backend.
   */
  public static async checkHealth(): Promise<{
    isOnline: boolean;
    device?: string;
    classesCount?: number;
    supportedClasses?: Record<number, string>;
  }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return {
          isOnline: true,
          device: data.device,
          classesCount: data.classes_count,
          supportedClasses: data.supported_classes,
        };
      }
      return { isOnline: false };
    } catch {
      return { isOnline: false };
    }
  }
}

/**
 * Retained for backwards-compatibility with demo scenario benchmarks.
 */
export class MockDetectionService {
  public static getAllScenarios() {
    return DEMO_SCENARIOS;
  }

  public static getScenarioById(id: string) {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === id);
    return scenario || DEMO_SCENARIOS[0];
  }
}
