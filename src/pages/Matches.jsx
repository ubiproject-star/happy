import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { MessageCircle, Loader2 } from 'lucide-react';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: tgUser } = useTelegram();

    useEffect(() => {
        fetchMatches();
    }, [tgUser]);

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
                .or(`user1_id.eq.${myId},user2_id.eq.${myId}`);

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

    if (loading) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-left">Recent Matches</h2>

                {matches.length === 0 ? (
                    <div className="text-center mt-20 text-gray-500">
                        <p>No matches yet.</p>
                        <p className="text-sm">Start swiping to find people!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {matches.map(({ match_id, user }) => (
                            <Link
                                to={`/chat/${match_id}`}
                                key={match_id}
                                className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative">
                                    <img
                                        src={user.photo_url || "https://i.pravatar.cc/150"}
                                        alt={user.first_name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>

                                <div className="ml-4 flex-1 text-left">
                                    <h3 className="font-bold text-lg">{user.first_name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">Say hello! 👋</p>
                                </div>

                                <div className="p-2 bg-gray-50 rounded-full text-primary">
                                    <MessageCircle size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
