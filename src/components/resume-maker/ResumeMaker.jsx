import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TemplateGallery from './TemplateGallery';
import ResumeForm from './ResumeForm';
import AIInterviewer from './AIInterviewer';
import ResumePreview from './ResumePreview';
import OptimizationLoading from './OptimizationLoading';
import { Sparkles, Layout, MessageSquare, Eye, Cpu, ChevronDown, Zap, AlertCircle } from 'lucide-react';

import { GEMINI_MODELS } from '../../constants/models';
import { API_BASE } from '../../config';


const ResumeMaker = ({ user, apiKey, model, setModel }) => {
    const [step, setStep] = useState('gallery'); // 'gallery', 'form', 'interview', 'preview'
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [initialFormData, setInitialFormData] = useState(null);
    const [aiFirstReply, setAiFirstReply] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState(null);


    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setStep('form');
    };

    const handleSkipOptimization = () => {
        console.log("DEBUG: Skipping optimization, using raw form data.");
        // Manual mapping from Form Data to Resume Schema
        const rawResume = {
            basics: initialFormData.basics,
            work: initialFormData.work,
            education: initialFormData.education,
            skills: initialFormData.skills,
            certificates: [] // Default empty
        };
        setResumeData(rawResume);
        setStep('preview');
        setIsValidating(false);
        setError(null);
    };

    const handleFormComplete = async (formData) => {
        console.log("DEBUG: handleFormComplete started", formData);
        setInitialFormData(formData);
        setIsValidating(true);
        setError(null);
        let wasQuotaError = false;

        try {
            console.log("DEBUG: Sending optimization request to:", `${API_BASE}/resume-interview`);
            const response = await axios.post(`${API_BASE}/resume-interview`, {
                message: "Optimize my resume based on the profile provided. Use your 'Dynamic Analysis Protocol' to decide if you can generate it now or if you need to ask a follow-up question for maximum impact.",
                history: [],
                api_key: apiKey,
                model: model,
                user_email: user.email,
                template_id: selectedTemplate?.id,
                initial_data: formData
            });

            console.log("DEBUG: Optimization Response:", response.data);

            if (response.data.status === 'complete') {
                console.log("DEBUG: AI complete, moving to preview");
                setResumeData(response.data.resume_json);
                setStep('preview');
            } else if (response.data.status === 'interviewing') {
                console.log("DEBUG: AI needs more info, moving to interview");
                setAiFirstReply(response.data.reply);
                setStep('interview');
            } else if (response.data.status === 'error_quota') {
                console.warn("DEBUG: Quota limit reached despite fallbacks.");
                setError("GEMINI_QUOTA");
                wasQuotaError = true;
            } else {
                console.log("DEBUG: Optimization returned unknown status, bypassing to preview with raw data");
                // Even if Gemini tried to talk back, we force it to show what it gave us or raw data
                if (response.data.resume_json) {
                    setResumeData(response.data.resume_json);
                    setStep('preview');
                } else {
                    handleSkipOptimization();
                }
            }
        } catch (err) {
            console.error("DEBUG: Optimization Error Catch:", err);
            setError("GE_API_ERROR");
        } finally {
            console.log("DEBUG: handleFormComplete request finished");
            if (!wasQuotaError) {
                setIsValidating(false);
            }
        }
    };




    const handleInterviewComplete = (data) => {
        setResumeData(data);
        setStep('preview');
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                {/* Step Progress */}
                <div className="flex items-center justify-center gap-4">
                    {[
                        { id: 'gallery', label: 'Template', icon: Layout },
                        { id: 'form', label: 'Basics', icon: Sparkles },
                        { id: 'preview', label: 'Ready', icon: Eye }
                    ].map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === s.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}>
                                <s.icon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
                            </div>
                            {idx < 2 && <div className="hidden sm:block w-8 h-px bg-white/5" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Model Selector */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Cpu className="w-4 h-4 text-primary" />
                    </div>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="appearance-none bg-white/5 border border-white/10 hover:border-primary/50 rounded-2xl pl-12 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 outline-none transition-all cursor-pointer min-w-[240px]"
                    >
                        <option value="models/gemini-2.0-flash" className="bg-slate-900">AI Engine: Auto</option>
                        {GEMINI_MODELS.map((group, gIdx) => (
                            <optgroup key={gIdx} label={group.group} className="bg-slate-900 text-slate-500 font-bold">
                                {group.models.map((m) => (
                                    <option key={m.id} value={m.id} className="bg-slate-900 text-white font-medium">{m.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {step === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full overflow-y-auto no-scrollbar"
                        >
                            <TemplateGallery onSelect={handleTemplateSelect} />
                        </motion.div>
                    )}
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full overflow-y-auto no-scrollbar"
                        >
                            {isValidating ? (
                                error === "GEMINI_QUOTA" ? (
                                    <div className="h-full flex items-center justify-center p-6">
                                        <div className="w-full max-w-lg bg-[#0f111a] border border-red-500/20 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full -m-20" />
                                            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 relative">
                                                <Zap className="w-10 h-10 text-red-500 animate-pulse" />
                                            </div>
                                            <div className="space-y-2 relative">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Quota Limit Reached</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                    Gemini has reached its daily or per-minute limit on the free tier. 
                                                    <span className="block mt-2 text-primary font-bold">This usually resets in 60 seconds or at midnight.</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-3 relative">
                                                <button 
                                                    onClick={() => {
                                                        setError(null);
                                                        handleFormComplete(initialFormData);
                                                    }}
                                                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    <Zap className="w-4 h-4 text-yellow-400 group-hover:animate-bounce" />
                                                    Retry Now
                                                </button>
                                                <button 
                                                    onClick={handleSkipOptimization}
                                                    className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                >
                                                    Skip AI & Use Raw Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : error === "GE_API_ERROR" ? (
                                    <div className="h-full flex items-center justify-center p-6">
                                        <div className="w-full max-w-lg bg-[#0f111a] border border-red-500/20 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full -m-20" />
                                            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 relative">
                                                <AlertCircle className="w-10 h-10 text-red-500" />
                                            </div>
                                            <div className="space-y-2 relative">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Connection Error</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                    We couldn't reach the AI Engine. This often happens if the server is waking up from a cold start.
                                                    <span className="block mt-2 text-primary font-bold">Please wait 60 seconds and try again.</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-3 relative">
                                                <button 
                                                    onClick={() => {
                                                        setError(null);
                                                        handleFormComplete(initialFormData);
                                                    }}
                                                    className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                                >
                                                    Retry Optimization
                                                </button>
                                                <button 
                                                    onClick={handleSkipOptimization}
                                                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 transition-all"
                                                >
                                                    Skip AI & Use Raw Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center gap-8">
                                        <OptimizationLoading />
                                        <button 
                                            onClick={handleSkipOptimization}
                                            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all"
                                        >
                                            Skip AI & Use Raw Data
                                        </button>
                                    </div>
                                )

                            ) : (
                                <ResumeForm onComplete={handleFormComplete} onBack={() => setStep('gallery')} />
                            )}
                        </motion.div>
                    )}

                    {step === 'interview' && (
                        <motion.div
                            key="interview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            <AIInterviewer 
                                user={user} 
                                apiKey={apiKey} 
                                model={model} 
                                templateId={selectedTemplate?.id}
                                initialData={initialFormData}
                                firstReply={aiFirstReply}
                                onComplete={handleInterviewComplete}
                                onBack={() => setStep('form')}
                            />
                        </motion.div>
                    )}
                    {step === 'preview' && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full"
                        >
                            <ResumePreview 
                                data={resumeData} 
                                template={selectedTemplate} 
                                onBack={() => setStep('interview')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResumeMaker;
