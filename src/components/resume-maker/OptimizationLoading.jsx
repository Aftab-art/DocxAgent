import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Cpu, Zap, ShieldCheck, Search } from 'lucide-react';

const STEPS = [
    { id: 1, icon: Search, text: "Analyzing your career profile...", color: "text-blue-400" },
    { id: 2, icon: Cpu, text: "Injecting high-impact action verbs...", color: "text-purple-400" },
    { id: 3, icon: Zap, text: "Optimizing for ATS algorithms...", color: "text-yellow-400" },
    { id: 4, icon: ShieldCheck, text: "Quantifying professional results...", color: "text-emerald-400" },
    { id: 5, icon: Sparkles, text: "Polishing for final presentation...", color: "text-primary" },
];

const OptimizationLoading = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % STEPS.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#090a0f]/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -mr-32 -mt-32 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] -ml-32 -mb-32" />

                <div className="relative z-10 flex flex-col items-center text-center gap-8">
                    {/* Animated Icon */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping" />
                        <div className="w-24 h-24 bg-gradient-to-tr from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Sparkles className="w-12 h-12 text-white animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                            Gemini <span className="text-primary">Optimizing</span>
                        </h3>
                        <p className="text-slate-400 text-sm font-medium tracking-wide">
                            Our AI is transforming your raw data into a professional masterpiece.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="w-full space-y-4 text-left">
                        {STEPS.map((step, idx) => {
                            const isPast = idx < currentStep;
                            const isActive = idx === currentStep;

                            return (
                                <motion.div 
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ 
                                        opacity: isPast || isActive ? 1 : 0.3,
                                        x: 0,
                                        scale: isActive ? 1.02 : 1
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                        isActive ? 'bg-white/5 border-white/10 shadow-lg' : 'border-transparent'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/20' : 'bg-transparent'}`}>
                                        {isPast ? (
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <step.icon className={`w-5 h-5 ${isActive ? step.color : 'text-slate-600'}`} />
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                        {step.text}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto flex gap-1">
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <motion.div 
                            className="bg-primary h-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizationLoading;
