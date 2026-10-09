import React from 'react';
import './SectionHeading.css';

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowVariant?: 'sun' | 'pink' | 'violet' | 'lime' | 'sky' | 'ink';
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  theme?: 'light' | 'dark';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowVariant = 'sun',
  title,
  description,
  align = 'left',
  className = '',
  theme = 'light',
}) => {
  return (
    <div className={`section-heading align-${align} theme-${theme} ${className}`.trim()}>
      {eyebrow && (
        <div className="section-eyebrow-wrapper">
          <span className={`eyebrow-pill eyebrow-${eyebrowVariant}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
};
