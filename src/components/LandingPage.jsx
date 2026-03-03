import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Zap,
    Shield,
    Cpu,
    CheckCircle2,
    ArrowRight,
    Users,
    ChevronRight,
    Search,
    Edit3,
    History,
    Download,
    Brain
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const features = [
        {
            icon: <Cpu className="w-6 h-6 text-primary" />,
            title: "Multi-Model Intelligence",
            description: "Automatically cycles through 44+ Gemini models to bypass quota limits and find the best performing available engine."
        },
        {
            icon: <FileText className="w-6 h-6 text-primary" />,
            title: "Map-and-Snippet discovery",
            description: "Initial mapping phase discover document structure, allowing the AI to read only relevant snippets—saving 90% of tokens."
        },
        {
            icon: <Zap className="w-6 h-6 text-primary" />,
            title: "Multi-Turn Interactive Editing",
            description: "A stateful engine that remembers context across multiple turns, enabling complex, conversational document refinement."
        },
        {
            icon: <Shield className="w-6 h-6 text-primary" />,
            title: "Enterprise Context Security",
            description: "Session-based temporary data handling ensures your confidential documents are never permanently stored on servers."
        }
    ];

    const stats = [
        { label: "Models Supported", value: "44+" },
        { label: "Processing Speed", value: "<1.2s" },
        { label: "Accuracy Rate", value: "99.9%" },
        { label: "Active Sessions", value: "12k+" }
    ];

    const workflowSteps = [
        {
            number: "01",
            title: "Structure Mapping",
            description: "Upload your .docx file. Our engine immediately generates a structural map of every paragraph and table.",
            icon: <FileText className="w-5 h-5 text-primary" />
        },
        {
            number: "02",
            title: "Snippet Discovery",
            description: "The AI uses the map to surgically 'teleport' to specific sections, reading only what is needed for your request.",
            icon: <Search className="w-5 h-5 text-primary" />
        },
        {
            number: "03",
            title: "Contextual Refinement",
            description: "Chat naturally with the agent. It maintains memory and context to handle multi-step instructions.",
            icon: <Edit3 className="w-5 h-5 text-primary" />
        },
        {
            number: "04",
            title: "Tracked Change Export",
            description: "Download results with native Microsoft Word tracked changes injected directly into the XML structure.",
            icon: <Download className="w-5 h-5 text-primary" />
        }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Handle direct hash navigation on mount
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => scrollToSection(id), 100);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-[#090a0f] text-slate-100 font-['Inter'] selection:bg-primary/30 overflow-x-hidden">
            {/* Header / Navbar */}
            <nav className="fixed top-0 w-full z-50 px-12 py-8 flex justify-between items-center backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Brain className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Word Engine </span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <button
                        onClick={() => scrollToSection('features')}
                        className={`hover:text-white transition-all hover:tracking-[0.3em] ${location.hash === '#features' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                    >
                        Features
                    </button>
                    <button
                        onClick={() => scrollToSection('workflow')}
                        className={`hover:text-white transition-all hover:tracking-[0.3em] ${location.hash === '#workflow' ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                    >
                        Workflow
                    </button>
                    <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
                    <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-white text-black rounded-full hover:bg-slate-200 transition-all font-black">Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="top" className="relative pt-60 pb-40 px-12 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Background Hero Image */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#090a0f] via-transparent to-[#090a0f]" />
                    <img
                        src="/hero_bg_docagent.png"
                        alt="Hero Background"
                        className="w-full h-full object-cover scale-110 animate-slow-pulse"
                        onError={(e) => e.target.style.display = 'none'} // Fallback if not copied yet
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 space-y-8 max-w-5xl"
                >
                    <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/10">
                        <Zap className="w-3.5 h-3.5 fill-primary" /> v15.2 Word Engine Active
                    </div>

                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] text-glow">
                        Surgical AI for <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Word Documents</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        The world’s first Neural Document Agent using Map-and-Snippet discovery. Automate complex edits and analysis with surgical precision.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/workspace')}
                            className="px-12 py-5 bg-primary text-white font-black rounded-[2rem] flex items-center gap-3 shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)] transition-all"
                        >
                            Open Neural Workspace <ArrowRight className="w-5 h-5" />
                        </motion.button>
                        <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] font-bold hover:bg-white/10 transition-all font-['Space_Grotesk']">
                            View API Specs
                        </button>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative z-10 mt-32 max-w-6xl w-full mx-auto"
                >
                    <div className="relative group p-4 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop"
                            alt="Dashboard Interface"
                            className="rounded-[2rem] w-full shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] -z-10 group-hover:bg-primary/30 transition-all" />
                    </div>
                </motion.div>
            </header>

            {/* Stats Grid */}
            <section className="px-12 py-20 bg-white/[0.02] border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <h3 className="text-4xl font-black text-white">{stat.value}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-12 py-40 max-w-7xl mx-auto space-y-24">
                <div className="text-center space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Precision Core</h4>
                    <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Advanced Document Intelligence</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-10 glass-morphism rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group hover:-translate-y-2"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="px-12 py-40 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="text-center space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Neural Cycle</h4>
                        <h2 className="text-5xl font-bold tracking-tight text-white leading-tight">Platform Workflow</h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

                        {workflowSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-[#0f1118] border border-white/10 rounded-full flex items-center justify-center relative group">
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500" />
                                    <div className="relative z-10 text-primary">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#090a0f]">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-12 py-20 border-t border-white/5 bg-black/40 text-slate-500">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20 text-primary">
                                <Brain className="w-4 h-4 stroke-[2.5px]" />
                            </div>
                            <span className="font-bold tracking-tight text-white italic">Word Engine V2</span>
                        </div>
                        <p className="max-w-sm text-sm font-medium leading-loose">
                            Redefining document editing through neural intelligence and Map-and-Snippet discovery at the XML layer.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Navigation</h4>
                        <ul className="space-y-3 text-sm font-bold">
                            <li><button onClick={() => scrollToSection('top')} className="hover:text-primary transition-colors">Home</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors">Features</button></li>
                            <li><button onClick={() => scrollToSection('workflow')} className="hover:text-primary transition-colors">Workflow</button></li>
                            <li><button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Legal</button></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System Status</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                            <span className="text-xs font-bold text-slate-100 italic">V15.2 Word Engine Online</span>
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-widest">© 2026 Word Engine Network</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
