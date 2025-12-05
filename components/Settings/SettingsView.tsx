import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Palette, Globe, Layers, Save, ToggleLeft, ToggleRight, Check, LogOut } from 'lucide-react';

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
    <div className="h-full flex flex-col animate-fade-in gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Manage your preferences and workspace configuration.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all font-bold font-header shadow-lg shadow-zinc-900/10 dark:shadow-white/10">
            <Save size={18} />
            Save Changes
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-2">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-header font-bold text-sm transition-all border ${
                        activeTab === tab.id
                        ? 'bg-white dark:bg-zinc-800 text-primary-600 border-zinc-200 dark:border-zinc-700 shadow-sm'
                        : 'bg-transparent text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                >
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content Area - Floating Card */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-y-auto custom-scrollbar p-10">
            
            {activeTab === 'general' && (
                <div className="space-y-10 max-w-2xl animate-fade-in">
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">Profile Information</h2>
                        
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer">
                                <User size={32} />
                            </div>
                            <div className="space-y-2">
                                <button className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-bold font-header">Upload New Picture</button>
                                <p className="text-xs text-zinc-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">First Name</label>
                                <input type="text" defaultValue="Alex" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Last Name</label>
                                <input type="text" defaultValue="Designer" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white" />
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Email Address</label>
                            <div className="flex gap-2">
                                <input type="email" defaultValue="alex@agency.com" className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white" />
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-wider"><Check size={12}/> Verified</span>
                            </div>
                        </div>

                        {onLogout && (
                            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold font-header text-sm transition-colors">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'appearance' && (
                <div className="space-y-10 max-w-2xl animate-fade-in">
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">Interface Theme</h2>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
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
                </div>
            )}

            {activeTab === 'workspace' && (
                <div className="space-y-10 max-w-2xl animate-fade-in">
                    <section className="space-y-6">
                         <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">Devspace Details</h2>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Workspace Name</label>
                            <input type="text" defaultValue="Acme Creative Team" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white" />
                        </div>
                    </section>
                </div>
            )}
            
            {activeTab === 'integrations' && (
                <div className="space-y-10 max-w-2xl animate-fade-in">
                    <section className="space-y-6">
                        <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white pb-2 border-b border-zinc-100 dark:border-zinc-800">Connected Apps</h2>
                        
                         <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#ff5c35] rounded-xl flex items-center justify-center text-white font-bold font-display shadow-sm">
                                    NB
                                </div>
                                <div>
                                    <p className="font-bold font-header text-zinc-900 dark:text-white">NanoBanana Styling Engine</p>
                                    <p className="text-xs text-zinc-500 font-medium">Automatic branding and asset generation.</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold uppercase tracking-wider shadow-sm text-zinc-500">Configure</button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#00a1e0] rounded-xl flex items-center justify-center text-white font-bold font-display shadow-sm">
                                    SF
                                </div>
                                <div>
                                    <p className="font-bold font-header text-zinc-900 dark:text-white">Salesforce CRM</p>
                                    <p className="text-xs text-zinc-500 font-medium">Sync deck engagement with leads.</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 rounded-lg border border-primary-200 bg-primary-50 text-xs font-bold uppercase tracking-wider shadow-sm text-primary-700">Connect</button>
                        </div>
                    </section>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;