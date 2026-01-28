import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from '../hooks/useTelegram';
import Card from '../components/Card';
import { Heart, X, MessageCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function Swipe() {
    const { user } = useTelegram();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfiles();
        }
    }, [user]);

    const fetchProfiles = async () => {
        setLoading(true);
        // 1. Get IDs of users already swiped
        const { data: swiped } = await supabase
            .from('swipes')
            .select('liked_id')
            .eq('liker_id', user.id.toString());

        const swipedIds = swiped?.map(s => s.liked_id) || [];
        swipedIds.push(user.id.toString()); // Exclude self

        // 2. Fetch users not in swipedIds
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .not('id', 'in', `(${swipedIds.join(',')})`)
            .limit(10);

        if (error) {
            console.error(error);
        } else {
            setProfiles(data || []);
        }
        setLoading(false);
    };

    const handleSwipe = async (direction, profileId) => {
        const isLike = direction === 'right';

        // Optimistic remove
        setProfiles(prev => prev.filter(p => p.id !== profileId));

        // DB Insert
        await supabase.from('swipes').insert({
            liker_id: user.id.toString(),
            liked_id: profileId,
            is_like: isLike,
        });

        if (isLike) {
            checkForMatch(profileId);
        }

        if (profiles.length <= 1) {
            // Fetch more in background
            fetchProfiles();
        }
    };

    const checkForMatch = async (otherUserId) => {
        const { data } = await supabase
            .from('swipes')
            .select('*')
            .eq('liker_id', otherUserId)
            .eq('liked_id', user.id.toString())
            .eq('is_like', true)
            .single();

        if (data) {
            await supabase.from('matches').insert({
                user1_id: user.id.toString(),
                user2_id: otherUserId,
            });
            // In a real app, show a modal here
            alert("It's a Match! 🎉");
        }
    };

    const refreshProfiles = () => {
        fetchProfiles();
    };

    if (!user) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-tr from-rose-50 to-orange-50 font-sans text-gray-800">
            {/* Top Header */}
            <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center bg-white/50 backdrop-blur-md shadow-sm rounded-b-3xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">H</div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500 tracking-tight">happi</h1>
                </div>
                <Link to="/matches" className="p-3 bg-white rounded-full shadow-lg text-gray-500 hover:text-primary transition-all hover:scale-110 active:scale-95">
                    <MessageCircle size={24} />
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="w-full max-w-sm h-[65vh] relative px-4">
                    <AnimatePresence>
                        {profiles.map((profile, index) => (
                            <Card
                                key={profile.id}
                                profile={profile}
                                onSwipe={(dir) => handleSwipe(dir, profile.id)}
                                style={{ zIndex: profiles.length - index }}
                            />
                        ))}
                    </AnimatePresence>

                    {profiles.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white/80 rounded-3xl shadow-xl border-2 border-dashed border-gray-200"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <RefreshCw className="text-primary w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">That's everyone!</h2>
                            <p className="text-gray-500 mb-8">No more profiles nearby.</p>

                            <button
                                onClick={refreshProfiles}
                                className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Refresh
                            </button>
                        </motion.div>
                    )}

                    {loading && profiles.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6 z-50 px-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => profiles.length > 0 && handleSwipe('left', profiles[0].id)}
                    className="w-16 h-16 bg-white text-rose-500 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center justify-center border-2 border-transparent hover:border-rose-100"
                >
                    <X size={32} strokeWidth={3} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => profiles.length > 0 && handleSwipe('right', profiles[0].id)}
                    className="w-20 h-20 bg-gradient-to-br from-primary to-rose-600 text-white rounded-full shadow-[0_10px_25px_rgba(255,75,75,0.3)] flex items-center justify-center"
                >
                    <Heart size={36} strokeWidth={3} fill="currentColor" />
                </motion.button>
            </div>
        </div>
    );
}
