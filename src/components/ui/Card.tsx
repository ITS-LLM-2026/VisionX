import React from 'react';
import './Card.css';

export interface CardProps {
  variant?: 'paper' | 'sun' | 'peach' | 'sky' | 'ink' | 'folder';
  tabColor?: 'sun' | 'pink' | 'violet' | 'lime';
  tabLabel?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'paper',
  tabColor = 'sun',
  tabLabel,
  shadow = 'md',
  hoverEffect = false,
  className = '',
  children,
}) => {
  const isFolder = variant === 'folder' || Boolean(tabLabel);
  const cardClasses = [
    'neo-card',
    `neo-card-${variant}`,
    `neo-shadow-${shadow}`,
    hoverEffect ? 'neo-card-hover' : '',
    isFolder ? 'neo-card-folder' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {isFolder && tabLabel && (
        <div className={`folder-tab folder-tab-${tabColor}`}>
          <span>{tabLabel}</span>
        </div>
      )}
      <div className="neo-card-content">{children}</div>
    </div>
  );
};
