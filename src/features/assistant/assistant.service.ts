import type { AssistantResponse, DemoScenario } from '../../types';

export class MockAssistantService {
  public static async ask(
    question: string,
    scenario: DemoScenario
  ): Promise<AssistantResponse> {
    // Simulate brief agentic retrieval delay (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const normalizedQ = question.toLowerCase();
    const matchedSample = scenario.sampleQuestions.find((sq) =>
      sq.question.toLowerCase().includes(normalizedQ) ||
      normalizedQ.includes(sq.question.toLowerCase().slice(0, 15))
    );

    if (matchedSample) {
      return {
        message: matchedSample.answer,
        isGrounded: true,
        sourceUrls: matchedSample.sources,
        needsVerification: !scenario.knowledge.materialVerified,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    // Default grounded fallback answering in context of the detected item
    return {
      message: `Regarding the detected ${scenario.name}: VisionX recommends "${scenario.knowledge.recommendedAction}". Remember that while visual detection identifies ${scenario.detection.label}, local MRF facilities prioritize clean, dry materials without organic residue.`,
      isGrounded: true,
      sourceUrls: ['VisionX Structured Waste Knowledge Base', scenario.knowledge.sourceUrl || 'Municipal Waste Guidelines'],
      needsVerification: !scenario.knowledge.materialVerified,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
