import React, { useState, useEffect } from 'react';
import { ScanLine, ArrowLeft, Sparkles, X, Send } from 'lucide-react';
import { useRouter } from '../lib/useRouter';
import { useCamera } from '../hooks/useCamera';
import { WasteAnalysisService } from '../features/waste/waste.service';
import { MockAssistantService } from '../features/assistant/assistant.service';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { getTimestamp, generateId } from '../lib/utils';
import type { ScannerInputMode, WasteAnalysisResult, AssistantResponse, DemoScenario } from '../types';
import { Badge } from '../components/ui/Badge';
import { InputModeSelector } from '../components/vision/InputModeSelector';
import { CameraViewfinder } from '../components/vision/CameraViewfinder';
import { ImageUploadPanel } from '../components/vision/ImageUploadPanel';
import { CapturedPreviewCard } from '../components/vision/CapturedPreviewCard';
import { AnalysisResultPanel } from '../components/vision/AnalysisResultPanel';
import './ScanPage.css';

export const ScanPage: React.FC = () => {
  const { navigate } = useRouter();

  // Input Mode: 'camera' | 'upload'
  const [inputMode, setInputMode] = useState<ScannerInputMode>('camera');

  // Selected Image state (Blob + object URL)
  const [selectedImage, setSelectedImage] = useState<{
    blob: Blob;
    url: string;
    sourceMode: ScannerInputMode;
  } | null>(null);

  // Selected Demo Scenario ID for deterministic simulation
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('plastic-bottle');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<WasteAnalysisResult | null>(null);

  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [assistantLoading, setAssistantLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    sources?: string[];
    needsVerification?: boolean;
    timestamp: string;
  }[]>([]);

  // Camera Hook
  const {
    videoRef,
    isActive: isCameraActive,
    isRequesting: isCameraRequesting,
    error: cameraError,
    facingMode,
    stream,
    startCamera,
    stopCamera,
    toggleFacingMode,
    captureFrame,
  } = useCamera();

  // Helper to safely revoke object URL and clean previous image
  const clearSelectedImage = () => {
    if (selectedImage?.url) {
      try {
        URL.revokeObjectURL(selectedImage.url);
      } catch {
        // ignore
      }
    }
    setSelectedImage(null);
  };

  // Switch input mode (Camera vs Upload)
  const handleModeChange = (mode: ScannerInputMode) => {
    if (mode === inputMode) return;

    // Stop active camera when leaving camera mode
    if (inputMode === 'camera' && isCameraActive) {
      stopCamera();
    }

    clearSelectedImage();
    setAnalysisResult(null);
    setInputMode(mode);
  };

  // Handle frame capture from live camera
  const handleCaptureFrame = async () => {
    const captured = await captureFrame();
    if (captured) {
      clearSelectedImage();
      setSelectedImage({
        blob: captured.blob,
        url: captured.url,
        sourceMode: 'camera',
      });
      setAnalysisResult(null);
    }
  };

  // Handle image selected via file upload
  const handleImageUploaded = (blob: Blob, url: string) => {
    clearSelectedImage();
    setSelectedImage({
      blob,
      url,
      sourceMode: 'upload',
    });
    setAnalysisResult(null);
  };

  // Retake or Choose another image
  const handleRetry = () => {
    clearSelectedImage();
    setAnalysisResult(null);

    // If retrying in camera mode and camera wasn't running, user can start camera again
  };

  // Trigger Waste Analysis
  const handleAnalyzeWaste = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await WasteAnalysisService.analyzeWasteImage(
        selectedImage.blob,
        selectedScenarioId
      );
      setAnalysisResult(result);
    } catch {
      // Mock fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset entire analysis to scan a new item
  const handleResetAnalysis = () => {
    clearSelectedImage();
    setAnalysisResult(null);
    setChatHistory([]);
  };

  // Active scenario data for assistant grounding
  const activeScenario: DemoScenario =
    DEMO_SCENARIOS.find((s: DemoScenario) => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  // Send message to assistant
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
      const response: AssistantResponse = await MockAssistantService.ask(
        questionText,
        activeScenario
      );
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (selectedImage?.url) {
        try {
          URL.revokeObjectURL(selectedImage.url);
        } catch {
          // ignore
        }
      }
    };
  }, [selectedImage]);

  return (
    <div className="scan-page-root">
      {/* Top Scanner Navigation Bar */}
      <header className="scan-header-bar">
        <div className="page-container scan-nav-inner">
          <div className="scan-nav-left">
            <button
              type="button"
              className="back-home-btn"
              onClick={() => {
                if (isCameraActive) stopCamera();
                navigate('/');
              }}
              aria-label="Back to VisionX Home"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span>Back to Home</span>
            </button>

            <div className="scan-brand-badge">
              <span className="scan-logo-box">
                <ScanLine size={16} strokeWidth={2.5} />
              </span>
              <span className="scan-brand-title">
                Vision<span className="scan-brand-x">X</span>
              </span>
              <span className="scan-status-tag">SCANNER</span>
            </div>
          </div>

          <div className="scan-nav-right">
            <Badge variant="sun" size="sm">
              DEMO MODE · MODEL NOT CONNECTED
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="scan-workspace-main">
        <div className="page-container">
          {/* Page Heading */}
          <div className="scan-page-heading">
            <div className="scan-eyebrow-row">
              <span className="scan-eyebrow-pill">VISIONX / WASTE INTELLIGENCE</span>
            </div>
            <h1 className="scan-page-title">
              Let's figure out <mark className="highlighter">where it goes</mark>.
            </h1>
            <p className="scan-page-subtitle">
              Capture a live photo using your camera or upload an image to explore its waste category, preparation steps, and disposal guidance.
            </p>
          </div>

          {/* Two-Column Responsive Workspace Grid */}
          <div className="scan-workspace-grid">
            {/* LEFT COLUMN: Input Workspace */}
            <div className="workspace-column-input">
              {/* Mode Selector */}
              <InputModeSelector
                mode={inputMode}
                onModeChange={handleModeChange}
                disabled={isAnalyzing}
              />

              {/* View 1: When no image is captured yet */}
              {!selectedImage && (
                <>
                  {inputMode === 'camera' ? (
                    <CameraViewfinder
                      videoRef={videoRef}
                      stream={stream}
                      isActive={isCameraActive}
                      isRequesting={isCameraRequesting}
                      facingMode={facingMode}
                      error={cameraError}
                      onStartCamera={startCamera}
                      onStopCamera={stopCamera}
                      onToggleFacingMode={toggleFacingMode}
                      onCaptureFrame={handleCaptureFrame}
                    />
                  ) : (
                    <ImageUploadPanel
                      onImageSelected={handleImageUploaded}
                      disabled={isAnalyzing}
                    />
                  )}
                </>
              )}

              {/* View 2: When an image is captured or uploaded */}
              {selectedImage && (
                <CapturedPreviewCard
                  imageUrl={selectedImage.url}
                  sourceMode={selectedImage.sourceMode}
                  selectedScenarioId={selectedScenarioId}
                  onScenarioChange={setSelectedScenarioId}
                  onAnalyze={handleAnalyzeWaste}
                  onRetry={handleRetry}
                  isAnalyzing={isAnalyzing}
                />
              )}
            </div>

            {/* RIGHT COLUMN: Analysis & Guidance Results */}
            <div className="workspace-column-result">
              <AnalysisResultPanel
                result={analysisResult}
                isAnalyzing={isAnalyzing}
                onReset={handleResetAnalysis}
                onOpenAssistant={() => setIsAssistantOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Assistant Modal / Drawer */}
      {isAssistantOpen && (
        <div className="assistant-modal-backdrop" role="dialog" aria-modal="true">
          <div className="assistant-drawer-card">
            <div className="drawer-header">
              <div className="drawer-title-group">
                <span className="drawer-icon-box">
                  <Sparkles size={18} strokeWidth={2.5} />
                </span>
                <div>
                  <h4 className="drawer-title">VisionX Conversational Assistant</h4>
                  <span className="drawer-subtitle">
                    Grounded with {activeScenario.name} context • Strands Spec
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

            <div className="drawer-disclaimer-banner">
              <span>DEMO MODE: Answers reflect structured waste knowledge base via mock service.</span>
            </div>

            <div className="drawer-chat-body">
              {chatHistory.length === 0 ? (
                <div className="drawer-empty-state">
                  <p className="empty-prompt-title">Suggested questions for this item:</p>
                  <div className="suggested-questions-list">
                    {activeScenario.sampleQuestions.map((q, idx) => (
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
                placeholder={`Ask about ${activeScenario.name} disposal or recycling...`}
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
    </div>
  );
};
