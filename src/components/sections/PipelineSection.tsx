import React from 'react';
import { Camera, Scan, Database, CheckCircle2, MessageSquare, ArrowRight, CornerDownRight, Bot } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import './PipelineSection.css';

export const PipelineSection: React.FC = () => {
  const stages = [
    {
      step: '01',
      title: 'Camera Input',
      icon: <Camera size={22} strokeWidth={2.5} />,
      desc: 'Capture a video frame or freeze a sample item via web or mobile camera stream.',
      badge: 'INPUT',
      badgeColor: 'sun' as const,
    },
    {
      step: '02',
      title: 'YOLO Detection',
      icon: <Scan size={22} strokeWidth={2.5} />,
      desc: 'Detect the supported object class, normalize bounding box coordinates, and return confidence.',
      badge: 'VISION',
      badgeColor: 'pink' as const,
    },
    {
      step: '03',
      title: 'Knowledge Lookup',
      icon: <Database size={22} strokeWidth={2.5} />,
      desc: 'Retrieve curated deterministic data for the detected class from verified waste taxonomy.',
      badge: 'CURATED',
      badgeColor: 'lime' as const,
    },
    {
      step: '04',
      title: 'Disposal Decision',
      icon: <CheckCircle2 size={22} strokeWidth={2.5} />,
      desc: 'Apply structured rules to generate physical preparation steps and contamination warnings.',
      badge: 'RULES',
      badgeColor: 'sun' as const,
    },
    {
      step: '05',
      title: 'User Guidance',
      icon: <MessageSquare size={22} strokeWidth={2.5} />,
      desc: 'Present clear next steps with responsible uncertainty tags and optional conversational assistance.',
      badge: 'ACTION',
      badgeColor: 'violet' as const,
    },
  ];

  return (
    <section className="section-wrapper bg-paper pipeline-section" id="pipeline">
      <div className="page-container">
        <SectionHeading
          eyebrow="UNDER THE HOOD"
          eyebrowVariant="violet"
          title={
            <>
              One item. A <mark className="highlighter">smarter decision</mark>.
            </>
          }
          description="VisionX separates visual recognition from disposal guidance so that identifying an object does not automatically become an unsupported recycling claim."
        />

        {/* 5-Stage Core Pipeline */}
        <div className="pipeline-flow-wrapper">
          <div className="pipeline-stages-container">
            {stages.map((stage, idx) => (
              <React.Fragment key={stage.step}>
                <div className="pipeline-stage-card">
                  <div className="stage-card-top">
                    <span className="stage-number">{stage.step}</span>
                    <Badge variant={stage.badgeColor} size="sm">
                      {stage.badge}
                    </Badge>
                  </div>
                  <div className="stage-icon-box">{stage.icon}</div>
                  <h4 className="stage-title">{stage.title}</h4>
                  <p className="stage-desc">{stage.desc}</p>
                </div>

                {idx < stages.length - 1 && (
                  <div className="pipeline-connector-arrow" aria-hidden="true">
                    <ArrowRight size={24} strokeWidth={2.5} className="arrow-horizontal" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Explicit Branch for Ambiguous / Unknown Items */}
          <div className="pipeline-branch-card">
            <div className="branch-label-row">
              <CornerDownRight size={20} strokeWidth={2.5} className="branch-icon" />
              <span className="branch-tag">AMBIGUOUS / UNCERTAIN BRANCH</span>
            </div>
            <div className="branch-content-grid">
              <div className="branch-step">
                <span className="branch-step-num">A</span>
                <div>
                  <strong>Low Confidence / Composite Item</strong>
                  <p>When visual class is unverified or composite materials are detected.</p>
                </div>
              </div>
              <div className="branch-arrow">→</div>
              <div className="branch-step highlight-agent">
                <span className="branch-step-num">B</span>
                <div>
                  <div className="agent-badge-row">
                    <Bot size={15} />
                    <strong>AWS Strands Agent</strong>
                  </div>
                  <p>Retrieves grounded waste knowledge to answer follow-up queries.</p>
                </div>
              </div>
              <div className="branch-arrow">→</div>
              <div className="branch-step">
                <span className="branch-step-num">C</span>
                <div>
                  <strong>Explanation with Caveats</strong>
                  <p>Provides transparent guidance without fabricating certainty.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
