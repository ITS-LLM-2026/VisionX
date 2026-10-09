import React from 'react';
import { Home, School, GraduationCap, Info, TrendingUp, Compass, Check } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import './UseCasesSection.css';

export const UseCasesSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-peach usecases-section" id="impact">
      {/* Decorative background shape */}
      <div className="usecases-deco-block" aria-hidden="true" />

      <div className="page-container">
        <SectionHeading
          eyebrow="WHERE IT MATTERS"
          eyebrowVariant="ink"
          title={
            <>
              Small decisions. <mark className="highlighter">Better sorting habits</mark>.
            </>
          }
          description="VisionX targets high-friction waste disposal scenarios where immediate clarity prevents contamination and builds responsible recycling reflexes."
        />

        {/* 3 Use-Case Editorial Cards */}
        <div className="usecases-grid">
          {/* Card 1: Households */}
          <Card variant="paper" tabLabel="HOUSEHOLDS" tabColor="sun" hoverEffect className="usecase-card">
            <div className="usecase-content">
              <div className="usecase-icon-box box-sun">
                <Home size={26} strokeWidth={2.5} />
              </div>
              <h3 className="usecase-title">Kitchen &amp; Curbside Decisions</h3>
              <p className="usecase-desc">
                Resolve everyday disposal uncertainty at the bin: whether a greasy takeout container can be saved by rinsing, whether caps stay screwed on, and where unverified films belong.
              </p>
              <ul className="usecase-highlights">
                <li><Check size={14} strokeWidth={2.5} /> Cuts commingled contamination</li>
                <li><Check size={14} strokeWidth={2.5} /> Clarifies confusing resin codes (#1 to #7)</li>
                <li><Check size={14} strokeWidth={2.5} /> Immediate prep instructions</li>
              </ul>
            </div>
          </Card>

          {/* Card 2: Campus Communities */}
          <Card variant="paper" tabLabel="COMMUNITIES" tabColor="pink" hoverEffect className="usecase-card">
            <div className="usecase-content">
              <div className="usecase-icon-box box-pink">
                <School size={26} strokeWidth={2.5} />
              </div>
              <h3 className="usecase-title">College Campuses &amp; Facilities</h3>
              <p className="usecase-desc">
                Equip student dining halls, dormitories, and campus facility management with a quick camera tool that helps visitors sort correctly between wet organic, dry paper, and residual bins.
              </p>
              <ul className="usecase-highlights">
                <li><Check size={14} strokeWidth={2.5} /> Supports orientation waste drives</li>
                <li><Check size={14} strokeWidth={2.5} /> Multi-stream cafeteria sorting</li>
                <li><Check size={14} strokeWidth={2.5} /> Aggregates scan patterns anonymously</li>
              </ul>
            </div>
          </Card>

          {/* Card 3: Environmental Education */}
          <Card variant="paper" tabLabel="EDUCATION" tabColor="violet" hoverEffect className="usecase-card">
            <div className="usecase-content">
              <div className="usecase-icon-box box-violet">
                <GraduationCap size={26} strokeWidth={2.5} />
              </div>
              <h3 className="usecase-title">Environmental Education</h3>
              <p className="usecase-desc">
                Replace dry recycling flyers with an interactive, tactile experience. Educators can demonstrate how near-infrared sorting works and why grease ruins paper pulping.
              </p>
              <ul className="usecase-highlights">
                <li><Check size={14} strokeWidth={2.5} /> Tangible visual demonstrations</li>
                <li><Check size={14} strokeWidth={2.5} /> Conversational Q&amp;A with Strands</li>
                <li><Check size={14} strokeWidth={2.5} /> Teaches the "why" behind policies</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Responsible Impact Metrics & Honest Disclosure Strip */}
        <div className="impact-disclosure-panel">
          <div className="disclosure-header">
            <div className="disclosure-title-group">
              <Info size={18} strokeWidth={2.5} />
              <strong>Responsible Metric Integrity &amp; Prototype Claims</strong>
            </div>
            <Badge variant="lime" size="sm">HONEST BENCHMARKING</Badge>
          </div>

          <div className="disclosure-body">
            <p>
              Unlike applications that display fabricated "CO₂ savings counters" or claim unverified tonnages recycled, VisionX adheres to strict measurement integrity:
            </p>
            <div className="disclosure-stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <Compass size={16} />
                  <span>ACTIONABLE DECISIONS</span>
                </div>
                <div className="stat-number">100%</div>
                <div className="stat-caption">Every detected class maps to verified physical next steps, not bare labels.</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <TrendingUp size={16} />
                  <span>RESPONSIBLE UNCERTAINTY</span>
                </div>
                <div className="stat-number">0%</div>
                <div className="stat-caption">Zero unverified polymer guarantees. Ambiguous plastics are explicitly flagged.</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <Info size={16} />
                  <span>LOCAL-FIRST READY</span>
                </div>
                <div className="stat-number">OFFLINE</div>
                <div className="stat-caption">Architected to operate with local Ollama / CV inference when needed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
