import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  RefreshCw,
  MessageSquare,
  Compass,
  Layers,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { WasteAnalysisResult } from '../../types';
import './AnalysisResultPanel.css';

interface AnalysisResultPanelProps {
  result: WasteAnalysisResult | null;
  isAnalyzing: boolean;
  onReset: () => void;
  onOpenAssistant: () => void;
}

export const AnalysisResultPanel: React.FC<AnalysisResultPanelProps> = ({
  result,
  isAnalyzing,
  onReset,
  onOpenAssistant,
}) => {
  const [whyExpanded, setWhyExpanded] = useState(false);

  // State 1: Analyzing Loading State
  if (isAnalyzing) {
    return (
      <div className="analysis-panel-card panel-loading">
        <div className="loading-content-box">
          <div className="loading-icon-pulse">
            <RefreshCw size={36} strokeWidth={2.5} className="spin-icon" />
          </div>
          <Badge variant="sun" size="sm">
            RUNNING DEMO ANALYSIS
          </Badge>
          <h3 className="loading-title">Analyzing Waste Object...</h3>
          <p className="loading-desc">
            Simulating YOLO object classification and deterministic disposal knowledge base retrieval.
          </p>
          <div className="loading-steps-ticker">
            <span>[1/3] Normalizing bounding coordinates</span>
            <span>[2/3] Matching material taxonomy</span>
            <span>[3/3] Generating physical preparation steps</span>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Empty State (Before analysis)
  if (!result) {
    return (
      <div className="analysis-panel-card panel-empty">
        <div className="empty-content-box">
          <div className="empty-icon-circle">
            <Compass size={36} strokeWidth={2.5} />
          </div>
          <Badge variant="ink" size="sm">
            WAITING FOR IMAGE
          </Badge>
          <h3 className="empty-title">Your results will appear here</h3>
          <p className="empty-desc">
            Capture a live video frame or upload an image from your device, then press <strong>Analyze Waste</strong> to inspect its disposal guidance.
          </p>
          <div className="empty-checklist-hint">
            <div className="hint-row">
              <span className="hint-num">1</span>
              <span>Input waste photo via camera or file</span>
            </div>
            <div className="hint-row">
              <span className="hint-num">2</span>
              <span>Confirm still preview &amp; test scenario</span>
            </div>
            <div className="hint-row">
              <span className="hint-num">3</span>
              <span>Receive structured next-step disposal rules</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Active Structured Result Panel
  return (
    <div className="analysis-panel-card panel-result">
      {/* Result Card Top Bar */}
      <div className="result-panel-header">
        <div className="result-badges-row">
          <Badge
            variant={
              result.category === 'organic'
                ? 'lime'
                : result.category === 'uncertain'
                ? 'uncertain'
                : 'pink'
            }
            size="md"
          >
            CATEGORY: {result.category.toUpperCase()}
          </Badge>

          <Badge
            variant={result.materialVerified ? 'lime' : 'uncertain'}
            size="sm"
          >
            {result.materialVerified ? 'MATERIAL VERIFIED' : 'MATERIAL UNVERIFIED'}
          </Badge>
        </div>

        <div className="result-simulation-tag">
          <Badge variant="ink" size="sm">
            SIMULATED RESULT
          </Badge>
        </div>
      </div>

      <div className="result-panel-body">
        {/* Title and Material Info */}
        <div className="result-title-section">
          <h3 className="result-display-name">{result.displayName}</h3>
          <div className="result-material-pill">
            <Layers size={14} strokeWidth={2.5} />
            <span className="material-label">MATERIAL:</span>
            <span className="material-value">{result.material || 'Unknown / Mixed'}</span>
          </div>
          <p className="material-caveat-text">
            {result.materialVerified
              ? 'Material chemistry confirmed for this benchmark class.'
              : 'Unverified polymer. Visual appearance does not confirm resin composition without optical spectroscopy.'}
          </p>
        </div>

        {/* Action Card: Yellow Neo-Brutalist Callout */}
        <div className="result-action-callout">
          <div className="action-callout-header">
            <CheckCircle2 size={18} strokeWidth={2.5} />
            <span>RECOMMENDED NEXT STEP</span>
          </div>
          <p className="action-callout-text">{result.recommendedAction}</p>
        </div>

        {/* Preparation Checklist */}
        <div className="result-prep-section">
          <h4 className="prep-section-heading">Preparation Steps:</h4>
          <ol className="prep-ordered-list">
            {result.preparationSteps.map((step, idx) => (
              <li key={idx} className="prep-list-item">
                <span className="item-step-num">{idx + 1}</span>
                <span className="item-step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Contamination Notice */}
        {result.contaminationWarning && (
          <div className="result-warning-box">
            <AlertOctagon size={18} strokeWidth={2.5} className="warning-icon" />
            <div>
              <strong className="warning-heading">Contamination Warning: </strong>
              <span className="warning-body">{result.contaminationWarning}</span>
            </div>
          </div>
        )}

        {/* Collapsible Environmental Rationale */}
        <div className="result-collapsible-wrapper">
          <button
            type="button"
            className="collapsible-toggle-btn"
            onClick={() => setWhyExpanded(!whyExpanded)}
            aria-expanded={whyExpanded}
            aria-controls="why-explanation-panel"
          >
            <span className="toggle-label-group">
              <Info size={16} strokeWidth={2.5} />
              <span>Why this recommendation?</span>
            </span>
            {whyExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {whyExpanded && (
            <div id="why-explanation-panel" className="collapsible-content-box">
              <p className="environmental-text">{result.environmentalContext}</p>
              <div className="policy-status-pill">
                <span className="status-label">STATUS:</span>
                <span className="status-text">
                  {result.policyStatus === 'verified-local'
                    ? 'Verified Local Collection Policy'
                    : 'GENERAL GUIDANCE · LOCAL RULES MAY VARY'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Assistant Follow-up Trigger Card (Sky Blue) */}
        <div className="result-assistant-callout">
          <div className="assistant-callout-left">
            <Sparkles size={18} strokeWidth={2.5} className="sparkle-icon" />
            <div>
              <strong>Need a deeper explanation?</strong>
              <p>Ask a follow-up question about this item.</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAssistant}
            icon={<MessageSquare size={16} strokeWidth={2.5} />}
          >
            Ask VisionX
          </Button>
        </div>

        {/* Reset / Scan Another Action */}
        <div className="result-footer-actions">
          <Button
            variant="secondary"
            size="md"
            onClick={onReset}
            icon={<RefreshCw size={16} strokeWidth={2.5} />}
            className="btn-scan-another"
          >
            Scan Another Item
          </Button>
        </div>
      </div>
    </div>
  );
};
