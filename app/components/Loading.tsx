// components/Loading.tsx
// Componente per mostrare stato di caricamento con spinner animato

'use client';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Caricamento...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
        
        {/* Spinning ring */}
        <div
          className={`
            ${sizeClasses[size]} 
            absolute top-0 left-0
            rounded-full 
            border-4 border-transparent 
            border-t-primary-600 
            animate-spin
          `}
        ></div>
      </div>
      
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
