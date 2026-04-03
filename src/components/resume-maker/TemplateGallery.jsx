import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Search, Filter, Layout as LayoutIcon, Sparkles } from 'lucide-react';
import { GENERATED_TEMPLATES, TEMPLATE_CATEGORIES } from './engine/constants';
import TemplateFactory from './engine/TemplateFactory';
import { DUMMY_RESUME_DATA } from './engine/dummyData';


const TemplateThumbnail = ({ layout, theme }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white select-none pointer-events-none">
            <div className="w-[850px] min-h-[1100px] origin-top-left scale-[0.23] bg-white text-black shadow-2xl">
                <TemplateFactory layoutId={layout} themeId={theme} data={DUMMY_RESUME_DATA} />
            </div>
            {/* Glassy overlay for the gallery card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
    );
};

const TemplateGallery = ({ onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredTemplates = useMemo(() => {
        return GENERATED_TEMPLATES.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 t.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'all' || t.layout === activeCategory || t.theme === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="h-full flex flex-col gap-8 overflow-y-auto no-scrollbar pb-20">
            {/* Hero Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="text-4xl font-black tracking-tighter text-white">
                        Design your <span className="text-primary italic">future.</span>
                    </h3>
                    <p className="text-slate-400 max-w-2xl">
                        Choose from <span className="text-white font-bold">100+ dynamic templates</span> powered by our Layout-Theme engine. 
                        Each template is ATS-friendly and professionally curated.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search 100+ templates (e.g. Modern, Executive, Minimalist...)" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {TEMPLATE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeCategory === cat.id 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <LayoutIcon className="w-4 h-4" />
                    <span>Showing {filteredTemplates.length} Templates</span>
                </div>
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                        Clear Search
                    </button>
                )}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredTemplates.map((template, idx) => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: idx * 0.02 }}
                            className="group relative flex flex-col bg-[#0f111a] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer shadow-2xl"
                            onClick={() => onSelect(template)}
                        >
                            {/* Thumbnail Container: Real Scale Preview */}
                            <div className="aspect-[3/4] overflow-hidden relative bg-white group-hover:after:content-[''] group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-primary/10 transition-all">
                                <TemplateThumbnail layout={template.layout} theme={template.theme} />
                                
                                {/* Badge */}
                                <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5 ring-4 ring-black/20 z-10">
                                    <Sparkles className="w-3 h-3 text-white" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">LIVE PREVIEW</span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary/20 backdrop-blur-sm z-20">
                                    <button className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                                        Use This Style
                                    </button>
                                </div>
                            </div>



                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{template.name}</h4>
                                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">{template.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                    {template.features.slice(0, 2).map(f => (
                                        <span key={f} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                            <Check className="w-2 h-2 text-primary" />
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Border Glow for Hover */}
                            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-3xl pointer-events-none transition-all duration-500" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredTemplates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <Filter className="w-12 h-12 text-slate-700" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No templates match your search</p>
                </div>
            )}

            {/* Quick Tips */}
            <div className="mt-8 p-8 bg-[#151921] border border-white/5 rounded-[2.5rem] flex items-start gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-colors group-hover:bg-primary/10" />
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-primary">Pro Design Tip</p>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                        Our dynamic engine separates <span className="text-white font-bold text-xs uppercase underline">Structure</span> from <span className="text-white font-bold text-xs uppercase underline">Aesthetics</span>. 
                        Try different combinations to find the perfect balance between corporate professionalism and creative flair. All 100+ templates are tested for OCR compatibility.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TemplateGallery;

