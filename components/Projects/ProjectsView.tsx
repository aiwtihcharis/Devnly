import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreHorizontal, FileText, Calendar } from 'lucide-react';
import { Project } from '../../types';
import { MockFirebase } from '../../services/mockFirebase';

const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        const data = await MockFirebase.db.getProjects();
        setProjects(data);
        setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="h-full flex flex-col animate-fade-in p-2">
      <div className="flex items-center justify-between mb-8 px-4 pt-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">All Projects</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">View and manage all your decks in one place.</p>
        </div>
      </div>

      <div className="flex-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col">
         {/* Toolbar */}
         <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-sans transition-all"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 font-header font-bold text-xs uppercase tracking-wider transition-all">
                <Filter size={16} /> Filter
            </button>
         </div>

         {/* Grid */}
         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-64 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800/50 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <div key={project.id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                            <div className="h-32 bg-zinc-50 dark:bg-zinc-800/50 relative border-b border-zinc-100 dark:border-zinc-800 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/10 transition-colors p-4 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-zinc-400">
                                        <FileText size={16} />
                                    </div>
                                    <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-display font-bold text-zinc-900 dark:text-white text-lg mb-2 line-clamp-1">{project.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 font-header font-medium mb-4">
                                    <Calendar size={12} />
                                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                                        project.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                        project.status === 'Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-zinc-50 text-zinc-500 border-zinc-100'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ProjectsView;