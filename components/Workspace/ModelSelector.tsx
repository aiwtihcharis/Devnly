
import React from 'react';
import { AIModelId, ModelMetadata } from '../../types';
import { Cpu, Zap, Brain, Image, Video } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: AIModelId;
  onSelect: (id: AIModelId) => void;
}

export const models: ModelMetadata[] = [
  { id: AIModelId.GEMINI_FLASH, name: 'Gemini 2.5 Flash', provider: 'Google', description: 'Balanced Performance', latency: 'Low', costPerToken: 1 },
  { id: AIModelId.GEMINI_FLASH_LITE, name: 'Gemini 2.5 Flash Lite', provider: 'Google', description: 'Fastest Responses', latency: 'Low', costPerToken: 0.5 },
  { id: AIModelId.GEMINI_PRO, name: 'Gemini 3 Pro', provider: 'Google', description: 'Thinking Mode (Reasoning)', latency: 'Medium', costPerToken: 3 },
  { id: AIModelId.GEMINI_IMAGE, name: 'Gemini 3 Pro Image', provider: 'Google', description: 'High Fidelity Images', latency: 'Medium', costPerToken: 2 },
  { id: AIModelId.VEO, name: 'Veo 3.1 Video', provider: 'Google', description: 'Fast Video Generation', latency: 'High', costPerToken: 10 },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  const current = models.find(m => m.id === selectedModel);

  return (
    <div className="relative group z-30">
      <div className="flex items-center gap-2 bg-white hover:bg-zinc-50 px-3 py-2 rounded-md cursor-pointer transition-all border border-zinc-200 hover:border-zinc-300 shadow-sm">
        <Cpu size={14} className="text-zinc-500" />
        <span className="text-sm font-medium text-zinc-700 font-sans">
          {current?.name}
        </span>
      </div>

      {/* Dropdown - Opens Upwards now */}
      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-zinc-200 p-1 hidden group-hover:block animate-in fade-in zoom-in-95 duration-150 origin-bottom-left">
        <div className="px-3 py-2 border-b border-zinc-100 mb-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">Orchestration Engine</span>
        </div>
        {models.map(model => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`w-full text-left p-3 rounded-md flex items-start gap-3 transition-all ${
                selectedModel === model.id 
                ? 'bg-primary-50 border border-primary-100' 
                : 'border border-transparent hover:bg-zinc-50 hover:border-zinc-200'
            }`}
          >
            <div className={`mt-0.5 p-1.5 rounded-md border ${
                selectedModel === model.id ? 'bg-white border-primary-200 text-primary-600' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
            }`}>
                {model.id === AIModelId.GEMINI_PRO ? <Brain size={14} /> : 
                 model.id === AIModelId.GEMINI_IMAGE ? <Image size={14} /> :
                 model.id === AIModelId.VEO ? <Video size={14} /> : <Zap size={14} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold font-display ${selectedModel === model.id ? 'text-primary-900' : 'text-zinc-900'}`}>{model.name}</p>
                {selectedModel === model.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
              </div>
              <p className="text-xs text-zinc-500 mt-1">{model.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-zinc-200 text-zinc-500 font-mono uppercase">{model.latency} Latency</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
