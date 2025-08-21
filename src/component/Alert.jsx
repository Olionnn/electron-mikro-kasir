// src/components/ui/Alert.jsx
import React, { useEffect, useState } from "react";

const COLORS = {
  success: {
    ring: "ring-green-200 border-green-200",
    bg: "bg-gradient-to-r from-green-50 to-green-100",
    text: "text-green-800",
    iconBg: "bg-green-500",
    icon: (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8Z"/>
      </svg>
    ),
  },
  error: {
    ring: "ring-red-200 border-red-200",
    bg: "bg-gradient-to-r from-red-50 to-red-100",
    text: "text-red-800",
    iconBg: "bg-red-500",
    icon: (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V7h2Z"/>
      </svg>
    ),
  },
  info: {
    ring: "ring-blue-200 border-blue-200",
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    text: "text-blue-800",
    iconBg: "bg-blue-500",
    icon: (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z"/>
      </svg>
    ),
  },
  warning: {
    ring: "ring-yellow-200 border-yellow-200",
    bg: "bg-gradient-to-r from-yellow-50 to-yellow-100",
    text: "text-yellow-800",
    iconBg: "bg-yellow-500",
    icon: (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V7h2Z"/>
      </svg>
    ),
  },
};

export default function Alert({ 
  type = "info", 
  children, 
  onClose, 
  autoClose = true, 
  duration = 5000,
  className = "" 
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const c = COLORS[type] || COLORS.info;

  useEffect(() => {
    // Animation entrance
    setTimeout(() => setIsAnimating(true), 100);

    // Auto close
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${className}`}>
      <div className={`
        w-80 max-w-sm rounded-lg shadow-lg border backdrop-blur-sm
        ${c.bg} ${c.text} ${c.ring}
        hover:shadow-xl transition-shadow duration-200
      `}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon with colored background */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${c.iconBg} flex items-center justify-center shadow-sm`}>
              {c.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-0.5">
              <div className="text-sm font-medium leading-5">
                {children}
              </div>
            </div>
            
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex-shrink-0 rounded-full p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 transition-colors duration-150"
              aria-label="Tutup pemberitahuan"
            >
              <svg className="h-4 w-4 opacity-60 hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress bar for auto close */}
          {/* {autoClose && (
            <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current opacity-30 rounded-full transition-all ease-linear"
                style={{ 
                  width: '100%',
                  animation: `shrink ${duration}ms linear forwards`
                }}
              />
            </div>
          )} */}
        </div>
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}