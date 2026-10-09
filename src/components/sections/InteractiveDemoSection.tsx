import React, { useState } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Send,
  X,
  Info,
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DEMO_SCENARIOS } from '../../data/demoScenarios';
import { MockAssistantService } from '../../features/assistant/assistant.service';
import type { AssistantResponse, DemoScenario } from '../../types';
import { BottleVector, BananaVector, ContainerVector } from '../common/VectorIllustrations';
import { getTimestamp, generateId } from '../../lib/utils';
import './InteractiveDemoSection.css';

export const InteractiveDemoSection: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [showWhyDetails, setShowWhyDetails] = useState(false);

  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    sources?: string[];
    needsVerification?: boolean;
    timestamp: string;
  }[]>([]);

  const scenario: DemoScenario = DEMO_SCENARIOS[selectedScenarioIndex];

  const handleScenarioChange = (index: number) => {
    setSelectedScenarioIndex(index);
    setIsCaptured(false);
    setShowWhyDetails(false);
    setChatHistory([]);
  };

  const handleCapture = () => {
    setIsShutterActive(true);
    setTimeout(() => {
      setIsShutterActive(false);
      setIsCaptured(true);
    }, 180);
  };

  const handleReset = () => {
    setIsCaptured(false);
    setShowWhyDetails(false);
  };

  const handleAskAssistant = async (questionText: string) => {
    if (!questionText.trim()) return;
    const userMsgTime = getTimestamp();

    setChatHistory((prev) => [
      ...prev,
      {
        id: generateId('user'),
        sender: 'user',
        text: questionText,
        timestamp: userMsgTime,
      },
    ]);
    setAssistantInput('');
    setAssistantLoading(true);

    try {
      const response: AssistantResponse = await MockAssistantService.ask(questionText, scenario);
      setChatHistory((prev) => [
        ...prev,
        {
          id: generateId('assistant'),
          sender: 'assistant',
          text: response.message,
          sources: response.sourceUrls,
          needsVerification: response.needsVerification,
          timestamp: response.timestamp || userMsgTime,
        },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          id: generateId('err'),
          sender: 'assistant',
          text: 'Simulation error while retrieving grounded context.',
          timestamp: userMsgTime,
        },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const renderIllustration = (id: string) => {
    switch (id) {
      case 'plastic-bottle':
        return <BottleVector size={200} />;
      case 'banana-peel':
        return <BananaVector size={200} />;
      case 'food-container':
        return <ContainerVector size={200} />;
      default:
        return <BottleVector size={200} />;
    }
  };

  return (
    <section className="section-wrapper bg-paper demo-section" id="demo">
      <div className="page-container">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="MEET VISIONX"
          eyebrowVariant="sun"
          title={
            <>
              From camera to <mark className="highlighter">confident next step</mark>.
            </>
          }
          description="Test the interactive waste-decision workflow. Switch sample scenarios, freeze the camera frame, inspect preparation steps, and test conversational explanations."
        />

        {/* Demo Scenario Selector Tabs */}
        <div className="demo-scenario-bar" role="tablist" aria-label="Demo waste scenarios">
          <span className="scenario-bar-label">SELECT SCENARIO:</span>
          <div className="scenario-buttons-group">
            {DEMO_SCENARIOS.map((item, idx) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={selectedScenarioIndex === idx}
                className={`scenario-btn ${selectedScenarioIndex === idx ? 'active' : ''}`}
                onClick={() => handleScenarioChange(idx)}
              >
                <span className="scenario-btn-num">0{idx + 1}</span>
                <span className="scenario-btn-name">{item.name}</span>
                <span className="scenario-btn-tag">{item.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Demo Workspace */}
        <div className="demo-workspace">
          {/* Left Column: Viewfinder & Capture Controls */}
          <div className="demo-camera-column">
            <div className="camera-frame-card">
              {/* Header Bar */}
              <div className="camera-header-bar">
                <div className="camera-info-left">
                  <span className="camera-icon-wrapper">
                    <Camera size={16} strokeWidth={2.5} />
                  </span>
                  <span className="camera-title-text">
                    {isCaptured ? 'Captured Frame (Frozen)' : 'Live Simulated Viewfinder'}
                  </span>
                </div>
                <div className="camera-badges-right">
                  <Badge variant={isCaptured ? 'sun' : 'live'} size="sm">
                    {isCaptured ? 'FRAME FROZEN' : 'SIMULATED STREAM'}
                  </Badge>
                </div>
              </div>

              {/* Viewport */}
              <div className={`camera-viewport ${isShutterActive ? 'shutter-flash' : ''}`}>
                {/* Crosshairs & Grid */}
                <div className="viewport-grid-lines" aria-hidden="true" />
                <div className="bracket-marker marker-tl" />
                <div className="bracket-marker marker-tr" />
                <div className="bracket-marker marker-bl" />
                <div className="bracket-marker marker-br" />

                {/* Waste Item Graphic */}
                <div className="viewport-illustration-box">
                  {renderIllustration(scenario.id)}
                </div>

                {/* Bounding Box Overlay */}
                <div
                  className="viewport-bbox"
                  style={{
                    left: `${scenario.detection.boundingBox.x * 100}%`,
                    top: `${scenario.detection.boundingBox.y * 100}%`,
                    width: `${scenario.detection.boundingBox.width * 100}%`,
                    height: `${scenario.detection.boundingBox.height * 100}%`,
                  }}
                >
                  <div className="bbox-label-chip">
                    <span className="label-text">{scenario.detection.label}</span>
                    <span className="label-confidence">
                      CONF: {Math.round(scenario.detection.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Stream / Frame Status Watermark */}
                <div className="viewport-watermark">
                  <span>CLASS: {scenario.detection.classId}</span>
                  <span>NORM_BBOX [0..1]</span>
                </div>
              </div>

              {/* Viewfinder Action Footer Bar */}
              <div className="camera-controls-bar">
                {!isCaptured ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCapture}
                    icon={<Camera size={18} strokeWidth={2.5} />}
                    className="action-capture-btn"
                  >
                    Capture &amp; Analyze Frame
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleReset}
                    icon={<RefreshCw size={18} strokeWidth={2.5} />}
                    className="action-capture-btn"
                  >
                    Reset to Live Stream
                  </Button>
                )}
                <span className="demo-camera-footnote">
                  * Demo mode uses simulated camera stream. Webcam integration connects in Phase 2.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Waste Result & Action Intelligence */}
          <div className="demo-result-column">
            <div className="result-card-container">
              {/* Category & Status Banner */}
              <div className="result-status-banner">
                <div className="banner-badge-group">
                  <Badge
                    variant={
                      scenario.knowledge.category === 'organic'
                        ? 'lime'
                        : scenario.knowledge.category === 'uncertain'
                        ? 'uncertain'
                        : 'pink'
                    }
                    size="md"
                  >
                    CATEGORY: {scenario.knowledge.category.toUpperCase()}
                  </Badge>
                  <Badge
                    variant={scenario.knowledge.materialVerified ? 'lime' : 'uncertain'}
                    size="sm"
                  >
                    {scenario.knowledge.materialVerified ? 'MATERIAL VERIFIED' : 'MATERIAL UNVERIFIED'}
                  </Badge>
                </div>
                <span className="demo-indicator-pill">STRUCTURED RULE RESULT</span>
              </div>

              {/* Title & Core Recommendation */}
              <div className="result-body-main">
                <h3 className="result-item-title">{scenario.knowledge.displayName}</h3>
                <div className="result-material-row">
                  <span className="meta-label">IDENTIFIED MATERIAL:</span>
                  <span className="meta-value">{scenario.knowledge.material}</span>
                </div>

                <div className="action-highlight-box">
                  <div className="action-box-header">
                    <CheckCircle size={18} strokeWidth={2.5} />
                    <span>RECOMMENDED DISPOSAL ACTION</span>
                  </div>
                  <p className="action-box-text">{scenario.knowledge.recommendedAction}</p>
                </div>

                {/* Preparation Steps Checklist */}
                <div className="prep-steps-section">
                  <h4 className="prep-heading">Physical Preparation Checklist:</h4>
                  <ul className="prep-list">
                    {scenario.knowledge.preparationSteps.map((step, idx) => (
                      <li key={idx} className="prep-item">
                        <span className="prep-step-num">{idx + 1}</span>
                        <span className="prep-step-text">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contamination Warning Box */}
                {scenario.knowledge.contaminationWarning && (
                  <div className="contamination-callout">
                    <AlertOctagon size={18} strokeWidth={2.5} className="warning-icon" />
                    <div>
                      <strong className="warning-title">Contamination Risk: </strong>
                      <span className="warning-text">{scenario.knowledge.contaminationWarning}</span>
                    </div>
                  </div>
                )}

                {/* Expandable "Why this recommendation?" */}
                <div className="why-recommendation-wrapper">
                  <button
                    type="button"
                    className="why-toggle-btn"
                    onClick={() => setShowWhyDetails(!showWhyDetails)}
                    aria-expanded={showWhyDetails}
                  >
                    <span className="why-toggle-title">
                      <Info size={16} strokeWidth={2.5} />
                      <span>Why this recommendation? (Environmental Context)</span>
                    </span>
                    {showWhyDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {showWhyDetails && (
                    <div className="why-details-content">
                      <p>{scenario.knowledge.environmentalContext}</p>
                      <div className="policy-status-indicator">
                        <span className="policy-tag">STATUS: {scenario.knowledge.policyStatus.toUpperCase()}</span>
                        <span>General municipal best practice. Regional policies may vary.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ask VisionX Assistant Trigger Bar */}
                <div className="assistant-trigger-bar">
                  <div className="assistant-trigger-text">
                    <Sparkles size={18} strokeWidth={2.5} className="sparkle-icon" />
                    <div>
                      <strong>Need deeper explanation?</strong>
                      <p>Ask our AWS Strands-ready agent follow-up questions about this item.</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAssistantOpen(true)}
                    icon={<MessageSquare size={16} strokeWidth={2.5} />}
                  >
                    Ask VisionX
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out / Modal Mock Assistant Drawer */}
      {isAssistantOpen && (
        <div className="assistant-modal-backdrop" role="dialog" aria-modal="true">
          <div className="assistant-drawer-card">
            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-title-group">
                <span className="drawer-icon-box">
                  <Sparkles size={18} strokeWidth={2.5} />
                </span>
                <div>
                  <h4 className="drawer-title">VisionX Conversational Assistant</h4>
                  <span className="drawer-subtitle">
                    Grounded with {scenario.name} context • Strands Spec
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsAssistantOpen(false)}
                aria-label="Close assistant panel"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Disclaimer pill */}
            <div className="drawer-disclaimer-banner">
              <span>DEMO MODE: Answers reflect structured waste knowledge base via mock service.</span>
            </div>

            {/* Chat Body */}
            <div className="drawer-chat-body">
              {chatHistory.length === 0 ? (
                <div className="drawer-empty-state">
                  <p className="empty-prompt-title">Suggested questions for this item:</p>
                  <div className="suggested-questions-list">
                    {scenario.sampleQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="suggested-q-btn"
                        onClick={() => handleAskAssistant(q.question)}
                      >
                        <span>"{q.question}"</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="chat-messages-container">
                  {chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.sender === 'user' ? 'row-user' : 'row-assistant'}`}
                    >
                      <div className={`chat-bubble bubble-${msg.sender}`}>
                        <div className="bubble-header">
                          <span className="bubble-author">
                            {msg.sender === 'user' ? 'You' : 'VisionX Assistant'}
                          </span>
                          <span className="bubble-time">{msg.timestamp}</span>
                        </div>
                        <p className="bubble-text">{msg.text}</p>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="bubble-sources">
                            <span className="source-label">Grounded Sources:</span>
                            {msg.sources.map((src, i) => (
                              <span key={i} className="source-chip">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}
                        {msg.needsVerification && (
                          <div className="verification-caveat">
                            * Note: Material is visually inferred; verification recommended.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {assistantLoading && (
                    <div className="chat-bubble-row row-assistant">
                      <div className="chat-bubble bubble-assistant bubble-loading">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="loading-label">Retrieving waste context...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              className="drawer-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAssistant(assistantInput);
              }}
            >
              <input
                type="text"
                className="drawer-input-field"
                placeholder={`Ask about ${scenario.name} disposal or recycling...`}
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                disabled={assistantLoading}
              />
              <button
                type="submit"
                className="drawer-send-btn"
                disabled={assistantLoading || !assistantInput.trim()}
                aria-label="Send question to assistant"
              >
                <Send size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
