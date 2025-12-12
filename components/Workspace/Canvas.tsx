
import React, { useState, useRef, useEffect } from 'react';
import { Slide, SlideElement, AnimationSettings, ElementStyle, SlideTransition } from '../../types';
import { 
    Type, Image, Trash2, Move, ArrowLeft, Download, Maximize, 
    Sparkles, Video, Music, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
    Bold, Italic, Layers, Settings, Palette, PlayCircle
} from 'lucide-react';
import { improveSlideContent } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSlideSelect: (id: string) => void;
  onUpdateSlide: (id: string, updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  onExit: () => void;
}

const FONTS = ['Plus Jakarta Sans', 'Unbounded', 'Inter', 'Playfair Display', 'Roboto Mono', 'Lobster', 'Arial', 'Georgia'];
const ANIMATIONS = ['none', 'fade-in', 'slide-in-left', 'slide-in-right', 'zoom-in', 'pop'];

const Canvas: React.FC<CanvasProps> = ({ slides, activeSlideId, onSlideSelect, onUpdateSlide, onAddSlide, onExit }) => {
  const activeSlide = slides.find(s => s.id === activeSlideId);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'style' | 'animate'>('style');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedElement = activeSlide?.elements.find(e => e.id === selectedElementId);

  // --- Update Helpers ---

  const updateElement = (elId: string, updates: Partial<SlideElement>) => {
    if (!activeSlide) return;
    const newElements = activeSlide.elements.map(el => 
      el.id === elId ? { ...el, ...updates } : el
    );
    onUpdateSlide(activeSlide.id, { elements: newElements });
  };

  const updateStyle = (key: keyof ElementStyle, value: any) => {
      if(!selectedElement) return;
      updateElement(selectedElement.id, { 
          style: { ...selectedElement.style, [key]: value } 
      });
  };

  const updateAnimation = (key: keyof AnimationSettings, value: any) => {
      if(!selectedElement) return;
      const currentAnim = selectedElement.animation || { type: 'none', duration: 0.5, delay: 0 };
      updateElement(selectedElement.id, { 
          animation: { ...currentAnim, [key]: value } 
      });
  };

  const updateSlideProperty = (key: keyof Slide, value: any) => {
      if (!activeSlide) return;
      onUpdateSlide(activeSlide.id, { [key]: value });
  };

  const updateTransition = (key: keyof SlideTransition, value: any) => {
      if (!activeSlide) return;
      const currentTransition = activeSlide.transition || { type: 'none', duration: 0.5 };
      onUpdateSlide(activeSlide.id, { 
          transition: { ...currentTransition, [key]: value } 
      });
  };

  // --- Interaction Handlers ---

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

  const addElement = (type: 'text' | 'image' | 'video' | 'audio') => {
    if (!activeSlide) return;
    const newId = `el-${Date.now()}`;
    const baseStyle: ElementStyle = { 
        zIndex: activeSlide.elements.length + 1,
        borderRadius: 0,
        opacity: 1
    };

    let newEl: SlideElement;

    if (type === 'text') {
        newEl = {
            id: newId, type, content: 'Double click to edit',
            x: 30, y: 30, w: 40, h: 15,
            style: { ...baseStyle, fontSize: 24, color: '#18181b', fontFamily: 'Plus Jakarta Sans', letterSpacing: 0, textAlign: 'left' },
            animation: { type: 'none', duration: 0.5, delay: 0 }
        };
    } else {
        newEl = {
            id: newId, type, content: '', // Placeholder URL
            x: 35, y: 30, w: 30, h: 40,
            style: { ...baseStyle, borderRadius: 12, backgroundColor: '#f4f4f5' },
            animation: { type: 'none', duration: 0.5, delay: 0 }
        };
    }

    onUpdateSlide(activeSlide.id, { elements: [...activeSlide.elements, newEl] });
    setSelectedElementId(newId);
  };

  const deleteSelected = () => {
      if (!activeSlide || !selectedElementId) return;
      const newElements = activeSlide.elements.filter(e => e.id !== selectedElementId);
      onUpdateSlide(activeSlide.id, { elements: newElements });
      setSelectedElementId(null);
  };

  // --- Rendering ---

  return (
    <div className="fixed inset-0 z-40 bg-zinc-100 dark:bg-zinc-950 flex flex-col h-full overflow-hidden select-none">
        
        {/* Top Toolbar */}
        <div className="h-14 glass-panel border-b border-white/20 dark:border-white/5 px-4 flex items-center justify-between shadow-sm z-50 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onExit} className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="flex items-center gap-1">
                    <button onClick={() => addElement('text')} className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-all group">
                        <Type size={18} className="group-hover:text-primary-500 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Text</span>
                    </button>
                    <button onClick={() => addElement('image')} className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-all group">
                        <Image size={18} className="group-hover:text-primary-500 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Image</span>
                    </button>
                    <button onClick={() => addElement('video')} className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-all group">
                        <Video size={18} className="group-hover:text-primary-500 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Video</span>
                    </button>
                     <button onClick={() => addElement('audio')} className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 transition-all group">
                        <Music size={18} className="group-hover:text-primary-500 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Audio</span>
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold font-header hover:scale-105 transition-transform">
                    <Maximize size={14} /> Preview
                </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Slide Strip */}
            <div className="w-48 bg-white/40 dark:bg-zinc-900/40 border-r border-white/20 dark:border-white/5 overflow-y-auto p-3 space-y-3 flex-shrink-0 backdrop-blur-md">
                {slides.map((slide, idx) => (
                    <div 
                        key={slide.id}
                        onClick={() => onSlideSelect(slide.id)}
                        className={`relative aspect-video rounded-lg border-2 cursor-pointer transition-all bg-white overflow-hidden group ${slide.id === activeSlide?.id ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'}`}
                    >
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <span className="text-[8px] text-zinc-300">{slide.title}</span>
                         </div>
                         <div className="absolute bottom-1 left-1 w-4 h-4 bg-zinc-100 rounded flex items-center justify-center text-[8px] font-bold text-zinc-500">
                             {idx + 1}
                         </div>
                    </div>
                ))}
                <button 
                    onClick={onAddSlide}
                    className="w-full aspect-video border-2 border-dashed border-zinc-300/50 hover:border-primary-500 rounded-lg flex items-center justify-center text-zinc-400 hover:text-primary-500 transition-colors"
                >
                    <span className="text-xs font-bold uppercase">Add Slide</span>
                </button>
            </div>

            {/* Main Canvas Area */}
            <div 
                className="flex-1 overflow-hidden bg-zinc-200/50 dark:bg-black/50 flex items-center justify-center relative"
                onMouseMove={handleCanvasMouseMove}
            >
                <div 
                    ref={canvasRef}
                    onClick={() => setSelectedElementId(null)}
                    className="aspect-video w-[90%] max-w-[1200px] bg-white shadow-2xl relative overflow-hidden ring-1 ring-black/5"
                    style={{ backgroundColor: activeSlide?.background || '#ffffff' }}
                >
                    {activeSlide?.elements.map(el => {
                        const isSelected = el.id === selectedElementId;
                        return (
                            <div
                                key={el.id}
                                onMouseDown={(e) => handleMouseDown(e, el)}
                                className={`absolute group cursor-move ${isSelected ? 'z-20' : 'z-10'}`}
                                style={{
                                    left: `${el.x}%`,
                                    top: `${el.y}%`,
                                    width: `${el.w}%`,
                                    height: `${el.h}%`,
                                    ...el.style,
                                    fontSize: el.style?.fontSize ? `${el.style.fontSize}px` : undefined,
                                    letterSpacing: el.style?.letterSpacing ? `${el.style.letterSpacing}px` : undefined,
                                }}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 border-2 border-primary-500 pointer-events-none">
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-primary-500"></div>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-primary-500"></div>
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-primary-500"></div>
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-primary-500"></div>
                                    </div>
                                )}
                                
                                {el.type === 'text' && (
                                    <div 
                                        className="w-full h-full outline-none"
                                        contentEditable 
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateElement(el.id, { content: e.currentTarget.innerText })}
                                        onMouseDown={(e) => e.stopPropagation()} // Allow text selection
                                    >
                                        {el.content}
                                    </div>
                                )}
                                {el.type === 'image' && (
                                    <img src={el.content || 'https://placehold.co/600x400/png?text=Image+Placeholder'} className="w-full h-full object-cover pointer-events-none" />
                                )}
                                {el.type === 'video' && (
                                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                                        {el.content ? (
                                            <video src={el.content} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <div className="text-white/50 flex flex-col items-center">
                                                <Video size={32} />
                                                <span className="text-xs font-bold mt-2">VIDEO</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {el.type === 'audio' && (
                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center border border-zinc-300 rounded-lg">
                                        <Music size={24} className="text-zinc-500" />
                                        <audio src={el.content} className="absolute bottom-0 w-full h-8" controls />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Property Panel */}
            <div className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-y-auto custom-scrollbar shadow-xl z-20">
                {selectedElement ? (
                    <div className="p-4 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-header">Properties</h3>
                             <button onClick={deleteSelected} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={14} /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <button onClick={() => setActiveTab('style')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'style' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Style</button>
                            <button onClick={() => setActiveTab('animate')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'animate' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Animate</button>
                        </div>

                        {activeTab === 'style' ? (
                            <div className="space-y-5 animate-fade-in">
                                {selectedElement.type === 'text' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-zinc-400">Font Family</label>
                                            <select 
                                                value={selectedElement.style?.fontFamily} 
                                                onChange={(e) => updateStyle('fontFamily', e.target.value)}
                                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                            >
                                                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-zinc-400">Size (px)</label>
                                                <input 
                                                    type="number" 
                                                    value={selectedElement.style?.fontSize}
                                                    onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-zinc-400">Kerning</label>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    value={selectedElement.style?.letterSpacing || 0}
                                                    onChange={(e) => updateStyle('letterSpacing', parseFloat(e.target.value))}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-zinc-400">Text Color</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="color" 
                                                    value={selectedElement.style?.color}
                                                    onChange={(e) => updateStyle('color', e.target.value)}
                                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                                                />
                                                <span className="text-xs font-mono text-zinc-500">{selectedElement.style?.color}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-zinc-400">Alignment</label>
                                            <div className="flex bg-zinc-50 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                                                {['left', 'center', 'right', 'justify'].map((align) => (
                                                    <button 
                                                        key={align}
                                                        onClick={() => updateStyle('textAlign', align)}
                                                        className={`flex-1 py-1.5 flex items-center justify-center rounded ${selectedElement.style?.textAlign === align ? 'bg-white dark:bg-zinc-600 shadow-sm text-primary-500' : 'text-zinc-400'}`}
                                                    >
                                                        {align === 'left' && <AlignLeft size={14} />}
                                                        {align === 'center' && <AlignCenter size={14} />}
                                                        {align === 'right' && <AlignRight size={14} />}
                                                        {align === 'justify' && <AlignJustify size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                     <label className="text-[10px] font-bold uppercase text-zinc-400">Appearance</label>
                                     <div className="grid grid-cols-2 gap-3">
                                         <div>
                                            <span className="text-[10px] text-zinc-500 block mb-1">Opacity</span>
                                            <input 
                                                type="range" min="0" max="1" step="0.1"
                                                value={selectedElement.style?.opacity ?? 1}
                                                onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
                                                className="w-full accent-primary-500 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                         </div>
                                         <div>
                                            <span className="text-[10px] text-zinc-500 block mb-1">Radius</span>
                                            <input 
                                                type="number" 
                                                value={selectedElement.style?.borderRadius || 0}
                                                onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value))}
                                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                            />
                                         </div>
                                     </div>
                                     <div className="mt-2">
                                        <span className="text-[10px] text-zinc-500 block mb-1">Background</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                value={selectedElement.style?.backgroundColor || '#ffffff'}
                                                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                                className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                                            />
                                             <button onClick={() => updateStyle('backgroundColor', 'transparent')} className="text-[10px] underline text-zinc-400">Clear</button>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-fade-in">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Entrance Animation</label>
                                    <select 
                                        value={selectedElement.animation?.type} 
                                        onChange={(e) => updateAnimation('type', e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                    >
                                        {ANIMATIONS.map(a => <option key={a} value={a}>{a.replace('-', ' ')}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Duration (s)</label>
                                    <input 
                                        type="range" min="0.1" max="3" step="0.1"
                                        value={selectedElement.animation?.duration} 
                                        onChange={(e) => updateAnimation('duration', parseFloat(e.target.value))}
                                        className="w-full accent-primary-500 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="text-right text-[10px] text-zinc-400">{selectedElement.animation?.duration}s</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Delay (s)</label>
                                    <input 
                                        type="number" min="0" step="0.1"
                                        value={selectedElement.animation?.delay} 
                                        onChange={(e) => updateAnimation('delay', parseFloat(e.target.value))}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                    />
                                </div>
                                <button className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                    <PlayCircle size={14} /> Preview Animation
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-header">Slide Settings</h3>
                             <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-400"><Layers size={14} /></div>
                        </div>
                        
                        {/* Background Section */}
                        <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase text-zinc-400">Background</label>
                             <div className="flex items-center gap-3">
                                 <input 
                                    type="color" 
                                    value={activeSlide?.background || '#ffffff'}
                                    onChange={(e) => updateSlideProperty('background', e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                                 />
                                 <div className="flex-1">
                                     <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase">{activeSlide?.background || '#ffffff'}</div>
                                     <div className="text-[10px] text-zinc-400">Fill Color</div>
                                 </div>
                             </div>
                        </div>

                        {/* Transition Section */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                             <label className="text-[10px] font-bold uppercase text-zinc-400">Transition</label>
                             <div className="space-y-3">
                                 <div>
                                    <span className="text-[10px] text-zinc-500 block mb-1">Type</span>
                                    <select 
                                        value={activeSlide?.transition?.type || 'none'}
                                        onChange={(e) => updateTransition('type', e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs font-medium outline-none"
                                    >
                                        <option value="none">None</option>
                                        <option value="fade">Fade</option>
                                        <option value="slide-left">Slide Left</option>
                                        <option value="slide-right">Slide Right</option>
                                        <option value="zoom">Zoom</option>
                                    </select>
                                 </div>
                                 
                                 <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[10px] text-zinc-500">Duration</span>
                                        <span className="text-[10px] text-zinc-400">{activeSlide?.transition?.duration || 0.5}s</span>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="2" step="0.1"
                                        value={activeSlide?.transition?.duration || 0.5}
                                        onChange={(e) => updateTransition('duration', parseFloat(e.target.value))}
                                        className="w-full accent-primary-500 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                 </div>
                             </div>
                        </div>
                        
                        <div className="pt-4 mt-auto">
                             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                 <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1"><Sparkles size={12} /> Pro Tip</h4>
                                 <p className="text-[10px] text-blue-600 dark:text-blue-300 leading-relaxed">
                                    Consistent transitions help maintain flow. We recommend "Slide Left" for linear storytelling.
                                 </p>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Canvas;