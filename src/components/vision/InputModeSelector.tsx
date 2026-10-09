import React from 'react';
import { Camera, Upload } from 'lucide-react';
import type { ScannerInputMode } from '../../types';
import './InputModeSelector.css';

interface InputModeSelectorProps {
  mode: ScannerInputMode;
  onModeChange: (mode: ScannerInputMode) => void;
  disabled?: boolean;
}

export const InputModeSelector: React.FC<InputModeSelectorProps> = ({
  mode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <div className="input-mode-selector" role="tablist" aria-label="Scanner input mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'camera'}
        disabled={disabled}
        className={`mode-tab-btn ${mode === 'camera' ? 'active' : ''}`}
        onClick={() => onModeChange('camera')}
      >
        <Camera size={18} strokeWidth={2.5} />
        <span>Live Camera</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === 'upload'}
        disabled={disabled}
        className={`mode-tab-btn ${mode === 'upload' ? 'active' : ''}`}
        onClick={() => onModeChange('upload')}
      >
        <Upload size={18} strokeWidth={2.5} />
        <span>Upload Photo</span>
      </button>
    </div>
  );
};
