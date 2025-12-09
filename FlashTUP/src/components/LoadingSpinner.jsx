import React from 'react';

function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`${sizeClasses[size]} border-white border-t-transparent rounded-full animate-spin mb-3 opacity-90`}
      ></div>
      {message && (
        <p className="text-white text-opacity-90 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;