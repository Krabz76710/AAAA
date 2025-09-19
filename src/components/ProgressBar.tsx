import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showPercentage = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Profil complété
          </span>
          <span className={`text-sm font-bold ${
            progress === 100 ? 'text-emerald-600' : 'text-gray-600'
          }`}>
            {progress}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor(progress)} rounded-full relative`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          {progress === 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse" />
          )}
        </div>
      </div>
      
      {progress === 100 && (
        <div className="mt-2 text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            ✨ Profil complet !
          </span>
        </div>
      )}
    </div>
  );
};