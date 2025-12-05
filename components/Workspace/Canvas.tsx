import React, { useState, useRef, useEffect } from 'react';
import { Slide, SlideElement } from '../../types';
import { MoreVertical, GripVertical, Plus, Type, Image, Trash2, Move, BoxSelect, ArrowLeft, Download, Maximize, Wand2, Sparkles, X } from 'lucide-react';
import { improveSlideContent } from '../../services/geminiService';

interface CanvasProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSlideSelect: (id: string) => void;
  onUpdateSlide: (id: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  onExit: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ slides, activeSlideId, onSlideSelect, onUpdateSlide, onAddSlide, onExit }) => {
  const activeSlide = slides.find(s => s.id === activeSlideId);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updateElement = (elId: string, updates: Partial<SlideElement>) => {
    if (!activeSlide) return;
    const newElements = activeSlide.elements.map(el => 
      el.id === elId ? { ...el, ...updates } : el
    );
    onUpdateSlide(activeSlide.id, { elements: newElements });
  };

  const handleMouseDown = (e: React.MouseEvent, el: SlideElement) => {
    e.stopPropagation();
    setSelectedElementId(el.id);
    setIsDragging(true);
    setDragOffset({
        x: e.clientX,
        y: e.clientY
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId || !activeSlide || !canvasRef.current) return;

    const el = activeSlide.elements.find(e => e.id === selectedElementId);
    if (!el) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaXPixels = e.clientX - dragOffset.x;
    const deltaYPixels = e.clientY - dragOffset.y;
    const deltaXPercent = (deltaXPixels / canvasRect.width) * 100;
    const deltaYPercent = (deltaYPixels / canvasRect.height) * 100;

    updateElement(selectedElementId, {
        x: el.x + deltaXPercent,
        y: el.y + deltaYPercent
    });

    setDragOffset({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const addElement = (type: 'text' | 'image') => {
    if (!activeSlide) return;
    const newId = `el-${Date.now()}`;
    const newEl: SlideElement = {
        id: newId,
        type,
        content: type === 'text' ? 'New Text Block' : '',
        x: 30, y: 30, w: 40, h: 20,
        style: type === 'text' ? { fontSize: '24px' } : {}
    };
    onUpdateSlide(activeSlide.id, { elements: [...activeSlide.elements, newEl] });
    setSelectedElementId(newId);
  };

  const deleteSelected = () => {
      if (!activeSlide || !selectedElementId) return;
      const newElements = activeSlide.elements.filter(e => e.id !== selectedElementId);
      onUpdateSlide(activeSlide.id, { elements: newElements });
      setSelectedElementId(null);
  };

  // AI Actions
  const handleAiAction = async (action: 'rewrite' | 'shorten' | 'professional') => {
    if (!activeSlide || !selectedElementId) return;
    const el = activeSlide.elements.find(e => e.id === selectedElementId);
    if (!el || el.type !== 'text') return;

    setAiLoading(true);
    const newText = await improveSlideContent(el.content, action);
    updateElement(selectedElementId, { content: newText });
    setAiLoading(false);
  };

  const renderElement = (el: SlideElement) => {
    const isSelected = el.id === selectedElementId;

    return (
      <div
        key={el.id}
        onMouseDown={(e) => handleMouseDown(e, el)}
        className={`absolute group cursor-move transition-shadow rounded-lg ${isSelected ? 'ring-2 ring-primary-500 z-10' : 'hover:ring-1 hover:ring-primary-200'}`}
        style={{
          left: `${el.x}%`,
          top: `${el.y}%`,
          width: `${el.w}%`,
          height: `${el.h}%`,
          ...el.style
        }}
      >
        {isSelected && (
            <>
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-500 rounded-full shadow-sm"></div>
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-500 rounded-full shadow-sm"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-500 rounded-full shadow-sm"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-500 rounded-full shadow-sm"></div>
                
                {/* AI Floating Toolbar for Text */}
                {el.type === 'text' && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 text-white rounded-lg shadow-xl border border-zinc-700 p-1 flex items-center gap-1 z-50 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-zinc-400 px-2 uppercase tracking-wider font-header flex items-center gap-1">
                            <Sparkles size={10} className="text-primary-500" /> Vora AI
                        </span>
                        <div className="w-px h-3 bg-zinc-700"></div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAiAction('rewrite'); }} 
                            className="p-1.5 hover:bg-zinc-700 rounded text-xs font-bold font-sans"
                            disabled={aiLoading}
                        >
                            {aiLoading ? 'Thinking...' : 'Rewrite'}
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAiAction('shorten'); }} 
                            className="p-1.5 hover:bg-zinc-700 rounded text-xs font-bold font-sans"
                            disabled={aiLoading}
                        >
                            Shorten
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAiAction('professional'); }} 
                            className="p-1.5 hover:bg-zinc-700 rounded text-xs font-bold font-sans"
                            disabled={aiLoading}
                        >
                            Formal
                        </button>
                    </div>
                )}
            </>
        )}

        {el.type === 'text' && (
          <div 
            className="w-full h-full p-2 outline-none font-display text-zinc-900" 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => updateElement(el.id, { content: e.currentTarget.innerText })}
            onClick={(e) => e.stopPropagation()}
          >
            {el.content}
          </div>
        )}
        {el.type === 'image' && (
           <div className="w-full h-full bg-zinc-50 flex items-center justify-center overflow-hidden rounded-lg border border-zinc-100">
               <div className="text-zinc-300 flex flex-col items-center">
                   <Image size={32} />
                   <span className="text-xs font-bold mt-2 font-display">IMAGE ASSET</span>
               </div>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-zinc-100 dark:bg-zinc-950 flex flex-col h-full animate-fade-in no-scrollbar">
        {/* Editor Toolbar */}
      <div className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-6">
            <button onClick={onExit} className="p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                <ArrowLeft size={20} />
            </button>
            <div className="h-8 w-px bg-zinc-100 dark:bg-zinc-800"></div>
            <div className="flex items-center gap-2">
                <button onClick={() => addElement('text')} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 font-header font-bold text-xs uppercase tracking-wider transition-all">
                    <Type size={16} /> Text
                </button>
                <button onClick={() => addElement('image')} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 font-header font-bold text-xs uppercase tracking-wider transition-all">
                    <Image size={16} /> Image
                </button>
            </div>
            
            {selectedElementId && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-200">
                     <div className="h-8 w-px bg-zinc-100 dark:bg-zinc-800"></div>
                     <button onClick={deleteSelected} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors">
                        <Trash2 size={18} />
                     </button>
                </div>
            )}
        </div>
        <div className="flex items-center gap-3">
            <button className="text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 font-bold font-header uppercase tracking-wider transition-colors flex items-center gap-2">
                <Maximize size={14} /> Preview
            </button>
            <button className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold font-header uppercase tracking-wider shadow-lg transition-colors flex items-center gap-2">
                <Download size={14} /> Export
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Slide Strip */}
        <div className="w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {slides.map((slide, idx) => (
                <div 
                    key={slide.id}
                    onClick={() => onSlideSelect(slide.id)}
                    className={`relative aspect-video rounded-lg border-2 cursor-pointer transition-all group bg-white shadow-sm overflow-hidden ${slide.id === activeSlide?.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                >
                    <div className="w-full h-full p-2 overflow-hidden flex flex-col scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none select-none bg-white">
                        <h1 className="text-5xl font-bold mb-6 text-zinc-900 font-display">{slide.title}</h1>
                    </div>
                    <div className={`absolute bottom-2 left-2 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold z-10 ${slide.id === activeSlide?.id ? 'bg-primary-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                        {idx + 1}
                    </div>
                </div>
            ))}
            <button 
                onClick={onAddSlide}
                className="w-full aspect-video border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all bg-transparent"
            >
                <Plus size={20} />
            </button>
        </div>

        {/* Canvas */}
        <div 
            className="flex-1 overflow-auto p-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 relative no-scrollbar"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => setSelectedElementId(null)}
        >
             {/* Dot Grid */}
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {activeSlide ? (
                <div 
                    ref={canvasRef}
                    className="relative w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-sm ring-1 ring-zinc-900/5 select-none transition-transform duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {activeSlide.elements.map(renderElement)}
                </div>
            ) : (
                <div className="text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-4">
                    <p className="font-header text-sm font-bold uppercase tracking-widest">No Slide Selected</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;