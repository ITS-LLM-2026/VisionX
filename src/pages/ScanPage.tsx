import React, { useState, useEffect } from 'react';
import { ScanLine, ArrowLeft, Sparkles, X, Send } from 'lucide-react';
import { useRouter } from '../lib/useRouter';
import { useCamera } from '../hooks/useCamera';
import { YoloDetectionService } from '../features/detection/detection.service';
import { StrandsAgentService } from '../features/assistant/assistant.service';
import { getTimestamp, generateId } from '../lib/utils';
import type { ScannerInputMode, DetectedWasteObject, AssistantResponse } from '../types';
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

  // Real YOLO Detection State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [detections, setDetections] = useState<DetectedWasteObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Backend Health Status
  const [backendHealth, setBackendHealth] = useState<{
    isOnline: boolean;
    device?: string;
    classesCount?: number;
  }>({ isOnline: false });

  // Assistant Drawer State (Powered by Strands Agents)
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [assistantLoading, setAssistantLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    sources?: string[];
    needsVerification?: boolean;
    suggestedQuestions?: string[];
    uncertaintyNote?: string | null;
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

  // Check Backend Health on Mount
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const health = await YoloDetectionService.checkHealth();
      if (isMounted) {
        setBackendHealth(health);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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

    if (inputMode === 'camera' && isCameraActive) {
      stopCamera();
    }

    clearSelectedImage();
    resetDetectionState();
    setInputMode(mode);
  };

  const resetDetectionState = () => {
    setDetections([]);
    setSelectedObjectId(null);
    setHasAnalyzed(false);
    setErrorMessage(null);
  };

  // Handle frame capture from live camera with optional live tracking handover
  const handleCaptureFrame = async (liveDets?: DetectedWasteObject[]) => {
    const captured = await captureFrame();
    if (captured) {
      clearSelectedImage();
      setSelectedImage({
        blob: captured.blob,
        url: captured.url,
        sourceMode: 'camera',
      });
      if (liveDets && liveDets.length > 0) {
        setDetections(liveDets);
        setSelectedObjectId(liveDets[0].id);
        setHasAnalyzed(true);
        setErrorMessage(null);
      } else {
        resetDetectionState();
      }
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
    resetDetectionState();
  };

  // Retake or Choose another image
  const handleRetry = () => {
    clearSelectedImage();
    resetDetectionState();
  };

  // Trigger Real YOLO Waste Analysis
  const handleAnalyzeWaste = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await YoloDetectionService.detectObjects(
        selectedImage.blob,
        0.18
      );

      if (result.success) {
        setDetections(result.detections);
        setSelectedObjectId(result.detections.length > 0 ? result.detections[0].id : null);
        setHasAnalyzed(true);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.error || 'Failed to run YOLO detection.');
        setDetections([]);
        setSelectedObjectId(null);
        setHasAnalyzed(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected error during detection.');
      setDetections([]);
      setSelectedObjectId(null);
      setHasAnalyzed(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset entire analysis to scan a new item
  const handleResetAnalysis = () => {
    clearSelectedImage();
    resetDetectionState();
    setChatHistory([]);
  };

  // Select an individual detected object from chips or bounding boxes
  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
  };

  // Currently selected object
  const selectedObject: DetectedWasteObject | null =
    detections.find((d) => d.id === selectedObjectId) || (detections.length > 0 ? detections[0] : null);

  const currentIndex = detections.findIndex((d) => d.id === selectedObject?.id);

  const handleSelectNext = () => {
    if (currentIndex >= 0 && currentIndex < detections.length - 1) {
      setSelectedObjectId(detections[currentIndex + 1].id);
    }
  };

  const handleSelectPrev = () => {
    if (currentIndex > 0) {
      setSelectedObjectId(detections[currentIndex - 1].id);
    }
  };

  // Grounded context for starter chips
  const starterQuestions = selectedObject ? [
    `How should I dispose of this ${selectedObject.display_name}?`,
    `What preparation steps are required before recycling?`,
    `What are the contamination hazards for this material?`,
  ] : [
    'How do I properly sort mixed recyclable containers?',
    'What items cause mechanical sorting failures?',
    'What are the most common household recycling errors?',
  ];

  // Send message to Strands conversational agent
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
      const response: AssistantResponse = await StrandsAgentService.ask({
        question: questionText,
        selectedObject,
        allDetections: detections,
        history: chatHistory.map((m) => ({ sender: m.sender, text: m.text })),
        sessionId: 'visionx-session-' + (selectedObject?.id || 'live-frame'),
      });

      setChatHistory((prev) => [
        ...prev,
        {
          id: generateId('assistant'),
          sender: 'assistant',
          text: response.message,
          sources: response.sourceUrls,
          needsVerification: response.needsVerification,
          suggestedQuestions: response.suggestedQuestions,
          uncertaintyNote: response.uncertaintyNote,
          timestamp: response.timestamp || userMsgTime,
        },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          id: generateId('err'),
          sender: 'assistant',
          text: 'VisionX Strands Agent encountered a connection issue. Please verify that the backend server is running.',
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
            {backendHealth.isOnline ? (
              <Badge variant="live" size="sm">
                YOLO11n LIVE ({backendHealth.device?.toUpperCase() || 'CPU'})
              </Badge>
            ) : (
              <Badge variant="sun" size="sm">
                LOCAL YOLO SERVER READY (START WITH PYTHON)
              </Badge>
            )}
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
              Real-Time <mark className="highlighter">Waste Detection</mark>.
            </h1>
            <p className="scan-page-subtitle">
              Capture a live photo using your camera or upload an image to run real YOLO object detection, explore multi-object bounding boxes, and get actionable disposal instructions.
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
                  detections={detections}
                  selectedObjectId={selectedObjectId}
                  onSelectObject={handleSelectObject}
                  onAnalyze={handleAnalyzeWaste}
                  onRetry={handleRetry}
                  isAnalyzing={isAnalyzing}
                  hasAnalyzed={hasAnalyzed}
                  errorMessage={errorMessage}
                />
              )}
            </div>

            {/* RIGHT COLUMN: Analysis & Guidance Results */}
            <div className="workspace-column-result">
              <AnalysisResultPanel
                selectedObject={selectedObject}
                totalDetections={detections.length}
                currentIndex={currentIndex}
                isAnalyzing={isAnalyzing}
                hasAnalyzed={hasAnalyzed}
                onSelectNext={handleSelectNext}
                onSelectPrev={handleSelectPrev}
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
                    Grounded with {selectedObject ? selectedObject.display_name : 'Municipal Waste'} context
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsAssistantOpen(false)}
                aria-label="Close assistant"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="drawer-chat-body">
              {chatHistory.length === 0 ? (
                <div className="drawer-empty-state">
                  <p className="empty-prompt-title">Suggested questions for this item:</p>
                  <div className="suggested-questions-list">
                    {starterQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="suggested-q-btn"
                        onClick={() => handleAskAssistant(q)}
                      >
                        <span>"{q}"</span>
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
                        <div className="bubble-text">
                          {msg.text.split('\n').map((paragraph, pIdx) =>
                            paragraph.trim() ? (
                              <p key={pIdx} className="bubble-paragraph">
                                {paragraph}
                              </p>
                            ) : null
                          )}
                        </div>

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

                        {msg.uncertaintyNote && (
                          <div className="verification-caveat">
                            * Note: {msg.uncertaintyNote}
                          </div>
                        )}

                        {msg.sender === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="suggested-followups-container">
                            <div className="source-label" style={{ marginBottom: '6px', marginTop: '4px' }}>
                              SUGGESTED FOLLOW-UPS:
                            </div>
                            <div className="suggested-questions-list">
                              {msg.suggestedQuestions.map((sq, sqIdx) => (
                                <button
                                  key={sqIdx}
                                  type="button"
                                  className="suggested-q-btn"
                                  onClick={() => handleAskAssistant(sq)}
                                  disabled={assistantLoading}
                                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                                >
                                  <span>"{sq}"</span>
                                </button>
                              ))}
                            </div>
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
                        <span className="loading-label">Thinking with Strands Agent...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Input Bar */}
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
                placeholder={
                  selectedObject
                    ? `Ask about ${selectedObject.display_name}...`
                    : 'Ask about waste sorting...'
                }
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
