
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, ArrowUp } from 'lucide-react';
import { AIModelId, ChatMessage } from '../../types';
import ModelSelector from './ModelSelector';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, model: AIModelId) => void;
  isTyping: boolean;
  renderEmptyState?: () => React.ReactNode;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping, renderEmptyState }) => {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModelId>(AIModelId.GEMINI_FLASH);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    onSendMessage(input, selectedModel);
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
        <div className="min-h-full pb-32">
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
                                    {/* Render custom metadata content if exists (e.g. Generated Deck Card) */}
                                    {msg.content && <div className="markdown mb-2">{msg.content}</div>}
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
            
            {/* Model Selector inside Input */}
            <div className="px-2 pt-1">
                <ModelSelector selectedModel={selectedModel} onSelect={setSelectedModel} />
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
                    placeholder="Describe the presentation you want to build..."
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
