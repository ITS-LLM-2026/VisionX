import type { AssistantResponse, DemoScenario, DetectedWasteObject, AgentChatApiResponse } from '../../types';

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

export interface AgentChatParams {
  question: string;
  sessionId?: string;
  selectedObject?: DetectedWasteObject | null;
  allDetections?: DetectedWasteObject[];
  history?: { sender: 'user' | 'assistant'; text: string }[];
  locality?: string;
}

export class StrandsAgentService {
  private static readonly ENDPOINT = '/api/visionx/chat';
  private static readonly FALLBACK_ENDPOINT = 'http://127.0.0.1:8000/api/visionx/chat';

  public static async ask(params: AgentChatParams): Promise<AssistantResponse> {
    const payload = {
      session_id: params.sessionId || 'session-' + Date.now(),
      user_question: params.question,
      selected_detection_id: params.selectedObject?.id,
      selected_object: params.selectedObject,
      all_detections: params.allDetections || [],
      history: params.history || [],
      locality: params.locality || 'General Municipal',
    };

    let response: Response;
    try {
      response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Chat API HTTP ${response.status}`);
      }
    } catch {
      // Direct fallback to 8000 if proxy failed
      response = await fetch(this.FALLBACK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Chat fallback API HTTP ${response.status}`);
      }
    }

    const data: AgentChatApiResponse = await response.json();

    return {
      message: data.answer,
      isGrounded: true,
      sourceUrls: data.sources || ['VisionX AI Knowledge Base'],
      needsVerification: data.needs_clarification,
      suggestedQuestions: data.suggested_questions || [],
      uncertaintyNote: data.uncertainty_note,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

