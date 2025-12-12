
import React, { useState } from 'react';
import { ArrowRight, User, Briefcase, Layers, Check } from 'lucide-react';
import { MockFirebase } from '../../services/mockFirebase';

interface OnboardingProps {
    onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [workspace, setWorkspace] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            await MockFirebase.auth.updateProfile({ name, role: role as any, workspaceName: workspace });
            setTimeout(() => {
                setLoading(false);
                onComplete();
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center z-50 transition-colors">
             <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-10 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1.5 bg-zinc-100 dark:bg-zinc-800 w-full">
                    <div 
                        className="h-full bg-primary-500 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="mt-6 mb-8 text-center">
                    <div className="w-14 h-14 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 font-display font-medium tracking-[-0.04em] text-xl mx-auto mb-6 shadow-lg">
                        D
                    </div>
                    <h2 className="text-2xl font-display font-medium tracking-[-0.04em] text-zinc-900 dark:text-white mb-2">
                        {step === 1 && "Let's set up your profile"}
                        {step === 2 && "What is your role?"}
                        {step === 3 && "Name your Devspace"}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 font-header text-sm">
                        {step === 1 && "How should we address you in the workspace?"}
                        {step === 2 && "This helps us tailor the AI tools for you."}
                        {step === 3 && "Create a shared environment for your team."}
                    </p>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <label className="block text-xs font-bold font-header uppercase text-zinc-400 mb-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-zinc-900 dark:text-white"
                                    placeholder="e.g. Alex Designer"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            {['Designer', 'Analyst', 'Marketer', 'Founder'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`p-4 rounded-xl border text-left transition-all ${
                                        role === r 
                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' 
                                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                    }`}
                                >
                                    <span className={`block text-sm font-bold font-display tracking-[-0.04em] ${role === r ? 'text-primary-700 dark:text-primary-400' : 'text-zinc-700 dark:text-zinc-300'}`}>{r}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <label className="block text-xs font-bold font-header uppercase text-zinc-400 mb-2">Workspace Name</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={workspace}
                                    onChange={(e) => setWorkspace(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-zinc-900 dark:text-white"
                                    placeholder="e.g. Acme Creative"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleNext}
                        disabled={(step === 1 && !name) || (step === 2 && !role) || (step === 3 && !workspace) || loading}
                        className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-bold font-header hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? 'Setting up...' : step === 3 ? 'Finish' : 'Continue'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </div>
             </div>
        </div>
    );
};

export default OnboardingView;
