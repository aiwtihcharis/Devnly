
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, ArrowUp, Ratio } from 'lucide-react';
import { AIModelId, ChatMessage } from '../../types';
import ModelSelector from './ModelSelector';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, model: AIModelId, config?: { aspectRatio: string }) => void;
  isTyping: boolean;
  renderEmptyState?: () => React.ReactNode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping, renderEmptyState }) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelId>(AIModelId.GEMINI_FLASH);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isMediaModel = selectedModel === AIModelId.GEMINI_IMAGE || selectedModel === AIModelId.VEO;

  const imageRatios = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];
  const videoRatios = ["16:9", "9:16"];
  const availableRatios = selectedModel === AIModelId.VEO ? videoRatios : imageRatios;

  // Reset default ratio when switching models if needed
  useEffect(() => {
     if (selectedModel === AIModelId.VEO && !videoRatios.includes(aspectRatio)) {
         setAspectRatio("16:9");
     }
  }, [selectedModel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input, selectedModel, isMediaModel ? { aspectRatio } : undefined);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full relative transition-colors duration-300 w-full max-w-5xl mx-auto">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="min-h-full pb-32" ref={scrollRef}>
            {!hasMessages && renderEmptyState ? (
                renderEmptyState()
            ) : (
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 text-primary-600 border border-zinc-100 dark:border-zinc-700 shadow-sm mt-1">
                                <Bot size={16} />
                            </div>
                        )}
                        
                        <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : 'items-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-5 py-3.5 rounded-2xl rounded-tr-sm font-sans text-sm leading-relaxed shadow-sm">
                                    {msg.content}
                                </div>
                            ) : (
                                <div className="text-zinc-800 dark:text-zinc-200 font-sans text-sm leading-relaxed w-full">
                                    {/* Text Content */}
                                    {msg.content && <div className="markdown mb-2">{msg.content}</div>}
                                    
                                    {/* Media Assets (Image/Video) */}
                                    {msg.metadata?.assetUrl && (
                                        <div className="mt-2 rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700">
                                            {msg.metadata.type === 'image_generated' ? (
                                                <img src={msg.metadata.assetUrl} alt="Generated Asset" className="w-full h-auto" />
                                            ) : msg.metadata.type === 'video_generated' ? (
                                                <video src={msg.metadata.assetUrl} controls className="w-full h-auto" />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm mt-1">
                                <User size={16} />
                            </div>
                        )}
                    </div>
                    ))}
                    
                    {isTyping && (
                    <div className="flex gap-4 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-primary-600 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                            <Bot size={16} />
                        </div>
                        <div className="flex items-center gap-1.5 pt-2">
                            <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-20">
        <div className="w-full max-w-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-2xl p-2 flex flex-col gap-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/50">
            
            {/* Model & Aspect Ratio Selector */}
            <div className="px-2 pt-1 flex items-center gap-2">
                <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
                
                {isMediaModel && (
                    <div className="relative group">
                        <button className="flex items-center gap-2 bg-white hover:bg-zinc-50 px-3 py-2 rounded-md cursor-pointer transition-all border border-zinc-200 hover:border-zinc-300 shadow-sm">
                            <Ratio size={14} className="text-zinc-500" />
                            <span className="text-sm font-medium text-zinc-700 font-sans">{aspectRatio}</span>
                        </button>
                        <div className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-lg shadow-xl border border-zinc-200 p-1 hidden group-hover:block animate-in fade-in zoom-in-95 duration-150 origin-bottom-left">
                            {availableRatios.map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setAspectRatio(r)}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold font-header hover:bg-zinc-50 rounded-md ${aspectRatio === r ? 'text-primary-600 bg-primary-50' : 'text-zinc-600'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-end gap-2 px-2 pb-1">
                <button className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <Paperclip size={20} />
                </button>
                
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isMediaModel ? "Describe the image or video you want to generate..." : "Describe the presentation..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-sans resize-none max-h-[120px]"
                    rows={1}
                />
                
                <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`p-2.5 rounded-xl transition-all shadow-sm flex-shrink-0 ${
                        input.trim() 
                        ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                    }`}
                >
                    <ArrowUp size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
