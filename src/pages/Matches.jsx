
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import { useSound } from '../contexts/SoundContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Loader2, Plus, X } from 'lucide-react';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();
    const { playSound } = useSound();
    const { t } = useLanguage();

    const handleDelete = async (e, matchId) => {
        e.preventDefault();
        e.stopPropagation();

        setMatches(prev => prev.filter(m => m.match_id !== matchId));

        try {
            const { error } = await supabase
                .from('matches')
                .delete()
                .eq('id', matchId);

            if (error) {
                console.error('Error deleting match:', error);
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    useEffect(() => {
        let mounted = true;

        const fetchMatches = async () => {
            try {
                // Robust ID handling
                const myId = tgUser?.id?.toString() || 'user_m_1';
                console.log('Fetching matches for:', myId);

                const { data: matchesData, error } = await supabase
                    .from('matches')
                    .select(`
                        id,
                        user1_id,
                        user2_id,
                        user1: user1_id(*),
                        user2: user2_id(*)
                    `)
                    .or(`user1_id.eq.${myId}, user2_id.eq.${myId}`)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Supabase Error:', error);
                }

                if (mounted) {
                    const safeData = matchesData || [];

                    const formattedMatches = safeData
                        .map(match => {
                            const isUser1 = match.user1_id.toString() === myId;
                            const otherUser = isUser1 ? match.user2 : match.user1;

                            if (!otherUser) return null;

                            return {
                                match_id: match.id,
                                user: otherUser
                            };
                        })
                        .filter(Boolean);

                    setMatches(formattedMatches);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error in fetchMatches:', error);
                if (mounted) setLoading(false);
            }
        };

        fetchMatches();

        return () => {
            mounted = false;
        };
    }, [tgUser?.id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center bg-black">
                    <Loader2 className="animate-spin text-pink-500" size={32} />
                </div>
            </Layout>
        );
    }

    const getGradient = (index) => {
        const colors = [
            'from-pink-500 to-rose-500',
            'from-purple-500 to-indigo-500',
            'from-blue-500 to-cyan-500',
            'from-yellow-400 to-orange-500',
            'from-green-400 to-emerald-500',
            'from-red-500 to-pink-600'
        ];
        return colors[index % colors.length];
    };

    // Ensure we always render 1000 slots total (Real + Placeholders)
    const totalSlots = 1000;
    const realMatchCount = matches.length;
    const voidCount = Math.max(0, totalSlots - realMatchCount);

    return (
        <Layout>
            <div className="min-h-screen bg-black pb-24 px-2 pt-4 md:pt-10 font-sans">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                        {t('your_favorites')}
                    </h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.3em] mt-2 uppercase">{t('quantum_entanglements')}</p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-3 gap-2">
                    {/* 1. Real Matches */}
                    {matches.map(({ match_id, user }, index) => (
                        <Link
                            to={`/user/${user.id}`}
                            key={match_id}
                            className="relative aspect-[3/4] group"
                        >
                            <div className={`absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br ${getGradient(index)} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                                <div className="w-full h-full relative rounded-[10px] overflow-hidden bg-gray-900">
                                    <img
                                        src={user.photo_url || `https://i.pravatar.cc/300?u=${user.id}`}
                                        alt={user.first_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-1 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-white font-bold text-sm tracking-wide">
                                            {user.first_name || t('unknown')}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDelete(e, match_id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20"
                            >
                                <span className="text-[10px]">❌</span>
                            </button>
                        </Link>
                    ))}

                    {/* 2. Void Slots (Placeholders) */}
                    {Array.from({ length: voidCount }).map((_, i) => (
                        <div key={`void-${i}`} className="aspect-[3/4] rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center opacity-30">
                            <div className="text-center">
                                <Plus size={16} className="text-white/20 mx-auto mb-1" />
                                <span className="text-[8px] uppercase tracking-widest text-white/10">EMPTY</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
