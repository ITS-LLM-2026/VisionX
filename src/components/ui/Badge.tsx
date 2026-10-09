import React from 'react';
import './Badge.css';

export interface BadgeProps {
  variant?: 'sun' | 'pink' | 'violet' | 'lime' | 'sky' | 'ink' | 'uncertain' | 'live';
  size?: 'sm' | 'md';
  rotate?: '-1' | '1' | '0' | '-2' | '2';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'sun',
  size = 'md',
  rotate = '0',
  icon,
  children,
  className = '',
}) => {
  const rotClass = rotate !== '0' ? `rotate-${rotate}` : '';
  return (
    <span className={`badge badge-${variant} badge-${size} ${rotClass} ${className}`.trim()}>
      {variant === 'live' && <span className="live-dot" aria-hidden="true" />}
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
