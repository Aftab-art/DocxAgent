import React from 'react';

const AcademicLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} font-serif p-20 flex flex-col gap-12 text-slate-800`}>
            {/* Academic Header */}
            <header className="flex flex-col items-center text-center gap-4">
                <h1 className="text-4xl font-bold uppercase tracking-widest border-b-4 border-double border-slate-300 pb-2">
                    {data.basics?.name}
                </h1>
                <div className="flex flex-col items-center gap-1 text-xs font-medium italic text-slate-500">
                    <span>{data.basics?.location} | {data.basics?.phone} | {data.basics?.email}</span>
                    {data.basics?.website && <span>{data.basics?.website}</span>}
                </div>
            </header>

            {/* Research Summary */}
            {data.basics?.summary && (
                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-200 mb-4 tracking-[0.1em]">Research Interests / Summary</h2>
                    <p className="text-sm leading-loose text-justify">{data.basics.summary}</p>
                </section>
            )}

            {/* Education Academic First */}
            {data.education?.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-200 mb-4 tracking-[0.1em]">Education</h2>
                    <div className="space-y-6">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-base">{edu.institution}</h3>
                                    <p className="text-sm italic">{edu.studyType} in {edu.area}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{edu.years}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Teaching Experience */}
            {data.work?.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-200 mb-4 tracking-[0.1em]">Teaching & Professional Experience</h2>
                    <div className="space-y-8">
                        {data.work.map((job, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">{job.position}</h3>
                                    <span className="text-xs font-bold text-slate-400">{job.years}</span>
                                </div>
                                <p className="text-sm font-medium italic text-slate-600">{job.company}</p>
                                <ul className="list-disc list-outside ml-6 space-y-1">
                                    {job.highlights?.map((h, i) => (
                                        <li key={i} className="text-sm leading-relaxed text-slate-700">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Publications / Certs Academic */}
            {data.certificates?.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-200 mb-4 tracking-[0.1em]">Publications & Honors</h2>
                    <div className="space-y-4">
                        {data.certificates.map((cert, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-slate-800">{cert.name}</span>
                                <span className="text-xs italic text-slate-500">{cert.issuer}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default AcademicLayout;
