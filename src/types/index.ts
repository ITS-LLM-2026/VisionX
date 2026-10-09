export type WasteCategory =
  | 'recyclable'
  | 'organic'
  | 'residual'
  | 'special-handling'
  | 'uncertain';

export interface BoundingBox {
  /** Normalized coordinates (0 to 1) relative to preview frame */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  classId: string;
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export type PolicyStatus = 'general-guidance' | 'verified-local' | 'unknown';

export interface WasteKnowledge {
  classId: string;
  displayName: string;
  material: string | null;
  materialVerified: boolean;
  category: WasteCategory;
  recommendedAction: string;
  preparationSteps: string[];
  environmentalContext: string;
  contaminationWarning?: string;
  sourceUrl?: string;
  policyStatus: PolicyStatus;
}

export interface WasteAnalysisResult extends WasteKnowledge {
  isSimulated: boolean;
  analyzedAt: string;
}

export interface AssistantResponse {
  message: string;
  isGrounded: boolean;
  sourceUrls: string[];
  needsVerification: boolean;
  timestamp?: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  tag: string;
  detection: Detection;
  knowledge: WasteKnowledge;
  sampleQuestions: {
    question: string;
    answer: string;
    sources: string[];
  }[];
}

export interface ResearchReference {
  id: string;
  title: string;
  citation: string;
  url: string;
  finding: string;
  scope: string;
}

export type ScannerInputMode = 'camera' | 'upload';

export type ScannerStatus =
  | 'idle'
  | 'camera-requesting'
  | 'camera-ready'
  | 'camera-error'
  | 'captured'
  | 'upload-ready'
  | 'analyzing'
  | 'result-ready'
  | 'error';
