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
    Plus,
    ChevronRight,
    Shield,
    User,
    X,
    Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import DocMap from './DocMap';
import ReviewSidebar from './ReviewSidebar';
import Profile from './Profile';
import ComparisonSummary from './ComparisonSummary';
import AdvancedReviewEditor from './AdvancedReviewEditor';

const API_BASE = import.meta.env.VITE_API_BASE ||
    (window.location.hostname.includes('vercel.app')
        ? "https://docxagent-backend-1.onrender.com"
        : "http://localhost:8000");

const Workspace = ({ user }) => {
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("models/gemini-2.0-flash");
    const [view, setView] = useState('chat'); // 'chat' or 'profile'
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Welcome to Word Engine. I've been upgraded with Map-and-Snippet logic for high fidelity edits. Upload a file to see the document map." }
    ]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [sessionHistory, setSessionHistory] = useState([]);

    // Word Engine States
    const [docMap, setDocMap] = useState([]);
    const [activeElementId, setActiveElementId] = useState(null);
    const [stagedEdit, setStagedEdit] = useState(null);
    const [showFullReview, setShowFullReview] = useState(false);
    const [isCommitting, setIsCommitting] = useState(false);

    useEffect(() => {
        const handleOpenReview = () => setShowFullReview(true);
        window.addEventListener('open-review', handleOpenReview);
        return () => window.removeEventListener('open-review', handleOpenReview);
    }, []);
    const [comparisonStats, setComparisonStats] = useState(null);
    const [docBlob, setDocBlob] = useState(null);
    const [showFullPreview, setShowFullPreview] = useState(false);

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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startNewWorkspace = () => {
        setSessionId(null);
        setMessages([
            { role: 'assistant', content: "Welcome to Word Engine. I've been upgraded with Map-and-Snippet logic for high fidelity edits. Upload a file to see the document map." }
        ]);
        setSuggestions([]);
        setDownloadUrl(null);
        setInput("");
        setErrorStatus(null);
        setDocMap([]);
        setStagedEdit(null);
        setView('chat');
    };

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
            setDocMap(response.data.doc_map || []);
            const welcomeMsg = response.data.welcome_question || `Success! I've indexed "${file.name}". I have the document map ready.`;
            setMessages(prev => [...prev, { role: 'assistant', content: welcomeMsg }]);
            setView('chat');
            // Fetch initial blob for preview
            fetchDocBlob(response.data.session_id);
        } catch (error) {
            console.error("DEBUG: Upload failed. API_BASE is:", API_BASE);
            console.error("DEBUG: Error details:", error);
            const msg = error.response?.data?.detail || error.message || "Upload failed.";
            setErrorStatus(msg);
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
            if (apiKey) formData.append('api_key', apiKey);
            formData.append('model', model);

            const response = await axios.post(`${API_BASE}/process-doc`, formData);
            const data = response.data;
            if (!data) {
                setErrorStatus("Server returned empty response.");
                return;
            }

            if (data.type === 'question') {
                setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
            } else if (data.type === 'action') {
                // New structured Review data
                if (data.review) {
                    setStagedEdit(data.review);
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `I've prepared a structural edit for the section "${data.review.element_id}".`,
                        isReview: true,
                        reviewData: data.review
                    }]);
                    // Refresh blob but DON'T show automatically
                    fetchDocBlob(sessionId);
                } else {
                    setStagedEdit(data);
                    setShowFullReview(true);
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `I've prepared a structural edit: ${data.summary}. Please review it in the sidebar.`,
                        isStaged: true
                    }]);
                }
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.detail || "Processing error.";

            if (error.response?.status === 429 || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("exhausted")) {
                setErrorStatus("AI Quota Exhausted. Please wait a minute or upgrade your plan.");
            } else {
                setErrorStatus(msg);
            }
        } finally {
            setIsEditing(false);
        }
    };

    const handleRejectEdit = async (elementId) => {
        if (!sessionId || !stagedEdit) return;
        setIsEditing(true);
        try {
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('element_id', elementId);
            formData.append('original_xml', stagedEdit.original_xml);

            await axios.post(`${API_BASE}/revert-edit`, formData);

            setMessages(prev => [...prev, { role: 'assistant', content: `Change for section ${elementId} rejected and reverted.` }]);
            setStagedEdit(null);
            setShowFullReview(false);
            // Refresh preview after rejection to show original state
            fetchDocBlob(sessionId);
        } catch (error) {
            console.error(error);
            setErrorStatus("Revert failed.");
        } finally {
            setIsEditing(false);
        }
    };

    const handleManualEdit = async (elementId, newText) => {
        setIsEditing(true);
        try {
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('prompt', `Apply this manual edit to section ${elementId}: ${newText}`);
            if (apiKey) formData.append('api_key', apiKey);
            formData.append('model', model);

            const response = await axios.post(`${API_BASE}/process-doc`, formData);
            const data = response.data;

            if (data.review) {
                setStagedEdit(data.review);
                // Refresh preview to show manual edit
                fetchDocBlob(sessionId);
            }
            setMessages(prev => [...prev, { role: 'assistant', content: `Manual edit applied to ${elementId}.` }]);
        } catch (error) {
            setErrorStatus("Manual edit failed.");
        } finally {
            setIsEditing(false);
        }
    };

    const handleAcceptEdit = async () => {
        if (!sessionId) return;
        setIsCommitting(true);
        setComparisonStats(null);
        try {
            // Step 1: Commit edits to the document buffer
            const commitFormData = new FormData();
            commitFormData.append('session_id', sessionId);
            await axios.post(`${API_BASE}/commit-edits`, commitFormData);

            // Step 2: Get comparison summary (stats + tracked file)
            const resp = await axios.get(`${API_BASE}/compare-summary/${sessionId}`);
            setComparisonStats(resp.data);

            setDownloadUrl(`${API_BASE}/download/${sessionId}`);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Comparison complete. Edits have been committed with native tracked changes. Review the summary below.",
                isComparison: true,
                stats: resp.data
            }]);
            setStagedEdit(null);
            setShowFullReview(false);
            // Refresh preview after commit
            fetchDocBlob(sessionId);
        } catch (error) {
            setErrorStatus("Commit failed.");
        } finally {
            setIsCommitting(false);
        }
    };

    const loadSession = async (uuid) => {
        setIsSyncing(true);
        setErrorStatus(null);
        try {
            const resp = await axios.get(`${API_BASE}/session/${uuid}`);
            const data = resp.data;
            setSessionId(data.session_id);
            setDocMap(data.doc_map || []);
            // Prioritize local credentials that the user just entered
            if (!apiKey) setApiKey(data.api_key || "");
            if (!model) setModel(data.model || "models/gemini-2.0-flash");
            setMessages(data.history || []);
            setStagedEdit(null);
            setDownloadUrl(null);
            setView('chat');
            // Fetch blob for preview
            fetchDocBlob(data.session_id);
        } catch (error) {
            console.error("Failed to load session:", error);
            setErrorStatus("Failed to load session.");
        } finally {
            setIsSyncing(false);
        }
    };

    const fetchDocBlob = async (sid) => {
        const targetSid = sid || sessionId;
        if (!targetSid) return;
        try {
            const response = await axios.get(`${API_BASE}/download/${targetSid}`, {
                responseType: 'blob'
            });
            setDocBlob(response.data);
        } catch (error) {
            console.error("Failed to fetch doc blob:", error);
        }
    };

    return (
        <div className="flex h-screen bg-[#090a0f] text-slate-200 overflow-hidden selection:bg-primary/30">
            {/* Column 1: Navigation Sidebar */}
            <aside className="w-80 border-r border-white/5 bg-[#0f1118]/40 backdrop-blur-3xl p-8 flex flex-col z-20 overflow-y-auto no-scrollbar shrink-0">
                <div className="flex items-center gap-4 mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary blur-lg opacity-20 animate-pulse" />
                        <div className="relative p-2.5 bg-primary/20 rounded-2xl border border-primary/30 text-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 stroke-[2.5px]" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 text-left">
                            Word <span className="text-primary">Engine</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 text-left">v2.0 Map-Snippet</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1 pr-2">
                    <div className="space-y-2">
                        <button
                            onClick={() => setView('chat')}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold ${view === 'chat' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chat Workspace
                        </button>
                        <button
                            onClick={() => setView('profile')}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold ${view === 'profile' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <User className="w-4 h-4" />
                            View Profile
                        </button>
                    </div>

                    <div className="h-px bg-white/5 mx-2" />

                    <button
                        onClick={startNewWorkspace}
                        className="w-full flex items-center justify-center gap-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-primary/5 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        New Session
                    </button>

                    <DocMap
                        map={docMap}
                        onSelect={(item) => {
                            setActiveElementId(item.id);
                            setInput(`Read and summarize the content of section ${item.id}`);
                        }}
                        activeId={activeElementId}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-1">
                            <History className="w-3.5 h-3.5" />
                            Recent Activity
                        </div>
                        <div className="space-y-2">
                            {sessionHistory.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-xs font-medium bg-white/5 rounded-2xl border border-white/5 border-dashed">No prior sessions.</div>
                            ) : (
                                sessionHistory.slice(0, 5).map((session, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => loadSession(session.uuid)}
                                        disabled={isSyncing}
                                        className={`w-full text-left p-3.5 rounded-2xl transition-all border ${sessionId === session.uuid ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="text-xs font-bold truncate text-slate-200">{session.title}</div>
                                        <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500">{new Date(session.date).toLocaleDateString()}</div>
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
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-100 disabled:opacity-30 font-bold py-4 rounded-3xl transition-all group shadow-xl shadow-white/5"
                    >
                        {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        Upload DOCX
                    </button>
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".docx" />

                    {sessionId && (
                        <button
                            onClick={() => setShowFullPreview(true)}
                            className="w-full flex items-center justify-center gap-3 bg-primary text-white hover:bg-primary/90 font-bold py-4 rounded-3xl transition-all group shadow-xl shadow-primary/10"
                        >
                            <FileCheck className="w-5 h-5" />
                            Full Preview
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <AnimatePresence>
                {view === 'chat' ? (
                    <motion.main
                        key="chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex"
                    >
                        {/* Chat Column */}
                        <div className="flex-1 flex flex-col border-r border-white/5 relative">
                            <header className="h-20 flex items-center justify-between px-12 border-b border-white/5 backdrop-blur-xl z-10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Ephemeral Session</span>
                                    </div>
                                    {errorStatus && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{errorStatus}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    {downloadUrl && !stagedEdit && (
                                        <motion.a
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            href={downloadUrl}
                                            className="flex items-center gap-2.5 px-6 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/30"
                                            onClick={() => setDownloadUrl(null)} // Clear after download to force review of next changes
                                            download
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Final.docx
                                        </motion.a>
                                    )}
                                    <button
                                        onClick={() => setView('profile')}
                                        className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-colors"
                                    >
                                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 no-scrollbar">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-6 rounded-[2rem] ${msg.role === 'user' ? 'bg-primary/20 border border-primary/30 ml-auto text-right' : 'glass-morphism border-white/5 text-left'}`}>
                                            <div className="text-[14px] leading-relaxed">
                                                {msg.isStaged && <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 w-fit px-2 py-0.5 rounded-full">Review Required</div>}
                                                {msg.content}
                                                {msg.isReview && (
                                                    <div className="mt-8 border-t border-white/5 pt-8">
                                                        <button
                                                            onClick={() => setShowFullReview(true)}
                                                            className="flex items-center gap-3 px-8 py-4 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            Review Proposed Edit
                                                        </button>
                                                    </div>
                                                )}
                                                {msg.isComparison && (
                                                    <div className="mt-4">
                                                        <ComparisonSummary
                                                            stats={msg.stats}
                                                            onDownload={() => window.location.href = `${API_BASE}/download/${sessionId}`}
                                                        />
                                                    </div>
                                                )}
                                                {msg.download_url && (
                                                    <a href={msg.download_url} download className="mt-4 flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-bold rounded-xl">
                                                        <Download className="w-4 h-4" /> Download Result
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {(isAnalyzing || isEditing || isSyncing) && (
                                    <div className="flex justify-start gap-4 items-center glass-morphism p-4 rounded-2xl w-fit">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs font-bold text-slate-400">
                                            {isSyncing ? "Restoring session..." : "Word Engine is processing..."}
                                        </span>
                                    </div>
                                )}
                                <div ref={chatEndRef} className="h-20" />
                            </div>

                            <div className="p-10 shrink-0">
                                <div className="max-w-4xl mx-auto flex items-center gap-3 glass-morphism p-2 rounded-[2rem] border-white/10">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder={sessionId ? "Instruct the engine..." : "Upload a document to begin"}
                                        disabled={!sessionId || isEditing || isSyncing}
                                        className="flex-1 bg-transparent px-6 py-4 text-sm outline-none"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!sessionId || isEditing || !input || isSyncing}
                                        className="p-4 bg-white text-black rounded-full hover:scale-105 transition-all disabled:opacity-20"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <ReviewSidebar
                            stagedEdit={stagedEdit}
                            onAccept={handleAcceptEdit}
                            isCommitting={isCommitting}
                            activeId={activeElementId}
                        />

                        {/* Side-by-Side Review Overlay (True Full Screen) */}
                        <AnimatePresence>
                            {stagedEdit && showFullReview && (
                                <div className="fixed inset-0 z-[200] flex flex-col bg-[#0d0f14]">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        className="w-full h-full flex flex-col relative"
                                    >
                                        <button
                                            onClick={() => setShowFullReview(false)}
                                            className="absolute top-10 right-10 z-[210] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-90"
                                        >
                                            <X className="w-8 h-8" />
                                        </button>
                                        <AdvancedReviewEditor
                                            blob={docBlob}
                                            sessionId={sessionId}
                                            onClose={() => setShowFullReview(false)}
                                            onAcceptAll={handleAcceptEdit}
                                            mode="suggesting"
                                        />
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Full Document Preview Overlay */}
                        <AnimatePresence>
                            {showFullPreview && (
                                <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                        className="w-full max-w-7xl h-full flex shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                                    >
                                        <AdvancedReviewEditor
                                            blob={docBlob}
                                            sessionId={sessionId}
                                            onClose={() => setShowFullPreview(false)}
                                            onAcceptAll={handleAcceptEdit}
                                            mode="viewing" // or 'suggesting' if they want to edit in full preview too
                                        />
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.main>
                ) : (
                    <Profile
                        user={user}
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                        model={model}
                        setModel={setModel}
                        onBack={() => setView('chat')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Workspace;
