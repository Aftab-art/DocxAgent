import React from 'react';
import { Download, CheckCircle, PlusCircle, MinusCircle, FileText } from 'lucide-react';

const ComparisonSummary = ({ stats, onDownload }) => {
    if (!stats) return null;

    return (
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Comparison Report</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Work_Engine Agent</p>
                    </div>
                </div>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[11px] font-black rounded-xl hover:bg-gray-200 transition-colors"
                >
                    <Download className="w-4 h-4" /> DOWNLOAD DOCX
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <PlusCircle className="w-6 h-6 text-green-400" />
                    <div>
                        <div className="text-2xl font-black text-green-400">{stats.insertions}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Insertions</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <MinusCircle className="w-6 h-6 text-red-400" />
                    <div>
                        <div className="text-2xl font-black text-red-400">{stats.deletions}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Deletions</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Tracked Changes enabled: Open in Microsoft Word to see detailed revisions.
            </div>
        </div>
    );
};

export default ComparisonSummary;
