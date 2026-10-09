import { DEMO_SCENARIOS } from '../../data/demoScenarios';
import type { DemoScenario } from '../../types';

export class MockDetectionService {
  public static getAllScenarios(): DemoScenario[] {
    return DEMO_SCENARIOS;
  }

  public static getScenarioById(id: string): DemoScenario {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === id);
    return scenario || DEMO_SCENARIOS[0];
  }
}
