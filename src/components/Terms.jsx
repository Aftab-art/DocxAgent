import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#090a0f] text-slate-300 font-['Inter'] selection:bg-primary/30">
            <nav className="fixed top-0 w-full z-50 px-12 py-6 flex justify-between items-center backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                        <Brain className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <span className="font-bold tracking-tight text-white">DocAgent Pro</span>
                </div>
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                </button>
            </nav>

            <main className="max-w-4xl mx-auto pt-32 pb-20 px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Terms of Service</h1>
                        <p className="text-slate-500 max-w-lg mx-auto">Last updated: March 1, 2026</p>
                    </div>

                    <section className="space-y-8 glass-morphism p-12 rounded-[2.5rem] border border-white/5 leading-relaxed">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
                            <p>By accessing and using DocAgent Pro, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">2. AI-Powered Processing</h2>
                            <p>DocAgent Pro utilizes Google Gemini API for document analysis and modification. While we strive for "surgical precision", you acknowledge that AI-generated content may require human oversight. We do not guarantee 100% accuracy for complex formatting changes.</p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">3. Data Privacy</h2>
                            <p>Your documents are processed in a temporary session environment. We do not permanently store your intellectual property unless specified via the export/download functions. All sessions are automatically purged after 24 hours of inactivity.</p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">4. API Key Usage</h2>
                            <p>Users providing their own Gemini API keys are responsible for all usage associated with those keys. DocAgent Pro is not liable for any costs or quota limitations incurred on the user's personal API account.</p>
                        </div>
                    </section>
                </motion.div>
            </main>
        </div>
    );
};

export default Terms;
