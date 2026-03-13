import React, { useState, useEffect, useRef } from 'react';
import * as docx from 'docx-preview';
import { Check, X, Edit3, Save, RotateCcw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewWorkspace = ({
    blob,
    reviewData,
    onAccept,
    onReject,
    onManualEdit,
    isProcessing
}) => {
    const { modified_text, element_id } = reviewData;
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(modified_text);
    const viewerRef = useRef(null);

    useEffect(() => {
        setEditText(modified_text);
    }, [modified_text]);

    useEffect(() => {
        if (blob && viewerRef.current) {
            renderDocx();
        }
    }, [blob]);

    const renderDocx = async () => {
        if (!blob || !viewerRef.current) return;
        try {
            viewerRef.current.innerHTML = '';
            await docx.renderAsync(blob, viewerRef.current, null, {
                className: "docx-container",
                inWrapper: true,
                ignoreWidth: false,
                ignoreHeight: true
            });
        } catch (error) {
            console.error("docx-preview error:", error);
            viewerRef.current.innerHTML = `<div class="p-8 text-red-500">Failed to render preview.</div>`;
        }
    };

    const handleSaveEdit = () => {
        onManualEdit(element_id, editText);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0f14] relative overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                        <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Document Review</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Staged Changes Applied (Review Below)</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/5 text-slate-300 text-xs font-bold rounded-full hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" />
                        Manual Adjust
                    </button>
                    {isProcessing && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>
            </div>

            {/* Document Workspace (Full View) */}
            <div className="flex-1 overflow-y-auto bg-[#1a1c23] p-8 md:p-16 lg:p-24 no-scrollbar scroll-smooth flex justify-center">
                <div className="w-full max-w-5xl bg-white shadow-[0_50px_100px_rgba(0,0,0,0.4)] ring-1 ring-black/10 relative transition-all duration-700 rounded-lg overflow-visible mb-24">
                    <div ref={viewerRef} className="docx-container h-full w-full" />
                </div>
            </div>

            {/* Manual Edit Overlay */}
            <AnimatePresence>
                {isEditing && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-black/70 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-2xl bg-[#0f1118] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsEditing(false)}
                                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <Edit3 className="w-6 h-6 text-primary" />
                                Refine Section {element_id}
                            </h4>
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full h-80 bg-white/5 p-8 rounded-3xl border border-white/10 outline-none font-serif text-[1.2rem] leading-relaxed text-slate-100 resize-none focus:border-primary/50 transition-all shadow-inner"
                                placeholder="Refine the text here..."
                                autoFocus
                            />
                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-5 text-slate-400 font-bold hover:text-white transition-colors rounded-2xl bg-white/5 border border-white/5"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-[2] bg-primary text-white font-bold py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
                                >
                                    Update Preview
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="p-10 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-6 z-20">
                <button
                    disabled={isProcessing}
                    onClick={() => onReject(element_id)}
                    className="flex items-center gap-3 px-10 py-5 text-slate-500 hover:text-red-400 font-bold transition-all active:scale-95 disabled:opacity-30 group"
                >
                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Discard Changes
                </button>

                <div className="flex items-center gap-4 flex-1 max-w-[480px]">
                    <button
                        disabled={isProcessing || isEditing}
                        onClick={() => onAccept()}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-100 font-bold py-6 rounded-[1.8rem] transition-all shadow-[0_15px_40px_rgba(255,255,255,0.05)] active:scale-95 disabled:opacity-20 disabled:scale-[0.98]"
                    >
                        <Check className="w-6 h-6 stroke-[3px]" />
                        Confirm and Save
                    </button>
                </div>
            </div>

            <style>{`
                .docx-container {
                    padding: 0 !important;
                    width: 100% !important;
                }
                .docx-container .docx {
                    padding: 60px 50px !important;
                    background: white !important;
                    box-shadow: none !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                }
                .docx-container p {
                    margin-bottom: 0.75rem !important;
                    line-height: 1.6 !important;
                }
                /* Ensure tables and other elements fill width */
                .docx-container table {
                    width: 100% !important;
                    margin-bottom: 1rem !important;
                }
                /* Fix for "small screen" rendering */
                @media (max-width: 1024px) {
                   .docx-container .docx {
                        padding: 40px 30px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReviewWorkspace;
