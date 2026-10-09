import React from 'react';
import './IconButton.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'paper' | 'sun' | 'pink' | 'violet' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  variant = 'paper',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`icon-btn icon-btn-${variant} icon-btn-${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
