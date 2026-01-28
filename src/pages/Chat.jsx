import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useTelegram from '../hooks/useTelegram';
import { ArrowLeft, Send } from 'lucide-react';
import clsx from 'clsx';

export default function Chat() {
    const { id: matchId } = useParams();
    const navigate = useNavigate();
    const { user: tgUser } = useTelegram();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const messagesEndRef = useRef(null);

    const myId = tgUser?.id?.toString() || 'user_m_1';

    useEffect(() => {
        const fetchChatDetails = async () => {
            const { data: match } = await supabase
                .from('matches')
                .select(`
                *,
                user1:user1_id(*),
                user2:user2_id(*)
            `)
                .eq('id', matchId)
                .single();

            if (match) {
                const processedUser = match.user1.id === myId ? match.user2 : match.user1;
                setOtherUser(processedUser);
            }
        };

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('match_id', matchId)
                .order('created_at', { ascending: true });

            setMessages(data || []);
        };

        fetchChatDetails();
        fetchMessages();

        // Subscribe to new messages
        const subscription = supabase
            .channel(`chat:${matchId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `match_id=eq.${matchId}`
            }, (payload) => {
                setMessages(current => [...current, payload.new]);
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [matchId, myId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const { error } = await supabase
            .from('messages')
            .insert({
                match_id: matchId,
                sender_id: myId,
                content: newMessage.trim()
            });

        if (!error) {
            setNewMessage('');
        } else {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-100 shadow-sm z-10 bg-white">
                <button onClick={() => navigate('/matches')} className="mr-4 text-gray-600">
                    <ArrowLeft size={24} />
                </button>

                {otherUser && (
                    <div className="flex items-center">
                        <img
                            src={otherUser.photo_url || "https://i.pravatar.cc/100"}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            alt="User"
                        />
                        <div>
                            <h3 className="font-bold text-gray-900">{otherUser.first_name}</h3>
                            <span className="text-xs text-green-500 font-medium">Online</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === myId;
                    return (
                        <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                            <div className={clsx(
                                "max-w-[75%] p-3 rounded-2xl text-sm shadow-sm",
                                isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 bg-gray-100 rounded-full outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                />
                <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary text-white rounded-full shadow-md disabled:opacity-50 hover:scale-105 transition-transform"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
