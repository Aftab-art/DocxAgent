import React from 'react';

const ModernLayout = ({ data, theme }) => {
    if (!data) return null;

    return (
        <div className={`w-full min-h-full ${theme.colors.background} ${theme.fonts.body} p-[0.75in] flex flex-col gap-8`}>
            {/* Header */}
            <header className="flex flex-col gap-4">
                <h1 className={`text-5xl ${theme.fonts.heading} ${theme.colors.primary}`}>
                    {data.basics?.name}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium">
                    <span className={theme.colors.secondary}>{data.basics?.email}</span>
                    <span className={theme.colors.secondary}>{data.basics?.phone}</span>
                    <span className={theme.colors.secondary}>{data.basics?.location}</span>
                    {data.basics?.website && (
                        <span className={theme.colors.secondary}>{data.basics?.website}</span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {data.basics?.summary && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Profile</h2>
                    <p className="text-sm leading-relaxed">{data.basics.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.work?.length > 0 && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Experience</h2>
                    <div className="space-y-6">
                        {data.work.map((job, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className={theme.styles.itemTitle}>{job.position} | {job.company}</h3>
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
                    <div className="space-y-4">
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

            {/* Skills */}
            {data.skills?.length > 0 && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-x-8 gap-y-4">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <span className={theme.styles.itemSubTitle}>{skill.name}</span>
                                <p className="text-xs">{skill.keywords?.join(', ')}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certificates */}
            {data.certificates?.length > 0 && (
                <section>
                    <h2 className={theme.styles.sectionTitle}>Certifications</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.certificates.map((cert, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className={theme.styles.itemTitle + " text-sm"}>{cert.name}</span>
                                <span className={theme.styles.itemSubTitle + " text-xs"}>{cert.issuer}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ModernLayout;
