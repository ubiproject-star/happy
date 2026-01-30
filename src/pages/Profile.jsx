import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import LiveBackground from '../components/LiveBackground';
import { Camera, Save, Sparkles, User, MapPin, Calendar, Heart, Globe, Instagram, Send, Languages, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile() {
    const { user: tgUser } = useTelegram();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Initial State
    const [profile, setProfile] = useState({
        first_name: '',
        photo_url: '',
        instagram_handle: '',
        gender: 'man',
        orientation: 'female', // Maps to interested_in
        region: 'Europe',
        age: 24,
        bio: ''
    });

    // 1. Fetch Profile on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            const myId = tgUser?.id; // || 12345 (debug)
            if (!myId) return;

            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', myId)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                }

                if (data) {
                    setProfile({
                        first_name: data.first_name || tgUser?.first_name || '',
                        photo_url: data.photo_url || tgUser?.photo_url || '',
                        instagram_handle: data.instagram_handle || '',
                        gender: data.gender || 'man',
                        orientation: data.interested_in || 'female',
                        region: data.region || 'Europe',
                        age: data.birth_year ? new Date().getFullYear() - data.birth_year : 24,
                        bio: data.bio || ''
                    });
                } else {
                    // New user, prep default state
                    setProfile(prev => ({
                        ...prev,
                        first_name: tgUser?.first_name || '',
                        photo_url: tgUser?.photo_url || ''
                    }));
                }
            } catch (err) {
                console.error("Fetch Exception:", err);
            }
        };

        fetchProfile();
    }, [tgUser]);

    // 2. Handle Save
    const handleSave = async () => {
        if (!tgUser?.id) return;
        setLoading(true);

        try {
            const updates = {
                first_name: profile.first_name,
                photo_url: profile.photo_url,
                instagram_handle: profile.instagram_handle,
                gender: profile.gender,
                interested_in: profile.orientation, // Mapping back
                region: profile.region,
                birth_year: new Date().getFullYear() - parseInt(profile.age),
                bio: profile.bio,
                updated_at: new Date()
            };

            const { error } = await supabase
                .from('users')
                .upsert({ id: tgUser.id, ...updates });

            if (error) {
                console.error("Supabase UPSERT Error Detailed:", JSON.stringify(error, null, 2));
                alert(`DB Error: ${error.message} (Code: ${error.code})`);
                throw error;
            }

            alert(t('saved_success') || 'Profile Saved Successfully!');
        } catch (error) {
            console.error('CRITICAL Error updating profile:', error);
            // alert('Failed to save profile.'); // Handled above
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Image Upload
    const handleImageUpload = async (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        try {
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${tgUser?.id || 'unknown'}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (data) {
                setProfile(prev => ({ ...prev, photo_url: data.publicUrl }));
            }

        } catch (error) {
            console.error('Upload Error:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Options
    const GENDER_OPTIONS = ['man', 'woman', 'trans_man', 'trans_woman'];
    const ORIENTATION_OPTIONS = ['male', 'female', 'lesbian', 'gay', 'bisexual'];
    const REGION_OPTIONS = ['North America', 'Asia', 'Europe', 'Africa', 'Middle East', 'South America'];

    // ... (SelectionGrid Component remains the same)
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

                {/* Header Title */}
                <div className="text-center mb-8 glass py-4 rounded-2xl border border-white/10">
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent drop-shadow-sm">
                        {t('profile_title')}
                    </h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.3em] mt-1 uppercase">{t('configure_profile')}</p>
                </div>

                <div className="max-w-md mx-auto space-y-8">

                    {/* AVATAR: Uploadable */}
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
                                        onError={(e) => e.target.src = `https://i.pravatar.cc/300?u=${tgUser?.id}`}
                                    />
                                )}
                            </div>

                            {/* Hidden File Input + Label Trigger */}
                            <label className="absolute bottom-0 right-0 p-2 bg-[#1a1a1a] text-neon-blue rounded-full border border-neon-blue/30 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
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
                                <User size={14} /> Name
                            </label>
                            <input
                                value={profile.first_name}
                                disabled
                                className="w-full p-4 rounded-xl bg-[#0f0f0f] border border-white/5 text-gray-400 font-mono text-sm"
                            />
                        </div>

                        {/* Language Selector Link */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase ml-1">
                                <Languages size={14} /> Language
                            </label>
                            <button
                                onClick={() => navigate('/language')}
                                className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white font-bold text-left flex justify-between items-center hover:bg-[#252525] transition-colors"
                            >
                                <span>{language ? language.toUpperCase() : 'Select'}</span>
                                <Globe size={16} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-purple uppercase ml-1 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                                <Calendar size={14} /> {t('age')}
                            </label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
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
                            label={t('gender')}
                            icon={User}
                            options={GENDER_OPTIONS}
                            value={profile.gender}
                            onChange={(val) => setProfile({ ...profile, gender: val })}
                            translateOption={true}
                        />

                        <SelectionGrid
                            label={t('orientation')}
                            icon={Heart}
                            options={ORIENTATION_OPTIONS}
                            value={profile.orientation}
                            onChange={(val) => setProfile({ ...profile, orientation: val })}
                            translateOption={true}
                        />

                        <SelectionGrid
                            label={t('region')}
                            icon={Globe}
                            options={REGION_OPTIONS}
                            value={profile.region}
                            onChange={(val) => setProfile({ ...profile, region: val })}
                            translateOption={false}
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
                                    {t('update')}
                                </>
                            )}
                        </motion.button>

                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
