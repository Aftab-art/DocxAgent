import React, { useEffect, useRef } from 'react';
import * as docx from 'docx-preview';
import { Download, X } from 'lucide-react';

const DocxViewer = ({ blob, onClose, onDownload }) => {
    const viewerRef = useRef(null);

    useEffect(() => {
        if (blob && viewerRef.current) {
            renderDocx();
        }
    }, [blob]);

    const renderDocx = async () => {
        if (!blob || !viewerRef.current) return;
        try {
            // Clean container before render
            viewerRef.current.innerHTML = '';

            await docx.renderAsync(blob, viewerRef.current, null, {
                className: "docx-container",
                inWrapper: false,
                ignoreWidth: false,
                ignoreHeight: false
            });
        } catch (error) {
            console.error("Error rendering docx:", error);
            viewerRef.current.innerHTML = `<div class="p-8 text-red-500 font-bold">Failed to render document preview.</div>`;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f3f4f6] relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Document Preview</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="max-w-[850px] mx-auto bg-white shadow-2xl ring-1 ring-black/5 min-h-screen">
                    <div ref={viewerRef} className="docx-container" />
                </div>
            </div>

            <style>{`
                .docx-container {
                    padding: 0 !important;
                }
                .docx-container .docx {
                    margin: 0 auto !important;
                    padding: 40pt !important;
                    background: white !important;
                    box-shadow: none !important;
                }
                .docx-container section.docx {
                    margin-bottom: 2rem !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
                }
            `}</style>
        </div>
    );
};

export default DocxViewer;
