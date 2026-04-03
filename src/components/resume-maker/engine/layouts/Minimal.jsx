import React from 'react';

const MinimalLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
         <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-16 flex flex-col gap-12`}>
            {/* Minimal Header */}
            <header className="flex justify-between items-start border-b border-slate-100 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className={`text-4xl ${theme.fonts.heading} ${theme.colors.primary}`}>
                        {data.basics?.name}
                    </h1>
                    <p className="text-sm font-medium text-slate-500">{data.basics?.label || 'Professional'}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>{data.basics?.email}</span>
                    <span>{data.basics?.phone}</span>
                    <span>{data.basics?.location}</span>
                </div>
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-[150px_1fr] gap-12">
                <aside className="flex flex-col gap-12">
                    {/* Skills Minimal */}
                    {data.skills?.length > 0 && (
                        <nav className="flex flex-col gap-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Skills</h2>
                            <div className="flex flex-col gap-3">
                                {data.skills.map((skill, idx) => (
                                    <span key={idx} className="text-xs font-bold text-slate-600">{skill.name}</span>
                                ))}
                            </div>
                        </nav>
                    )}

                    {/* Education Minimal */}
                    {data.education?.length > 0 && (
                        <nav className="flex flex-col gap-4">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Education</h2>
                            <div className="flex flex-col gap-4">
                                {data.education.map((edu, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{edu.area}</span>
                                        <span className="text-[10px] font-medium text-slate-400">{edu.years}</span>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    )}
                </aside>

                <main className="flex flex-col gap-12">
                     {/* Summary */}
                    {data.basics?.summary && (
                        <section>
                            <p className="text-sm leading-relaxed text-slate-600 border-l-2 border-slate-100 pl-6 italic">{data.basics.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.work?.length > 0 && (
                        <section className="flex flex-col gap-10">
                            {data.work.map((job, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className={theme.styles.itemTitle}>{job.position}</h3>
                                        <span className={theme.styles.date}>{job.years}</span>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">{job.company}</p>
                                    <ul className="space-y-2">
                                        {job.highlights?.map((h, i) => (
                                            <li key={i} className="text-xs leading-relaxed text-slate-500">• {h}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MinimalLayout;
