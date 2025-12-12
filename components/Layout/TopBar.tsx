
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, FileText, Bell, Check, Sparkles, Share2, Users, Link, Copy } from 'lucide-react';
import { MockFirebase } from '../../services/mockFirebase';
import { AppNotification } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  setView?: (view: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ setView }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [stats, setStats] = useState({ deckCount: 0, conversionRate: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Poll for notifications or fetch on mount/toggle
  const fetchData = async () => {
      const notifs = await MockFirebase.db.getNotifications();
      setNotifications(notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

      const projects = await MockFirebase.db.getProjects();
      const analytics = await MockFirebase.db.getAnalytics();
      
      const totalViews = analytics.filter(a => a.action === 'View').length || 1; 
      const totalConversions = analytics.filter(a => a.action === 'Conversion').length;
      const rawRate = analytics.length > 0 ? (totalConversions / totalViews) * 100 : 0;

      setStats({
          deckCount: projects.length,
          conversionRate: parseFloat(rawRate.toFixed(1))
      });
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = MockFirebase.subscribe(fetchData);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: string) => {
      await MockFirebase.db.markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
      await MockFirebase.db.markAllNotificationsAsRead();
  };

  return (
    <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-20 glass-gradient rounded-[2rem] flex items-center px-8 justify-between flex-shrink-0 z-20 relative"
    >
      <div className="flex items-center gap-8 md:gap-12">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 bg-white/40 dark:bg-zinc-800/40 border border-white/40 dark:border-white/10 rounded-xl text-zinc-400 dark:text-zinc-500 flex items-center justify-center group-hover:text-primary-600 dark:group-hover:text-primary-500 group-hover:border-primary-200/50 dark:group-hover:border-primary-900/50 group-hover:bg-primary-50/20 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5 font-header group-hover:text-primary-600/70 transition-colors">Decks Created</p>
            <p className="text-lg font-medium font-display tracking-[-0.04em] text-zinc-900 dark:text-white leading-none">{stats.deckCount}</p>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-4 group cursor-default">
          <div className="w-10 h-10 bg-white/40 dark:bg-zinc-800/40 border border-white/40 dark:border-white/10 rounded-xl text-zinc-400 dark:text-zinc-500 flex items-center justify-center group-hover:text-primary-600 dark:group-hover:text-primary-500 group-hover:border-primary-200/50 dark:group-hover:border-primary-900/50 group-hover:bg-primary-50/20 transition-all duration-300 shadow-sm backdrop-blur-sm">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-0.5 font-header group-hover:text-primary-600/70 transition-colors">Conversion</p>
            <p className="text-lg font-medium font-display tracking-[-0.04em] text-zinc-900 dark:text-white leading-none">{stats.conversionRate}%</p>
          </div>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Collaboration Area */}
        <div className="flex items-center -space-x-3 mr-2">
            {[1, 2, 3].map((i) => (
                <motion.div whileHover={{ y: -3, zIndex: 10 }} key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer`}>
                    {i === 1 ? 'AD' : i === 2 ? 'JD' : 'MK'}
                </motion.div>
            ))}
            <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={() => setShowShareModal(true)}
                className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-primary-500 hover:border-primary-500 transition-all z-0 hover:z-10"
            >
                <Share2 size={12} />
            </motion.button>
        </div>

        {setView && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('generator')}
            className="flex items-center gap-2 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl shadow-lg hover:shadow-primary-500/20 transition-all group border border-transparent dark:border-zinc-100/50"
          >
            <Sparkles size={16} className="text-primary-500 dark:text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-display font-medium tracking-[-0.04em] text-sm">Vora</span>
          </motion.button>
        )}

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
            <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all hover:bg-white/40 dark:hover:bg-white/10 ${showNotifications ? 'bg-white/40 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
                <Bell size={20} className={showNotifications ? 'animate-pulse' : ''} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border border-white dark:border-zinc-900 animate-pulse"></span>
                )}
            </motion.button>

            <AnimatePresence>
            {showNotifications && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-full mt-4 w-80 glass-gradient rounded-2xl overflow-hidden origin-top-right z-50 shadow-2xl"
                >
                    <div className="p-4 border-b border-white/20 dark:border-white/5 flex items-center justify-between bg-white/30 dark:bg-zinc-900/30 backdrop-blur-md">
                        <h3 className="font-medium font-display tracking-[-0.04em] text-sm text-zinc-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider transition-colors">Mark all read</button>
                        )}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto bg-white/20 dark:bg-zinc-900/20 backdrop-blur-md">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-zinc-400">
                                <p className="text-xs font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <motion.div layout key={n.id} className={`p-4 border-b border-white/10 hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-colors duration-200 ${n.read ? 'opacity-70' : 'bg-primary-50/20'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-zinc-300/50' : 'bg-primary-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]'}`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white mb-0.5">{n.title}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{n.message}</p>
                                            <p className="text-[10px] text-zinc-400 mt-2">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                        {!n.read && (
                                            <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }} className="text-zinc-400 hover:text-primary-500 p-1 hover:bg-white/50 rounded transition-all">
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-zinc-200/50 dark:bg-white/10"></div>
        <div className="flex items-center gap-2 text-xs font-bold font-header text-zinc-700 dark:text-zinc-300 bg-white/40 dark:bg-zinc-800/40 px-4 py-2 rounded-xl border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div>
          OPERATIONAL
        </div>
      </div>
      
      {/* Share/Collaboration Modal */}
      <AnimatePresence>
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
             <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="glass-card w-full max-w-lg p-8 rounded-[2rem] shadow-2xl relative bg-white/90 dark:bg-zinc-900/90"
             >
                 <button onClick={() => setShowShareModal(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                     <Check size={20} />
                 </button>
                 
                 <div className="mb-8">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-2xl flex items-center justify-center border border-primary-100 dark:border-primary-900/30">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white">Collaborate</h3>
                     </div>
                     <p className="text-sm text-zinc-500 font-header">Invite your team to edit this deck in real-time.</p>
                 </div>

                 <div className="space-y-6">
                     <div className="space-y-2">
                         <label className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Invite via Email</label>
                         <div className="flex gap-2">
                            <input type="email" placeholder="colleague@company.com" className="flex-1 bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm" />
                            <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 rounded-xl font-bold font-header text-sm hover:scale-105 transition-transform">Invite</button>
                         </div>
                     </div>

                     <div className="relative">
                         <div className="absolute inset-0 flex items-center">
                             <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                         </div>
                         <div className="relative flex justify-center text-xs uppercase">
                             <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 font-bold font-header">Or copy link</span>
                         </div>
                     </div>

                     <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                         <div className="p-2 bg-white dark:bg-zinc-700 rounded-lg text-zinc-400">
                             <Link size={16} />
                         </div>
                         <div className="flex-1 truncate text-xs text-zinc-500 font-mono">
                             https://devdecks.app/shared/deck/d-123456...
                         </div>
                         <button className="text-primary-600 font-bold text-xs hover:text-primary-700 flex items-center gap-1 px-2">
                             <Copy size={12} /> Copy
                         </button>
                     </div>
                     
                     <div className="space-y-4 pt-2">
                         <p className="text-xs font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wider font-header">Active Members</p>
                         <div className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
                                 <div>
                                     <p className="text-sm font-bold text-zinc-900 dark:text-white">Alex Designer (You)</p>
                                     <p className="text-xs text-zinc-500">Owner</p>
                                 </div>
                             </div>
                             <span className="text-xs font-bold text-zinc-400">Online</span>
                         </div>
                         <div className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                                 <div>
                                     <p className="text-sm font-bold text-zinc-900 dark:text-white">Jane Doe</p>
                                     <p className="text-xs text-zinc-500">Editor</p>
                                 </div>
                             </div>
                             <span className="text-xs font-bold text-emerald-500">Editing slide 2...</span>
                         </div>
                     </div>
                 </div>
             </motion.div>
        </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopBar;
