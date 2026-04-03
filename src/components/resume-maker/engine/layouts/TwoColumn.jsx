import React from 'react';

const TwoColumnLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} flex flex-row overflow-hidden`}>
            {/* Sidebar */}
            <aside className={`w-[35%] h-full ${theme.colors.accent} border-r ${theme.colors.border} p-12 flex flex-col gap-8`}>
                <div className="flex flex-col gap-2">
                    <h1 className={`text-4xl ${theme.fonts.heading} ${theme.colors.primary} break-words`}>
                        {data.basics?.name}
                    </h1>
                </div>

                <section className="flex flex-col gap-4">
                    <h2 className={theme.styles.sectionTitle}>Contact</h2>
                    <div className="flex flex-col gap-3 text-sm">
                        <span className={theme.colors.secondary}>{data.basics?.email}</span>
                        <span className={theme.colors.secondary}>{data.basics?.phone}</span>
                        <span className={theme.colors.secondary}>{data.basics?.location}</span>
                        {data.basics?.website && (
                             <span className={theme.colors.secondary}>{data.basics?.website}</span>
                        )}
                    </div>
                </section>

                {/* Skills */}
                {data.skills?.length > 0 && (
                    <section className="flex flex-col gap-4">
                        <h2 className={theme.styles.sectionTitle}>Skills</h2>
                        <div className="flex flex-col gap-4">
                            {data.skills.map((skill, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <span className={theme.styles.itemSubTitle}>{skill.name}</span>
                                    <p className="text-[10px] leading-tight text-slate-500 uppercase tracking-widest font-black">
                                        {skill.keywords?.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates */}
                {data.certificates?.length > 0 && (
                    <section className="flex flex-col gap-4">
                        <h2 className={theme.styles.sectionTitle}>Certs</h2>
                        <div className="flex flex-col gap-3">
                            {data.certificates.map((cert, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className={theme.styles.itemTitle + " text-xs uppercase"}>{cert.name}</span>
                                    <span className={theme.styles.itemSubTitle + " text-[10px]"}>{cert.issuer}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full p-12 flex flex-col gap-8 overflow-y-auto no-scrollbar">
                {/* Summary */}
                {data.basics?.summary && (
                    <section>
                        <h2 className={theme.styles.sectionTitle}>Professional Summary</h2>
                        <p className="text-sm leading-relaxed">{data.basics.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.work?.length > 0 && (
                    <section>
                        <h2 className={theme.styles.sectionTitle}>Experience</h2>
                        <div className="space-y-8">
                            {data.work.map((job, idx) => (
                                <div key={idx} className="flex flex-col gap-3">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className={theme.styles.itemTitle}>{job.position}</h3>
                                            <p className={theme.styles.itemSubTitle}>{job.company}</p>
                                        </div>
                                        <span className={theme.styles.date}>{job.years}</span>
                                    </div>
                                    <ul className={theme.styles.bullet}>
                                        {job.highlights?.map((h, i) => (
                                            <li key={i} className="text-xs leading-relaxed">{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education?.length > 0 && (
                    <section>
                        <h2 className={theme.styles.sectionTitle}>Education</h2>
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className={theme.styles.itemTitle}>{edu.studyType} in {edu.area}</h3>
                                        <p className={theme.styles.itemSubTitle}>{edu.institution}</p>
                                    </div>
                                    <span className={theme.styles.date}>{edu.years}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default TwoColumnLayout;
