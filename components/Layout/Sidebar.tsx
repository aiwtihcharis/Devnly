
import React from 'react';
import { LayoutDashboard, FolderKanban, LayoutTemplate, BarChart2, Settings, Users, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[280px] h-full glass-gradient rounded-[2rem] flex flex-col overflow-hidden flex-shrink-0 relative z-20"
    >
      {/* Brand */}
      <div className="p-8 flex items-center gap-4">
        <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-200 flex items-center justify-center text-white dark:text-zinc-900 font-medium font-display tracking-[-0.04em] border border-white/10 shadow-xl cursor-pointer"
        >
          D
        </motion.div>
        <span className="font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white text-xl drop-shadow-sm">Devdecks</span>
      </div>

      {/* Navigation */}
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 px-4 py-2 space-y-1"
      >
        <div className="px-5 pb-3">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-header opacity-70">Menu</span>
        </div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              variants={itemVariants}
              onClick={() => setView(item.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all relative overflow-hidden group ${
                isActive 
                  ? 'bg-gradient-to-r from-zinc-900/95 to-zinc-900/80 dark:from-white/95 dark:to-white/80 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/5 border border-white/10 dark:border-white/20' 
                  : 'hover:bg-white/40 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={18} className={`relative z-10 ${isActive ? 'text-primary-400 dark:text-primary-600' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'}`} />
              <span className={`font-header text-sm relative z-10 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </motion.button>
          );
        })}
      </motion.nav>

      {/* Devspace / Team Section */}
      <div className="px-6 py-4">
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-2xl p-4 cursor-pointer border border-white/40 dark:border-white/5 bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md"
        >
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/90 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20 backdrop-blur-sm">
                    AC
                 </div>
                 <div className="flex-1 min-w-0">
                     <p className="text-xs font-bold font-header text-zinc-900 dark:text-white truncate">Acme Creative</p>
                     <p className="text-[10px] text-zinc-500">Pro Plan</p>
                 </div>
            </div>
        </motion.div>
      </div>

      {/* Profile & Settings */}
      <div className="p-6 mt-auto">
        <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('settings')}
            className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-all text-xs font-bold font-header shadow-sm border border-white/40 dark:border-white/10 bg-white/40 dark:bg-zinc-800/40 hover:bg-white/60 dark:hover:bg-zinc-700/60 text-zinc-600 dark:text-zinc-300 backdrop-blur-md`}
        >
            <Settings size={14} /> Settings
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
