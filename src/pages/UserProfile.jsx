import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import useTelegram from '../hooks/useTelegram';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';
import LiveBackground from '../components/LiveBackground';
import { User, Heart, Globe, Instagram, Send, Sparkles, ChevronLeft } from 'lucide-react';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: tgUser } = useTelegram();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async () => {
        if (!id || isLiked) return;

        try {
            const myId = tgUser?.id?.toString() || 'user_m_1';
            // Ensure ID is passed correctly (Supabase often needs strings for UUIDs or ints depending on schema)
            const targetId = id.toString();

            console.log(`Attempting match: ${myId} -> ${targetId}`);

            const { error } = await supabase
                .from('matches')
                .insert([{ user1_id: myId, user2_id: targetId }]);

            if (error) throw error;

            setIsLiked(true);
        } catch (error) {
            console.error('Error liking user:', error);
        }
    };

    const checkMatchStatus = async () => {
        if (!id) return;
        try {
            const myId = tgUser?.id?.toString() || 'user_m_1';
            const targetId = id.toString();

            const { data, error } = await supabase
                .from('matches')
                .select('id')
                .or(`and(user1_id.eq.${myId},user2_id.eq.${targetId}),and(user1_id.eq.${targetId},user2_id.eq.${myId})`)
                .maybeSingle();

            if (data) {
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error checking match status:', error);
        }
    };

    const matchUser = async () => {
        if (!id) return;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                // Determine display values (mocking defaults if missing, mimicking Profile.jsx structure)
                setProfile({
                    ...data,
                    first_name: data.first_name || 'Mystery User',
                    photo_url: data.photo_url || `https://i.pravatar.cc/300?u=${id}`,
                    // Mock additional fields if they don't exist in DB yet, or use generic defaults
                    gender: 'Man', // In a real app, these would come from DB
                    orientation: 'Female',
                    region: 'Europe',
                    birth_year: 2000,
                    instagram_handle: data.username, // Using username as proxy or empty
                });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        matchUser();
        checkMatchStatus();
    }, [id, tgUser]);

    const ReadOnlyGrid = ({ label, icon: Icon, value }) => (
        <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold tracking-widest text-neon-blue uppercase ml-1 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                <Icon size={14} /> {label}
            </label>
            <div className="w-full p-3 rounded-xl bg-[#1a1a1a]/80 border border-white/5 text-white shadow-[0_0_20px_rgba(0,243,255,0.1)] text-xs font-bold tracking-wider uppercase">
                {value || 'Not Specified'}
            </div>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <LiveBackground />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-8"
                    >
                        <Sparkles size={48} className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]" />
                    </motion.div>

                    <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
                        ESTABLISHING<br />CONNECTION
                    </h2>

                    <div className="mt-4 flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 rounded-full bg-pink-500"
                            />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-500 gap-4">
                    <Sparkles size={48} />
                    <p className="uppercase tracking-widest">User Not Found</p>
                    <button onClick={() => navigate(-1)} className="text-neon-blue hover:underline text-sm uppercase">Go Back</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <LiveBackground />

            <div className="relative z-10 min-h-screen pb-24 px-4 pt-6 font-sans text-stone-200 overflow-x-hidden w-full">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-4 z-50 p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Header Title */}
                <div className="relative text-center mb-8 glass py-4 rounded-2xl border border-white/10 mx-auto max-w-xs sm:max-w-md mt-2">
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                        Happi Chatting
                    </h1>
                </div>

                <div className="max-w-md mx-auto space-y-8">

                    {/* AVATAR: Static & High Quality */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                                <img
                                    src={profile.photo_url}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-4 border-[#0a0a0a]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* READ-ONLY GRID */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-6 p-6 glass rounded-3xl border border-white/5 shadow-2xl w-full"
                    >
                        {/* Name & Like Button */}
                        <div className="text-center mb-6 flex flex-col items-center gap-4">
                            <h2 className="text-3xl font-black italic text-white tracking-tight">{profile.first_name}</h2>

                            <button
                                onClick={handleLike}
                                disabled={isLiked}
                                className={`
                                    flex items-center gap-2 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all
                                    ${isLiked
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:scale-105 active:scale-95 border border-white/10'
                                    }
                                `}
                            >
                                <Heart size={16} className={isLiked ? "fill-current" : ""} />
                                {isLiked ? 'SAVED' : 'SAVE'}
                            </button>
                        </div>

                        {/* Variables */}
                        <div className="grid grid-cols-2 gap-4">
                            <ReadOnlyGrid
                                label="Gender"
                                icon={User}
                                value={profile.gender}
                            />
                            <ReadOnlyGrid
                                label="Age"
                                icon={Sparkles}
                                value={profile.birth_year ? `${new Date().getFullYear() - profile.birth_year} (${profile.birth_year})` : 'N/A'}
                            />
                            <ReadOnlyGrid
                                label="Interested In"
                                icon={Heart}
                                value={profile.orientation}
                            />
                            <ReadOnlyGrid
                                label="Region"
                                icon={Globe}
                                value={profile.region}
                            />
                        </div>

                        {/* Social Links Section */}
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase text-center mb-4">Connections</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Instagram */}
                                {profile.instagram_handle && (
                                    <a
                                        href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 transition-all group overflow-hidden"
                                    >
                                        <Instagram className="text-gray-400 group-hover:text-[#E1306C] mb-2" size={24} />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest truncate w-full text-center">Instagram</span>
                                    </a>
                                )}

                                {/* Telegram (Assuming username exists) */}
                                {profile.username && (
                                    <a
                                        href={`https://t.me/${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 transition-all group overflow-hidden"
                                    >
                                        <Send className="text-gray-400 group-hover:text-[#0088cc] mb-2" size={24} />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest truncate w-full text-center">Telegram</span>
                                    </a>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
