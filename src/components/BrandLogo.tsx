import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
  }[size];

  const textStyles = {
    sm: 'text-xs tracking-wider',
    md: 'text-sm sm:text-base tracking-wider',
    lg: 'text-xl tracking-widest',
    xl: 'text-2xl sm:text-3xl tracking-widest',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle white halo backdrop */}
          <circle cx="50" cy="50" r="48" fill="#FFFFFF" fillOpacity="0.85" />
          
          {/* Left circle (warm coral/peach) */}
          <circle
            cx="40"
            cy="50"
            r="23"
            fill="#F27A54"
            fillOpacity="0.88"
          />

          {/* Right circle (calm indigo/periwinkle) */}
          <circle
            cx="60"
            cy="50"
            r="23"
            fill="#6366F1"
            fillOpacity="0.88"
          />

          {/* Empathy intersection face curve */}
          <circle cx="50" cy="44" r="2.4" fill="#FFFFFF" />
          <path
            d="M 40 52 C 45 61, 55 61, 60 52 C 57 54, 43 54, 40 52 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold uppercase font-sans text-[#18181B] ${textStyles}`}>
          The Other Side
        </span>
      )}
    </div>
  );
};
