import { useState, useRef, useEffect, useCallback } from 'react';

export type CameraErrorType =
  | 'permission-denied'
  | 'no-camera'
  | 'camera-in-use'
  | 'not-supported'
  | 'unknown';

export interface CameraError {
  type: CameraErrorType;
  message: string;
}

export type CameraFacingMode = 'user' | 'environment';

export function useCamera() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop all camera tracks and release device
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore cleanup errors
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setIsActive(false);
    setIsRequesting(false);
  }, []);

  // Request camera access and attach stream to video element
  const startCamera = useCallback(async (preferredFacingMode?: CameraFacingMode) => {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError({
        type: 'not-supported',
        message: 'Camera access is not supported by your browser or requires a secure context (HTTPS/localhost).',
      });
      return;
    }

    const currentFacing = preferredFacingMode || facingMode;
    setIsRequesting(true);

    try {
      // Stop existing tracks if switching modes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      // First attempt with preferred facing mode
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: currentFacing === 'environment' ? { ideal: 'environment' } : { ideal: 'user' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false, // Strict: Never request microphone
        });
      } catch (modeErr) {
        // Fallback to any available video stream if specific facing mode fails
        console.warn('Facing mode constraint failed, falling back to default video:', modeErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);

      // If videoRef is already in DOM, attach immediately
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch {
          // auto-play policy catch
        }
      }

      setIsActive(true);
      setError(null);
    } catch (err: unknown) {
      stopCamera();
      const errName = (err as Error)?.name || '';

      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setError({
          type: 'permission-denied',
          message: 'Camera permission was denied. Please allow camera access in your browser settings and try again.',
        });
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setError({
          type: 'no-camera',
          message: 'No camera hardware found on this device. You can still test the workflow using the Upload Photo option.',
        });
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        setError({
          type: 'camera-in-use',
          message: 'The camera is currently in use by another application or tab. Please close it and retry.',
        });
      } else {
        setError({
          type: 'unknown',
          message: 'Unable to start camera. Please verify device permissions or use the photo upload option.',
        });
      }
    } finally {
      setIsRequesting(false);
    }
  }, [facingMode, stopCamera]);

  // Toggle between front (user) and rear (environment) camera
  const toggleFacingMode = useCallback(async () => {
    const nextMode: CameraFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isActive) {
      await startCamera(nextMode);
    }
  }, [facingMode, isActive, startCamera]);

  // Attach stream whenever video element becomes available or isActive changes
  useEffect(() => {
    if (isActive && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
        video.play().catch(() => {});
      }
    }
  }, [isActive, stream]);

  // Capture frame from active video element to a Blob & Object URL
  const captureFrame = useCallback(async (): Promise<{ blob: Blob; url: string } | null> => {
    const video = videoRef.current;
    if (!video || !isActive) {
      return null;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw normal un-mirrored frame for analysis
      ctx.drawImage(video, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
      });

      if (!blob) return null;

      const url = URL.createObjectURL(blob);
      return { blob, url };
    } catch {
      return null;
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isActive,
    isRequesting,
    error,
    facingMode,
    stream,
    startCamera,
    stopCamera,
    toggleFacingMode,
    captureFrame,
  };
}
