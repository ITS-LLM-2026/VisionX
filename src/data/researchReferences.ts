import type { ResearchReference } from '../types';

export const RESEARCH_REFERENCES: ResearchReference[] = [
  {
    id: 'taco-dataset',
    title: 'TACO: Trash Annotations in Context for Litter Detection',
    citation: 'Proença, P. F., & Simões, P. (2020). arXiv:2003.06975',
    url: 'https://arxiv.org/abs/2003.06975',
    finding:
      'Standard visual classifiers often fail in diverse real-world waste settings due to object deformation, occlusion, and background clutter. Open-source hierarchical litter datasets provide the basis for robust bounding-box detection.',
    scope: 'Computer Vision Benchmark for Real-World Waste',
  },
  {
    id: 'epa-contamination',
    title: 'Municipal Solid Waste Contamination & Material Quality Brief',
    citation: 'U.S. EPA Advancing Sustainable Materials Management (Fact Sheet)',
    url: 'https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling',
    finding:
      'Curbside recycling contamination rates frequently exceed 15-25% in commingled single-stream systems. The primary causes are "wishcycling" and soiled food containers.',
    scope: 'Curbside Contamination & Stream Quality Analysis',
  },
  {
    id: 'strands-sdk',
    title: 'AWS Strands Agents SDK Technical Documentation',
    citation: 'Strands Agents Open-Source Python Framework (2024)',
    url: 'https://strandsagents.com/docs/',
    finding:
      'Provides an open-source agent runtime decoupling structured domain knowledge from generative conversational agents, supporting local model backends (Ollama) and cloud model providers.',
    scope: 'Agentic Reasoning & Conversational Tool Architecture',
  },
];
