
import React from 'react';
import { LayoutTemplate, ArrowRight, Star, Plus } from 'lucide-react';
import { Template } from '../../types';

interface TemplatesViewProps {
    onSelectTemplate?: (template: Template) => void;
}

const templates: Template[] = [
    { id: 't1', title: 'Startup Pitch Deck', description: 'The standard 10-slide deck for raising seed capital.', thumbnailColor: 'bg-zinc-900', slideCount: 10 },
    { id: 't2', title: 'QBR Review', description: 'Quarterly business review with financial breakdown.', thumbnailColor: 'bg-primary-500', slideCount: 15 },
    { id: 't3', title: 'Product Launch', description: 'Go-to-market strategy and feature showcase.', thumbnailColor: 'bg-emerald-500', slideCount: 8 },
    { id: 't4', title: 'Marketing Strategy', description: 'Comprehensive campaign planning structure.', thumbnailColor: 'bg-purple-500', slideCount: 12 },
    { id: 't5', title: 'Design Portfolio', description: 'Showcase your creative work visually.', thumbnailColor: 'bg-pink-500', slideCount: 6 },
    { id: 't6', title: 'Sales Proposal', description: 'High-converting B2B sales presentation.', thumbnailColor: 'bg-blue-500', slideCount: 9 },
];

const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  return (
    <div className="h-full flex flex-col animate-fade-in p-2">
      <div className="flex items-center justify-between mb-8 px-4 pt-2">
        <div>
          <h1 className="text-3xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white tracking-tight">Templates Library</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Start faster with professional layouts.</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl font-bold font-header shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Plus size={18} />
            Import Template
        </button>
      </div>

      <div className="flex-1 glass-gradient rounded-[2rem] shadow-sm overflow-y-auto custom-scrollbar p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
                <div key={template.id} className="group glass-card rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white/40 dark:bg-zinc-800/40" onClick={() => onSelectTemplate?.(template)}>
                    <div className={`aspect-video rounded-xl ${template.thumbnailColor} mb-4 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform duration-500`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                        <LayoutTemplate className="absolute bottom-3 right-3 text-white/50" size={24} />
                        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white font-header uppercase tracking-wider border border-white/10">
                            {template.slideCount} Slides
                        </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white text-lg">{template.title}</h3>
                    </div>
                    
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-header leading-relaxed mb-6 h-10 line-clamp-2">
                        {template.description}
                    </p>

                    <button className="w-full py-3 bg-zinc-100 dark:bg-zinc-700/50 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white text-zinc-900 dark:text-white rounded-xl font-bold font-header text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
                        Use Template <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;
