import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import LiveBackground from '../components/LiveBackground';
import { Camera, Save, Sparkles, User, MapPin, Calendar, Heart, Globe, Instagram, Send } from 'lucide-react';

export default function Profile() {
    const { user: tgUser } = useTelegram();

    // State including new variables
    const [profile, setProfile] = useState(() => {
        // Mock data or TG data
        const base = tgUser ? {
            first_name: tgUser.first_name,
            photo_url: tgUser.photo_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
        } : {
            first_name: 'Demo User',
            photo_url: 'https://randomuser.me/api/portraits/men/99.jpg'
        };

        return {
            ...base,
            gender: 'Man',
            orientation: 'Female',
            region: 'Europe',
            age: 24
        };
    });

    const [loading, setLoading] = useState(false);

    // Options as requested
    const GENDER_OPTIONS = ['Man', 'Woman', 'Trans man', 'Trans woman'];
    const ORIENTATION_OPTIONS = ['Male', 'Female', 'Lesbian', 'Gay', 'Bisexual'];
    const REGION_OPTIONS = ['North America', 'Asia', 'Europe', 'Africa', 'Middle East', 'South America'];

    const handleSave = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    // Modern Box Selection Component
    const SelectionGrid = ({ label, icon: Icon, options, value, onChange }) => (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-blue uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                <Icon size={14} /> {label}
            </label>
            <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`
                            py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border
                            ${value === opt
                                ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                                : 'bg-[#1a1a1a]/80 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Layout>
            <LiveBackground />

            <div className="relative z-10 min-h-screen pb-24 px-4 pt-4 md:pt-10 font-sans text-stone-200">

                {/* Header Title - Matching Discover Style */}
                <div className="text-center mb-8 glass py-4 rounded-2xl border border-white/10">
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent drop-shadow-sm">
                        PROFILE
                    </h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.3em] mt-1 uppercase">Configure your profile</p>
                </div>

                <div className="max-w-md mx-auto space-y-8">

                    {/* AVATAR: Static & Clean (Animation Removed) */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                                <img
                                    src={profile.photo_url}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-[#1a1a1a] text-neon-blue rounded-full border border-neon-blue/30 shadow-lg hover:scale-110 transition-transform">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>

                    {/* FORM GRID */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-8 p-6 glass rounded-3xl border border-white/5"
                    >
                        {/* Name (Read Only) */}
                        <div className="space-y-2 opacity-60">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase ml-1">
                                <User size={14} /> Name (Synced)
                            </label>
                            <input
                                value={profile.first_name}
                                disabled
                                className="w-full p-4 rounded-xl bg-[#0f0f0f] border border-white/5 text-gray-400 font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-purple uppercase ml-1 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                                <Calendar size={14} /> AGE
                            </label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                                className="
                                    w-full p-4 rounded-xl 
                                    bg-[#1a1a1a] border border-white/10 
                                    text-white font-bold text-center tracking-widest
                                    focus:border-neon-purple focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]
                                    outline-none transition-all duration-300
                                "
                            />
                        </div>

                        {/* Variables Grid */}
                        <SelectionGrid
                            label="Gender Identity"
                            icon={User}
                            options={GENDER_OPTIONS}
                            value={profile.gender}
                            onChange={(val) => setProfile({ ...profile, gender: val })}
                        />

                        <SelectionGrid
                            label="Interested In"
                            icon={Heart}
                            options={ORIENTATION_OPTIONS}
                            value={profile.orientation}
                            onChange={(val) => setProfile({ ...profile, orientation: val })}
                        />

                        <SelectionGrid
                            label="Region"
                            icon={Globe}
                            options={REGION_OPTIONS}
                            value={profile.region}
                            onChange={(val) => setProfile({ ...profile, region: val })}
                        />

                        {/* Social Links Section */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Social Connections</h3>

                            {/* Instagram */}
                            <div className="group space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#E1306C] uppercase ml-1 drop-shadow-[0_0_5px_rgba(225,48,108,0.5)]">
                                    <Instagram size={14} /> Instagram
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={profile.instagram_handle || ''}
                                        onChange={(e) => setProfile({ ...profile, instagram_handle: e.target.value })}
                                        placeholder="@username"
                                        className="
                                            w-full p-4 pl-12 rounded-xl 
                                            bg-[#1a1a1a] border border-white/10 
                                            text-white font-medium tracking-wide
                                            focus:border-[#E1306C] focus:shadow-[0_0_15px_rgba(225,48,108,0.2)]
                                            outline-none transition-all duration-300 placeholder-gray-600
                                        "
                                    />
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E1306C] transition-colors" size={18} />
                                </div>
                            </div>

                            {/* Telegram (Auto-Generated) */}
                            <div className="group space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#0088cc] uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,136,204,0.5)]">
                                    <Send size={14} /> Telegram
                                </label>
                                <div className="relative opacity-80">
                                    <input
                                        type="text"
                                        value={`https://t.me/${tgUser?.username || 'user'}`}
                                        readOnly
                                        disabled
                                        className="
                                            w-full p-4 pl-12 rounded-xl 
                                            bg-[#0f0f0f] border border-white/5 
                                            text-gray-400 font-mono text-sm tracking-wide
                                            cursor-not-allowed select-none
                                        "
                                    />
                                    <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0088cc]" size={18} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 uppercase tracking-widest border border-gray-800 px-2 py-1 rounded">Auto-Linked</span>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={loading}
                            className={`
                                w-full py-4 rounded-full font-black tracking-widest uppercase text-sm
                                shadow-lg flex items-center justify-center gap-3 mt-8
                                transition-all duration-300 border border-transparent
                                ${loading
                                    ? 'bg-stone-800 text-stone-500 cursor-wait'
                                    : 'bg-white text-black hover:bg-neon-blue hover:text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'}
                            `}
                        >
                            {loading ? (
                                <span className="animate-pulse">Syncing...</span>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    UPDATE
                                </>
                            )}
                        </motion.button>

                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
