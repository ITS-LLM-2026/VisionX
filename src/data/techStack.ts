export interface TechItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
}

export const CORE_TECH_STACK: TechItem[] = [
  { id: 'python', name: 'Python 3.11', category: 'Core Runtime', badge: 'CV Backend', description: 'Model inference & data pipeline' },
  { id: 'opencv', name: 'OpenCV', category: 'Vision Library', badge: 'Frame Processing', description: 'Real-time video frame extraction' },
  { id: 'yolo', name: 'YOLOv11 / Ultralytics', category: 'Object Detection', badge: 'Vision Model', description: 'Bounding-box waste classification' },
  { id: 'react', name: 'React 19', category: 'Frontend UI', badge: 'Component Architecture', description: 'Declarative, responsive client' },
  { id: 'typescript', name: 'TypeScript', category: 'Type Safety', badge: 'Strict Contracts', description: 'Robust domain models & types' },
  { id: 'vite', name: 'Vite 8', category: 'Build Tool', badge: 'ESM Bundler', description: 'Instant HMR & optimized production' },
];

export const AGENT_ECOSYSTEM_STACK: TechItem[] = [
  { id: 'strands', name: 'AWS Strands Agents', category: 'Agent Runtime', badge: 'Conversational Layer', description: 'Grounded reasoning and context tools' },
  { id: 'ollama', name: 'Ollama (Local LLM)', category: 'Local Provider', badge: 'Zero-Cloud Option', description: 'Privacy-first offline assistant' },
  { id: 'github', name: 'GitHub Actions', category: 'CI / CD', badge: 'Open Source', description: 'Continuous integration and repo hosting' },
  { id: 'lucide', name: 'Lucide Icons', category: 'Vector Glyphs', badge: 'Thick-Stroke Icons', description: 'Consistent 2px line iconography' },
];
