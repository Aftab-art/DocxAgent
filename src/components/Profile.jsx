import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Key,
    Cpu,
    LogOut,
    Shield,
    ChevronLeft,
    CheckCircle2,
    Settings2,
    Edit2,
    Check,
    Loader2,
    Eye,
    EyeOff,
    Lock
} from 'lucide-react';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Profile = ({ user, apiKey, setApiKey, model, setModel, onBack }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user.displayName || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === user.displayName) {
            setIsEditingName(false);
            return;
        }

        setIsUpdating(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: newName
            });
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
            setIsEditingName(false);
        } catch (error) {
            console.error("Failed to update name:", error);
        } finally {
            setIsUpdating(false);
        }
    };

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

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl px-4 py-2 w-full max-w-sm">
                                        <input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            autoFocus
                                            className="bg-transparent text-2xl font-black text-white outline-none w-full"
                                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateName()}
                                        />
                                        <button
                                            onClick={handleUpdateName}
                                            disabled={isUpdating}
                                            className="p-1.5 bg-primary rounded-lg text-white"
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 group">
                                        <h2 className="text-4xl font-black tracking-tight text-white">{user.displayName || "User Profile"}</h2>
                                        <button
                                            onClick={() => setIsEditingName(true)}
                                            className="opacity-0 group-hover:opacity-100 p-2 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <AnimatePresence>
                                    {updateSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
                                        >
                                            <Check className="w-3 h-3" /> Profile Updated
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </section>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* API Config Card */}
                        <div className="p-10 glass-morphism rounded-[2.5rem] border-white/5 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Lock className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold">Security Vault</h3>
                                </div>
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="p-2 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all"
                                >
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-1 tracking-widest">Gemini API Key</label>
                                    <div className="relative group">
                                        <input
                                            type={showKey ? "text" : "password"}
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-primary/50 transition-all font-mono tracking-wider"
                                            placeholder="Optional: Manual API Key Override"
                                        />
                                        <Shield className={`absolute right-4 top-4 w-4 h-4 transition-colors ${showKey ? 'text-primary' : 'text-slate-500'}`} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-xl w-fit">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                                            {apiKey ? "Manual Override Active" : "System Managed Security Active"}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-2 leading-relaxed flex items-center gap-2 italic">
                                        <Shield className="w-3 h-3" />
                                        If no key is entered, the system will use the secure server-side key.
                                    </p>
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
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] outline-none focus:border-primary/50 text-white appearance-none cursor-pointer hover:bg-black/60 transition-all font-bold scrollbar-hide"
                                    >
                                        <option value="models/gemini-2.0-flash">Auto-Select (Recommended)</option>

                                        <optgroup label="Gemini 2.5 Series (Experimental)">
                                            <option value="models/gemini-2.5-flash">Gemini 2.5 Flash</option>
                                            <option value="models/gemini-2.5-pro">Gemini 2.5 Pro</option>
                                            <option value="models/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                                            <option value="models/gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
                                            <option value="models/gemini-2.5-flash-native-audio-latest">Gemini 2.5 Flash Native Audio</option>
                                            <option value="models/gemini-2.5-computer-use-preview-10-2025">Gemini 2.5 Computer Use</option>
                                        </optgroup>

                                        <optgroup label="Gemini 2.0 Series">
                                            <option value="models/gemini-2.0-flash">Gemini 2.0 Flash</option>
                                            <option value="models/gemini-2.0-flash-001">Gemini 2.0 Flash-001</option>
                                            <option value="models/gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</option>
                                            <option value="models/gemini-2.0-flash-lite-001">Gemini 2.0 Flash Lite-001</option>
                                            <option value="models/gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Exp</option>
                                        </optgroup>

                                        <optgroup label="Gemini 3.x Series (Preview)">
                                            <option value="models/gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                                            <option value="models/gemini-3.1-pro-preview-customtools">Gemini 3.1 Pro (Custom Tools)</option>
                                            <option value="models/gemini-3-pro-preview">Gemini 3 Pro Preview</option>
                                            <option value="models/gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                                        </optgroup>

                                        <optgroup label="Gemma Open Models">
                                            <option value="models/gemma-3-27b-it">Gemma 3 27B</option>
                                            <option value="models/gemma-3-12b-it">Gemma 3 12B</option>
                                            <option value="models/gemma-3-4b-it">Gemma 3 4B</option>
                                            <option value="models/gemma-3-1b-it">Gemma 3 1B</option>
                                        </optgroup>

                                        <optgroup label="Gemini 1.5 & Legacy">
                                            <option value="models/gemini-1.5-flash">Gemini 1.5 Flash</option>
                                            <option value="models/gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            <option value="models/gemini-flash-latest">Gemini Flash (Latest)</option>
                                            <option value="models/gemini-pro-latest">Gemini Pro (Latest)</option>
                                        </optgroup>

                                        <optgroup label="Specialized Engines">
                                            <option value="models/deep-research-pro-preview-12-2025">Deep Research Pro</option>
                                            <option value="models/aqa">AQA (Attributable QA)</option>
                                            <option value="models/gemini-embedding-001">Text Embedding</option>
                                        </optgroup>

                                        <optgroup label="Visual & Creative">
                                            <option value="models/imagen-4.0-ultra-generate-001">Imagen 4 Ultra</option>
                                            <option value="models/veo-3.0-fast-generate-001">Veo 3 Fast</option>
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
