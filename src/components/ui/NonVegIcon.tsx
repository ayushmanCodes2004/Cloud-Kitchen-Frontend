import React from 'react';

interface NonVegIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NonVegIcon: React.FC<NonVegIconProps> = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Red square border */}
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          stroke="#dc2626"
          strokeWidth="2"
          fill="none"
        />
        {/* Red filled circle */}
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="#dc2626"
        />
      </svg>
    </div>
  );
};

export const VegIcon: React.FC<NonVegIconProps> = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Green square border */}
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          stroke="#16a34a"
          strokeWidth="2"
          fill="none"
        />
        {/* Green filled circle */}
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="#16a34a"
        />
      </svg>
    </div>
  );
};
