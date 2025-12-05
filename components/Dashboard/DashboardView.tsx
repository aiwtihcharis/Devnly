import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, Clock, PlayCircle, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { MockFirebase } from '../../services/mockFirebase';

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
  }, []);

  return (
    <div className="p-2 animate-fade-in pb-10">
      <div className="flex items-end justify-between mb-8 px-4 pt-2">
        <div>
            <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">Your Projects</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium font-header">Manage your decks and orchestration sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Card */}
        <button 
            onClick={onNewProject}
            className="group relative border border-dashed border-zinc-300 dark:border-zinc-700 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[300px] hover:border-primary-500 dark:hover:border-primary-500 hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-all cursor-pointer backdrop-blur-sm"
        >
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-300 dark:text-zinc-600 group-hover:border-primary-200 dark:group-hover:border-primary-800 group-hover:text-primary-500 dark:group-hover:text-primary-400 flex items-center justify-center transition-colors mb-6 shadow-sm">
                <Plus size={28} />
            </div>
            <span className="font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white font-header text-lg">Create Blank Deck</span>
        </button>

        {/* Project Cards */}
        {projects.map((project) => (
          <div key={project.id} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/20 dark:border-zinc-700 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all group overflow-hidden flex flex-col h-[300px] hover:shadow-xl hover:-translate-y-1 duration-300 relative">
            
            {/* Active Border Animation on Hover */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:animate-border-beam pointer-events-none"></div>

            <div className="h-40 bg-zinc-50/50 dark:bg-zinc-800/30 relative border-b border-zinc-100 dark:border-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/50 transition-colors p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border font-header ${
                        project.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        project.status === 'Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-white text-zinc-500 border-zinc-200'
                    }`}>
                        {project.status}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
                <div className="flex gap-2 opacity-30">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-800"></div>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold font-display text-zinc-900 dark:text-white line-clamp-1 text-lg mb-1">{project.title}</h3>
                <div className="flex items-center gap-2 mb-4 text-xs font-medium text-zinc-400 font-header">
                    <Clock size={12} />
                    <span>Edited {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                     <button 
                        onClick={() => onOpenProject(project.id)}
                        className="text-xs font-bold font-header text-zinc-900 dark:text-white flex items-center gap-2 group/btn hover:text-primary-600 transition-colors"
                     >
                        OPEN DECK <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;