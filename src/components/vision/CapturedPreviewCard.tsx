import React from 'react';
import { Sparkles, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { ScannerInputMode, DetectedWasteObject } from '../../types';
import './CapturedPreviewCard.css';

interface CapturedPreviewCardProps {
  imageUrl: string;
  sourceMode: ScannerInputMode;
  detections: DetectedWasteObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onAnalyze: () => void;
  onRetry: () => void;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  errorMessage: string | null;
}

export const CapturedPreviewCard: React.FC<CapturedPreviewCardProps> = ({
  imageUrl,
  sourceMode,
  detections,
  selectedObjectId,
  onSelectObject,
  onAnalyze,
  onRetry,
  isAnalyzing,
  hasAnalyzed,
  errorMessage,
}) => {
  return (
    <div className="captured-preview-card">
      {/* Top Header */}
      <div className="preview-top-bar">
        <div className="preview-status-group">
          <Badge variant="sun" size="sm">
            {sourceMode === 'camera' ? 'CAMERA STILL' : 'UPLOADED IMAGE'}
          </Badge>
          <span className="source-tag">
            {sourceMode === 'camera' ? 'FRAME CAPTURED' : 'SOURCE FILE'}
          </span>
        </div>
        <Badge variant={detections.length > 0 ? 'lime' : 'ink'} size="sm">
          {hasAnalyzed
            ? `${detections.length} ${detections.length === 1 ? 'OBJECT DETECTED' : 'OBJECTS DETECTED'}`
            : 'FROZEN STILL'}
        </Badge>
      </div>

      {/* Image Preview Box with Real Bounding Box Overlays */}
      <div className="preview-image-viewport">
        <img
          src={imageUrl}
          alt="Waste item still preview"
          className="preview-image-element"
        />

        {/* Framing brackets */}
        <div className="preview-frame-brackets" aria-hidden="true">
          <div className="corner-bracket bracket-tl" />
          <div className="corner-bracket bracket-tr" />
          <div className="corner-bracket bracket-bl" />
          <div className="corner-bracket bracket-br" />
        </div>

        {/* Real Bounding Boxes Rendered from YOLO Model (Max Confidence per Object) */}
        {hasAnalyzed &&
          detections.map((det) => {
            const isSelected = selectedObjectId === det.id;
            return (
              <button
                key={det.id}
                type="button"
                className={`detection-bounding-box ${isSelected ? 'selected' : ''} cat-${det.waste_category}`}
                style={{
                  left: `${det.box.x * 100}%`,
                  top: `${det.box.y * 100}%`,
                  width: `${det.box.width * 100}%`,
                  height: `${det.box.height * 100}%`,
                }}
                onClick={() => onSelectObject(det.id)}
                title={`Click to inspect ${det.display_name} (${Math.round(det.confidence * 100)}%)`}
                aria-label={`Select detected item ${det.display_name}`}
              >
                <span className="box-badge-label">
                  {det.display_name} · {Math.round(det.confidence * 100)}%
                </span>
              </button>
            );
          })}
      </div>

      {/* Multi-Object Selection Chips / Cards (Prompt 3 & Issue 2: Max Confidence) */}
      {hasAnalyzed && detections.length > 0 && (
        <div className="detections-selection-container">
          <div className="detections-header-row">
            <div className="detections-count-badge">
              <Sparkles size={14} strokeWidth={2.5} />
              <span>DETECTED OBJECTS ({detections.length})</span>
            </div>
            <span className="detections-hint-text">
              Click an object or bounding box to inspect disposal details
            </span>
          </div>

          <div className="detection-chips-grid">
            {detections.map((det) => {
              const isSelected = selectedObjectId === det.id;
              return (
                <button
                  key={det.id}
                  type="button"
                  className={`detection-chip-card ${isSelected ? 'active' : ''} chip-${det.waste_category}`}
                  onClick={() => onSelectObject(det.id)}
                >
                  <div className="chip-indicator" />
                  <div className="chip-details">
                    <span className="chip-name">{det.display_name}</span>
                    <span className="chip-conf">
                      {Math.round(det.confidence * 100)}% CONFIDENCE
                    </span>
                  </div>
                  <span className={`chip-category-tag tag-${det.waste_category}`}>
                    {det.waste_category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when Analyzed but No Objects Found */}
      {hasAnalyzed && detections.length === 0 && !errorMessage && (
        <div className="empty-detection-alert">
          <AlertCircle size={18} strokeWidth={2.5} />
          <div>
            <strong>No supported objects detected</strong> in this frame.
            Try adjusting the lighting, bringing the item closer to the camera, or testing another angle.
          </div>
        </div>
      )}

      {/* Backend Error State Banner */}
      {errorMessage && (
        <div className="backend-error-banner">
          <div className="error-title-row">
            <ShieldAlert size={18} strokeWidth={2.5} />
            <span>Detection Backend Unavailable</span>
          </div>
          <p className="error-desc-text">{errorMessage}</p>
          <div>
            <span className="error-code-tip">Terminal: python backend/server.py</span>
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="preview-actions-bar">
        <Button
          variant="primary"
          size="lg"
          onClick={onAnalyze}
          disabled={isAnalyzing}
          icon={<Sparkles size={18} strokeWidth={2.5} />}
          className="btn-analyze-waste"
        >
          {isAnalyzing ? 'Running YOLO Inference...' : hasAnalyzed ? 'Re-run Detection' : 'Run Waste Detection'}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onRetry}
          disabled={isAnalyzing}
          icon={<RefreshCw size={16} strokeWidth={2.5} />}
        >
          {sourceMode === 'camera' ? 'Retake Frame' : 'Upload Another'}
        </Button>
      </div>
    </div>
  );
};
