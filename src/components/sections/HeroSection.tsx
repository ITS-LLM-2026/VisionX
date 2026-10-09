import React, { useState } from 'react';
import { Camera, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useRouter } from '../../lib/useRouter';
import { DEMO_SCENARIOS } from '../../data/demoScenarios';
import { BottleVector, BananaVector, ContainerVector } from '../common/VectorIllustrations';
import './HeroSection.css';

export const HeroSection: React.FC = () => {
  const { navigate } = useRouter();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isCaptured, setIsCaptured] = useState(false);

  const scenario = DEMO_SCENARIOS[selectedScenarioIndex];

  const renderIllustration = (id: string) => {
    switch (id) {
      case 'plastic-bottle':
        return <BottleVector size={170} />;
      case 'banana-peel':
        return <BananaVector size={170} />;
      case 'food-container':
        return <ContainerVector size={170} />;
      default:
        return <BottleVector size={170} />;
    }
  };

  return (
    <section className="section-wrapper bg-sun hero-section" id="hero">
      {/* Decorative Neo-Brutalist Geometric Shapes */}
      <div className="hero-deco-pink-circle" aria-hidden="true" />
      <div className="hero-deco-violet-block" aria-hidden="true" />

      <div className="page-container hero-container">
        <div className="hero-grid">
          {/* Left Column: Headline, Copy, Actions */}
          <div className="hero-content">
            <div className="hero-status-pill">
              <Badge variant="ink" size="sm">
                COMPUTER VISION × WASTE INTELLIGENCE
              </Badge>
            </div>

            <h1 className="hero-headline">
              Don't just identify waste. Know <mark className="highlighter">what to do</mark> with it.
            </h1>

            <p className="hero-subtext">
              VisionX turns everyday computer vision and structured disposal rules into a practical, actionable recommendation. Know what you're holding, how to prepare it, and why it matters.
            </p>

            <div className="hero-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/scan')}
                icon={<Camera size={20} strokeWidth={2.5} />}
                className="hero-btn-primary"
              >
                Launch Scanner
              </Button>
              <Button
                variant="secondary"
                size="lg"
                asLink
                href="#demo"
              >
                Interactive Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                asLink
                href="#pipeline"
              >
                How It Works
              </Button>
            </div>

            {/* Quick Proof Pills */}
            <div className="hero-proof-strip">
              <div className="proof-pill">
                <CheckCircle2 size={16} strokeWidth={2.5} className="proof-icon" />
                <span>Deterministic Disposal Rules</span>
              </div>
              <div className="proof-pill">
                <ShieldAlert size={16} strokeWidth={2.5} className="proof-icon" />
                <span>Responsible Uncertainty</span>
              </div>
              <div className="proof-pill">
                <Sparkles size={16} strokeWidth={2.5} className="proof-icon" />
                <span>AWS Strands Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Tactile Hero Product Preview */}
          <div className="hero-preview-wrapper">
            {/* Playful Sticker Badge */}
            <div className="hero-sticker-badge">
              <span>FROM DETECTION TO DECISION</span>
            </div>

            {/* Main Interactive Camera Card */}
            <div className="hero-product-card">
              {/* Card Window Header */}
              <div className="preview-card-header">
                <div className="camera-status-left">
                  <span className="window-dot dot-red" />
                  <span className="window-dot dot-yellow" />
                  <span className="window-dot dot-green" />
                  <span className="camera-label-text">
                    <Camera size={15} strokeWidth={2.5} />
                    <span>{isCaptured ? 'FRAME FROZEN' : 'SIMULATED CAMERA STREAM'}</span>
                  </span>
                </div>
                <Badge variant={isCaptured ? 'sun' : 'live'} size="sm">
                  {isCaptured ? 'CAPTURED' : 'LIVE'}
                </Badge>
              </div>

              {/* Scenario Quick Selector (Demo Controls inside Hero) */}
              <div className="hero-sample-tabs">
                {DEMO_SCENARIOS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`sample-tab-btn ${selectedScenarioIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedScenarioIndex(idx);
                      setIsCaptured(false);
                    }}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Viewfinder Area */}
              <div className="hero-viewfinder">
                {/* Viewfinder Corner Brackets */}
                <div className="viewfinder-bracket bracket-tl" />
                <div className="viewfinder-bracket bracket-tr" />
                <div className="viewfinder-bracket bracket-bl" />
                <div className="viewfinder-bracket bracket-br" />

                {/* Vector Waste Illustration */}
                <div className="hero-item-visual">
                  {renderIllustration(scenario.id)}
                </div>

                {/* Bounding Box Overlay */}
                <div
                  className="hero-bounding-box"
                  style={{
                    left: `${scenario.detection.boundingBox.x * 100}%`,
                    top: `${scenario.detection.boundingBox.y * 100}%`,
                    width: `${scenario.detection.boundingBox.width * 100}%`,
                    height: `${scenario.detection.boundingBox.height * 100}%`,
                  }}
                >
                  <div className="bbox-tag">
                    <span className="bbox-label">{scenario.detection.label}</span>
                    <span className="bbox-conf">
                      {Math.round(scenario.detection.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Shutter Trigger Button */}
                <button
                  type="button"
                  className={`hero-shutter-btn ${isCaptured ? 'btn-reset' : ''}`}
                  onClick={() => setIsCaptured(!isCaptured)}
                  aria-label={isCaptured ? 'Reset to live stream' : 'Capture frame'}
                >
                  {isCaptured ? 'Reset Stream' : 'Press to Capture'}
                </button>
              </div>

              {/* Overlapping Bottom Recommendation Pill */}
              <div className="hero-overlapping-result">
                <div className="result-mini-header">
                  <Badge
                    variant={
                      scenario.knowledge.category === 'organic'
                        ? 'lime'
                        : scenario.knowledge.category === 'uncertain'
                        ? 'uncertain'
                        : 'pink'
                    }
                    size="sm"
                  >
                    {scenario.knowledge.category.toUpperCase()}
                  </Badge>
                  <span className="demo-notice-tag">DEMO METRIC</span>
                </div>
                <p className="result-action-summary">
                  <strong>Action:</strong> {scenario.knowledge.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
