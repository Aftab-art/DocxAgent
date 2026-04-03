import React from 'react';

const CorporateLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-[1.1in] flex flex-col gap-10 text-[#1a202c]`}>
            {/* Corporate Header */}
            <header className="flex justify-between items-end border-b-2 border-[#1a202c] pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className={`text-5xl ${theme.fonts.heading} ${theme.colors.primary} tracking-tight`}>
                        {data.basics?.name}
                    </h1>
                    <p className="text-xl font-bold uppercase tracking-widest text-[#4a5568] italic underline underline-offset-8 decoration-[#e2e8f0]">
                        {data.basics?.label || 'Corporate Professional'}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#718096] bg-[#f7fafc] border border-[#edf2f7] px-8 py-4 rounded-2xl shadow-sm">
                    <span className="flex items-center gap-2">{data.basics?.email}</span>
                    <span className="flex items-center gap-2">{data.basics?.phone}</span>
                    <span className="flex items-center gap-2">{data.basics?.location}</span>
                </div>
            </header>

            {/* Corporate Grid */}
            <div className="grid grid-cols-12 gap-16">
                <div className="col-span-8 flex flex-col gap-12">
                    {/* Experience Corporate */}
                    {data.work?.length > 0 && (
                        <section className="flex flex-col gap-8">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#2d3748] flex items-center gap-4 before:content-[''] before:h-4 before:w-1 before:bg-primary">Selected Professional History</h2>
                            <div className="space-y-10">
                                {data.work.map((job, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 group">
                                        <div className="flex justify-between items-baseline border-b border-[#edf2f7] pb-2 group-hover:border-primary/50 transition-all">
                                            <div className="flex flex-col">
                                                <h3 className="font-black text-lg text-[#1a202c] uppercase">{job.position}</h3>
                                                <p className="text-sm font-bold text-[#4a5568] underline decoration-slate-100 underline-offset-4">{job.company}</p>
                                            </div>
                                            <span className="text-xs font-black text-[#a0aec0] uppercase tracking-tighter bg-white border border-[#edf2f7] px-3 py-1 rounded shadow-sm italic">
                                                {job.years}
                                            </span>
                                        </div>
                                        <ul className="list-disc list-outside ml-6 space-y-2">
                                            {job.highlights?.map((h, i) => (
                                                <li key={i} className="text-sm leading-relaxed text-[#4a5568]">{h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 flex flex-col gap-12">
                    {/* Summary Corporate */}
                    {data.basics?.summary && (
                        <section className="flex flex-col gap-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#718096]">Executive Summary</h2>
                            <p className="text-xs leading-relaxed text-slate-500 font-medium text-justify">{data.basics.summary}</p>
                        </section>
                    )}

                    {/* Education Corporate */}
                    {data.education?.length > 0 && (
                        <section className="flex flex-col gap-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#718096]">Highest Qualifications</h2>
                            <div className="flex flex-col gap-6">
                                {data.education.map((edu, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 p-6 bg-[#f7fafc] border border-[#edf2f7] rounded-3xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{edu.studyType}</span>
                                        <h3 className="font-black text-sm text-[#2d3748] uppercase leading-none mt-1">{edu.area}</h3>
                                        <p className="text-[10px] font-bold text-[#718096] italic mt-1">{edu.institution}</p>
                                        <span className="text-[10px] font-black text-[#cbd5e0] uppercase tracking-widest mt-4 border-t border-[#e2e8f0] pt-2">
                                            Graduated {edu.years}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills Corporate */}
                    {data.skills?.length > 0 && (
                        <section className="flex flex-col gap-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#718096]">Core Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 bg-white border-2 border-[#edf2f7] px-4 py-2 rounded-2xl hover:border-primary/30 transition-all">
                                        <span className="text-[10px] font-black text-[#2d3748] uppercase">{skill.name}</span>
                                        <p className="text-[9px] text-[#a0aec0] font-bold uppercase tracking-tighter">Verified</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorporateLayout;
