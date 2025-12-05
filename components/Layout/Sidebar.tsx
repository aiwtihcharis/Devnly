import React from 'react';
import { LayoutDashboard, FolderKanban, Send, BarChart2, Settings, Users, Layers, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isDarkMode, toggleDarkMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'generator', label: 'Vora AI', icon: Zap },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <div className="w-[280px] h-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl flex flex-col rounded-[2rem] shadow-sm border border-white/20 dark:border-zinc-700/50 overflow-hidden flex-shrink-0 transition-all duration-300 relative z-20">
      {/* Brand */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-bold font-display border border-zinc-900 dark:border-white shadow-lg shadow-zinc-900/10 transition-all">
          D
        </div>
        <span className="font-display font-bold text-zinc-900 dark:text-white text-xl tracking-tight">Devdecks</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-2 space-y-1">
        <div className="px-3 pb-3">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-header">Menu</span>
        </div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group border ${
                isActive 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 border-zinc-900 dark:border-white font-semibold' 
                  : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} className={`${isActive ? 'text-primary-500 dark:text-primary-600' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
              <span className={`font-header text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Devspace / Team Section */}
      <div className="px-6 py-4">
        <div className="bg-white/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/30 rounded-2xl p-4 transition-colors hover:border-primary-200 dark:hover:border-primary-800 group backdrop-blur-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    AC
                 </div>
                 <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold font-header text-zinc-900 dark:text-white truncate">Acme Creative</p>
                     <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pro Plan</p>
                 </div>
            </div>
        </div>
      </div>

      {/* Profile & Settings */}
      <div className="p-6 mt-auto">
        <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-bold font-header shadow-sm bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300`}
        >
            <Settings size={14} /> Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;