import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-slate-200 border-t-brand-600 rounded-full animate-spin`}
      />
      {text && <p className="mt-3 text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-slate-200 rounded w-20"></div>
        <div className="h-5 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-6 bg-slate-200 rounded-full w-14"></div>
      </div>
    </div>
  );
};

