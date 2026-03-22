import React, { useEffect, useRef, useState } from 'react';
import { DocxEditor } from '@eigenpal/docx-js-editor';
import { Check, X, Download, Save, Loader2, Sidebar } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const AdvancedReviewEditor = ({ 
    blob, 
    sessionId, 
    onClose, 
    onAcceptAll,
    mode = 'suggesting'
}) => {
    const editorRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [arrayBuffer, setArrayBuffer] = useState(null);

    useEffect(() => {
        if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => setArrayBuffer(e.target.result);
            reader.readAsArrayBuffer(blob);
        }
    }, [blob]);

    const handleSync = async () => {
        if (!editorRef.current || !sessionId) return;
        setIsSaving(true);
        try {
            const buffer = await editorRef.current.save({ selective: true });
            const updatedBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('file', updatedBlob, 'document.docx');

            await axios.post(`${API_BASE}/save-doc`, formData);
            console.log("Document synced to GridFS");
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAcceptAndApply = async () => {
        if (!editorRef.current) return;
        setIsSaving(true);
        try {
            // editor.save() strips track changes markers for final download
            const finalBuffer = await editorRef.current.save(); 
            const finalBlob = new Blob([finalBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            
            // Sync final version
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('file', finalBlob, 'final_document.docx');
            await axios.post(`${API_BASE}/save-doc`, formData);
            
            // Trigger download
            const url = window.URL.createObjectURL(finalBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'final_document.docx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            if (onAcceptAll) onAcceptAll();
        } catch (error) {
            console.error("Finalize failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!arrayBuffer) {
        return (
            <div className="flex items-center justify-center h-full bg-[#0d0f14] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 font-bold">Loading Document...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0d0f14] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-b border-white/10 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/20 rounded-xl text-primary border border-primary/30">
                        <Save className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Advanced Review Editor</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                            Real-Time Suggestion Mode Active
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isSaving && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Auto-Syncing...
                        </div>
                    )}
                    <button
                        onClick={handleAcceptAndApply}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Check className="w-4 h-4" />
                        Accept and Apply
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative overflow-hidden">
                <DocxEditor
                    ref={editorRef}
                    documentBuffer={arrayBuffer}
                    mode={mode} // 'suggesting'
                    showReviewPane={true}
                    onTrackChange={(change) => {
                        console.log("Track change detected:", change);
                        handleSync(); // Sync on every change
                    }}
                    styles={{
                        suggestion: {
                            insertion: {
                                color: '#10b981', // green-500
                                textDecoration: 'underline'
                            },
                            deletion: {
                                color: '#ef4444', // red-500
                                textDecoration: 'line-through'
                            }
                        }
                    }}
                    className="h-full w-full"
                />
            </div>

            <style>{`
                .docx-editor-container {
                    background: #1a1c23 !important;
                }
                .docx-editor-canvas {
                    box-shadow: 0 50px 100px rgba(0,0,0,0.4) !important;
                    margin: 40px auto !important;
                }
                .docx-editor-sidebar {
                    background: #0f1118 !important;
                    border-left: 1px solid rgba(255,255,255,0.05) !important;
                }
            `}</style>
        </div>
    );
};

export default AdvancedReviewEditor;
