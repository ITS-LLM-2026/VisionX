import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import './ImageUploadPanel.css';

interface ImageUploadPanelProps {
  onImageSelected: (blob: Blob, url: string) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  onImageSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, PNG, or WEBP photo.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('File size exceeds 10 MB limit. Please select a smaller photo.');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      onImageSelected(file, url);
    } catch {
      setErrorMessage('Failed to decode the selected image. Please try another file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-card">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden-file-input"
        aria-label="Upload waste item photo"
        disabled={disabled}
      />

      <div
        className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'dropzone-disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-box">
          <UploadCloud size={36} strokeWidth={2.5} />
        </div>

        <h4 className="upload-heading">Drop a waste photo here</h4>
        <p className="upload-subtext">
          Drag and drop an image from your computer, or click below to choose a file.
        </p>

        <Button
          variant="primary"
          size="md"
          onClick={handleButtonClick}
          disabled={disabled}
          icon={<ImageIcon size={18} strokeWidth={2.5} />}
        >
          Choose Image
        </Button>

        <div className="upload-formats-strip">
          <span>Supported: JPG · PNG · WEBP (Max 10 MB)</span>
        </div>

        {errorMessage && (
          <div className="upload-error-callout" role="alert">
            <AlertCircle size={16} strokeWidth={2.5} />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
