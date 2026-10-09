import React from 'react';
import { HelpCircle, AlertTriangle, GitFork, ExternalLink, BookOpen } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RESEARCH_REFERENCES } from '../../data/researchReferences';
import './ProblemSection.css';

export const ProblemSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-peach" id="problem">
      {/* Decorative skewed accent block */}
      <div className="problem-deco-shape" aria-hidden="true" />

      <div className="page-container">
        {/* Editorial Split Header */}
        <div className="problem-header-grid">
          <SectionHeading
            eyebrow="THE PROBLEM"
            eyebrowVariant="ink"
            title={
              <>
                Knowing what it is <mark className="highlighter">isn't enough</mark>.
              </>
            }
          />
          <div className="problem-lead-box">
            <p className="problem-lead-text">
              Every day, billions of consumers hold waste in their hands and make split-second guesses. The fundamental breakdown in waste recovery isn't just visual recognition—it is the knowledge gap between detecting an object and understanding what physical action to take next.
            </p>
          </div>
        </div>

        {/* 3 Distinct Problem Cards */}
        <div className="problem-cards-grid">
          {/* Card 1: The Guessing Game */}
          <Card variant="paper" tabLabel="DILEMMA 01" tabColor="pink" hoverEffect className="problem-card">
            <div className="problem-card-inner">
              <div className="problem-icon-chip chip-pink">
                <HelpCircle size={28} strokeWidth={2.5} />
              </div>
              <h3 className="problem-card-title">Looks recyclable. But is it?</h3>
              <p className="problem-card-desc">
                Appearance is misleading. A plastic clamshell may display a resin chasing-arrows stamp (#6 PS or #5 PP), yet local Material Recovery Facilities (MRFs) may lack markets to reprocess it, sending it straight to landfill.
              </p>
              <div className="problem-card-takeaway takeaway-pink">
                <span>Core gap: Visual shape does not equal chemical recyclability.</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Contamination */}
          <Card variant="paper" tabLabel="DILEMMA 02" tabColor="sun" hoverEffect className="problem-card">
            <div className="problem-card-inner">
              <div className="problem-icon-chip chip-sun">
                <AlertTriangle size={28} strokeWidth={2.5} />
              </div>
              <h3 className="problem-card-title">One wrong item ruins the batch.</h3>
              <p className="problem-card-desc">
                When oily takeout containers or unemptied beverage bottles enter commingled recycling bins, oils and liquids soak paper bales. Contaminated recycling streams get rejected and landfilled by the ton.
              </p>
              <div className="problem-card-takeaway takeaway-sun">
                <span>Core gap: Preparation rules (rinse, separate, dry) are rarely communicated.</span>
              </div>
            </div>
          </Card>

          {/* Card 3: No Clear Next Step */}
          <Card variant="paper" tabLabel="DILEMMA 03" tabColor="violet" hoverEffect className="problem-card">
            <div className="problem-card-inner">
              <div className="problem-icon-chip chip-violet">
                <GitFork size={28} strokeWidth={2.5} />
              </div>
              <h3 className="problem-card-title">Detection is not the finish line.</h3>
              <p className="problem-card-desc">
                A conventional computer vision classifier detects an object and proudly displays the label <code className="inline-code">"Plastic"</code>. That single word leaves the user stranded without actionable instructions.
              </p>
              <div className="problem-card-takeaway takeaway-violet">
                <span>Core gap: Vision must map to deterministic, rule-based disposal logic.</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Evidence & Verified Research Strip (Prompt 0 & 1 Strictness: No fake stats) */}
        <div className="evidence-strip-container">
          <div className="evidence-strip-header">
            <div className="evidence-title-group">
              <BookOpen size={20} strokeWidth={2.5} />
              <span className="evidence-title">Verified Research &amp; Benchmark References</span>
            </div>
            <Badge variant="ink" size="sm">ACADEMIC &amp; GOV SOURCES</Badge>
          </div>

          <div className="evidence-grid">
            {RESEARCH_REFERENCES.slice(0, 2).map((ref) => (
              <div key={ref.id} className="evidence-item-card">
                <div className="evidence-meta">
                  <span className="evidence-scope">{ref.scope}</span>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="evidence-source-link"
                    title="View open publication"
                  >
                    <span>{ref.citation}</span>
                    <ExternalLink size={12} strokeWidth={2.5} />
                  </a>
                </div>
                <h4 className="evidence-paper-title">{ref.title}</h4>
                <p className="evidence-finding">{ref.finding}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
