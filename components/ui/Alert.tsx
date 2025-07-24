import React from 'react';
import { XCircleIcon, CheckCircleIcon, InformationCircleIcon } from './icons/Icons';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
  className?: string;
}

const icons = {
  success: <CheckCircleIcon className="h-5 w-5" />,
  error: <XCircleIcon className="h-5 w-5" />,
  info: <InformationCircleIcon className="h-5 w-5" />,
};

const colors = {
  success: 'bg-emerald-100 border-emerald-400 text-emerald-800',
  error: 'bg-red-100 border-red-400 text-red-800',
  info: 'bg-sky-100 border-sky-400 text-sky-800',
};

export const Alert: React.FC<AlertProps> = ({ message, type, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`p-4 border rounded-md flex items-start gap-3 transition-all ${colors[type]} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-offset-2" aria-label="Dismiss">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
