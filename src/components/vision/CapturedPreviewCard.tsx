import React from 'react';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { WasteAnalysisService } from '../../features/waste/waste.service';
import type { ScannerInputMode } from '../../types';
import './CapturedPreviewCard.css';

interface CapturedPreviewCardProps {
  imageUrl: string;
  sourceMode: ScannerInputMode;
  selectedScenarioId: string;
  onScenarioChange: (scenarioId: string) => void;
  onAnalyze: () => void;
  onRetry: () => void;
  isAnalyzing: boolean;
}

export const CapturedPreviewCard: React.FC<CapturedPreviewCardProps> = ({
  imageUrl,
  sourceMode,
  selectedScenarioId,
  onScenarioChange,
  onAnalyze,
  onRetry,
  isAnalyzing,
}) => {
  const availableScenarios = WasteAnalysisService.getAvailableScenarios();

  return (
    <div className="captured-preview-card">
      {/* Top Header */}
      <div className="preview-top-bar">
        <div className="preview-status-group">
          <Badge variant="sun" size="sm">
            {sourceMode === 'camera' ? 'IMAGE CAPTURED' : 'IMAGE READY'}
          </Badge>
          <span className="source-tag">
            {sourceMode === 'camera' ? 'FRAME FROM WEBCAM' : 'UPLOADED FILE'}
          </span>
        </div>
        <Badge variant="ink" size="sm">
          FROZEN STILL
        </Badge>
      </div>

      {/* Image Preview Box */}
      <div className="preview-image-viewport">
        <img
          src={imageUrl}
          alt="Captured waste item preview"
          className="preview-image-element"
        />
        <div className="preview-frame-brackets" aria-hidden="true">
          <div className="corner-bracket bracket-tl" />
          <div className="corner-bracket bracket-tr" />
          <div className="corner-bracket bracket-bl" />
          <div className="corner-bracket bracket-br" />
        </div>
      </div>

      {/* Mock Demo Scenario Selector (Strict Prompt 2: Transparent simulation) */}
      <div className="simulation-scenario-box">
        <div className="scenario-label-row">
          <Layers size={14} strokeWidth={2.5} />
          <span className="scenario-label-text">TEST SCENARIO (DETERMINISTIC SIMULATION):</span>
        </div>
        <div className="scenario-selector-chips">
          {availableScenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              disabled={isAnalyzing}
              className={`scenario-chip-btn ${selectedScenarioId === sc.id ? 'active' : ''}`}
              onClick={() => onScenarioChange(sc.id)}
            >
              <span>{sc.name}</span>
            </button>
          ))}
        </div>
        <p className="scenario-disclaimer">
          * YOLO model inference is simulated. Selecting a scenario deterministically controls the guidance output.
        </p>
      </div>

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
          {isAnalyzing ? 'Analyzing Waste...' : 'Analyze Waste'}
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          disabled={isAnalyzing}
          icon={<RefreshCw size={16} strokeWidth={2.5} />}
        >
          {sourceMode === 'camera' ? 'Retake Photo' : 'Choose Another Image'}
        </Button>
      </div>
    </div>
  );
};
