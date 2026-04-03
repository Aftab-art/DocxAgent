/**
 * Style Themes for the Resume Engine
 * Each theme provides Tailwind class strings for common UI elements.
 */

export const Themes = {
    minimal: {
        id: 'minimal',
        name: 'Minimalist Slate',
        colors: {
            primary: 'text-slate-900',
            secondary: 'text-slate-500',
            accent: 'bg-slate-100',
            border: 'border-slate-200',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-sans font-bold tracking-tight',
            body: 'font-sans text-slate-600',
        },
        styles: {
            sectionTitle: 'text-lg font-black uppercase tracking-widest border-b border-slate-200 pb-1 mb-4',
            itemTitle: 'font-bold text-base text-slate-900',
            itemSubTitle: 'text-sm font-medium text-slate-500',
            date: 'text-xs text-slate-400 font-mono',
            bullet: 'list-disc list-outside ml-4 space-y-1 text-slate-600',
        }
    },
    modern: {
        id: 'modern',
        name: 'Modern Indigo',
        colors: {
            primary: 'text-indigo-950',
            secondary: 'text-indigo-600',
            accent: 'bg-indigo-50',
            border: 'border-indigo-100',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-sans font-extrabold tracking-tighter',
            body: 'font-sans text-indigo-900/80',
        },
        styles: {
            sectionTitle: 'text-xl font-bold text-indigo-950 flex items-center gap-2 mb-4 after:content-[""] after:h-px after:flex-1 after:bg-indigo-100',
            itemTitle: 'font-bold text-base text-indigo-950',
            itemSubTitle: 'text-sm font-semibold text-indigo-600',
            date: 'text-xs font-bold text-indigo-400 uppercase tracking-wider',
            bullet: 'list-none space-y-2 text-indigo-900/70', // Modern style: no bullets, more spacing
        }
    },
    bold: {
        id: 'bold',
        name: 'High Contrast Bold',
        colors: {
            primary: 'text-black',
            secondary: 'text-slate-700',
            accent: 'bg-yellow-400',
            border: 'border-black',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-serif font-black uppercase tracking-tighter',
            body: 'font-serif text-slate-900',
        },
        styles: {
            sectionTitle: 'text-2xl font-black uppercase bg-black text-white px-4 py-1 mb-6 skew-x-[-12deg]',
            itemTitle: 'font-black text-lg text-black',
            itemSubTitle: 'text-base font-bold text-slate-800 italic',
            date: 'text-sm font-black text-black border-2 border-black px-2 py-0.5',
            bullet: 'list-square list-outside ml-5 space-y-1',
        }
    },
    vibrant: {
        id: 'vibrant',
        name: 'Creative Emerald',
        colors: {
            primary: 'text-emerald-950',
            secondary: 'text-emerald-600',
            accent: 'bg-emerald-500/10',
            border: 'border-emerald-200',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-sans font-black tracking-tight',
            body: 'font-sans text-emerald-900/80',
        },
        styles: {
            sectionTitle: 'text-lg font-black uppercase text-emerald-600 mb-4 flex flex-col after:content-[""] after:h-1 after:w-12 after:bg-emerald-500 after:mt-1',
            itemTitle: 'font-bold text-base text-emerald-950',
            itemSubTitle: 'text-sm font-bold text-emerald-600/80',
            date: 'text-xs font-medium text-emerald-400',
            bullet: 'list-disc list-outside ml-4 space-y-1',
        }
    },
    executive: {
        id: 'executive',
        name: 'Executive Navy',
        colors: {
            primary: 'text-[#0a192f]',
            secondary: 'text-[#112240]',
            accent: 'bg-[#112240]/5',
            border: 'border-[#0a192f]/10',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-serif font-bold text-4xl',
            body: 'font-sans text-slate-700 leading-relaxed',
        },
        styles: {
            sectionTitle: 'text-lg font-bold text-[#0a192f] border-l-4 border-[#0a192f] pl-4 mb-4 uppercase tracking-widest',
            itemTitle: 'font-bold text-base text-[#0a192f]',
            itemSubTitle: 'text-sm font-medium text-[#112240]',
            date: 'text-xs text-slate-500 italic',
            bullet: 'list-disc list-outside ml-4 space-y-1',
        }
    },
    // We can add 5 more themes easily to get to 10
    cyber: {
        id: 'cyber',
        name: 'Cyber Terminal',
        colors: {
            primary: 'text-green-500',
            secondary: 'text-green-700',
            accent: 'bg-green-500/10',
            border: 'border-green-500/30',
            background: 'bg-black',
        },
        fonts: {
            heading: 'font-mono font-black uppercase',
            body: 'font-mono text-green-400/80',
        },
        styles: {
            sectionTitle: 'text-xl font-black border-2 border-green-500 p-2 mb-6 inline-block',
            itemTitle: 'font-black text-green-500 text-lg before:content-[">_"]',
            itemSubTitle: 'text-sm text-green-600',
            date: 'text-xs font-bold opacity-70',
            bullet: 'list-none space-y-1 before:content-["-"]',
        }
    },
    luxury: {
        id: 'luxury',
        name: 'Luxury Rose',
        colors: {
            primary: 'text-rose-950',
            secondary: 'text-rose-800',
            accent: 'bg-rose-50',
            border: 'border-rose-100',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-serif italic font-light',
            body: 'font-sans text-rose-900/70',
        },
        styles: {
            sectionTitle: 'text-3xl font-serif text-rose-950 mb-8 text-center after:content-[""] after:block after:w-24 after:h-px after:bg-rose-200 after:mx-auto after:mt-4',
            itemTitle: 'font-bold text-lg text-rose-950',
            itemSubTitle: 'text-sm font-medium text-rose-800/80 uppercase tracking-widest',
            date: 'text-xs text-rose-400 font-light',
            bullet: 'list-disc list-outside ml-4 space-y-2',
        }
    },
    flat: {
        id: 'flat',
        name: 'Flat Design UI',
        colors: {
            primary: 'text-sky-900',
            secondary: 'text-sky-600',
            accent: 'bg-sky-50',
            border: 'border-sky-100',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-sans font-black',
            body: 'font-sans text-slate-600',
        },
        styles: {
            sectionTitle: 'text-sm font-black uppercase tracking-tighter text-sky-900 bg-sky-100/50 rounded-lg px-4 py-2 mb-4 inline-block',
            itemTitle: 'font-black text-base text-sky-950',
            itemSubTitle: 'text-xs font-bold text-sky-600 uppercase',
            date: 'text-[10px] font-black bg-white border border-sky-100 rounded px-2 py-1',
            bullet: 'list-none space-y-1',
        }
    },
    earth: {
        id: 'earth',
        name: 'Earth Tone',
        colors: {
            primary: 'text-amber-950',
            secondary: 'text-amber-800',
            accent: 'bg-amber-50',
            border: 'border-amber-200',
            background: 'bg-white',
        },
        fonts: {
            heading: 'font-serif font-black tracking-wider',
            body: 'font-sans text-amber-900/80',
        },
        styles: {
            sectionTitle: 'text-lg font-black uppercase text-amber-900 border-b-2 border-amber-900/30 mb-4 pb-1',
            itemTitle: 'font-bold text-base text-amber-950',
            itemSubTitle: 'text-sm font-semibold text-amber-800 underline decoration-amber-200 decoration-2 underline-offset-4',
            date: 'text-xs text-amber-600 font-sans',
            bullet: 'list-disc list-outside ml-4 space-y-1',
        }
    },
    night: {
        id: 'night',
        name: 'Night Sky',
        colors: {
            primary: 'text-white',
            secondary: 'text-blue-400',
            accent: 'bg-blue-400/10',
            border: 'border-white/10',
            background: 'bg-[#0f172a]',
        },
        fonts: {
            heading: 'font-sans font-black tracking-tighter',
            body: 'font-sans text-slate-300',
        },
        styles: {
            sectionTitle: 'text-sm font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-4 before:content-[""] before:h-[2px] before:w-8 before:bg-blue-400',
            itemTitle: 'font-black text-lg text-white',
            itemSubTitle: 'text-sm font-bold text-blue-400',
            date: 'text-[10px] text-slate-500 font-black uppercase',
            bullet: 'list-disc list-outside ml-4 space-y-1 text-slate-400',
        }
    }
};
