
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };
  
  const sizeClass = sizeMap[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500 rounded-lg blur-sm opacity-50 animate-pulse"></div>
        <div className={`${sizeClass} aspect-square bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg relative z-10 flex items-center justify-center`}>
          <svg
            width="60%"
            height="60%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M21 14L18 11M18 11L21 8M18 11H19C15.134 11 12 7.866 12 4V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10L6 13M6 13L3 16M6 13H5C8.866 13 12 16.134 12 20V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      {variant === 'default' && (
        <span className="ml-2 font-semibold text-foreground">
          Planatrix
        </span>
      )}
    </div>
  );
};
