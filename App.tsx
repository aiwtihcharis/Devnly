
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import DashboardView from './components/Dashboard/DashboardView';
import GeneratorView from './components/Generator/GeneratorView';
import Canvas from './components/Workspace/Canvas';
import AnalyticsView from './components/Analytics/AnalyticsView';
import LoginView from './components/Auth/LoginView';
import OnboardingView from './components/Auth/OnboardingView';
import SettingsView from './components/Settings/SettingsView';
import TeamsView from './components/Teams/TeamsView';
import ProjectsView from './components/Projects/ProjectsView';
import TemplatesView from './components/Sent/SentView'; 
import { generateDeckContent, generateImage, generateVideo } from './services/geminiService';
import { AIModelId, ChatMessage, Slide, Template } from './types';
import { MockFirebase } from './services/mockFirebase';
import { Zap, Layout, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('devdecks_session'));
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Generator/Editor State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    localStorage.setItem('devdecks_session', 'active');
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    localStorage.setItem('devdecks_session', 'active');
    setIsLoggedIn(true);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('devdecks_session');
    setIsLoggedIn(false);
    setShowOnboarding(false);
    setCurrentView('dashboard');
  };

  const handleOnboardingComplete = () => {
      setShowOnboarding(false);
      setCurrentView('dashboard');
  };

  const handleNewProjectRequest = () => {
    setShowCreateModal(true);
  };

  const startVoraAI = () => {
    setMessages([]);
    setSlides([]);
    setCurrentProjectId(`proj-${Date.now()}`); 
    setShowCreateModal(false);
    setCurrentView('generator');
  };

  const startManualBuilder = () => {
    const initialSlide: Slide = {
        id: `slide-${Date.now()}`,
        title: 'Untitled Slide',
        elements: [
            { id: 'title-1', type: 'text', content: 'Double Click to Edit Title', x: 10, y: 10, w: 80, h: 20, style: { fontSize: 40, fontWeight: 'bold' } }
        ]
    };
    setSlides([initialSlide]);
    setActiveSlideId(initialSlide.id);
    setCurrentProjectId(`proj-${Date.now()}`); 
    setShowCreateModal(false);
    setCurrentView('editor');
    
    MockFirebase.db.createProject({
        id: `proj-${Date.now()}`,
        title: 'Untitled Deck',
        updatedAt: new Date(),
        status: 'Draft',
        thumbnailUrl: '',
        slides: [initialSlide],
        modelPreference: AIModelId.GEMINI_FLASH
    });
  };

  const handleOpenProject = async (id: string) => {
    const projects = await MockFirebase.db.getProjects();
    const proj = projects.find(p => p.id === id);
    if (proj) {
        setSlides(proj.slides && proj.slides.length > 0 ? proj.slides : [
             { id: 's1', title: 'Q3 Review', elements: [{ id: 'e1', type: 'text', content: 'Q3 Financial Review', x: 10, y: 40, w: 80, h: 20, style: { fontSize: 40, fontWeight: 'bold' }}] }
        ]);
        setActiveSlideId(proj.slides?.[0]?.id || 's1');
        setCurrentProjectId(id);
        setCurrentView('editor');
    }
  };

  const handleTemplateSelect = (template: Template) => {
    const newSlides: Slide[] = Array.from({ length: template.slideCount }).map((_, i) => ({
        id: `slide-${i}`,
        title: `${template.title} - Slide ${i + 1}`,
        elements: [
            { id: `t-${i}`, type: 'text', content: `${template.title}: Section ${i + 1}`, x: 10, y: 10, w: 80, h: 10, style: { fontSize: 32, fontWeight: 'bold' } },
            { id: `b-${i}`, type: 'text', content: 'Add your content here...', x: 10, y: 30, w: 80, h: 50, style: { fontSize: 18 } }
        ]
    }));
    setSlides(newSlides);
    setActiveSlideId(newSlides[0].id);
    setCurrentProjectId(`proj-${Date.now()}`); 
    
    MockFirebase.db.createProject({
        id: `proj-${Date.now()}`,
        title: template.title,
        updatedAt: new Date(),
        status: 'Draft',
        thumbnailUrl: '',
        slides: newSlides,
        modelPreference: AIModelId.GEMINI_FLASH
    });

    setCurrentView('editor');
  };

  const handleSendMessage = async (text: string, model: AIModelId, config?: { aspectRatio: string }) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date(), modelId: model };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
        // --- MEDIA GENERATION LOGIC ---
        if (model === AIModelId.GEMINI_IMAGE) {
            // Gemini 3 Pro Image (with optional AR)
            const imageUrl = await generateImage(text, config?.aspectRatio);
            setIsTyping(false);
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: imageUrl ? 'Here is the image I generated for you.' : 'Sorry, I failed to generate the image.',
                timestamp: new Date(),
                modelId: model,
                metadata: imageUrl ? { type: 'image_generated', assetUrl: imageUrl } : undefined
            };
            setMessages(prev => [...prev, botMsg]);
            return;
        }

        if (model === AIModelId.VEO) {
            // Veo (with optional AR)
            const videoUrl = await generateVideo(text, config?.aspectRatio);
            setIsTyping(false);
            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: videoUrl ? 'Here is the video I generated for you.' : 'Sorry, I failed to generate the video.',
                timestamp: new Date(),
                modelId: model,
                metadata: videoUrl ? { type: 'video_generated', assetUrl: videoUrl } : undefined
            };
            setMessages(prev => [...prev, botMsg]);
            return;
        }

        // --- DECK/TEXT GENERATION LOGIC ---
        const context = slides.map(s => s.title).join(', ');
        const response = await generateDeckContent(text, model, context);

        setIsTyping(false);
        
        const botMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            content: response.text, 
            timestamp: new Date(), 
            modelId: model,
            metadata: response.slides && response.slides.length > 0 ? { type: 'deck_generated', slideCount: response.slides.length } : undefined
        };

        setMessages(prev => [...prev, botMsg]);

        if (response.slides && response.slides.length > 0) {
            setSlides(prev => [...prev, ...response.slides!]);
            if (!activeSlideId) setActiveSlideId(response.slides![0].id);
        }

    } catch (e) {
        setIsTyping(false);
        const errorMsg: ChatMessage = { id: Date.now().toString(), role: 'model', content: 'An unexpected error occurred.', timestamp: new Date() };
        setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleSlideUpdate = (id: string, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        title: 'New Slide',
        elements: [
            { id: `title-${Date.now()}`, type: 'text', content: 'New Slide Title', x: 10, y: 10, w: 80, h: 20, style: { fontSize: 40, fontWeight: 'bold' } }
        ]
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  if (!isLoggedIn) return <LoginView onLogin={handleLogin} onSignup={handleSignup} />;

  if (currentView === 'editor') {
      return (
          <>
            <Canvas 
                slides={slides} 
                activeSlideId={activeSlideId} 
                onSlideSelect={setActiveSlideId}
                onUpdateSlide={handleSlideUpdate}
                onAddSlide={handleAddSlide}
                onExit={() => setCurrentView('dashboard')}
            />
          </>
      );
  }

  return (
    <div className="flex h-screen w-screen font-sans p-4 gap-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-950 dark:to-black pointer-events-none"></div>
      
      {showOnboarding && <OnboardingView onComplete={handleOnboardingComplete} />}

      <AnimatePresence>
      {showCreateModal && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
             <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className="glass-card bg-white/90 dark:bg-zinc-900/90 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl relative"
             >
                 <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                     <X size={20} className="text-zinc-500" />
                 </button>
                 
                 <div className="text-center mb-10">
                     <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white mb-2">Create New Deck</h2>
                     <p className="text-zinc-500 dark:text-zinc-400 font-header">Choose how you want to start building.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                     <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startVoraAI} 
                        className="group relative bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-2xl p-6 text-left transition-all"
                    >
                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-500/30">
                             <Zap size={24} />
                         </div>
                         <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-1">Vora AI</h3>
                         <p className="text-xs text-zinc-500 font-header leading-relaxed">Chat with our AI Architect to generate a structured presentation in seconds.</p>
                     </motion.button>

                     <motion.button 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startManualBuilder} 
                        className="group relative bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-2xl p-6 text-left transition-all"
                    >
                         <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 shadow-sm border border-zinc-200 dark:border-zinc-600">
                             <Layout size={24} />
                         </div>
                         <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-1">Manual Builder</h3>
                         <p className="text-xs text-zinc-500 font-header leading-relaxed">Start with a blank canvas and build your deck slide by slide.</p>
                     </motion.button>
                 </div>
             </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 gap-4 h-full relative z-10">
        <TopBar setView={setCurrentView} />
        
        <main className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full"
                >
                    {currentView === 'dashboard' && <div className="h-full overflow-y-auto no-scrollbar"><DashboardView onNewProject={handleNewProjectRequest} onOpenProject={handleOpenProject} /></div>}
                    {currentView === 'projects' && <ProjectsView />}
                    {currentView === 'templates' && <TemplatesView onSelectTemplate={handleTemplateSelect} />}
                    {currentView === 'teams' && <div className="h-full p-2"><TeamsView /></div>}
                    {currentView === 'settings' && <div className="h-full p-2"><SettingsView isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} onLogout={handleLogout} /></div>}
                    {currentView === 'analytics' && <AnalyticsView />}
                    
                    {currentView === 'generator' && (
                        <GeneratorView 
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isTyping={isTyping}
                            generatedSlides={slides}
                            onEditDeck={() => setCurrentView('editor')}
                            onSelectTemplate={handleTemplateSelect}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
