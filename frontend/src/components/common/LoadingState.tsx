import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
  type?: 'card' | 'table' | 'chart' | 'generic';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading live data...',
  rows = 3,
  type = 'generic',
}) => {
  if (type === 'card') {
    return (
      <div className="animate-pulse bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 bg-slate-800 rounded w-2/3"></div>
        <div className="h-3 bg-slate-800 rounded w-1/2"></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-slate-800/80 rounded w-full"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/40 rounded w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-64 w-full bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-end gap-2 animate-pulse">
        <div className="flex items-end gap-4 h-40">
          <div className="w-1/6 bg-slate-800 rounded h-1/4"></div>
          <div className="w-1/6 bg-slate-800 rounded h-1/2"></div>
          <div className="w-1/6 bg-slate-800 rounded h-3/4"></div>
          <div className="w-1/6 bg-slate-800 rounded h-full"></div>
          <div className="w-1/6 bg-slate-800 rounded h-2/3"></div>
          <div className="w-1/6 bg-slate-800 rounded h-1/3"></div>
        </div>
        <div className="h-3 bg-slate-800 rounded w-1/4 self-center mt-4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
