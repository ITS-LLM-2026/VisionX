import React, { useEffect } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw, SwitchCamera } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { CameraError, CameraFacingMode } from '../../hooks/useCamera';
import './CameraViewfinder.css';

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive: boolean;
  isRequesting: boolean;
  facingMode?: CameraFacingMode;
  error: CameraError | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onToggleFacingMode?: () => void;
  onCaptureFrame: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  stream,
  isActive,
  isRequesting,
  facingMode = 'user',
  error,
  onStartCamera,
  onStopCamera,
  onToggleFacingMode,
  onCaptureFrame,
}) => {
  // Ensure video element plays and attaches stream whenever available
  useEffect(() => {
    const video = videoRef.current;
    if (isActive && stream && video) {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.play().catch((err) => {
          console.warn('Video auto-play interrupted:', err);
        });
      }
    }
  }, [isActive, stream, videoRef]);

  return (
    <div className="camera-viewfinder-card">
      {/* Top Header Bar */}
      <div className="viewfinder-header">
        <div className="viewfinder-title-group">
          <Camera size={16} strokeWidth={2.5} />
          <span className="viewfinder-title-text">
            {isActive ? 'LIVE WEBCAM STREAM' : 'CAMERA INTERFACE'}
          </span>
        </div>
        <div className="viewfinder-badges">
          {isActive ? (
            <Badge variant="live" size="sm">
              CAMERA ON
            </Badge>
          ) : (
            <Badge variant="ink" size="sm">
              CAMERA OFF
            </Badge>
          )}

          {isActive && onToggleFacingMode && (
            <button
              type="button"
              className="flip-camera-btn"
              onClick={onToggleFacingMode}
              title={`Switch camera (Currently ${facingMode === 'user' ? 'Front' : 'Rear'})`}
              aria-label="Switch camera between front and rear"
            >
              <SwitchCamera size={14} strokeWidth={2.5} />
              <span>{facingMode === 'user' ? 'Front' : 'Rear'}</span>
            </button>
          )}

          <Badge variant="sun" size="sm">
            PROTOTYPE
          </Badge>
        </div>
      </div>

      {/* Main Viewfinder Display Area */}
      <div className="viewfinder-viewport">
        {/* State 1: Active Live Camera Feed */}
        {isActive && (
          <div className="live-video-container">
            <video
              ref={(node) => {
                videoRef.current = node;
                if (node && stream && node.srcObject !== stream) {
                  node.srcObject = stream;
                  node.play().catch(() => {});
                }
              }}
              className={`live-video-element ${facingMode === 'user' ? 'mirrored' : ''}`}
              playsInline
              autoPlay
              muted
              onLoadedMetadata={(e) => {
                const target = e.currentTarget;
                target.play().catch(() => {});
              }}
            />

            {/* Static Framing Brackets (Strict: No fake bounding boxes or confidence) */}
            <div className="framing-bracket bracket-tl" aria-hidden="true" />
            <div className="framing-bracket bracket-tr" aria-hidden="true" />
            <div className="framing-bracket bracket-bl" aria-hidden="true" />
            <div className="framing-bracket bracket-br" aria-hidden="true" />

            {/* Viewfinder Center Crosshair Hint */}
            <div className="viewfinder-center-marker" aria-hidden="true" />

            {/* Bottom Status Watermark */}
            <div className="viewport-hint-overlay">
              <span>Place one item in the centre of the frame</span>
            </div>
          </div>
        )}

        {/* State 2: Requesting Access */}
        {!isActive && isRequesting && (
          <div className="camera-state-placeholder">
            <div className="state-spinner-box">
              <RefreshCw size={32} strokeWidth={2.5} className="spin-icon" />
            </div>
            <h4 className="placeholder-title">Requesting Camera Access</h4>
            <p className="placeholder-desc">
              Please grant camera permission in your browser prompt to view the live video feed.
            </p>
          </div>
        )}

        {/* State 3: Camera Error (Permission denied, device in use, no hardware) */}
        {!isActive && !isRequesting && error && (
          <div className="camera-state-placeholder placeholder-error">
            <div className="error-icon-box">
              <AlertCircle size={32} strokeWidth={2.5} />
            </div>
            <h4 className="placeholder-title">Camera Unavailable</h4>
            <p className="placeholder-desc">{error.message}</p>
            <div className="error-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={onStartCamera}
                icon={<RefreshCw size={14} />}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* State 4: Initial Inactive Placeholder (Does not auto-start camera) */}
        {!isActive && !isRequesting && !error && (
          <div className="camera-state-placeholder">
            <div className="camera-placeholder-icon">
              <Camera size={36} strokeWidth={2.5} />
            </div>
            <h4 className="placeholder-title">Ready to scan?</h4>
            <p className="placeholder-desc">
              Turn on your camera and place one waste item in view to capture a still frame for analysis.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={onStartCamera}
              icon={<Camera size={18} strokeWidth={2.5} />}
              className="start-camera-btn"
            >
              Turn Camera On
            </Button>
            <span className="permission-note">
              * Camera permission required. Audio/microphone is never requested.
            </span>
          </div>
        )}
      </div>

      {/* Camera Action Controls (Visible when camera is active) */}
      {isActive && (
        <div className="viewfinder-controls-bar">
          <Button
            variant="primary"
            size="md"
            onClick={onCaptureFrame}
            icon={<Camera size={18} strokeWidth={2.5} />}
            className="btn-capture-frame"
          >
            Capture Frame
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onStopCamera}
            icon={<CameraOff size={18} strokeWidth={2.5} />}
          >
            Turn Camera Off
          </Button>
        </div>
      )}
    </div>
  );
};
