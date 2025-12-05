import React from 'react';
import { TrendingUp, FileText, Eye, Bell } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <div className="h-20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-zinc-700/50 flex items-center px-8 justify-between shadow-sm flex-shrink-0 transition-colors duration-300 z-20">
      <div className="flex items-center gap-8 md:gap-12">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl text-zinc-400 dark:text-zinc-500 flex items-center justify-center group-hover:text-primary-600 dark:group-hover:text-primary-500 group-hover:border-primary-100 dark:group-hover:border-primary-900 transition-colors shadow-sm">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5 font-header">Decks Created</p>
            <p className="text-lg font-bold font-display text-zinc-900 dark:text-white leading-none">124</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl text-zinc-400 dark:text-zinc-500 flex items-center justify-center group-hover:text-primary-600 dark:group-hover:text-primary-500 group-hover:border-primary-100 dark:group-hover:border-primary-900 transition-colors shadow-sm">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5 font-header">Conversion</p>
            <p className="text-lg font-bold font-display text-zinc-900 dark:text-white leading-none">18.4%</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
        </button>
        <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700/50"></div>
        <div className="flex items-center gap-2 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div>
          OPERATIONAL
        </div>
      </div>
    </div>
  );
};

export default TopBar;