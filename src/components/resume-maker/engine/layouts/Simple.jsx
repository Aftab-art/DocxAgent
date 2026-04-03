import React from 'react';

const SimpleLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-12 flex flex-col gap-8 text-slate-900 shadow-inner`}>
            {/* Simple Header */}
            <header className="flex flex-col gap-2 border-b border-slate-100 pb-6">
                <h1 className={`text-4xl ${theme.fonts.heading} ${theme.colors.primary} tracking-tighter`}>
                    {data.basics?.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>{data.basics?.location}</span>
                    <span className="text-slate-200">|</span>
                    <span>{data.basics?.phone}</span>
                    <span className="text-slate-200">|</span>
                    <span>{data.basics?.email}</span>
                </div>
            </header>

            {/* Summary Simple */}
            {data.basics?.summary && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Profile</h2>
                    <p className="text-sm leading-relaxed text-slate-600 border-l-2 border-slate-100 pl-6 italic">{data.basics.summary}</p>
                </section>
            )}

            {/* Experience Simple */}
            {data.work?.length > 0 && (
                <section className="flex flex-col gap-6">
                     <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Experience</h2>
                     <div className="space-y-8">
                        {data.work.map((job, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base text-slate-900">{job.position}</h3>
                                    <span className="text-xs font-bold text-slate-400 italic">{job.years}</span>
                                </div>
                                <p className="text-xs font-black uppercase tracking-tighter text-slate-400">{job.company}</p>
                                <ul className="list-disc list-outside ml-6 space-y-1">
                                    {job.highlights?.map((h, i) => (
                                        <li key={i} className="text-xs leading-relaxed text-slate-600">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                     </div>
                </section>
            )}

            {/* Education Simple */}
            {data.education?.length > 0 && (
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Education</h2>
                    <div className="flex flex-col gap-4">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-baseline">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{edu.area}</span>
                                    <span className="text-xs font-medium text-slate-400 italic">{edu.institution}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{edu.years}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Simple */}
            {data.skills?.length > 0 && (
                <section className="flex flex-col gap-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Skills</h2>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{skill.name}</span>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                    {skill.keywords?.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default SimpleLayout;
