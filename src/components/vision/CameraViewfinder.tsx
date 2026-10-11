import React, { useEffect, useState, useRef } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw, SwitchCamera, Sparkles, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { YoloDetectionService } from '../../features/detection/detection.service';
import type { CameraError, CameraFacingMode } from '../../hooks/useCamera';
import type { DetectedWasteObject } from '../../types';
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
  onCaptureFrame: (initialDetections?: DetectedWasteObject[]) => void;
  onLiveDetectionsChange?: (detections: DetectedWasteObject[]) => void;
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
  onLiveDetectionsChange,
}) => {
  // Real-time live YOLO tracking detections
  const [liveDetections, setLiveDetections] = useState<DetectedWasteObject[]>([]);
  const isInferringRef = useRef<boolean>(false);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Attach stream whenever video element becomes active
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

  // Real-Time YOLO Tracking Loop (Runs continuously while camera is on)
  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (!hiddenCanvasRef.current) {
      hiddenCanvasRef.current = document.createElement('canvas');
    }

    const canvas = hiddenCanvasRef.current;
    let isMounted = true;

    // Run inference roughly every 280ms (~3.5 frames per second on CPU)
    const intervalId = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || isInferringRef.current || !isActive) {
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      canvas.width = Math.min(640, vw);
      canvas.height = Math.min(480, vh);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      isInferringRef.current = true;

      try {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.70);
        });

        if (blob && isMounted && isActive) {
          const res = await YoloDetectionService.detectObjects(blob, 0.18);
          if (res.success && isMounted) {
            setLiveDetections(res.detections);
            onLiveDetectionsChange?.(res.detections);
          }
        }
      } catch {
        // Silently skip transient network frame dropped
      } finally {
        isInferringRef.current = false;
      }
    }, 280);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      isInferringRef.current = false;
      setLiveDetections([]);
    };
  }, [isActive, videoRef, onLiveDetectionsChange]);

  const handleCapture = () => {
    onCaptureFrame(liveDetections);
  };

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
              <span className="live-pulse-dot" style={{ display: 'inline-block', marginRight: '4px' }} />
              LIVE YOLO TRACKING
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

            {/* Static Framing Brackets */}
            <div className="framing-bracket bracket-tl" aria-hidden="true" />
            <div className="framing-bracket bracket-tr" aria-hidden="true" />
            <div className="framing-bracket bracket-bl" aria-hidden="true" />
            <div className="framing-bracket bracket-br" aria-hidden="true" />

            {/* Viewfinder Center Crosshair Hint */}
            <div className="viewfinder-center-marker" aria-hidden="true" />

            {/* REAL-TIME LIVE YOLO TRACKING HITBOXES (Prompt 3 & Issue 1) */}
            {liveDetections.map((det) => {
              // Adjust for mirrored front camera feed
              const leftPct =
                facingMode === 'user'
                  ? (1 - det.box.x - det.box.width) * 100
                  : det.box.x * 100;

              return (
                <div
                  key={det.id}
                  className={`live-hitbox cat-${det.waste_category}`}
                  style={{
                    left: `${leftPct}%`,
                    top: `${det.box.y * 100}%`,
                    width: `${det.box.width * 100}%`,
                    height: `${det.box.height * 100}%`,
                  }}
                >
                  <div className="hitbox-corner tl" />
                  <div className="hitbox-corner tr" />
                  <div className="hitbox-corner bl" />
                  <div className="hitbox-corner br" />
                  <div className="hitbox-badge">
                    <span className="live-pulse-dot" />
                    <span className="hitbox-label-text">
                      {det.display_name} · {Math.round(det.confidence * 100)}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Bottom Status Watermark */}
            <div className="viewport-hint-overlay">
              {liveDetections.length > 0 ? (
                <span>
                  🟢 Tracking {liveDetections.length}{' '}
                  {liveDetections.length === 1 ? 'object' : 'objects'} in real time
                </span>
              ) : (
                <span>Point camera at any waste item to track</span>
              )}
            </div>
          </div>
        )}

        {/* State 2: Requesting Access */}
        {!isActive && isRequesting && (
          <div className="camera-state-placeholder">
            <div className="placeholder-icon-box">
              <RefreshCw size={28} strokeWidth={2.5} className="spin-icon" />
            </div>
            <h4 className="placeholder-title">Requesting Camera Access</h4>
            <p className="placeholder-desc">
              Please grant camera permission in your browser prompt to view the live video feed and real-time tracking.
            </p>
          </div>
        )}

        {/* State 3: Camera Error */}
        {!isActive && !isRequesting && error && (
          <div className="camera-state-placeholder placeholder-error">
            <div className="error-icon-box">
              <AlertCircle size={28} strokeWidth={2.5} />
            </div>
            <h4 className="placeholder-title">Camera Unavailable</h4>
            <p className="placeholder-desc">{error.message}</p>
            <div>
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

        {/* State 4: Initial Inactive Placeholder */}
        {!isActive && !isRequesting && !error && (
          <div className="camera-state-placeholder">
            <div className="placeholder-icon-box">
              <Eye size={28} strokeWidth={2.5} />
            </div>
            <h4 className="placeholder-title">Real-Time Waste Vision</h4>
            <p className="placeholder-desc">
              Turn on your camera to see real-time YOLO tracking with live hitboxes and confidence scores before capturing.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCamera}
              icon={<Camera size={18} strokeWidth={2.5} />}
            >
              Turn Camera On
            </Button>
          </div>
        )}
      </div>

      {/* Live Detection Banner Below Viewfinder */}
      {isActive && liveDetections.length > 0 && (
        <div className="live-detection-banner">
          <div className="banner-left">
            <Sparkles size={16} strokeWidth={2.5} />
            <span>LIVE TRACKING:</span>
            {liveDetections.map((d) => (
              <span key={d.id} className="banner-item-chip">
                {d.display_name} ({Math.round(d.confidence * 100)}%)
              </span>
            ))}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#1E6B34' }}>
            Click "Capture Frame" to freeze &amp; inspect
          </span>
        </div>
      )}

      {/* Camera Controls Bar */}
      {isActive && (
        <div className="viewfinder-controls">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCapture}
            icon={<Camera size={18} strokeWidth={2.5} />}
            className="btn-capture-frame"
          >
            Capture Frame
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onStopCamera}
            icon={<CameraOff size={16} strokeWidth={2.5} />}
          >
            Turn Camera Off
          </Button>
        </div>
      )}
    </div>
  );
};
