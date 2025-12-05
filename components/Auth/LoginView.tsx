import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Sparkles, User, ArrowLeft } from 'lucide-react';
import { MockFirebase } from '../../services/mockFirebase';

interface LoginViewProps {
  onLogin: () => void;
  onSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignup }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        if (isSignUp) {
            await MockFirebase.auth.signup(email, name);
            // Simulate delay for effect
            setTimeout(() => {
                setLoading(false);
                onSignup();
            }, 1000);
        } else {
            await MockFirebase.auth.login(email);
            setTimeout(() => {
                setLoading(false);
                onLogin();
            }, 1000);
        }
    } catch (error) {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 relative overflow-hidden transition-colors">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-full -mr-8 -mt-8 z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-tr-full -ml-8 -mb-8 z-0"></div>

        <div className="relative z-10 animate-fade-in">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="font-display font-bold text-2xl">D</span>
                </div>
            </div>

            <div className="text-center mb-10">
                <h1 className="font-display font-bold text-3xl text-zinc-900 dark:text-white mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-header">
                    {isSignUp ? 'Join Devdecks to start building.' : 'Enter your credentials to access Devdecks.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                    <div className="space-y-1.5 animate-slide-up">
                        <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider ml-1 font-header">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                required={isSignUp}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
                                placeholder="Alex Designer"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider ml-1 font-header">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            placeholder="name@agency.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider ml-1 font-header">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {!isSignUp && (
                    <div className="flex items-center justify-between text-xs font-medium pt-2 font-header">
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">
                            <input type="checkbox" className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500" />
                            Remember me
                        </label>
                        <button type="button" className="text-primary-600 hover:text-primary-700">Forgot password?</button>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold font-header py-4 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-white/10 hover:shadow-zinc-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin"></div>
                    ) : (
                        <>
                        {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                 <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-center text-sm font-header font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                 >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                 </button>

                 {!isSignUp && (
                    <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold py-3.5 rounded-xl transition-all text-sm font-header">
                        <Sparkles size={16} className="text-primary-500" />
                        Sign in with SSO
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;