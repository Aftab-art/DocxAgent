import React from 'react';

const CreativeLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-12 flex flex-col gap-10`}>
            {/* Creative Banner */}
            <header className={`p-12 -mx-12 -mt-12 ${theme.colors.accent} flex flex-col gap-4 border-b-8 ${theme.colors.border}`}>
                <h1 className={`text-7xl ${theme.fonts.heading} ${theme.colors.primary} break-words leading-none animate-pulse`}>
                    {data.basics?.name}
                </h1>
                <p className="text-xl font-bold uppercase tracking-widest text-slate-500 italic">
                    {data.basics?.label || 'Designer & Innovator'}
                </p>
                <div className="flex flex-wrap gap-8 text-xs font-black uppercase tracking-widest text-slate-400 mt-4">
                    <span>{data.basics?.email}</span>
                    <span>{data.basics?.phone}</span>
                    <span>{data.basics?.location}</span>
                </div>
            </header>

            {/* Creative Content Grid */}
            <div className="grid grid-cols-12 gap-12">
                <main className="col-span-8 flex flex-col gap-16">
                     {/* Experience Creative */}
                    {data.work?.length > 0 && (
                        <section className="flex flex-col gap-12">
                            <h2 className={theme.styles.sectionTitle}>The Journey</h2>
                            <div className="space-y-16">
                                {data.work.map((job, idx) => (
                                    <div key={idx} className="relative pl-12 border-l-4 border-slate-100 flex flex-col gap-4">
                                         <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h3 className={theme.styles.itemTitle + " text-2xl"}>{job.position}</h3>
                                                <p className={theme.styles.itemSubTitle + " text-lg italic"}>{job.company}</p>
                                            </div>
                                            <span className={theme.styles.date + " bg-slate-50 px-4 py-1 rounded-full border border-slate-100 shadow-sm"}>
                                                {job.years}
                                            </span>
                                        </div>
                                        <ul className="grid grid-cols-1 gap-3">
                                            {job.highlights?.map((h, i) => (
                                                <li key={i} className="text-sm leading-relaxed p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-slate-50 transition-all">
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <aside className="col-span-4 flex flex-col gap-16">
                     {/* Creative Summary */}
                    {data.basics?.summary && (
                        <section className="p-8 bg-slate-900 border-2 border-slate-800 rounded-[3rem] shadow-2xl skew-y-3 relative">
                            <div className="-skew-y-3">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">Philosophy</h2>
                                <p className="text-sm leading-relaxed text-slate-400 font-serif italic text-justify">{data.basics.summary}</p>
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary flex items-center justify-center rounded-full text-white font-black text-2xl animate-spin-slow">
                                *
                            </div>
                        </section>
                    )}

                    {/* Creative Skills */}
                    {data.skills?.length > 0 && (
                        <section className="flex flex-col gap-8">
                             <h2 className={theme.styles.sectionTitle}>Talents</h2>
                             <div className="grid grid-cols-1 gap-6">
                                {data.skills.map((skill, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-black uppercase tracking-widest">{skill.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400">95%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full group-hover:w-full transition-all duration-1000" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default CreativeLayout;
