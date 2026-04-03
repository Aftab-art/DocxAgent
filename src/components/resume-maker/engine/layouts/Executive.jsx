import React from 'react';

const ExecutiveLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-[1.2in] flex flex-col gap-12 text-[#0a192f]`}>
            {/* Executive Header */}
            <header className="flex flex-col gap-6 border-b-4 border-[#0a192f] pb-8">
                <div className="flex flex-col gap-2">
                    <h1 className={`text-6xl ${theme.fonts.heading} ${theme.colors.primary} tracking-tight leading-none`}>
                        {data.basics?.name}
                    </h1>
                    <p className="text-2xl font-bold uppercase tracking-[0.2em] text-[#112240] opacity-80">
                        {data.basics?.label || 'Executive Leader'}
                    </p>
                </div>
                <div className="flex flex-wrap gap-x-12 gap-y-2 text-sm font-black uppercase tracking-widest text-[#0a192f]">
                    <span className="flex items-center gap-2">{data.basics?.location}</span>
                    <span className="flex items-center gap-2">{data.basics?.phone}</span>
                    <span className="flex items-center gap-2 text-primary">{data.basics?.email}</span>
                </div>
            </header>

            {/* Content: Summary & Experience */}
            <main className="flex flex-col gap-12">
                {/* Summary */}
                {data.basics?.summary && (
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-[#0a192f] mb-6 flex items-center gap-4 after:content-[''] after:h-[2px] after:flex-1 after:bg-slate-200">Executive Summary</h2>
                        <p className="text-base leading-relaxed text-slate-700 italic border-l-8 border-[#0a192f] pl-8 py-2 bg-slate-50/50 rounded-r-2xl text-justify">{data.basics.summary}</p>
                    </section>
                )}

                {/* Experience Executive */}
                {data.work?.length > 0 && (
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-[#0a192f] mb-6 flex items-center gap-4 after:content-[''] after:h-[2px] after:flex-1 after:bg-slate-200">Career Trajectory</h2>
                        <div className="space-y-12">
                            {data.work.map((job, idx) => (
                                <div key={idx} className="flex flex-col gap-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-2xl font-black text-[#0a192f] leading-none uppercase">{job.position}</h3>
                                            <p className="text-lg font-bold text-[#112240] opacity-70 italic tracking-widest">{job.company}</p>
                                        </div>
                                        <span className="text-sm font-black bg-[#0a192f] text-white px-6 py-1.5 rounded-full shadow-lg shadow-[#0a192f]/20 uppercase tracking-widest">
                                            {job.years}
                                        </span>
                                    </div>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {job.highlights?.map((h, i) => (
                                            <li key={i} className="text-sm leading-relaxed text-slate-700 font-medium pl-6 border-l-2 border-slate-100 hover:border-[#0a192f] transition-all">
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

            {/* Sidebar-like Footer Grid for Skills & Education */}
            <div className="grid grid-cols-2 gap-20 border-t-2 border-slate-100 pt-12">
                 {/* Education */}
                 {data.education?.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black uppercase tracking-widest text-[#0a192f] mb-6">Academic Background</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <h3 className="font-bold text-base text-[#0a192f]">{edu.institution}</h3>
                                    <p className="text-sm italic text-[#112240] underline decoration-[#0a192f]/20 underline-offset-4">{edu.studyType} in {edu.area}</p>
                                    <span className="text-xs font-black text-slate-400 mt-1">{edu.years}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Executive */}
                {data.skills?.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black uppercase tracking-widest text-[#0a192f] mb-6">Core Competencies</h2>
                        <div className="flex flex-wrap gap-4">
                            {data.skills.map((skill, idx) => (
                                <div key={idx} className="flex flex-col bg-slate-50 border border-slate-100 px-6 py-3 rounded-[2rem] hover:bg-[#0a192f] hover:text-white transition-all group">
                                    <span className="text-sm font-black uppercase tracking-widest">{skill.name}</span>
                                    <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-slate-300 font-bold tracking-tighter">
                                        {skill.keywords?.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ExecutiveLayout;
