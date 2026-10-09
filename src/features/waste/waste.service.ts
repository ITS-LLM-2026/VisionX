import { DEMO_SCENARIOS } from '../../data/demoScenarios';
import { getTimestamp } from '../../lib/utils';
import type { WasteAnalysisResult } from '../../types';

export class WasteAnalysisService {
  /**
   * Deterministic mock waste analysis.
   * Simulates inference delay and returns structured waste guidance.
   * In Phase 3, this service boundary will be replaced with real YOLO inference API calls.
   */
  public static async analyzeWasteImage(
    _imageBlob: Blob,
    scenarioId: string = 'plastic-bottle'
  ): Promise<WasteAnalysisResult> {
    // Simulated inference processing delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const matched = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];

    return {
      ...matched.knowledge,
      isSimulated: true,
      analyzedAt: getTimestamp(),
    };
  }

  public static getAvailableScenarios() {
    return DEMO_SCENARIOS.map((s) => ({
      id: s.id,
      name: s.name,
      tag: s.tag,
      category: s.knowledge.category,
    }));
  }
}
