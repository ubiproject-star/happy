import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from '../hooks/useTelegram';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';

export default function Chat() {
    const { id: otherUserId } = useParams();
    const { user } = useTelegram();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [matchId, setMatchId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user && otherUserId) {
            loadChatDetails();
        }
    }, [user, otherUserId]);

    useEffect(() => {
        if (matchId) {
            const channel = supabase
                .channel(`chat:${matchId}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            }
        }
    }, [matchId]);

    const loadChatDetails = async () => {
        const { data: profile } = await supabase.from('users').select('*').eq('id', otherUserId).single();
        setOtherUser(profile);

        const { data: match } = await supabase
            .from('matches')
            .select('id')
            .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
            .single();

        if (match) {
            setMatchId(match.id);

            const { data: msgs } = await supabase
                .from('messages')
                .select('*')
                .eq('match_id', match.id)
                .order('created_at', { ascending: true });

            setMessages(msgs || []);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !matchId) return;

        const { error } = await supabase.from('messages').insert({
            match_id: matchId,
            sender_id: user.id.toString(),
            content: newMessage.trim(),
        });

        if (!error) {
            setNewMessage('');
        }
    };

    if (!otherUser) return <div className="p-4">Loading chat...</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white shadow-sm z-10 sticky top-0">
                <Link to="/matches" className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors">
                    <ChevronLeft size={28} />
                </Link>
                <div className="relative ml-1">
                    <img
                        src={otherUser.photo_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100"}
                        alt={otherUser.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="ml-3 flex-1">
                    <h3 className="font-bold text-lg leading-tight">{otherUser.first_name}</h3>
                    <span className="text-xs text-green-500 font-medium">Online</span>
                </div>

                <div className="flex gap-3 text-gray-400">
                    <MoreVertical size={20} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === user.id.toString();
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${isMe
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 pb-6">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 p-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 transition-all font-medium"
                />
                <button type="submit" className={`p-3 rounded-full shadow-lg transition-transform ${newMessage.trim() ? 'bg-primary text-white hover:scale-110' : 'bg-gray-200 text-gray-400'}`} disabled={!newMessage.trim()}>
                    <Send size={20} fill={newMessage.trim() ? "currentColor" : "none"} />
                </button>
            </form>
        </div>
    );
}
