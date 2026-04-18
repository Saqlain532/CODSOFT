import React from 'react';

export const ZenithNavIcon = ({ className = "w-auto h-8" }) => (
  <svg 
    viewBox="0 0 190 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      {/* Gradient adjusted to flow horizontally across the text */}
      <linearGradient id="navZGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--color-Primary, #22D3EE)" />
        <stop offset="100%" stopColor="var(--color-accent, #8B5CF6)" />
      </linearGradient>
    </defs>
    
    {/* === THE MOTION CART ICON === */}
    <g transform="translate(0, 4)">
      {/* Speed lines for "moving forward" effect */}
      <path 
        d="M 0 14 H 6 M -2 20 H 4" 
        stroke="var(--color-secondary-text, #94A3B8)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.5"
      />
      
      {/* The 'Z' Cart Chassis */}
      <path 
        d="M 4 8 L 8 10 H 22 L 12 24 H 26" 
        stroke="url(#navZGrad)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Cart Wheels */}
      <circle cx="14" cy="30" r="2.5" fill="var(--color-Primary, #22D3EE)" />
      <circle cx="24" cy="30" r="2.5" fill="var(--color-accent, #8B5CF6)" />
      
      {/* The Apex Star */}
      <path 
        d="M 24 0 Q 24 4 28 4 Q 24 4 24 8 Q 24 4 20 4 Q 24 4 24 0 Z" 
        fill="#FBBF24" 
      />
    </g>

    {/* === THE STYLIZED ITALIC TEXT === */}
    {/* 'Zenith' using your display font and gradient */}
    <text 
      x="40" 
      y="28" 
      fontFamily="var(--font-display, Outfit, sans-serif)" 
      fontSize="24" 
      fontWeight="800" 
      fontStyle="italic" 
      fill="url(#navZGrad)"
      letterSpacing="0.5"
    >
      Zenith
    </text>

    {/* 'Mart' using your standard font and off-white color */}
    <text 
      x="120" 
      y="28" 
      fontFamily="var(--font-sans, Inter, sans-serif)" 
      fontSize="24" 
      fontWeight="500" 
      fontStyle="italic" 
      fill="var(--color-primary-text, #F8FAFC)"
    >
      Mart
    </text>
  </svg>
);