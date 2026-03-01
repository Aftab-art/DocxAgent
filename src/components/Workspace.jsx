import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Send,
    Upload,
    Download,
    Settings2,
    MessageSquare,
    FileCheck,
    Loader2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    LogOut,
    Brain,
    History,
    Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const API_BASE = "http://localhost:8000";

const Workspace = ({ user }) => {
    const [apiKey, setApiKey] = useState("AIzaSyA6ErW5KKyEviPc_tHrGwYBmcNx5pcqZ2o");
    const [model, setModel] = useState("models/gemini-2.0-flash");
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Welcome to DocAgent Pro. I can analyze and modify your Word documents with surgical precision. Upload a file to get started." }
    ]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);
    const [modelOptions, setModelOptions] = useState([
        "models/gemini-2.0-flash",
        "models/gemini-1.5-flash",
        "models/gemini-2.0-pro-exp-02-05"
    ]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [sessionHistory, setSessionHistory] = useState([]);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchHistory = async () => {
        if (!user?.email) return;
        try {
            const resp = await axios.get(`${API_BASE}/history/${user.email}`);
            setSessionHistory(resp.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchHistory();
        }
    }, [user]);

    const loadSession = async (session_uuid) => {
        try {
            const resp = await axios.get(`${API_BASE}/history/session/${session_uuid}`);
            const formattedMessages = resp.data.map(msg => ({
                role: msg.role,
                content: msg.content,
                isAction: msg.change_log ? true : false,
                change_log: msg.change_log,
                download_url: msg.download_url ? `${API_BASE}${msg.download_url}` : null
            }));

            // Re-add welcome message at the top just for context if empty, or just use history
            setMessages(formattedMessages);
            setSessionId(session_uuid);

            // Find if there's a download URL in the latest messages
            const lastDownload = formattedMessages.filter(m => m.download_url).pop();
            setDownloadUrl(lastDownload ? lastDownload.download_url : null);
            setSuggestions([]);
        } catch (error) {
            console.error("Failed to load session:", error);
            setErrorStatus("Failed to restore session context.");
        }
    };

    const startNewWorkspace = () => {
        setSessionId(null);
        setMessages([
            { role: 'assistant', content: "Welcome to DocAgent Pro. I can analyze and modify your Word documents with surgical precision. Upload a file to get started." }
        ]);
        setSuggestions([]);
        setDownloadUrl(null);
        setInput("");
        setErrorStatus(null);
    };

    const fetchModels = async () => {
        setIsSyncing(true);
        setErrorStatus(null);
        try {
            const formData = new FormData();
            formData.append('api_key', apiKey);
            const resp = await axios.post(`${API_BASE}/sync-models`, formData);
            if (resp.data.models) {
                setModelOptions(resp.data.models);
                const best = resp.data.models.find(m => m.includes('gemini-2.0-flash') && !m.includes('exp'))
                    || resp.data.models.find(m => m.includes('gemini-1.5-flash'))
                    || resp.data.models[0];
                if (best) setModel(best);
            }
        } catch (error) {
            console.error(error);
            setErrorStatus("Failed to sync models. Check API key.");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setErrorStatus(null);
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('model', model);
        formData.append('user_email', user.email);

        try {
            const response = await axios.post(`${API_BASE}/upload`, formData);
            setSessionId(response.data.session_id);
            setSuggestions(response.data.suggestions || []);
            const welcomeMsg = response.data.welcome_question || `Success! I've ingested "${file.name}". How can I transform this document for you?`;
            setMessages(prev => [...prev, { role: 'assistant', content: welcomeMsg }]);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.status === 429
                ? "Gemini API Quota Exceeded. Fallback protocols engaged."
                : "Connection failed. Please ensure the backend is running.";
            setErrorStatus(errorMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: `System Error: ${errorMsg}`, isError: true }]);
        } finally {
            setIsAnalyzing(false);
            await fetchHistory();
        }
    };

    const sendMessage = async (text) => {
        const userMsg = text || input;
        if (!userMsg || !sessionId) return;

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        if (!text) setInput("");
        setIsEditing(true);
        setErrorStatus(null);

        try {
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('prompt', userMsg);

            const response = await axios.post(`${API_BASE}/process-doc`, formData);
            const data = response.data;

            if (data.type === 'question') {
                setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
                setSuggestions([]);
            } else if (data.type === 'action') {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.summary,
                    isAction: true,
                    change_log: data.change_log,
                    download_url: `${API_BASE}${data.download_url}`
                }]);
                setDownloadUrl(`${API_BASE}${data.download_url}`);
                if (data.suggestions) setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error(error);
            let errorMsg = "I encountered a processing error. Please check the logs.";
            if (error.response?.status === 429) {
                errorMsg = "Quota Exceeded (429) on all fallback models. Please wait 60 seconds.";
            }
            setErrorStatus(errorMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg, isError: true }]);
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#090a0f] text-slate-200 overflow-hidden selection:bg-primary/30">
            {/* Sidebar */}
            <aside className="w-80 border-r border-white/5 bg-[#0f1118]/40 backdrop-blur-3xl p-8 flex flex-col z-20 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-4 mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-lg opacity-20 animate-pulse" />
                        <div className="relative p-2.5 bg-primary/20 rounded-2xl border border-primary/30 text-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 stroke-[2.5px]" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            DocAgent <span className="text-primary">Pro</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">v15.2 Hybrid</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1 pr-2">
                    <button
                        onClick={startNewWorkspace}
                        className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-primary/5 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        New Workspace
                    </button>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-1">
                            <History className="w-3.5 h-3.5" />
                            Recent Activity
                        </div>

                        <div className="space-y-2">
                            {sessionHistory.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-xs font-medium bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                    No prior sessions found.
                                </div>
                            ) : (
                                sessionHistory.map((session, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => loadSession(session.uuid)}
                                        className={`w-full text-left p-3.5 rounded-2xl transition-all group ${sessionId === session.uuid
                                                ? 'bg-primary/10 border border-primary/20'
                                                : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        <div className={`text-xs font-bold truncate mb-1 ${sessionId === session.uuid ? 'text-primary' : 'text-slate-200 group-hover:text-white'}`}>
                                            {session.title}
                                        </div>
                                        <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500">
                                            {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-auto space-y-3">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-100 disabled:opacity-30 font-bold py-4 rounded-3xl transition-all shadow-xl shadow-white/5 group active:scale-95"
                    >
                        {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />}
                        Upload Doc
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".docx" />
                </div>
            </aside>

            {/* Main Container */}
            <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.08)_0%,_transparent_70%)]">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-12 border-b border-white/5 backdrop-blur-xl z-10 font-['Space_Grotesk']">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                            <Brain className="w-3.5 h-3.5 stroke-[2.5px]" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Live Workspace</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {downloadUrl && (
                            <motion.a
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                href={downloadUrl}
                                className="flex items-center gap-2.5 px-6 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/30 transition-all border border-primary/20"
                                download
                            >
                                <Download className="w-4 h-4" />
                                Download Modified.docx
                            </motion.a>
                        )}
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2.5 rounded-xl border transition-all ${showSettings
                                ? 'bg-primary/20 border-primary/40 text-primary'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Settings2 className="w-5 h-5" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {showSettings && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowSettings(false)}
                                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-24 right-12 w-72 glass-morphism border-white/10 p-6 z-50 shadow-2xl"
                                >
                                    <div className="space-y-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                                                <Brain className="w-8 h-8 text-primary stroke-[2px]" />
                                            </div>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Authenticated</span>
                                            <span className="text-sm font-bold text-white truncate w-full px-2">{user?.email}</span>
                                        </div>

                                        <div className="space-y-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                                            <div className="group">
                                                <label className="block text-[10px] font-bold mb-1.5 ml-1 text-slate-500 group-focus-within:text-primary transition-colors">API Key</label>
                                                <input
                                                    type="password"
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                    className="w-full bg-[#0f1118] border border-white/10 rounded-2xl py-3 px-4 text-xs font-mono outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                                                    placeholder="Enter Gemini Key..."
                                                />
                                            </div>

                                            <div className="group">
                                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                                    <label className="block text-[10px] font-bold text-slate-500 group-focus-within:text-primary transition-colors">Neural Model</label>
                                                    <button
                                                        onClick={fetchModels}
                                                        disabled={isSyncing}
                                                        className="text-[9px] font-black uppercase text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {isSyncing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                                                        Sync
                                                    </button>
                                                </div>
                                                <select
                                                    value={model}
                                                    onChange={(e) => setModel(e.target.value)}
                                                    className="w-full bg-[#0f1118] border border-white/10 rounded-2xl py-3 px-4 text-xs outline-none focus:border-primary/50 appearance-none cursor-pointer transition-all"
                                                >
                                                    {modelOptions.map((opt) => (
                                                        <option key={opt} value={opt} className="bg-[#0f1118]">{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <button
                                            onClick={() => signOut(auth)}
                                            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all group"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Terminate Session
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </header>

                {/* Conversation Area */}
                <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 scroll-smooth no-scrollbar">
                    <AnimatePresence mode='popLayout'>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] p-6 rounded-[2.5rem] ${msg.role === 'user'
                                    ? 'chat-bubble-user rounded-tr-none'
                                    : msg.isError
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-tl-none'
                                        : 'glass-morphism rounded-tl-none border-white/5'
                                    }`}>
                                    <div className="flex items-center gap-2.5 mb-2">
                                        {msg.role === 'assistant' && (
                                            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary flex items-center justify-center">
                                                <Brain className="w-3.5 h-3.5 stroke-[2.5px]" />
                                            </div>
                                        )}
                                        <span className="text-[9px] uppercase font-black tracking-widest opacity-40">
                                            {msg.role === 'user' ? 'Human Operator' : 'Agent Protocol'}
                                        </span>
                                    </div>
                                    <div className="text-[15px] leading-relaxed font-medium">
                                        {msg.isAction && <div className="flex items-center gap-2 mb-2 text-xs text-primary bg-primary/10 w-fit px-3 py-1 rounded-full"><FileCheck className="w-3.5 h-3.5" /> Core Modification Applied</div>}
                                        {msg.content}

                                        {msg.change_log && msg.change_log.length > 0 && (
                                            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Change Log</p>
                                                <ul className="space-y-1.5">
                                                    {msg.change_log.map((change, idx) => (
                                                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                                            {change}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {msg.download_url && (
                                            <a
                                                href={msg.download_url}
                                                download
                                                className="mt-4 flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg shadow-white/5"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Result
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(isAnalyzing || isEditing) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-start"
                        >
                            <div className="glass-morphism rounded-[2rem] p-5 flex items-center gap-4 border-white/5 pr-8">
                                <div className="flex items-center justify-center p-2 bg-primary/10 rounded-xl relative">
                                    <div className="absolute inset-0 bg-primary blur rounded-xl opacity-30 animate-pulse" />
                                    <Loader2 className="w-4 h-4 animate-spin text-primary relative" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Processing</span>
                                    <span className="text-xs font-medium text-slate-400">Agent is thinking...</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} className="h-20" />
                </div>

                {/* Input Dock */}
                <div className="p-10 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/90 to-transparent">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 justify-center mb-2">
                                {suggestions.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => sendMessage(s)}
                                        className="text-[11px] font-bold py-2 px-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15 transition-all text-slate-400 hover:text-white"
                                    >
                                        {s}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center gap-3">
                                <div className="flex-1 glass-morphism rounded-[2.5rem] flex items-center px-8 border-white/10 focus-within:border-primary/40 transition-all shadow-2xl">
                                    <MessageSquare className="w-5 h-5 text-slate-500 mr-4" />
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder={sessionId ? "Instruct the agent to edit..." : "Upload a .docx to begin session"}
                                        disabled={!sessionId || isEditing}
                                        className="w-full bg-transparent py-6 text-sm font-medium outline-none placeholder:text-slate-600"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!sessionId || isEditing || !input}
                                        className="p-3 bg-white text-black rounded-2xl disabled:bg-slate-800 disabled:text-slate-600 transition-all hover:scale-110 shadow-lg active:scale-95"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {errorStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full backdrop-blur-xl"
                                >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errorStatus}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Workspace;
