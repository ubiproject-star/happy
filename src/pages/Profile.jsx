import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import LiveBackground from '../components/LiveBackground';
import { Camera, Sparkles, User, Calendar, Heart, Globe, Instagram, Send, Languages, Loader2, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
    const { user: tgUser } = useTelegram();
    const { user: dbUser, refreshUser } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initial State - Sync with Schema V4
    const [profile, setProfile] = useState({
        first_name: dbUser?.first_name || tgUser?.first_name || '',
        photo_url: dbUser?.photo_url || tgUser?.photo_url || '',
        instagram_handle: dbUser?.instagram_handle || '',
        gender: dbUser?.gender || 'man',
        orientation: dbUser?.interested_in || 'female',
        region: dbUser?.region || 'Europe',
        age: dbUser?.age || 24, // Direct Age
    });

    // 1. Update form when DB user loads
    useEffect(() => {
        if (dbUser) {
            setProfile(prev => ({
                ...prev,
                first_name: dbUser.first_name || prev.first_name,
                photo_url: dbUser.photo_url || prev.photo_url,
                instagram_handle: dbUser.instagram_handle || '',
                gender: dbUser.gender || 'man',
                orientation: dbUser.interested_in || 'female',
                region: dbUser.region || 'Europe',
                age: dbUser.age || 24
            }));
        }
    }, [dbUser]);

    // 2. Handle Save
    const handleSave = async () => {
        if (!tgUser?.id) return;
        setLoading(true);

        try {
            const myId = tgUser.id.toString();

            // Schema V4 Updates
            const updates = {
                first_name: profile.first_name, // Now Editable
                photo_url: profile.photo_url,
                instagram_handle: profile.instagram_handle,
                gender: profile.gender,
                interested_in: profile.orientation,
                region: profile.region,
                age: parseInt(profile.age), // INTEGER
                updated_at: new Date()
            };

            // Use the Service Role Client from AuthContext if possible, or standard.
            // Standard is fine if RLS allows it (which it does via 'true' policy currently)
            const { error } = await supabase
                .from('users')
                .upsert({ id: myId, ...updates });

            if (error) {
                console.error("Supabase Save Error:", error);
                throw error;
            }

            alert(t('saved_success') || 'Profile Saved!');
            alert(t('saved_success') || 'Profile Saved!');
            await refreshUser(); // Refresh Context (AWAIT IT)
        } catch (error) {
            console.error('Save Failed:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Image Upload
    const handleImageUpload = async (event) => {
        if (!event.target.files || event.target.files.length === 0) return;

        try {
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${tgUser?.id || 'unknown'}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (data) {
                setProfile(prev => ({ ...prev, photo_url: data.publicUrl }));
            }
        } catch (error) {
            alert('Upload Failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Options
    const GENDER_OPTIONS = ['man', 'woman', 'trans_man', 'trans_woman'];
    const ORIENTATION_OPTIONS = ['male', 'female', 'lesbian', 'gay', 'bisexual'];
    const REGION_OPTIONS = ['North America', 'Asia', 'Europe', 'Africa', 'Middle East', 'South America'];

    const SelectionGrid = ({ label, icon: Icon, options, value, onChange, translateOption = false }) => (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-blue uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                <Icon size={14} /> {label}
            </label>
            <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => {
                    const displayText = translateOption ? t(opt) : opt;
                    return (
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
                            {displayText}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Layout>
            <LiveBackground />
            <div className="relative z-10 min-h-screen pb-24 px-4 pt-4 md:pt-10 font-sans text-stone-200">

                {/* Header */}
                <div className="text-center mb-8 glass py-4 rounded-2xl border border-white/10">
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                        {t('profile_title')}
                    </h1>
                </div>

                <div className="max-w-md mx-auto space-y-8">
                    {/* AVATAR */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                                {uploading ? (
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <Loader2 className="animate-spin text-neon-blue" />
                                    </div>
                                ) : (
                                    <img
                                        src={profile.photo_url || `https://i.pravatar.cc/300?u=${tgUser?.id}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
                                    />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-[#1a1a1a] text-neon-blue rounded-full border border-neon-blue/30 shadow-lg cursor-pointer">
                                <Camera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    {/* FORM */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8 p-6 glass rounded-3xl border border-white/5">

                        {/* Name (Editable) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase ml-1">
                                <User size={14} /> {t('name') || 'Name'}
                            </label>
                            <input
                                value={profile.first_name}
                                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                className="w-full p-4 rounded-xl bg-[#0f0f0f] border border-white/10 text-white font-bold"
                            />
                        </div>

                        {/* Photo URL (Manual Input) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase ml-1">
                                <ExternalLink size={14} /> {t('photo_url') || 'Photo Link'}
                            </label>
                            <input
                                value={profile.photo_url}
                                onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                                placeholder="https://..."
                                className="w-full p-4 rounded-xl bg-[#0f0f0f] border border-white/10 text-white font-mono text-xs truncate focus:ring-1 focus:ring-neon-blue outline-none"
                            />
                        </div>

                        {/* Age (Direct Int) */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-purple uppercase ml-1">
                                <Calendar size={14} /> {t('age')}
                            </label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white font-bold text-center tracking-widest focus:border-neon-purple outline-none"
                            />
                        </div>

                        {/* Gender & Orientation */}
                        <SelectionGrid label={t('gender')} icon={User} options={GENDER_OPTIONS} value={profile.gender} onChange={(val) => setProfile({ ...profile, gender: val })} translateOption={true} />
                        <SelectionGrid label={t('orientation')} icon={Heart} options={ORIENTATION_OPTIONS} value={profile.orientation} onChange={(val) => setProfile({ ...profile, orientation: val })} translateOption={true} />
                        <SelectionGrid label={t('region')} icon={Globe} options={REGION_OPTIONS} value={profile.region} onChange={(val) => setProfile({ ...profile, region: val })} translateOption={false} />

                        {/* Social Links */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Social Connections</h3>

                            {/* Instagram */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#E1306C] uppercase ml-1">
                                    <Instagram size={14} /> Instagram
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={profile.instagram_handle}
                                        onChange={(e) => setProfile({ ...profile, instagram_handle: e.target.value })}
                                        placeholder="@username"
                                        className="flex-1 p-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white"
                                    />
                                    {profile.instagram_handle && (
                                        <a
                                            href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 bg-[#E1306C]/20 text-[#E1306C] rounded-xl flex items-center justify-center border border-[#E1306C]/50"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Telegram */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#0088cc] uppercase ml-1">
                                    <Send size={14} /> Telegram
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-3 rounded-xl bg-[#0f0f0f] border border-white/5 text-gray-400 font-mono text-sm truncate">
                                        @{tgUser?.username || 'user'}
                                    </div>
                                    <a
                                        href={`https://t.me/${tgUser?.username}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-[#0088cc]/20 text-[#0088cc] rounded-xl flex items-center justify-center border border-[#0088cc]/50"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Save */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-4 rounded-full font-black tracking-widest uppercase text-sm bg-white text-black hover:bg-neon-blue hover:text-black shadow-lg flex items-center justify-center gap-3 mt-8"
                        >
                            {loading ? <span className="animate-pulse">Saving...</span> : <><Sparkles size={18} /> {t('update')}</>}
                        </motion.button>

                        {/* Language Selector */}
                        <button
                            onClick={() => navigate('/language')}
                            className="w-full py-3 rounded-xl text-xs font-bold text-gray-500 uppercase flex items-center justify-center gap-2 hover:text-white transition-colors"
                        >
                            <Globe size={14} /> Language: {language?.toUpperCase()}
                        </button>

                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
