import React from 'react';

export const BottleVector: React.FC<{ size?: number; className?: string }> = ({ size = 160, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Plastic Bottle Vector"
  >
    {/* Bottle Body */}
    <rect x="58" y="18" width="44" height="18" rx="4" fill="#CFE4FB" stroke="#0B0B0B" strokeWidth="2.5" />
    <rect x="66" y="8" width="28" height="10" rx="3" fill="#FF4F81" stroke="#0B0B0B" strokeWidth="2.5" />
    {/* Shoulder */}
    <path
      d="M58 36L42 64V140C42 144.418 45.5817 148 50 148H110C114.418 148 118 144.418 118 140V64L102 36H58Z"
      fill="#CFE4FB"
      stroke="#0B0B0B"
      strokeWidth="2.5"
    />
    {/* Label */}
    <rect x="42" y="74" width="76" height="38" fill="#FFC61A" stroke="#0B0B0B" strokeWidth="2.5" />
    <line x1="52" y1="88" x2="84" y2="88" stroke="#0B0B0B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="98" x2="72" y2="98" stroke="#0B0B0B" strokeWidth="2" strokeLinecap="round" />
    <circle cx="98" cy="93" r="6" fill="#0B0B0B" />
    {/* Liquid line */}
    <path d="M46 126C58 123 70 128 82 125C94 122 106 127 114 125" stroke="#7B5CFA" strokeWidth="2" strokeLinecap="round" />
    {/* Grip ribs */}
    <line x1="48" y1="52" x2="112" y2="52" stroke="#0B0B0B" strokeWidth="1.5" strokeDasharray="3 3" />
  </svg>
);

export const BananaVector: React.FC<{ size?: number; className?: string }> = ({ size = 160, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Banana Peel Vector"
  >
    {/* Banana Main Curve */}
    <path
      d="M32 128C38 88 64 36 122 28C124 28 126 30 124 32C98 56 82 92 88 136C72 136 46 138 32 128Z"
      fill="#FFC61A"
      stroke="#0B0B0B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Peel Flap */}
    <path
      d="M88 136C96 112 118 84 136 78C138 78 139 81 137 83C122 102 112 124 104 140L88 136Z"
      fill="#FFE9A8"
      stroke="#0B0B0B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Stem tip */}
    <path d="M122 28L134 22L138 28L126 34" fill="#3CC24A" stroke="#0B0B0B" strokeWidth="2.5" />
    {/* Brown spots */}
    <circle cx="62" cy="78" r="3.5" fill="#0B0B0B" />
    <circle cx="78" cy="98" r="4" fill="#0B0B0B" />
    <circle cx="52" cy="106" r="2.5" fill="#0B0B0B" />
    {/* Non-recyclable PLU sticker */}
    <rect x="70" y="60" width="18" height="14" rx="3" fill="#FF4F81" stroke="#0B0B0B" strokeWidth="2" transform="rotate(-15 70 60)" />
    <line x1="74" y1="67" x2="84" y2="67" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const ContainerVector: React.FC<{ size?: number; className?: string }> = ({ size = 160, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Food Container Vector"
  >
    {/* Clamshell Top Lid */}
    <path
      d="M26 62L44 26H116L134 62H26Z"
      fill="#EFEDE8"
      stroke="#0B0B0B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Clamshell Base */}
    <path
      d="M24 68L36 124C37 128 41 132 46 132H114C119 132 123 128 124 124L136 68H24Z"
      fill="#EFEDE8"
      stroke="#0B0B0B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Rim rim */}
    <rect x="18" y="62" width="124" height="8" rx="2" fill="#FFC61A" stroke="#0B0B0B" strokeWidth="2.5" />
    {/* Hinge */}
    <rect x="70" y="24" width="20" height="6" rx="2" fill="#0B0B0B" />
    {/* Grease / Sauce warning stain */}
    <path
      d="M54 94C64 88 82 86 92 98C100 106 88 118 76 114C66 112 50 102 54 94Z"
      fill="#FF4F81"
      stroke="#0B0B0B"
      strokeWidth="2"
      strokeDasharray="2 2"
    />
    {/* Resin code stamp #5 */}
    <polygon points="76,40 84,40 80,48" fill="none" stroke="#0B0B0B" strokeWidth="1.5" />
    <text x="76" y="56" fontFamily="Space Mono" fontSize="9" fontWeight="bold" fill="#0B0B0B">PP 5</text>
  </svg>
);
