import React, { useEffect } from 'react';

function Toast({ id, message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl 
      text-white min-w-[300px] backdrop-blur-md bg-opacity-90
      animate-slideIn mb-3 transition-all transform hover:scale-102 cursor-pointer
      ${styles[type] || styles.info}
    `}
    onClick={() => onClose(id)}
    role="alert"
    >
      <div className="bg-white bg-opacity-20 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
        {icons[type]}
      </div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
        className="text-white opacity-70 hover:opacity-100 font-bold"
      >
        ×
      </button>
    </div>
  );
}

export default React.memo(Toast);