import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Printer, ArrowLeft, Loader2, CheckCircle, Edit3, Eye } from 'lucide-react';
import { DocxEditor } from '@eigenpal/docx-js-editor';

import { API_BASE } from '../../config';


import TemplateFactory from './engine/TemplateFactory';

const ResumePreview = ({ data, template, onBack }) => {
    const editorRef = useRef(null);
    const [isExporting, setIsExporting] = useState(null); // 'pdf' or 'docx'
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [docxBuffer, setDocxBuffer] = useState(null);
    const [isLoadingDoc, setIsLoadingDoc] = useState(false);
    const [editedData, setEditedData] = useState(JSON.stringify(data, null, 2));

    const fetchDocx = async () => {
        setIsLoadingDoc(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE}/generate-resume`, {
                resume_json: data,
                template_id: template.id,
                format: 'docx'
            }, {
                responseType: 'arraybuffer'
            });
            setDocxBuffer(response.data);
            setIsEditing(true);
        } catch (err) {
            console.error("Fetch DOCX error:", err);
            setError("Failed to load document for editing.");
        } finally {
            setIsLoadingDoc(false);
        }
    };

    const handleSaveEdit = () => {
        try {
            const parsed = JSON.parse(editedData);
            setIsEditing(false);
        } catch (e) {
            setError("Invalid JSON format. Please check your changes.");
        }
    };

    const handleManualDownload = async (format) => {
        if (!editorRef.current) return;
        setIsExporting(format);
        setError(null);
        try {
            const buffer = await editorRef.current.save();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            if (format === 'docx') {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Resume_${data.basics?.name?.replace(/\s+/g, '_')}_Edited.docx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else if (format === 'pdf') {
                // Send buffer to backend for conversion
                const formData = new FormData();
                formData.append('file', blob, 'resume.docx');
                
                const response = await axios.post(`${API_BASE}/convert-to-pdf`, formData, {
                    responseType: 'blob'
                });
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Resume_${data.basics?.name?.replace(/\s+/g, '_')}_Edited.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error("Manual export error:", error);
            setError(`Failed to export modified ${format.toUpperCase()}.`);
        } finally {
            setIsExporting(null);
        }
    };

    const handleExport = async (format) => {
        if (isEditing) {
            return handleManualDownload(format);
        }
        setIsExporting(format);
        setError(null);
        
        try {
            const response = await axios.post(`${API_BASE}/generate-resume`, {
                resume_json: data,
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
                        onClick={() => isEditing ? setIsEditing(false) : fetchDocx()}
                        disabled={isLoadingDoc}
                        className={`px-6 py-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
                            isEditing ? "bg-white/10 text-white" : "bg-primary/20 text-primary border border-primary/30"
                        }`}
                    >
                        {isLoadingDoc ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isEditing ? (
                            <><Eye className="w-4 h-4" /> View Preview</>
                        ) : (
                            <><Edit3 className="w-4 h-4" /> Edit Manually</>
                        )}
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="flex-1 lg:flex-none flex items-center gap-2.5 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                        {isEditing ? "Download PDF" : "Export PDF"}
                    </button>
                    <button
                        onClick={() => handleExport('docx')}
                        disabled={isExporting}
                        className="flex-1 lg:flex-none flex items-center gap-2.5 px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isExporting === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        {isEditing ? "Download DOCX" : "Export DOCX"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                    {error}
                </div>
            )}

             <div className="flex-1 overflow-hidden bg-slate-900/50 rounded-[2.5rem] border border-white/5 p-4 flex justify-center relative">
                {isEditing && docxBuffer ? (
                    <div className="w-full h-full relative group">
                        <DocxEditor
                            ref={editorRef}
                            documentBuffer={docxBuffer}
                            className="h-full w-full rounded-2xl overflow-hidden"
                            mode="editing"
                        />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            Manual Edit Mode
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto no-scrollbar p-8 flex justify-center">
                        <div className="w-full max-w-[850px] aspect-[1/1.414] bg-white text-black shadow-2xl rounded-sm overflow-hidden flex flex-col scale-[0.8] origin-top">
                            <TemplateFactory 
                                layoutId={template.layout} 
                                themeId={template.theme} 
                                data={data} 
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .docx-editor-container {
                    background: transparent !important;
                }
                .docx-editor-canvas {
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5) !important;
                    margin: 20px auto !important;
                    border-radius: 4px;
                }
                .docx-editor-sidebar {
                    background: #1e293b !important;
                    border-left: 1px solid rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </div>
    );
};


export default ResumePreview;
