import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import { Camera, Save, Sparkles, User, Heart, FileText } from 'lucide-react';

export default function Profile() {
    const { user: tgUser } = useTelegram();
    const [profile, setProfile] = useState(() => {
        if (tgUser) {
            return {
                first_name: tgUser.first_name,
                bio: '',
                looking_for: 'all',
                photo_url: tgUser.photo_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
            };
        } else {
            return {
                first_name: 'Demo User',
                bio: 'I love coding and coffee.',
                looking_for: 'female',
                photo_url: 'https://randomuser.me/api/portraits/men/99.jpg'
            };
        }
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // In a real app, toast notification would go here
        }, 1000);
    };

    // Reusing the "Erotic Flux" Pulse Frame for consistency
    const ProfileAvatarFrame = ({ children }) => (
        <div className="relative group w-40 h-40 flex items-center justify-center mx-auto mb-8">
            {/* 1. Sensual Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-pink-600 to-purple-800 blur-xl opacity-50"
            />

            {/* 2. The Liquid Rim */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "40% 60% 70% 30% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 border-[2px] border-pink-400/40 overflow-hidden z-10 bg-rose-950/20 backdrop-blur-sm"
            >
                <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-fuchsia-900/10 mix-blend-overlay z-10" />
                    {children}
                </div>
            </motion.div>

            {/* Camera Icon Badge */}
            <button className="absolute bottom-1 right-1 z-20 p-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-lg border border-pink-400/30 hover:scale-110 transition-transform">
                <Camera size={16} />
            </button>
        </div>
    );

    const GlassInput = ({ label, icon: Icon, value, onChange, disabled, type = "text" }) => (
        <div className="group space-y-2">
            <label className="flex items-center gap-2 text-xs font-medium tracking-widest text-pink-200/50 uppercase ml-1 group-focus-within:text-pink-300 transition-colors">
                <Icon size={12} /> {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="
                        w-full p-4 rounded-xl 
                        bg-white/5 border border-white/10 
                        text-pink-50 placeholder-pink-200/20
                        focus:border-pink-500/50 focus:bg-pink-900/10 focus:shadow-[0_0_20px_rgba(236,72,153,0.1)]
                        outline-none transition-all duration-300
                    "
                />
            </div>
        </div>
    );

    const OptionPill = ({ label, value, current, onClick }) => (
        <button
            onClick={onClick}
            className={`
                flex-1 py-3 px-4 rounded-lg text-xs font-medium tracking-wider uppercase transition-all duration-300 border
                ${current === value
                    ? 'bg-pink-600/20 border-pink-500 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                    : 'bg-white/5 border-white/5 text-stone-500 hover:border-white/20 hover:text-stone-300'}
            `}
        >
            {label}
        </button>
    );

    return (
        <Layout>
            <div className="min-h-screen pb-24 px-6 pt-8 font-sans bg-[#0f0305] text-stone-200 selection:bg-pink-500/30">
                {/* Background Atmosphere */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#38040e_0%,#000000_100%)]" />
                    <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                </div>

                <div className="relative z-10 max-w-md mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h2
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-3xl font-thin tracking-[0.2em] text-pink-100 uppercase"
                        >
                            Your <span className="font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Essence</span>
                        </motion.h2>
                        <p className="text-pink-300/40 text-xs tracking-widest mt-2 uppercase">Curate your persona</p>
                    </div>

                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ProfileAvatarFrame>
                            <img
                                src={profile.photo_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </ProfileAvatarFrame>
                    </motion.div>

                    {/* Form Fields */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Name (Read Only) */}
                        <div className="opacity-70 grayscale">
                            <GlassInput
                                label="Identity Name"
                                icon={User}
                                value={profile.first_name}
                                disabled={true}
                            />
                        </div>

                        {/* Bio */}
                        <div className="group space-y-2">
                            <label className="flex items-center gap-2 text-xs font-medium tracking-widest text-pink-200/50 uppercase ml-1 group-focus-within:text-pink-300 transition-colors">
                                <FileText size={12} /> Manifesto / Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="
                                    w-full p-4 rounded-xl min-h-[120px]
                                    bg-white/5 border border-white/10 
                                    text-pink-50 placeholder-pink-200/20
                                    focus:border-pink-500/50 focus:bg-pink-900/10 focus:shadow-[0_0_20px_rgba(236,72,153,0.1)]
                                    outline-none transition-all duration-300 resize-none
                                "
                                placeholder="Whisper something to the universe..."
                            />
                        </div>

                        {/* Looking For */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-medium tracking-widest text-pink-200/50 uppercase ml-1">
                                <Heart size={12} /> Desires
                            </label>
                            <div className="flex gap-2">
                                <OptionPill
                                    label="Men"
                                    value="male"
                                    current={profile.looking_for}
                                    onClick={() => setProfile({ ...profile, looking_for: 'male' })}
                                />
                                <OptionPill
                                    label="Women"
                                    value="female"
                                    current={profile.looking_for}
                                    onClick={() => setProfile({ ...profile, looking_for: 'female' })}
                                />
                                <OptionPill
                                    label="All"
                                    value="all"
                                    current={profile.looking_for}
                                    onClick={() => setProfile({ ...profile, looking_for: 'all' })}
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={loading}
                            className={`
                                w-full mt-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm
                                shadow-lg flex items-center justify-center gap-3
                                transition-all duration-500
                                ${loading
                                    ? 'bg-stone-800 text-stone-500 cursor-wait'
                                    : 'bg-gradient-to-r from-pink-700 to-rose-900 text-white shadow-[0_10px_30px_rgba(190,24,93,0.3)] hover:shadow-[0_10px_40px_rgba(190,24,93,0.5)] border border-pink-500/20'}
                            `}
                        >
                            {loading ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                <>
                                    <Sparkles size={18} className="text-pink-200" />
                                    Immortalize
                                </>
                            )}
                        </motion.button>

                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
