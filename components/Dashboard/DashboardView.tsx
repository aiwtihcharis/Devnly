
import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Clock, PlayCircle, ArrowRight, Layout } from 'lucide-react';
import { Project } from '../../types';
import { MockFirebase } from '../../services/mockFirebase';
import { motion } from 'framer-motion';

interface DashboardViewProps {
  onNewProject: () => void;
  onOpenProject: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNewProject, onOpenProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        const data = await MockFirebase.db.getProjects();
        // Sort by newest first and take top 4 for the dashboard
        const recent = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
        setProjects(recent);
        setLoading(false);
    };
    fetchProjects();
    
    // Subscribe for live updates
    const unsubscribe = MockFirebase.subscribe(fetchProjects);
    return () => unsubscribe();
  }, []);

  const containerVariants = {
      hidden: { opacity: 0 },
      show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
      }
  };

  const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-2 pb-10">
      <div className="flex items-end justify-between mb-8 px-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white leading-tight">Your Projects</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-header font-medium">Manage your decks and orchestration sessions.</p>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-[300px] rounded-[2rem] bg-white/20 dark:bg-zinc-800/20 animate-pulse border border-white/20"></div>)}
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border-2 border-dashed border-zinc-200/50 dark:border-zinc-800/50 rounded-[3rem] bg-white/10 dark:bg-zinc-900/10 backdrop-blur-sm"
        >
            <div className="w-20 h-20 bg-white/50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-6 shadow-sm transform rotate-3 border border-white/20">
                <Layout size={40} />
            </div>
            <h2 className="text-2xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white mb-2">No Decks Made</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-header max-w-md mb-8">
                Your workspace is looking a bit empty. Create your first presentation to get started.
            </p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewProject}
                className="group flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-bold font-header shadow-xl shadow-zinc-900/10 hover:shadow-2xl transition-all duration-300"
            >
                <Plus size={20} />
                Create Blank Deck
            </motion.button>
        </motion.div>
      ) : (
        /* Projects Grid */
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {/* Create New Card (Mini) */}
            <motion.button 
                variants={itemVariants}
                onClick={onNewProject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative border border-dashed border-zinc-300/60 dark:border-zinc-700/60 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px] hover:border-primary-500 dark:hover:border-primary-500 hover:bg-white/20 dark:hover:bg-zinc-800/20 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
                <div className="w-14 h-14 rounded-2xl bg-white/60 dark:bg-zinc-800/60 border border-white/40 dark:border-white/10 text-zinc-300 dark:text-zinc-600 group-hover:border-primary-200 dark:group-hover:border-primary-800 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center justify-center transition-all duration-300 mb-6 shadow-sm group-hover:scale-110">
                    <Plus size={28} />
                </div>
                <span className="font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white font-header text-lg transition-colors">Create New</span>
            </motion.button>

            {/* Project Cards */}
            {projects.map((project) => (
            <motion.div 
                key={project.id} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-[300px] group relative cursor-pointer"
            >
                {/* Reactive Border Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ zIndex: 0 }}></div>
                     <div className="absolute inset-[1px] rounded-[2rem] border border-primary-500/30"></div>
                </div>

                <div className="h-40 bg-gradient-to-br from-zinc-50/50 to-white/30 dark:from-zinc-800/30 dark:to-zinc-900/10 relative border-b border-white/20 dark:border-white/5 group-hover:bg-white/40 dark:group-hover:bg-zinc-800/40 transition-colors duration-300 p-6 flex flex-col justify-between backdrop-blur-md z-10">
                    <div className="flex justify-between items-start z-10">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border font-header backdrop-blur-sm ${
                            project.status === 'Published' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-100' : 
                            project.status === 'Review' ? 'bg-amber-50/80 text-amber-600 border-amber-100' :
                            'bg-white/80 text-zinc-500 border-zinc-200'
                        }`}>
                            {project.status}
                        </span>
                        <button className="w-8 h-8 rounded-full bg-white/40 hover:bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors backdrop-blur-sm">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                    <div className="flex gap-2 opacity-30">
                        <div className="w-8 h-8 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 border-2 border-white/50 dark:border-zinc-800/50"></div>
                    </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col z-10 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-sm">
                    <h3 className="font-medium font-display tracking-[-0.04em] text-zinc-900 dark:text-white line-clamp-1 text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-2 mb-4 text-xs font-medium text-zinc-400 font-header">
                        <Clock size={12} />
                        <span>Edited {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                        <motion.button 
                            whileHover={{ x: 5 }}
                            onClick={() => onOpenProject(project.id)}
                            className="text-xs font-bold font-header text-zinc-900 dark:text-white flex items-center gap-2 group/btn hover:text-primary-600 transition-colors bg-white/50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/20 dark:border-white/5"
                        >
                            OPEN DECK <ArrowRight size={14} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardView;
