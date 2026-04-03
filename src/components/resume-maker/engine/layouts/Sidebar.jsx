import React from 'react';

const SidebarLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} flex flex-row overflow-hidden`}>
            {/* Sidebar Left */}
            <aside className={`w-[28%] h-full ${theme.colors.accent} border-r ${theme.colors.border} p-10 flex flex-col gap-10 text-slate-800`}>
                <div className="flex flex-col gap-2">
                    <h1 className={`text-4xl ${theme.fonts.heading} ${theme.colors.primary} break-words leading-none`}>
                        {data.basics?.name}
                    </h1>
                </div>

                <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary opacity-50">Email</span>
                        <span className="text-slate-900 border-b border-slate-200 pb-2">{data.basics?.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-primary opacity-50">Phone</span>
                        <span className="text-slate-900 border-b border-slate-200 pb-2">{data.basics?.phone}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-primary opacity-50">Location</span>
                        <span className="text-slate-900 border-b border-slate-200 pb-2">{data.basics?.location}</span>
                    </div>
                </div>

                {/* Sidebar Skills */}
                {data.skills?.length > 0 && (
                    <section className="flex flex-col gap-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-4">Skills</h2>
                        <div className="flex flex-col gap-4">
                            {data.skills.map((skill, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 bg-white/50 border border-white rounded-2xl shadow-sm">
                                    <span className="text-xs font-black uppercase tracking-tighter text-slate-900">{skill.name}</span>
                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '90%' }} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{skill.keywords?.[0]}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sidebar Education */}
                {data.education?.length > 0 && (
                    <section className="flex flex-col gap-6">
                         <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary border-l-4 border-primary pl-4">Education</h2>
                         <div className="flex flex-col gap-6">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex flex-col gap-1 italic">
                                    <span className="text-[10px] font-black text-slate-900 tracking-tighter uppercase">{edu.area}</span>
                                    <span className="text-[10px] font-medium text-slate-400 leading-tight">{edu.institution}</span>
                                    <span className="text-[9px] font-black text-primary opacity-50 mt-2">{edu.years}</span>
                                </div>
                            ))}
                         </div>
                    </section>
                )}
            </aside>

            {/* Main Content Right */}
            <main className="flex-1 h-full p-16 flex flex-col gap-12 overflow-y-auto no-scrollbar shadow-inner bg-slate-50/10">
                {/* Summary Sidebar */}
                {data.basics?.summary && (
                    <section className="relative">
                         <span className="absolute -top-10 -left-6 text-9xl text-slate-100 font-serif leading-none opacity-50 select-none">“</span>
                        <p className="text-sm leading-relaxed text-slate-700 italic border-l-2 border-slate-100 pl-8 text-justify relative z-10">{data.basics.summary}</p>
                    </section>
                )}

                {/* Experience Sidebar */}
                {data.work?.length > 0 && (
                    <section className="flex flex-col gap-10">
                         <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-300 flex items-center gap-6 after:content-[''] after:h-[2px] after:flex-1 after:bg-slate-100">Experience</h2>
                         <div className="space-y-12">
                            {data.work.map((job, idx) => (
                                <div key={idx} className="flex flex-col gap-4 group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-xl font-black text-slate-900 leading-none hover:text-primary transition-colors cursor-pointer">{job.position}</h3>
                                            <p className="text-sm font-bold text-slate-400 italic tracking-widest">{job.company}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full uppercase tracking-tighter group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                                {job.years}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {job.highlights?.map((h, i) => (
                                            <li key={i} className="text-xs leading-relaxed text-slate-600 bg-white/50 border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
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
        </div>
    );
};

export default SidebarLayout;
