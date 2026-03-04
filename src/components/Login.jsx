import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome, AlertCircle, Loader2, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/workspace');
        } catch (err) {
            console.error(err);
            let msg = "An authentication error occurred.";
            if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
            if (err.code === 'auth/wrong-password') msg = "Invalid password.";
            if (err.code === 'auth/email-already-in-use') msg = "This email is already registered.";
            if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (providerName) => {
        setError(null);
        setLoading(true);
        const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/workspace');
        } catch (err) {
            console.error(err);
            setError(`Failed to sign in with ${providerName}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-6 selection:bg-primary/30">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-morphism p-10 rounded-[2.5rem] border border-white/5 relative z-10 space-y-8"
            >
                <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                            <Brain className="w-5 h-5 stroke-[2.5px]" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Word Engine</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isSignUp ? 'Join the neural document architecture' : 'Sign in to resume surgical document editing'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-[0.98] shadow-xl shadow-white/5 mt-6 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                {isSignUp ? 'Initialize Account' : 'Sign In Now'} <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="bg-[#0f1118]/80 px-4 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleSocialSignIn('google')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        <Chrome className="w-4 h-4" /> <span className="text-xs font-bold">Google</span>
                    </button>
                    <button
                        onClick={() => handleSocialSignIn('github')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        <Github className="w-4 h-4" /> <span className="text-xs font-bold">GitHub</span>
                    </button>
                </div>

                <p className="text-center text-xs text-slate-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary hover:underline font-bold ml-1"
                    >
                        {isSignUp ? 'Sign In' : 'Start Trial'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
