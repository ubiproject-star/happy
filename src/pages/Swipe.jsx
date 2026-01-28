import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import UserCard from '../components/UserCard';
import Layout from '../components/Layout';
import { X, Heart, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Swipe() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();

    useEffect(() => {
        fetchUsers();
    }, [tgUser]);

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
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col h-full p-4">
                <header className="flex justify-between items-center mb-4 px-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">Happi</h1>
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <img src={tgUser?.photo_url || "https://i.pravatar.cc/100"} className="w-8 h-8 rounded-full" alt="Profile" />
                    </div>
                </header>

                <div className="relative flex-1 w-full max-w-sm mx-auto mb-8">
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
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
                                <Heart size={64} className="mb-4 text-gray-300" />
                                <h3 className="text-xl font-medium mb-2">No more profiles</h3>
                                <p>Check back later for more people!</p>
                                <button onClick={fetchUsers} className="mt-6 text-primary font-medium hover:underline">
                                    Refresh
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {users.length > 0 && (
                    <div className="flex justify-center gap-8 mb-4">
                        <button
                            onClick={() => handleSwipe('left', users[users.length - 1])}
                            className="p-4 bg-white rounded-full shadow-lg text-red-500 hover:scale-110 transition-transform ring-1 ring-gray-100"
                        >
                            <X size={32} />
                        </button>
                        <button
                            onClick={() => handleSwipe('right', users[users.length - 1])}
                            className="p-4 bg-gradient-to-r from-primary to-pink-500 rounded-full shadow-lg text-white hover:scale-110 transition-transform"
                        >
                            <Heart size={32} fill="currentColor" />
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
