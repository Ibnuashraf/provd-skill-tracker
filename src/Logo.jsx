import React from 'react';

export default function Logo({ size = 'large', showText = true }) {
  const isLarge = size === 'large';
  const sqSize = isLarge ? 36 : 24;
  
  return (
    <div className={`p-logo-wrap ${isLarge ? 'pl-large' : 'pl-small'}`}>
      <svg width={sqSize} height={sqSize} viewBox="0 0 36 36" fill="none" className="p-logo-svg">
        <defs>
          <linearGradient id="logoGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8E830" />
            <stop offset="100%" stopColor="#96C020" />
          </linearGradient>
          <linearGradient id="logoGradSec" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2898D8" />
            <stop offset="100%" stopColor="#8878E8" />
          </linearGradient>
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Layered Hexagon/Cube look */}
        <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="rgba(255,255,255,0.03)" stroke="url(#logoGradSec)" strokeWidth="1.5" className="p-logo-hex" />
        <path d="M18 8L26 13V23L18 28L10 23V13L18 8Z" fill="url(#logoGradMain)" filter="url(#logoGlow)" className="p-logo-core" />
        <path d="M18 18L26 13M18 18L10 13M18 18V28" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && <div className="p-logo-text" style={{background: 'linear-gradient(90deg, #B8E830, #2898D8)', WebkitBackgroundClip: 'text', color: 'transparent'}}>Provd</div>}
    </div>
  );
}
