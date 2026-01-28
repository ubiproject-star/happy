import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import UserCard from '../components/UserCard';
import Layout from '../components/Layout';
import { X, Heart, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import LiveBackground from '../components/LiveBackground';

export default function Swipe() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();

    const fetchUsers = async () => {
        try {
            // In a real app, we would filter out users already swiped
            // For now, just fetch everyone except self (if we had self ID)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .limit(10);

            if (error) throw error;

            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [tgUser]);

    const handleSwipe = async (direction, swipedUser) => {
        // Remove user from stack locally
        const newUsers = users.filter(u => u.id !== swipedUser.id);
        setUsers(newUsers);

        // If swipe right (like), record it in DB
        if (direction === 'right') {
            try {
                // Demo mode: use a fake self ID if no TG user
                const likerId = tgUser?.id?.toString() || 'user_m_1';

                const { error } = await supabase
                    .from('swipes')
                    .insert({
                        liker_id: likerId,
                        liked_id: swipedUser.id,
                        is_like: true
                    });

                if (error) {
                    // Ignore unique constraint errors (already swiped)
                    if (error.code !== '23505') console.error('Error recording swipe:', error);
                } else {
                    // Check for mutual like (Match)
                    const { data: mutualLike } = await supabase
                        .from('swipes')
                        .select('*')
                        .eq('liker_id', swipedUser.id)
                        .eq('liked_id', likerId)
                        .eq('is_like', true)
                        .single();

                    if (mutualLike) {
                        // It's a match!
                        alert("It's a Match! 🎉"); // Simple alert for MVP
                        await supabase
                            .from('matches')
                            .insert({
                                user1_id: likerId,
                                user2_id: swipedUser.id
                            });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <LiveBackground />
                <div className="relative z-10 flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" size={48} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <LiveBackground />

            <div className="relative z-10 flex flex-col h-full p-4 overflow-hidden">
                {/* Header - Floating Glass */}
                <header className="flex justify-between items-center mb-6 px-4 py-3 rounded-full glass mx-2">
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent drop-shadow-sm">
                        HAPPI
                    </h1>
                    <div className="p-1 rounded-full border border-white/20">
                        <img
                            src={tgUser?.photo_url || "https://randomuser.me/api/portraits/lego/2.jpg"}
                            className="w-8 h-8 rounded-full border border-black/50"
                            alt="Profile"
                        />
                    </div>
                </header>

                {/* Card Stack Area */}
                <div className="relative flex-1 w-full max-w-sm mx-auto mb-4 perspective-1000">
                    <AnimatePresence>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                index === users.length - 1 && (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        onSwipe={(dir) => handleSwipe(dir, user)}
                                    />
                                )
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 glass rounded-3xl mx-4 animate-float">
                                <Heart size={64} className="mb-4 text-neon-red drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]" />
                                <h3 className="text-2xl font-bold mb-2 text-white">No more profiles</h3>
                                <p className="text-gray-400 font-light">Expand your search area or check back later!</p>
                                <button
                                    onClick={fetchUsers}
                                    className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    Refresh Radar
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons - Bottom Floating */}
                {users.length > 0 && (
                    <div className="flex justify-center gap-10 mb-6 items-center">
                        <button
                            onClick={() => handleSwipe('left', users[users.length - 1])}
                            className="group p-5 bg-[#1a1a1a] rounded-full text-red-500 shadow-xl border border-red-500/30 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-110"
                        >
                            <X size={32} className="group-hover:rotate-12 transition-transform" />
                        </button>

                        <button
                            onClick={() => handleSwipe('right', users[users.length - 1])}
                            className="group p-5 bg-[#1a1a1a] rounded-full text-neon-blue shadow-xl border border-neon-blue/30 hover:bg-neon-blue hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-110"
                        >
                            <Heart size={32} fill="currentColor" className="group-hover:scale-125 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
