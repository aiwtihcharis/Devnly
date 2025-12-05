
import React from 'react';
import { AIModelId, ChatMessage, Slide, Template } from '../../types';
import ChatInterface from '../Workspace/ChatInterface';
import { Sparkles, Edit3, LayoutTemplate, ArrowRight, Zap } from 'lucide-react';

interface GeneratorViewProps {
    messages: ChatMessage[];
    onSendMessage: (text: string, model: AIModelId) => void;
    isTyping: boolean;
    generatedSlides: Slide[];
    onEditDeck: () => void;
    onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
    { id: 't1', title: 'Startup Pitch', description: 'Classic 10-slide investor deck structure.', thumbnailColor: 'bg-zinc-900', slideCount: 10 },
    { id: 't2', title: 'QBR Review', description: 'Quarterly business performance analysis.', thumbnailColor: 'bg-primary-500', slideCount: 15 },
    { id: 't3', title: 'Product Launch', description: 'Feature showcase and market strategy.', thumbnailColor: 'bg-emerald-500', slideCount: 8 },
    { id: 't4', title: 'Marketing Plan', description: 'Campaign strategy and channel breakdown.', thumbnailColor: 'bg-purple-500', slideCount: 12 },
];

const GeneratorView: React.FC<GeneratorViewProps> = ({ messages, onSendMessage, isTyping, generatedSlides, onEditDeck, onSelectTemplate }) => {
    
    // Render the generated deck card inside the chat stream if it exists
    const messagesWithCards = messages.map(msg => {
        if (msg.role === 'model' && msg.metadata?.type === 'deck_generated') {
             return {
                 ...msg,
                 content: (
                     <div className="w-full">
                         <p className="mb-4">{msg.content}</p>
                         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-lg max-w-sm hover:border-primary-500 transition-colors group cursor-pointer" onClick={onEditDeck}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-xl flex items-center justify-center">
                                    <Sparkles size={20} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-zinc-900 dark:text-white">Deck Ready</h3>
                                    <p className="text-xs text-zinc-500 font-header">{msg.metadata.slideCount} Slides Generated</p>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-bold font-header text-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                                <Edit3 size={14} /> Open Editor
                            </button>
                         </div>
                     </div>
                 ) as any
             }
        }
        return msg;
    });

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
            <div className="mb-8 text-center space-y-3 max-w-lg">
                <div className="w-16 h-16 bg-zinc-900 dark:bg-white rounded-3xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl mx-auto mb-6 transform -rotate-6">
                    <Zap size={32} className="fill-current" />
                </div>
                <h1 className="text-4xl font-display font-bold text-zinc-900 dark:text-white">What are we building?</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-header">Start a conversation to generate from scratch, or choose a template below.</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {templates.map(template => (
                    <button 
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className="group flex flex-col text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-primary-500 dark:hover:border-primary-500 p-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
                    >
                        <div className={`h-24 w-full rounded-xl ${template.thumbnailColor} mb-4 relative overflow-hidden`}>
                             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                             <LayoutTemplate className="absolute bottom-2 right-2 text-white/50" size={20} />
                        </div>
                        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-sm mb-1">{template.title}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-header leading-relaxed line-clamp-2">{template.description}</p>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-primary-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                            Use Template <ArrowRight size={10} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="h-full relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
            <ChatInterface 
                messages={messagesWithCards} 
                onSendMessage={onSendMessage} 
                isTyping={isTyping}
                renderEmptyState={renderEmptyState}
            />
        </div>
    );
};

export default GeneratorView;
