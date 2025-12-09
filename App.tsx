
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import SentView from './components/Sent/SentView';
import { generateDeckContent } from './services/geminiService';
import { AIModelId, ChatMessage, Slide, Template } from './types';
import { MockFirebase } from './services/mockFirebase';
import { Zap, Layout, X } from 'lucide-react';

function App() {
  // Lazy initialization checks localStorage BEFORE the first render.
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('devdecks_session'));
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for Generator/Editor
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Project State for Persistence
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
    setCurrentProjectId(`proj-${Date.now()}`); // Generate ID
    setShowCreateModal(false);
    setCurrentView('generator');
  };

  const startManualBuilder = () => {
    const initialSlide: Slide = {
        id: `slide-${Date.now()}`,
        title: 'Untitled Slide',
        elements: [
            { id: 'title-1', type: 'text', content: 'Double Click to Edit Title', x: 10, y: 10, w: 80, h: 20, style: { fontSize: '40px', fontWeight: 'bold' } }
        ]
    };
    setSlides([initialSlide]);
    setActiveSlideId(initialSlide.id);
    setCurrentProjectId(`proj-${Date.now()}`); // Generate ID
    setShowCreateModal(false);
    setCurrentView('editor');
    
    // Create initial project in DB
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
    // In real app, fetch from Firestore here
    const projects = await MockFirebase.db.getProjects();
    const proj = projects.find(p => p.id === id);
    if (proj) {
        setSlides(proj.slides && proj.slides.length > 0 ? proj.slides : [
             { id: 's1', title: 'Q3 Review', elements: [{ id: 'e1', type: 'text', content: 'Q3 Financial Review', x: 10, y: 40, w: 80, h: 20, style: { fontSize: '40px', fontWeight: 'bold' }}] }
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
            { id: `t-${i}`, type: 'text', content: `${template.title}: Section ${i + 1}`, x: 10, y: 10, w: 80, h: 10, style: { fontSize: '32px', fontWeight: 'bold' } },
            { id: `b-${i}`, type: 'text', content: 'Add your content here...', x: 10, y: 30, w: 80, h: 50, style: { fontSize: '18px' } }
        ]
    }));
    setSlides(newSlides);
    setActiveSlideId(newSlides[0].id);
    setCurrentProjectId(`proj-${Date.now()}`); // Generate ID
    setCurrentView('editor');
  };

  const handleSendMessage = async (text: string, model: AIModelId) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date(), modelId: model };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

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
  };

  const handleSlideUpdate = (id: string, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        title: 'New Slide',
        elements: [
            { id: `title-${Date.now()}`, type: 'text', content: 'New Slide Title', x: 10, y: 10, w: 80, h: 20, style: { fontSize: '40px', fontWeight: 'bold' } }
        ]
    };
    setSlides(prev => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  if (!isLoggedIn) return <LoginView onLogin={handleLogin} onSignup={handleSignup} />;

  // Full Screen Editor Mode
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl border border-zinc-200 dark:border-zinc-700 relative">
                 <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                     <X size={20} className="text-zinc-500" />
                 </button>
                 
                 <div className="text-center mb-10">
                     <h2 className="text-3xl font-display font-bold text-zinc-900 dark:text-white mb-2">Create New Deck</h2>
                     <p className="text-zinc-500 dark:text-zinc-400 font-header">Choose how you want to start building.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                     <button onClick={startVoraAI} className="group relative bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent hover:border-primary-500 dark:hover:border-primary-500 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:-translate-y-1">
                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-500/30">
                             <Zap size={24} />
                         </div>
                         <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-1">Vora AI</h3>
                         <p className="text-xs text-zinc-500 font-header leading-relaxed">Chat with our AI Architect to generate a structured presentation in seconds.</p>
                     </button>

                     <button onClick={startManualBuilder} className="group relative bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:-translate-y-1">
                         <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-900 dark:text-white mb-4 shadow-sm border border-zinc-200 dark:border-zinc-600">
                             <Layout size={24} />
                         </div>
                         <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-white mb-1">Manual Builder</h3>
                         <p className="text-xs text-zinc-500 font-header leading-relaxed">Start with a blank canvas and build your deck slide by slide.</p>
                     </button>
                 </div>
             </div>
        </div>
      )}

      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 gap-4 h-full relative z-10">
        <TopBar />
        
        <main className="flex-1 relative overflow-hidden">
          {currentView === 'dashboard' && <div className="h-full overflow-y-auto no-scrollbar"><DashboardView onNewProject={handleNewProjectRequest} onOpenProject={handleOpenProject} /></div>}
          {currentView === 'projects' && <ProjectsView />}
          {currentView === 'sent' && <SentView />}
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
        </main>
      </div>
    </div>
  );
}

export default App;
