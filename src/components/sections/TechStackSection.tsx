import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { CORE_TECH_STACK, AGENT_ECOSYSTEM_STACK } from '../../data/techStack';
import type { TechItem } from '../../data/techStack';
import { Cpu, Terminal, Bot, Code, Zap, Boxes } from 'lucide-react';
import './TechStackSection.css';

interface MarqueeRowProps {
  items: TechItem[];
  direction?: 'left' | 'right';
  speed?: 'normal' | 'slow';
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, direction = 'left', speed = 'normal' }) => {
  // Duplicate array 3 times for a truly seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  const getTechIcon = (id: string) => {
    switch (id) {
      case 'python':
        return <Terminal size={18} strokeWidth={2.5} />;
      case 'opencv':
        return <Cpu size={18} strokeWidth={2.5} />;
      case 'yolo':
        return <Zap size={18} strokeWidth={2.5} />;
      case 'react':
        return <Code size={18} strokeWidth={2.5} />;
      case 'typescript':
        return <Code size={18} strokeWidth={2.5} />;
      case 'vite':
        return <Zap size={18} strokeWidth={2.5} />;
      case 'strands':
        return <Bot size={18} strokeWidth={2.5} />;
      case 'ollama':
        return <Cpu size={18} strokeWidth={2.5} />;
      default:
        return <Boxes size={18} strokeWidth={2.5} />;
    }
  };

  return (
    <div className="marquee-viewport" tabIndex={0} aria-label="Technology tools ticker">
      <div className={`marquee-track track-${direction} track-${speed}`}>
        {duplicatedItems.map((tech, index) => (
          <div key={`${tech.id}-${index}`} className="tech-tile">
            <div className="tech-tile-top">
              <span className="tech-tile-icon">{getTechIcon(tech.id)}</span>
              <span className="tech-tile-badge">{tech.badge}</span>
            </div>
            <div className="tech-tile-name">{tech.name}</div>
            <div className="tech-tile-category">{tech.category}</div>
            <div className="tech-tile-desc">{tech.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TechStackSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-paper stack-section" id="stack">
      <div className="page-container">
        <SectionHeading
          eyebrow="THE STACK"
          eyebrowVariant="sun"
          title={
            <>
              Simple pieces. <mark className="highlighter">One useful experience</mark>.
            </>
          }
          description="Computer vision, structured data, a responsive frontend, and an optional agent layer—engineered with modern, lightweight primitives."
        />

        <div className="stack-marquee-wrapper">
          {/* Row 1: Core Application (Leftward) */}
          <div className="marquee-group">
            <div className="marquee-label-tag">
              <span>ROW 01: CORE APPLICATION &amp; CV PIPELINE</span>
            </div>
            <MarqueeRow items={CORE_TECH_STACK} direction="left" speed="normal" />
          </div>

          {/* Row 2: Agent & Ecosystem (Rightward) */}
          <div className="marquee-group">
            <div className="marquee-label-tag tag-pink">
              <span>ROW 02: AGENTIC REASONING &amp; ECOSYSTEM</span>
            </div>
            <MarqueeRow items={AGENT_ECOSYSTEM_STACK} direction="right" speed="slow" />
          </div>
        </div>
      </div>
    </section>
  );
};
