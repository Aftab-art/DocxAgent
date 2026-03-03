import React from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Key,
    Cpu,
    LogOut,
    Shield,
    ChevronLeft,
    CheckCircle2,
    Settings2
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Profile = ({ user, apiKey, setApiKey, model, setModel, onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-[#090a0f]"
        >
            <header className="h-20 flex items-center px-12 border-b border-white/5 backdrop-blur-xl z-10 shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold">Back to Workspace</span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-12">
                    {/* User Profile Header */}
                    <section className="flex items-center gap-8 p-10 glass-morphism rounded-[3rem] border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />

                        <div className="relative">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white/10 shadow-2xl" />
                            ) : (
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center border-4 border-white/10 shadow-2xl">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 p-2.5 bg-green-500 rounded-2xl border-4 border-[#090a0f] text-white">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tight text-white">{user.displayName || "User Profile"}</h2>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                        </div>
                    </section>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* API Config Card */}
                        <div className="p-10 glass-morphism rounded-[2.5rem] border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Key className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">API Security</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-1">Gemini API Key</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-primary/50 transition-all font-mono"
                                            placeholder="AIza..."
                                        />
                                        <Shield className="absolute right-4 top-4 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-3 leading-relaxed">Your key is stored locally in this browser session for security purposes.</p>
                                </div>
                            </div>
                        </div>

                        {/* Engine Selection Card */}
                        <div className="p-10 glass-morphism rounded-[2.5rem] border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">AI Engine</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-1">Preferred Model</label>
                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-primary/50 text-white appearance-none cursor-pointer hover:bg-black/60 transition-all"
                                    >
                                        <option value="models/gemini-2.0-flash">Auto-Select (Recommended)</option>
                                        <optgroup label="Gemini 2.0 Series">
                                            <option value="models/gemini-2.0-flash">Gemini 2.0 Flash</option>
                                            <option value="models/gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Exp</option>
                                        </optgroup>
                                        <optgroup label="Gemini 1.5 Series">
                                            <option value="models/gemini-1.5-flash">Gemini 1.5 Flash</option>
                                            <option value="models/gemini-1.5-pro">Gemini 1.5 Pro</option>
                                        </optgroup>
                                    </select>
                                    <div className="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Settings2 className="w-4 h-4 text-slate-500" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">Adaptive model switching enabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400">Need help?</p>
                            <p className="text-[10px] text-slate-600">Refer to our documentation for API troubleshooting.</p>
                        </div>

                        <button
                            onClick={() => signOut(auth)}
                            className="flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold shadow-2xl shadow-red-500/5 active:scale-95"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out Account
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
