import React from 'react';
import { useApp } from '../contexts/AppContext';

export const StatusIndicator: React.FC = () => {
  const { isLoading, error } = useApp();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-blue-600">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-sm">AI正在思考...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
      <span className="text-sm">系统正常</span>
    </div>
  );
};
