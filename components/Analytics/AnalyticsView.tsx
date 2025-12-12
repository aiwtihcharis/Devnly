
import React from 'react';
import { BarChart2 } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  return (
    <div className="h-full flex flex-col animate-fade-in p-2">
        <div className="mb-8 px-4 pt-2">
            <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white tracking-tight">Analytics</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Real-time engagement metrics.</p>
        </div>

        <div className="flex-1 glass-gradient rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border border-white/20 dark:border-zinc-800">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-6 border border-zinc-200 dark:border-zinc-700 animate-pulse-slow">
                <BarChart2 size={40} />
            </div>
            <h2 className="text-2xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white mb-2">Nothing to Analyze Yet</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-header max-w-sm">
                Publish and share your first deck to start gathering engagement insights and conversion data.
            </p>
        </div>
    </div>
  );
};

export default AnalyticsView;
