import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // light = white text (for dark bg), dark = black text (for light bg)
}

export function Logo({ className = "", variant = 'light' }: LogoProps) {
  const textColor = variant === 'dark' ? 'fill-black' : 'fill-white';
  const boltColor = variant === 'dark' ? 'fill-black' : 'fill-[var(--primary)]'; // Use primary neon green for dark mode logo

  return (
    <svg 
      viewBox="0 0 160 50" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Text "Blit" - Using system font but bold/heavy */}
      <text 
        x="0" 
        y="40" 
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" 
        fontWeight="800" 
        fontSize="48" 
        className={textColor}
        letterSpacing="-2"
      >
        Blit
      </text>
      
      {/* Lightning Bolt "Z" representation */}
      {/* A sharp, angular bolt shape that resembles a Z */}
      <path 
        d="M105 5 L145 5 L120 28 L155 28 L95 55 L115 28 L80 28 Z" 
        className={boltColor}
        stroke="none"
      />
    </svg>
  );
}