import React from 'react';

const ProfessionalLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-[1in] flex flex-col gap-10`}>
            {/* Centered Header */}
            <header className="flex flex-col items-center text-center gap-4">
                <h1 className={`text-6xl ${theme.fonts.heading} ${theme.colors.primary} uppercase tracking-widest`}>
                    {data.basics?.name}
                </h1>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold uppercase tracking-wider">
                    <span className={theme.colors.secondary}>{data.basics?.email}</span>
                    <span className={theme.colors.secondary}>{data.basics?.phone}</span>
                    <span className={theme.colors.secondary}>{data.basics?.location}</span>
                    {data.basics?.website && (
                         <span className={theme.colors.secondary}>{data.basics?.website}</span>
                    )}
                </div>
                <div className={`w-full h-1 ${theme.colors.accent}`} />
            </header>

            {/* Summary */}
            {data.basics?.summary && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Summary</h2>
                    <p className="text-sm leading-loose italic text-slate-700">{data.basics.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.work?.length > 0 && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Professional Experience</h2>
                    <div className="space-y-10">
                        {data.work.map((job, idx) => (
                            <div key={idx} className="flex flex-col gap-4">
                                <div className="flex justify-between items-end border-b-2 border-slate-100 pb-2">
                                    <h3 className={theme.styles.itemTitle}>{job.position}</h3>
                                    <span className={theme.styles.date}>{job.years}</span>
                                </div>
                                <p className={theme.styles.itemSubTitle + " font-bold uppercase tracking-widest mb-1"}>{job.company}</p>
                                <ul className={theme.styles.bullet}>
                                    {job.highlights?.map((h, i) => (
                                        <li key={i} className="text-sm leading-relaxed mb-1">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-16">
                <div>
                    {/* Education */}
                    {data.education?.length > 0 && (
                        <section>
                            <h2 className={theme.styles.sectionTitle}>Education</h2>
                            <div className="space-y-6">
                                {data.education.map((edu, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <h3 className={theme.styles.itemTitle + " text-sm"}>{edu.studyType} in {edu.area}</h3>
                                        <p className={theme.styles.itemSubTitle + " text-xs"}>{edu.institution}</p>
                                        <span className={theme.styles.date}>{edu.years}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-8">
                     {/* Skills */}
                    {data.skills?.length > 0 && (
                        <section>
                            <h2 className={theme.styles.sectionTitle}>Expertise</h2>
                            <div className="flex flex-wrap gap-4">
                                {data.skills.map((skill, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex flex-col gap-1">
                                        <span className={theme.styles.itemSubTitle + " text-xs uppercase"}>{skill.name}</span>
                                        <p className="text-[10px] text-slate-500 font-bold">{skill.keywords?.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certificates */}
                    {data.certificates?.length > 0 && (
                        <section>
                            <h2 className={theme.styles.sectionTitle}>Certs</h2>
                            <div className="flex flex-col gap-4">
                                {data.certificates.map((cert, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <span className={theme.styles.itemTitle + " text-xs"}>{cert.name}</span>
                                        <span className={theme.styles.itemSubTitle + " text-[10px]"}>{cert.issuer}</span>
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

export default ProfessionalLayout;
