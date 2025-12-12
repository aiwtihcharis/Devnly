import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Sparkles, User, ArrowLeft } from 'lucide-react';
import { MockFirebase } from '../../services/mockFirebase';
import { motion } from 'framer-motion';

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
            // Updated to pass password to the service (even if Mock ignores it)
            await MockFirebase.auth.signup(email, password, name);
            setTimeout(() => {
                setLoading(false);
                onSignup();
            }, 600);
        } else {
            // Updated to pass password
            await MockFirebase.auth.login(email, password);
            setTimeout(() => {
                setLoading(false);
                onLogin();
            }, 600);
        }
    } catch (error) {
        console.error("Auth error:", error);
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-100 dark:bg-black p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-3xl"
      ></motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10">
            <div className="flex justify-center mb-8">
                <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-black dark:from-white dark:to-zinc-200 rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl transform -rotate-3 border border-white/20"
                >
                    <span className="font-display font-medium tracking-[-0.04em] text-2xl">D</span>
                </motion.div>
            </div>

            <div className="text-center mb-10">
                <h1 className="font-display font-medium tracking-[-0.04em] text-3xl text-zinc-900 dark:text-white mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-header">
                    {isSignUp ? 'Join Devdecks to start building.' : 'Enter your credentials to access Devdecks.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5"
                    >
                        <label className="text-xs font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider ml-1 font-header">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                required={isSignUp}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 backdrop-blur-sm"
                                placeholder="Alex Designer"
                            />
                        </div>
                    </motion.div>
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
                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 backdrop-blur-sm"
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
                            className="w-full bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-11 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-sans text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 backdrop-blur-sm"
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

                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold font-header py-4 rounded-xl shadow-lg shadow-zinc-900/10 dark:shadow-white/10 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin"></div>
                    ) : (
                        <>
                        {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                        </>
                    )}
                </motion.button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-4">
                 <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-center text-sm font-header font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                 >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                 </button>

                 {!isSignUp && (
                    <button className="w-full flex items-center justify-center gap-3 bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:bg-white/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold py-3.5 rounded-xl transition-all text-sm font-header backdrop-blur-sm">
                        <Sparkles size={16} className="text-primary-500" />
                        Sign in with SSO
                    </button>
                 )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;