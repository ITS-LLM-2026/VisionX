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

export type MappingStatus = 'verified' | 'conditional' | 'unverified';

export interface DetectedWasteObject {
  id: string;
  instance_index: number;
  class_id: number;
  model_class_name: string;
  display_name: string;
  confidence: number;
  box: BoundingBox;
  waste_category: WasteCategory;
  material: string;
  material_verified: boolean;
  disposal_method: string;
  recycling_guidance: string;
  preparation_steps: string[];
  contamination_warning?: string | null;
  reusability?: string | null;
  environmental_impact: string;
  special_handling?: string | null;
  policy_status: PolicyStatus;
  mapping_status: MappingStatus;
  source: string;
  source_url?: string | null;
}

export interface DetectionApiResponse {
  success: boolean;
  inference_time_ms: number;
  image_width: number;
  image_height: number;
  confidence_threshold: number;
  detections_count: number;
  detections: DetectedWasteObject[];
  error?: string;
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
  suggestedQuestions?: string[];
  uncertaintyNote?: string | null;
}

export interface AgentChatApiResponse {
  success: boolean;
  answer: string;
  suggested_questions: string[];
  sources: string[];
  needs_clarification: boolean;
  uncertainty_note?: string | null;
  model_used?: string;
  error?: string;
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
