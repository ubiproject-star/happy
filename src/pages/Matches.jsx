import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { MessageCircle, Loader2, Sparkles } from 'lucide-react';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();

    const fetchMatches = async () => {
        try {
            const myId = tgUser?.id?.toString() || 'user_m_1';

            // Fetch matches where I am user1 or user2
            const { data: matchesData, error } = await supabase
                .from('matches')
                .select(`
                id,
                user1:user1_id(*),
                user2:user2_id(*)
            `)
                .or(`user1_id.eq.${myId},user2_id.eq.${myId}`)
                .order('created_at', { ascending: false }); // Show newest first if col exists, else remove. Assuming creation order matters.

            if (error) throw error;

            // Transform data to get the distinct "other" user
            const formattedMatches = matchesData.map(match => {
                const otherUser = match.user1.id === myId ? match.user2 : match.user1;
                return {
                    match_id: match.id,
                    user: otherUser
                };
            });

            setMatches(formattedMatches);
        } catch (error) {
            console.error('Error fetching matches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [tgUser]);

    if (loading) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center bg-black">
                    <Loader2 className="animate-spin text-pink-500" size={32} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-black pb-24 px-2 pt-6 font-sans">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
                        YOUR FLOCK
                    </h1>
                    <p className="text-gray-500 text-[10px] tracking-[0.3em] mt-2 uppercase">Quantum Entanglements</p>
                </div>

                {matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                        <Sparkles className="mb-4 text-gray-700" size={48} />
                        <p className="tracking-widest uppercase text-xs">Void State</p>
                        <p className="text-[10px] mt-2 opacity-50">Spin the oracle to find souls.</p>
                    </div>
                ) : (
                    /* 3-Column Grid */
                    <div className="grid grid-cols-3 gap-2">
                        {matches.map(({ match_id, user }, index) => {
                            // Generate a consistent random color for the frame based on ID/Index
                            const colors = [
                                'from-pink-500 to-rose-500',
                                'from-purple-500 to-indigo-500',
                                'from-blue-500 to-cyan-500',
                                'from-yellow-400 to-orange-500',
                                'from-green-400 to-emerald-500',
                                'from-red-500 to-pink-600'
                            ];
                            const colorClass = colors[index % colors.length];

                            return (
                                <Link
                                    to={`/chat/${match_id}`}
                                    key={match_id}
                                    className="relative aspect-[3/4] group"
                                >
                                    {/* Colorful Frame */}
                                    <div className={`absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br ${colorClass} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                                        <div className="w-full h-full relative rounded-[10px] overflow-hidden bg-gray-900">
                                            <img
                                                src={user.photo_url || `https://i.pravatar.cc/300?u=${user.id}`}
                                                alt={user.first_name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />

                                            {/* Name Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-1 bg-gradient-to-t from-black/90 to-transparent">
                                                <p className="text-white text-[10px] font-bold text-center uppercase tracking-wider truncate">
                                                    {user.first_name || 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
