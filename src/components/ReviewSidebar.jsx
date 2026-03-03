import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, FileEdit, ArrowRight, MessageSquare, Shield } from 'lucide-react';

const ReviewSidebar = ({ stagedEdit, onAccept, isCommitting, activeId }) => {
    return (
        <aside
            className="w-96 glass-morphism border-l border-white/10 z-30 flex flex-col shadow-2xl shrink-0 h-full"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                        <FileEdit className="w-4 h-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Review Changes</h2>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Action Required</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {stagedEdit ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">AI Summary</p>
                            <p className="text-sm text-slate-300 italic">"{stagedEdit.summary}"</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Structural Diff Preview</p>
                            <div className="p-4 rounded-2xl bg-[#0f1118] border border-white/10 font-mono text-[11px] space-y-2">
                                <div className="text-red-400 opacity-50 flex items-start gap-2">
                                    <span className="shrink-0">-</span>
                                    <span>[Original XML Fragment Indexed]</span>
                                </div>
                                <div className="text-primary flex items-start gap-2">
                                    <span className="shrink-0">+</span>
                                    <span>[Updated XML with Tracked Changes]</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-3">
                            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                            <p className="text-[10px] text-primary leading-relaxed font-medium">
                                Accepts will commit the XML delta to the document buffer. You can then download the final .docx with native tracked changes.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            {activeId ? <MessageSquare className="w-8 h-8 text-primary opacity-50" /> : <Shield className="w-8 h-8 text-slate-700" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-200">
                                {activeId ? "Paragraph Selected" : "Ready for Editing"}
                            </p>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                {activeId
                                    ? "First modify the paragraph like you want by telling the AI your requirements."
                                    : "Select a paragraph from the Document Map or upload a file to start staging changes."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-black/20">
                <button
                    disabled={!stagedEdit || isCommitting}
                    onClick={onAccept}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-100 disabled:opacity-30 font-bold py-4 rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95 group"
                >
                    {isCommitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <ArrowRight className="w-5 h-5" />
                        </motion.div>
                    ) : (
                        <>
                            Commit & Update Doc
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                {!stagedEdit && activeId && (
                    <p className="text-[9px] text-center text-slate-500 mt-3 font-bold uppercase tracking-wider">Modify the snippet to enable commit</p>
                )}
            </div>
        </aside>
    );
};

export default ReviewSidebar;
