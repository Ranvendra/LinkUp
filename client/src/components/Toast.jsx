import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-gradient-to-r from-green-400 to-emerald-500',
    error: 'bg-gradient-to-r from-red-400 to-rose-500',
    warning: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    info: 'bg-gradient-to-r from-blue-400 to-cyan-500',
  };

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className={`fixed top-6 right-6 ${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in-right z-50 max-w-md`}>
      <div className="shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p className="font-semibold text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
