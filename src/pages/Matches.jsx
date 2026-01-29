import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { Loader2, Plus, X } from 'lucide-react';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();

    const fetchMatches = async () => {
        try {
            const myId = tgUser?.id?.toString() || 'user_m_1';
            console.log('My ID:', myId);

            // Fetch matches where I am user1 or user2
            const { data: matchesData, error } = await supabase
                .from('matches')
                .select(`
                id,
                user1:user1_id(*),
                user2:user2_id(*)
            `)
                .or(`user1_id.eq.${myId},user2_id.eq.${myId}`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase Error:', error);
                throw error;
            }

            console.log('Raw Matches Data:', matchesData);

            // Transform data to get the distinct "other" user
            const formattedMatches = matchesData
                .map(match => {
                    // Check if users exist to avoid crash
                    if (!match.user1 || !match.user2) {
                        console.warn('Match with missing user data:', match);
                        // If one side is missing but the other isn't, try to salvage (though unlikely in valid Foreign Key)
                        // For now, return null to filter
                        return null;
                    }

                    const otherUser = match.user1.id.toString() === myId ? match.user2 : match.user1;
                    return {
                        match_id: match.id,
                        user: otherUser
                    };
                })
                .filter(Boolean); // Remove nulls

            console.log('Formatted Matches:', formattedMatches);
            setMatches(formattedMatches);
        } catch (error) {
            console.error('Error fetching matches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, matchId) => {
        e.preventDefault();
        e.stopPropagation(); // Double safety

        // Optimistic update
        setMatches(prev => prev.filter(m => m.match_id !== matchId));

        try {
            const { error } = await supabase
                .from('matches')
                .delete()
                .eq('id', matchId);

            if (error) {
                console.error('Error deleting match:', error);
                fetchMatches(); // Revert on error
            }
        } catch (err) {
            console.error('Delete failed:', err);
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

    // Generate colors for placeholders/matches
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

    // Prepare grid items: Real matches followed by empty "void" slots to fill the "3x1000" concept
    // Render enough placeholders to make the grid look dense and infinite
    const totalSlots = 300;

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

                {/* 3-Column Grid */}
                <div className="grid grid-cols-3 gap-2">

                    {/* 1. Real Matches */}
                    {matches.map(({ match_id, user }, index) => (
                        <Link
                            to={`/user/${user.id}`} // Links to Profile
                            key={match_id}
                            className="relative aspect-[3/4] group"
                        >
                            {/* Colorful Frame */}
                            <div className={`absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br ${getGradient(index)} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
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

                            {/* Delete Button (Red X) */}
                            <button
                                onClick={(e) => handleDelete(e, match_id)}
                                className="absolute -top-1 -right-1 z-20 p-1 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>
                        </Link>
                    ))}

                    {/* 2. Void Slots (Placeholders) */}
                    {Array.from({ length: Math.max(0, totalSlots - matches.length) }).map((_, i) => {
                        const index = matches.length + i;
                        return (
                            <div key={`void-${i}`} className="relative aspect-[3/4] opacity-20 hover:opacity-40 transition-opacity">
                                <div className={`absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br ${getGradient(index)}`}>
                                    <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center">
                                        <Plus className="text-white/10" size={16} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </Layout>
    );
}
