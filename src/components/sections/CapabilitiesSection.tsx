import React from 'react';
import { Scan, FileSpreadsheet, ShieldQuestion, Bot, Sparkles } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import './CapabilitiesSection.css';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-sand capabilities-section" id="capabilities">
      {/* Decorative background shape */}
      <div className="cap-deco-circle" aria-hidden="true" />

      <div className="page-container">
        <SectionHeading
          eyebrow="BUILT FOR BETTER DECISIONS"
          eyebrowVariant="ink"
          title={
            <>
              More than a <mark className="highlighter-pink">bounding box</mark>.
            </>
          }
          description="VisionX bridges the gap between raw machine learning output and human physical action with four tightly integrated capabilities."
        />

        <div className="capabilities-grid">
          {/* Feature 1: Real-time Vision */}
          <Card variant="paper" tabLabel="VISION" tabColor="sun" hoverEffect className="capability-card cap-card-1">
            <div className="cap-content">
              <div className="cap-icon-box box-sun">
                <Scan size={26} strokeWidth={2.5} />
              </div>
              <h3 className="cap-title">Spot the item.</h3>
              <p className="cap-desc">
                A specialized YOLO-based detection pipeline trained to recognize waste objects in diverse, cluttered environments with real-time bounding boxes.
              </p>
              {/* Graphic Mockup Inside Card */}
              <div className="cap-visual visual-scan">
                <div className="mini-bbox">
                  <span>DETECTED_CLASS: #plastic_cup</span>
                  <span className="mini-conf">92%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Feature 2: Structured Guidance */}
          <Card variant="paper" tabLabel="KNOWLEDGE" tabColor="lime" hoverEffect className="capability-card cap-card-2">
            <div className="cap-content">
              <div className="cap-icon-box box-lime">
                <FileSpreadsheet size={26} strokeWidth={2.5} />
              </div>
              <h3 className="cap-title">Know the next step.</h3>
              <p className="cap-desc">
                Detected classes map directly into curated waste rules that specify preparation steps—rinsing liquids, removing caps, or avoiding commingled bales.
              </p>
              <div className="cap-visual visual-checklist">
                <div className="mini-check-row">
                  <span className="check-box-icon">✓</span>
                  <span>Empty liquid residue</span>
                </div>
                <div className="mini-check-row">
                  <span className="check-box-icon">✓</span>
                  <span>Inspect resin stamp #5</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Feature 3: Responsible Uncertainty */}
          <Card variant="paper" tabLabel="ACCURACY" tabColor="pink" hoverEffect className="capability-card cap-card-3">
            <div className="cap-content">
              <div className="cap-icon-box box-pink">
                <ShieldQuestion size={26} strokeWidth={2.5} />
              </div>
              <h3 className="cap-title">No confident guesses.</h3>
              <p className="cap-desc">
                If an item is unverified or composite, VisionX explicitly marks it as uncertain rather than fabricating false recyclability guarantees.
              </p>
              <div className="cap-visual visual-uncertainty">
                <Badge variant="uncertain" size="sm">
                  MATERIAL UNVERIFIED
                </Badge>
                <span className="uncertain-note">Flagged for local verification</span>
              </div>
            </div>
          </Card>

          {/* Feature 4: Conversational Help */}
          <Card variant="paper" tabLabel="AGENT" tabColor="violet" hoverEffect className="capability-card cap-card-4">
            <div className="cap-content">
              <div className="cap-icon-box box-violet">
                <Bot size={26} strokeWidth={2.5} />
              </div>
              <h3 className="cap-title">Ask why.</h3>
              <p className="cap-desc">
                An AWS Strands Agents-powered conversational layer that explains environmental trade-offs, optical sorting constraints, and complex ambiguous cases.
              </p>
              <div className="cap-visual visual-chat">
                <div className="mini-chat-bubble">
                  <Sparkles size={12} className="sparkle-mini" />
                  <span>"Why can't black plastics be sorted by NIR?"</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
