import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, ArrowRight } from 'lucide-react';

const ResumeForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        basics: { name: '', email: '', phone: '', location: '', summary: '' },
        work: [{ company: '', position: '', years: '', highlights: [''] }],
        education: [{ institution: '', area: '', studyType: '', years: '' }],
        skills: [{ name: 'Technical Skills', keywords: [''] }]
    });

    const handleChange = (section, index, field, value) => {
        const newData = { ...formData };
        if (section === 'basics') {
            newData.basics[field] = value;
        } else {
            newData[section][index][field] = value;
        }
        setFormData(newData);
    };

    const handleListChange = (section, index, listIndex, value) => {
        const newData = { ...formData };
        if (section === 'work') {
            newData.work[index].highlights[listIndex] = value;
        } else if (section === 'skills') {
            newData.skills[index].keywords[listIndex] = value;
        }
        setFormData(newData);
    };

    const addItem = (section) => {
        const newData = { ...formData };
        if (section === 'work') {
            newData.work.push({ company: '', position: '', years: '', highlights: [''] });
        } else if (section === 'education') {
            newData.education.push({ institution: '', area: '', studyType: '', years: '' });
        } else if (section === 'skills') {
            newData.skills.push({ name: '', keywords: [''] });
        }
        setFormData(newData);
    };

    const removeItem = (section, index) => {
        const newData = { ...formData };
        newData[section].splice(index, 1);
        setFormData(newData);
    };

    const addListItem = (section, index) => {
        const newData = { ...formData };
        if (section === 'work') {
            newData.work[index].highlights.push('');
        } else if (section === 'skills') {
            newData.skills[index].keywords.push('');
        }
        setFormData(newData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto space-y-12 pb-24"
        >
            {/* Basics Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                    <User className="w-6 h-6" />
                    <h3 className="text-xl font-bold uppercase tracking-widest">Personal Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                        <input
                            type="text"
                            value={formData.basics.name}
                            onChange={(e) => handleChange('basics', null, 'name', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input
                            type="email"
                            value={formData.basics.email}
                            onChange={(e) => handleChange('basics', null, 'email', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                        <input
                            type="text"
                            value={formData.basics.phone}
                            onChange={(e) => handleChange('basics', null, 'phone', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                            placeholder="+1 234 567 890"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                        <input
                            type="text"
                            value={formData.basics.location}
                            onChange={(e) => handleChange('basics', null, 'location', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                            placeholder="New York, NY"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Professional Summary (Optional)</label>
                    <textarea
                        value={formData.basics.summary}
                        onChange={(e) => handleChange('basics', null, 'summary', e.target.value)}
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 resize-none"
                        placeholder="Briefly describe your career goals and key strengths..."
                    />
                </div>
            </section>

            {/* Work Experience */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-primary">
                        <Briefcase className="w-6 h-6" />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Experience</h3>
                    </div>
                    <button
                        onClick={() => addItem('work')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Job
                    </button>
                </div>
                {formData.work.map((job, idx) => (
                    <div key={idx} className="p-8 border border-white/5 bg-white/5 rounded-3xl space-y-6 relative group">
                        <button
                            onClick={() => removeItem('work', idx)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                                <input
                                    type="text"
                                    value={job.company}
                                    onChange={(e) => handleChange('work', idx, 'company', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Position</label>
                                <input
                                    type="text"
                                    value={job.position}
                                    onChange={(e) => handleChange('work', idx, 'position', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Time Period (e.g. 2021 - Present)</label>
                                <input
                                    type="text"
                                    value={job.years}
                                    onChange={(e) => handleChange('work', idx, 'years', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 uppercase">Key Highlights</label>
                            {job.highlights.map((h, hidx) => (
                                <input
                                    key={hidx}
                                    type="text"
                                    value={h}
                                    onChange={(e) => handleListChange('work', idx, hidx, e.target.value)}
                                    placeholder="e.g. Led a team of 5 developers to launch a new feature..."
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            ))}
                            <button
                                onClick={() => addListItem('work', idx)}
                                className="text-xs font-bold text-primary hover:underline"
                            >
                                + Add highlight
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-primary">
                        <GraduationCap className="w-6 h-6" />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Education</h3>
                    </div>
                    <button
                        onClick={() => addItem('education')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Education
                    </button>
                </div>
                {formData.education.map((edu, idx) => (
                    <div key={idx} className="p-8 border border-white/5 bg-white/5 rounded-3xl space-y-6 relative group">
                        <button
                            onClick={() => removeItem('education', idx)}
                            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Institution</label>
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleChange('education', idx, 'institution', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Area of Study</label>
                                <input
                                    type="text"
                                    value={edu.area}
                                    onChange={(e) => handleChange('education', idx, 'area', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Degree Type (e.g. BS, MS)</label>
                                <input
                                    type="text"
                                    value={edu.studyType}
                                    onChange={(e) => handleChange('education', idx, 'studyType', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Graduation Year</label>
                                <input
                                    type="text"
                                    value={edu.years}
                                    onChange={(e) => handleChange('education', idx, 'years', e.target.value)}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-primary">
                        <Code className="w-6 h-6" />
                        <h3 className="text-xl font-bold uppercase tracking-widest">Skills</h3>
                    </div>
                    <button
                        onClick={() => addItem('skills')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {formData.skills.map((skill, idx) => (
                        <div key={idx} className="p-6 border border-white/5 bg-white/5 rounded-3xl space-y-4 relative group">
                            <button
                                onClick={() => removeItem('skills', idx)}
                                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleChange('skills', idx, 'name', e.target.value)}
                                placeholder="Category (e.g. Frontend)"
                                className="w-full bg-transparent text-sm font-bold border-b border-white/10 pb-2 outline-none focus:border-primary"
                            />
                            <div className="flex flex-wrap gap-2">
                                {skill.keywords.map((k, kidx) => (
                                    <input
                                        key={kidx}
                                        type="text"
                                        value={k}
                                        onChange={(e) => handleListChange('skills', idx, kidx, e.target.value)}
                                        placeholder="+ Skill"
                                        className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary/50 min-w-[80px]"
                                    />
                                ))}
                                <button
                                    onClick={() => addListItem('skills', idx)}
                                    className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Action Bar */}
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => onComplete(formData)}
                    className="flex items-center gap-4 px-12 py-5 bg-primary text-white text-lg font-bold rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all group"
                >
                    Review with AI Coach
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default ResumeForm;
