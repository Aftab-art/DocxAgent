import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Table, Hash, ChevronRight } from 'lucide-react';

const DocMap = ({ map, onSelect, activeId }) => {
    if (!map || map.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-1">
                <Hash className="w-3.5 h-3.5" />
                Document Map
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar pr-2">
                {map.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        onClick={() => onSelect(item)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${activeId === item.id
                                ? 'bg-primary/10 border-primary/30'
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        <div className={`p-1.5 rounded-lg ${item.type === 'table' ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'
                            }`}>
                            {item.type === 'table' ? <Table className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-slate-300 truncate group-hover:text-white transition-colors">
                                {item.summary}
                            </div>
                            <div className="text-[8px] uppercase tracking-tighter font-black text-slate-500">
                                {item.id}
                            </div>
                        </div>
                        <ChevronRight className={`w-3 h-3 mt-1 transition-transform ${activeId === item.id ? 'rotate-90 text-primary' : 'text-slate-600'}`} />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default DocMap;
