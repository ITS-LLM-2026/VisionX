import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import './CtaSection.css';

export const CtaSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-violet cta-section">
      {/* Decorative Neo-Brutalist Shapes */}
      <div className="cta-deco-circle" aria-hidden="true" />
      <div className="cta-deco-sun-block" aria-hidden="true" />

      <div className="page-container cta-container">
        <div className="cta-paper-card">
          <div className="cta-badge-row">
            <span className="cta-eyebrow-pill">
              <Sparkles size={14} />
              <span>TEST THE VISIONX PROTOTYPE</span>
            </span>
          </div>

          <h2 className="cta-headline">
            Better disposal starts with <mark className="highlighter">one decision</mark>.
          </h2>

          <p className="cta-subtext">
            Experience how VisionX turns object recognition into an actionable waste-disposal decision with structured preparation steps, contamination warnings, and grounded agent assistance.
          </p>

          <div className="cta-actions-group">
            <Button
              variant="primary"
              size="lg"
              asLink
              href="#demo"
              icon={<ArrowUpRight size={20} strokeWidth={2.5} />}
            >
              Explore the Demo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              asLink
              href="#pipeline"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
