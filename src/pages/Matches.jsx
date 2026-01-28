import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from '../hooks/useTelegram';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';

export default function Matches() {
    const { user } = useTelegram();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMatches();
        }
    }, [user]);

    const fetchMatches = async () => {
        // 1. Get match records
        const { data: matchData, error } = await supabase
            .from('matches')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (error || !matchData) return;

        // 2. Extract OTHER user IDs
        const otherUserIds = matchData.map(m =>
            m.user1_id === user.id.toString() ? m.user2_id : m.user1_id
        );

        if (otherUserIds.length === 0) return;

        // 3. Fetch profiles
        const { data: profiles } = await supabase
            .from('users')
            .select('*')
            .in('id', otherUserIds);

        setMatches(profiles || []);
    };

    return (
        <div className="h-screen bg-white flex flex-col font-sans">
            <div className="p-4 pt-6 flex flex-col gap-4 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Link to="/swipe" className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors">
                        <ChevronLeft size={32} />
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Messages</h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search matches..."
                        className="w-full bg-gray-100 py-3 pl-10 pr-4 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4">
                {/* New Matches (Horizontal) */}
                <div className="px-5 mt-2 mb-6">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">New Matches</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {matches.map((match) => (
                            <Link key={match.id} to={`/chat/${match.id}`} className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-orange-400">
                                    <img
                                        src={match.photo_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100"}
                                        alt={match.first_name}
                                        className="w-full h-full rounded-full object-cover border-2 border-white"
                                    />
                                </div>
                                <span className="text-sm font-semibold mt-2 text-gray-700">{match.first_name}</span>
                            </Link>
                        ))}
                        {matches.length === 0 && <p className="text-gray-400 text-sm">No new matches.</p>}
                    </div>
                </div>

                {/* Messages List */}
                <div className="px-2">
                    <h2 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conversations</h2>
                    {matches.map(match => (
                        <Link key={match.id} to={`/chat/${match.id}`} className="flex items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors active:scale-[0.98]">
                            <div className="relative">
                                <img
                                    src={match.photo_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100"}
                                    alt={match.first_name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            </div>

                            <div className="ml-4 flex-1 border-b border-gray-100 pb-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{match.first_name}</h3>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    Tap to chat using default UI.
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
