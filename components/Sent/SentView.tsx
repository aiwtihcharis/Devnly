import React from 'react';
import { Send, Eye, MousePointer, ExternalLink, CheckCircle } from 'lucide-react';

const SentView: React.FC = () => {
  const sentItems = [
    { id: 1, title: 'Enterprise Sales Deck', recipient: 'Acme Corp', sentAt: '2 hours ago', views: 12, status: 'Opened' },
    { id: 2, title: 'Q3 Review', recipient: 'Internal Board', sentAt: '1 day ago', views: 45, status: 'Completed' },
    { id: 3, title: 'Product Launch', recipient: 'TechCrunch', sentAt: '3 days ago', views: 0, status: 'Delivered' },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in p-2">
      <div className="flex items-center justify-between mb-8 px-4 pt-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">Distributions</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-header font-medium">Track delivered decks and recipient engagement.</p>
        </div>
      </div>

      <div className="flex-1 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col p-8">
        <div className="relative border-l-2 border-zinc-100 dark:border-zinc-800 ml-4 space-y-12">
            {sentItems.map((item) => (
                <div key={item.id} className="relative pl-8 group">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${
                        item.status === 'Opened' ? 'bg-primary-500' : item.status === 'Completed' ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}></div>
                    
                    <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm font-header text-zinc-500">Sent to <span className="font-bold text-zinc-900 dark:text-zinc-200">{item.recipient}</span> • {item.sentAt}</p>
                            </div>
                            <button className="p-2 text-zinc-400 hover:text-primary-500 transition-colors">
                                <ExternalLink size={18} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 font-header">
                                <Send size={14} className="text-zinc-400" />
                                {item.status}
                             </div>
                             <div className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 font-header">
                                <Eye size={14} className="text-zinc-400" />
                                {item.views} Views
                             </div>
                             {item.status === 'Completed' && (
                                 <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                    <CheckCircle size={12} /> Goal Met
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SentView;