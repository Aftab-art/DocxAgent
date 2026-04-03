import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, Brain, ArrowLeft, CheckCircle2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const AIInterviewer = ({ user, apiKey, model, templateId, initialData, firstReply, onComplete, onBack }) => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: firstReply || `Thanks for the details, ${initialData?.basics?.name || 'there'}! I've analyzed your initial profile. Now, I'll ask a few clarifying questions to optimize your resume for ATS and highlight your best achievements. Ready?` 
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/resume-interview`, {
                message: userMsg,
                history: messages,
                api_key: apiKey,
                model: model,
                user_email: user.email,
                template_id: templateId,
                initial_data: initialData
            });

            const data = response.data;
            
            if (data.status === 'complete') {
                setIsFinishing(true);
                setMessages(prev => [...prev, { role: 'assistant', content: "Perfect! I've gathered all the information I need. I'm now generating your ATS-optimized resume profile..." }]);
                setTimeout(() => {
                    onComplete(data.resume_json);
                }, 2000);
            } else if (data.status === 'error_quota') {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (error) {
            console.error("Interview error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to the AI brain right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col glass-morphism border-white/10 rounded-[2.5rem] overflow-hidden relative">
            {/* Header */}
            <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h4 className="text-lg font-bold">AI Interviewer</h4>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Session</span>
                        </div>
                    </div>
                </div>
                <div className="p-2.5 bg-primary/20 rounded-2xl border border-primary/30 text-primary">
                    <Brain className="w-5 h-5 stroke-[2.5px]" />
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-10 py-8 space-y-6 no-scrollbar">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30 ml-auto' : 'bg-white/5 border border-white/5'}`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coaching...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-[#090a0f]/50 backdrop-blur-xl border-t border-white/5">
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Tell me about your experience..."
                        disabled={isLoading || isFinishing}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary/50 transition-all text-sm"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading || isFinishing}
                        className="absolute right-2 p-3 bg-white text-black rounded-xl hover:scale-105 transition-all disabled:opacity-20"
                    >
                        {isFinishing ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gemini Pro is analyzing your answers for ATS keywords</span>
                </div>
            </div>
        </div>
    );
};

export default AIInterviewer;
