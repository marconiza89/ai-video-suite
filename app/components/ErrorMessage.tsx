// components/ErrorMessage.tsx
// Componente per visualizzare messaggi di errore, warning o info

'use client';

import { FiAlertCircle, FiX } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorMessage({ 
  message, 
  onClose, 
  type = 'error' 
}: ErrorMessageProps) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
    },
  };

  const currentStyle = styles[type];

  return (
    <div className={`${currentStyle.bg} ${currentStyle.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <FiAlertCircle className={`${currentStyle.icon} flex-shrink-0 mt-0.5`} size={20} />
        
        <div className="flex-1">
          <p className={`${currentStyle.text} text-sm`}>
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`${currentStyle.text} hover:opacity-70 transition-opacity`}
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
