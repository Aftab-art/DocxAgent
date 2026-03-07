import React, { useState, useEffect } from 'react';
import { Check, X, Edit3, Save, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewWorkspace = ({
    reviewData,
    onAccept,
    onReject,
    onManualEdit,
    isProcessing
}) => {
    const { original_text, modified_text, diff, element_id } = reviewData;
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(modified_text);

    useEffect(() => {
        setEditText(modified_text);
        setIsEditing(false);
    }, [modified_text]);

    const handleSaveEdit = () => {
        onManualEdit(element_id, editText);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#0d0f14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                        <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Document Review</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Editing Section: {element_id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 text-slate-300 text-xs font-bold rounded-full hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                        >
                            <Edit3 className="w-4 h-4" />
                            Manual Adjust
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area: Paper Aesthetic */}
            <div className="flex-1 flex overflow-hidden bg-[#1a1c23] p-6 gap-6">
                {/* Left Side: Original (Paper) */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-white/5 overflow-hidden ring-1 ring-black/5">
                    <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-sans">Draft Content</span>
                        </div>
                    </div>
                    <div className="flex-1 p-10 overflow-y-auto no-scrollbar font-serif text-[1.1rem] leading-[1.8] text-slate-500">
                        {original_text}
                    </div>
                </div>

                {/* Right Side: Modified (Paper) */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-white/5 overflow-hidden ring-1 ring-black/5">
                    <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 font-sans">AI Proposal</span>
                        </div>
                    </div>
                    <div className="flex-1 p-10 overflow-y-auto no-scrollbar relative">
                        {isEditing ? (
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full h-full bg-slate-50/50 p-4 rounded-xl border border-slate-100 outline-none font-serif text-[1.1rem] leading-[1.8] text-slate-900 resize-none placeholder:text-slate-300"
                                placeholder="Refine the text here..."
                                autoFocus
                            />
                        ) : (
                            <div className="font-serif text-[1.1rem] leading-[1.8] text-slate-900">
                                {diff && diff.length > 0 ? (
                                    <div className="flex flex-wrap gap-x-1.5">
                                        {diff.map(([type, word], idx) => (
                                            <span
                                                key={idx}
                                                className={
                                                    type === 'insert' ? 'text-emerald-600 underline decoration-2 underline-offset-4 bg-emerald-50' :
                                                        type === 'delete' ? 'text-red-400 line-through decoration-red-300/50 decoration-2 opacity-60' :
                                                            ''
                                                }
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    modified_text
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-6">
                <button
                    disabled={isProcessing}
                    onClick={() => onReject(element_id)}
                    className="flex items-center gap-3 px-10 py-4 text-slate-500 hover:text-red-400 font-bold transition-all active:scale-95 disabled:opacity-30 group"
                >
                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Discard Changes
                </button>

                <button
                    disabled={isProcessing || isEditing}
                    onClick={() => onAccept(element_id)}
                    className="flex-1 max-w-[420px] flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-100 font-bold py-5 rounded-[1.5rem] transition-all shadow-[0_15px_30px_rgba(255,255,255,0.05)] active:scale-95 disabled:opacity-20 disabled:scale-[0.98]"
                >
                    <Check className="w-6 h-6 stroke-[3px]" />
                    Accept and Apply
                </button>
            </div>
        </div>
    );
};

export default ReviewWorkspace;
