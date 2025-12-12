
import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe, Layers, Save, ToggleLeft, ToggleRight, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogout?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleDarkMode, onLogout }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'My Account', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Layers },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 px-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Manage your preferences and workspace configuration.</p>
        </motion.div>
        <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-bold font-header shadow-lg shadow-zinc-900/10 dark:shadow-white/10 active:scale-95 duration-200">
            <Save size={18} />
            Save Changes
        </motion.button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-header font-bold text-sm transition-all border relative overflow-hidden ${
                        activeTab === tab.id
                        ? 'text-primary-600 border-white/40 dark:border-white/10 shadow-sm backdrop-blur-sm'
                        : 'bg-transparent text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/30 dark:hover:bg-zinc-800/30'
                    }`}
                >
                    {activeTab === tab.id && (
                        <motion.div 
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white/60 dark:bg-zinc-800/60 z-0"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <tab.icon size={18} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area - Floating Card */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 glass-gradient rounded-[2rem] shadow-sm overflow-y-auto custom-scrollbar p-10"
        >
            <AnimatePresence mode="wait">
            {activeTab === 'general' && (
                <motion.div 
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 max-w-2xl"
                >
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">Profile Information</h2>
                        
                        <div className="flex items-center gap-6">
                            <motion.div whileHover={{ scale: 1.05 }} className="w-24 h-24 rounded-2xl bg-white/40 dark:bg-zinc-800/40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer backdrop-blur-sm">
                                <User size={32} />
                            </motion.div>
                            <div className="space-y-2">
                                <button className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-bold font-header hover:scale-105 transition-transform">Upload New Picture</button>
                                <p className="text-xs text-zinc-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">First Name</label>
                                <input type="text" defaultValue="Alex" className="w-full bg-white/50 dark:bg-zinc-800/50 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white backdrop-blur-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Last Name</label>
                                <input type="text" defaultValue="Designer" className="w-full bg-white/50 dark:bg-zinc-800/50 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white backdrop-blur-sm" />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Email Address</label>
                            <div className="flex gap-2">
                                <input type="email" defaultValue="alex@agency.com" className="flex-1 bg-white/50 dark:bg-zinc-800/50 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white backdrop-blur-sm" />
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50/80 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"><Check size={12}/> Verified</span>
                            </div>
                        </div>

                        {onLogout && (
                            <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold font-header text-sm transition-colors hover:translate-x-1 duration-200">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </section>
                </motion.div>
            )}

            {activeTab === 'appearance' && (
                <motion.div 
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 max-w-2xl"
                >
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">Interface Theme</h2>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/80 dark:bg-zinc-800/80 rounded-lg shadow-sm border border-white/20 dark:border-white/5">
                                    <Palette size={20} className="text-zinc-900 dark:text-white" />
                                </div>
                                <div>
                                    <p className="font-bold font-header text-zinc-900 dark:text-white">Dark Mode</p>
                                    <p className="text-xs text-zinc-500 font-medium">Toggle the application visual theme.</p>
                                </div>
                            </div>
                            <button onClick={toggleDarkMode} className="text-primary-600 hover:text-primary-700 transition-colors">
                                {isDarkMode ? <ToggleRight size={40} className="fill-primary-600/20" /> : <ToggleLeft size={40} className="text-zinc-300" />}
                            </button>
                        </div>
                    </section>
                </motion.div>
            )}
            
            {activeTab === 'workspace' && (
                <motion.div 
                    key="workspace"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 max-w-2xl"
                >
                     <section className="space-y-6">
                         <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">Devspace Details</h2>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Workspace Name</label>
                            <input type="text" defaultValue="Acme Creative Team" className="w-full bg-white/50 dark:bg-zinc-800/50 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white backdrop-blur-sm" />
                        </div>
                    </section>
                </motion.div>
            )}
            
            {activeTab === 'integrations' && (
                 <motion.div 
                    key="integrations"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 max-w-2xl"
                >
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">Connected Apps</h2>
                        
                         <div className="flex items-center justify-between p-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm hover:bg-white/60 transition-colors duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#ff5c35] to-[#ff8e71] rounded-xl flex items-center justify-center text-white font-bold font-display tracking-[-0.04em] shadow-lg shadow-orange-500/20">
                                    NB
                                </div>
                                <div>
                                    <p className="font-bold font-header text-zinc-900 dark:text-white">NanoBanana Styling Engine</p>
                                    <p className="text-xs text-zinc-500 font-medium">Automatic branding and asset generation.</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white/80 text-xs font-bold uppercase tracking-wider shadow-sm text-zinc-500 hover:scale-105 transition-transform">Configure</button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm hover:bg-white/60 transition-colors duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#00a1e0] to-[#4dc3ff] rounded-xl flex items-center justify-center text-white font-bold font-display tracking-[-0.04em] shadow-lg shadow-sky-500/20">
                                    SF
                                </div>
                                <div>
                                    <p className="font-bold font-header text-zinc-900 dark:text-white">Salesforce CRM</p>
                                    <p className="text-xs text-zinc-500 font-medium">Sync deck engagement with leads.</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-primary-200 bg-primary-50/80 text-xs font-bold uppercase tracking-wider shadow-sm text-primary-700 hover:scale-105 transition-transform">Connect</button>
                        </div>
                    </section>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsView;
