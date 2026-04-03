import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, FileText, Printer, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

import TemplateFactory from './engine/TemplateFactory';

const ResumePreview = ({ data, template, onBack }) => {
    const [isExporting, setIsExporting] = useState(null); // 'pdf' or 'docx'
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(JSON.stringify(data, null, 2));

    const handleSaveEdit = () => {
        try {
            const parsed = JSON.parse(editedData);
            setIsEditing(false);
        } catch (e) {
            setError("Invalid JSON format. Please check your changes.");
        }
    };

    const handleExport = async (format) => {
        setIsExporting(format);
        setError(null);
        let exportData = data;
        try {
            exportData = JSON.parse(editedData);
        } catch (e) {
            setError("Cannot export while JSON is invalid.");
            setIsExporting(null);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/generate-resume`, {
                resume_json: exportData,
                template_id: template.id,
                format: format
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Resume_${data.basics?.name?.replace(/\s+/g, '_')}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export error:", error);
            setError(`Failed to export as ${format.toUpperCase()}.`);
        } finally {
            setIsExporting(null);
        }
    };

    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-8">
            {/* Header / Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">Final Preview</h3>
                        <p className="text-sm text-slate-400">Review your generated resume before exporting.</p>
                    </div>
                </div>

                 <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                    >
                        {isEditing ? "View Preview" : "Edit Data"}
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="flex-1 lg:flex-none flex items-center gap-2.5 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                        Export PDF
                    </button>
                    <button
                        onClick={() => handleExport('docx')}
                        disabled={isExporting}
                        className="flex-1 lg:flex-none flex items-center gap-2.5 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isExporting === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Export DOCX
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                    {error}
                </div>
            )}

            {/* Preview Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-900/50 rounded-[2.5rem] border border-white/5 p-12 flex justify-center relative">
                {isEditing ? (
                    <div className="w-full max-w-4xl h-full flex flex-col gap-4">
                        <textarea
                            value={editedData}
                            onChange={(e) => setEditedData(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-3xl p-8 font-mono text-sm text-green-400 outline-none focus:border-primary/50 resize-none"
                            placeholder="Resume JSON Data..."
                        />
                         <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] text-primary uppercase font-bold text-center">
                            Note: Directly editing the JSON allows for maximum flexibility. Changes will be reflected in the preview and export.
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[850px] aspect-[1/1.414] bg-white text-black shadow-2xl rounded-sm overflow-hidden flex flex-col scale-[0.8] origin-top">
                        <TemplateFactory 
                            layoutId={template.layout} 
                            themeId={template.theme} 
                            data={(() => {
                                try { return JSON.parse(editedData); } catch(e) { return data; }
                            })()} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


export default ResumePreview;
