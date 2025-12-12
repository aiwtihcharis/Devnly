
import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreHorizontal, FileText, Calendar } from 'lucide-react';
import { Project } from '../../types';
import { MockFirebase } from '../../services/mockFirebase';
import { motion } from 'framer-motion';

const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
        const data = await MockFirebase.db.getProjects();
        setProjects(data);
        setLoading(false);
    };
    fetchProjects();
    const unsubscribe = MockFirebase.subscribe(fetchProjects);
    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-2">
      <div className="flex items-center justify-between mb-8 px-4 pt-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white tracking-tight">All Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">View and manage all your decks in one place.</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 glass-gradient rounded-[2rem] overflow-hidden flex flex-col shadow-sm"
      >
         {/* Toolbar */}
         <div className="p-6 border-b border-white/20 dark:border-white/5 flex items-center justify-between gap-4 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-md">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-zinc-800/50 border border-white/30 dark:border-white/10 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-sans transition-all backdrop-blur-sm"
                />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/30 dark:border-white/10 bg-white/30 dark:bg-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300 font-header font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-sm">
                <Filter size={16} /> Filter
            </motion.button>
         </div>

         {/* Grid */}
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-64 rounded-[2rem] bg-white/20 dark:bg-zinc-800/20 animate-pulse"></div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                     <div className="w-20 h-20 bg-white/40 dark:bg-zinc-800/40 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-6 border border-white/20">
                        <FileText size={32} />
                     </div>
                     <h2 className="text-xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white mb-2">No projects yet</h2>
                     <p className="text-zinc-500 dark:text-zinc-400 font-header max-w-xs mx-auto">
                        Your workspace is empty. Create your first presentation from the dashboard.
                     </p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                     <div className="w-16 h-16 bg-white/40 dark:bg-zinc-800/40 rounded-2xl flex items-center justify-center text-zinc-400 mx-auto mb-4 border border-white/20">
                        <Search size={24} />
                     </div>
                     <h3 className="font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white text-lg">No projects found</h3>
                     <p className="text-zinc-500 dark:text-zinc-400 font-header mt-1">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map(project => (
                        <motion.div 
                            key={project.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group glass-card rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer relative"
                        >
                            {/* Moving Shine Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            </div>

                            <div className="h-32 bg-gradient-to-br from-zinc-50/50 to-white/10 dark:from-zinc-800/50 dark:to-zinc-900/10 relative border-b border-white/20 dark:border-white/5 group-hover:bg-primary-50/20 dark:group-hover:bg-primary-900/10 transition-colors p-4 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-zinc-800/60 shadow-sm flex items-center justify-center text-zinc-400 border border-white/20">
                                        <FileText size={16} />
                                    </div>
                                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 z-10 relative">
                                <h3 className="font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{project.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-header font-medium mb-4">
                                    <Calendar size={12} />
                                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border backdrop-blur-sm ${
                                        project.status === 'Published' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-100' : 
                                        project.status === 'Review' ? 'bg-amber-50/80 text-amber-600 border-amber-100' :
                                        'bg-white/80 text-zinc-500 border-zinc-200'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
         </div>
      </motion.div>
    </div>
  );
};

export default ProjectsView;
