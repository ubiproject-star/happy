import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import MatchOverlay from '../components/MatchOverlay';

// --- Sub-Components ---

const EyeContainer = ({ children, borderColor = "border-blue-500", shadowColor = "shadow-blue-500/50" }) => (
    <div className={`relative w-36 h-36 rounded-full border-4 ${borderColor} bg-gray-900 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] ${shadowColor}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10 pointer-events-none" />
        {children}
        {/* Reflection Glint */}
        <div className="absolute top-4 right-6 w-3 h-2 bg-white/40 rounded-full blur-[2px] z-20" />
    </div>
);

const UserAvatar = ({ url, alt }) => (
    <img src={url} alt={alt} className="w-full h-full object-cover opacity-90" />
);

const SlotMachine = ({ currentMatch, spinning, onNavigate }) => (
    <div className="w-full h-full flex items-center justify-center relative bg-gray-900">
        <AnimatePresence mode='wait'>
            {currentMatch ? (
                <motion.img
                    key={currentMatch.id}
                    src={currentMatch.avatar_url || `https://i.pravatar.cc/300?u=${currentMatch.id}`}
                    alt="Match"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={onNavigate}
                />
            ) : (
                <div className="text-center p-2">
                    <span className="text-xs text-red-400 font-mono animate-pulse">NO SIGNAL</span>
                </div>
            )}
        </AnimatePresence>

        {/* Slot Scanlines */}
        {spinning && (
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-20 pointer-events-none opacity-50" />
        )}
    </div>
);

const NoseButton = ({ spinning, onClick }) => (
    <div className="relative z-30 group">
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={spinning}
            aria-label="Find Match"
            className={`
                w-24 h-32 rounded-[3.5rem] flex items-center justify-center 
                bg-gradient-to-b from-red-600 to-red-900 
                border-t border-red-400/30 shadow-[0_0_40px_rgba(220,38,38,0.4)]
                transition-all duration-300
                ${spinning ? 'brightness-125 shadow-[0_0_60px_rgba(220,38,38,0.7)]' : 'hover:shadow-[0_0_50px_rgba(220,38,38,0.6)]'}
            `}
        >
            <span className="text-4xl font-black text-white drop-shadow-md font-mono tracking-tighter">
                {spinning ? '•••' : '100'}
            </span>
        </motion.button>
        {/* Glows */}
        <div className="absolute bottom-6 -left-4 w-2 h-12 bg-red-500/30 rounded-full blur-xl" />
        <div className="absolute bottom-6 -right-4 w-2 h-12 bg-red-500/30 rounded-full blur-xl" />
    </div>
);

const MouthBar = () => (
    <div className="w-64 h-12 relative mt-4">
        <svg viewBox="0 0 300 60" className="w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            <path
                d="M 20 20 Q 150 60 280 20"
                fill="none"
                stroke="url(#mouth-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <defs>
                <linearGradient id="mouth-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

// --- Main Page Component ---

export default function Welcome() {
    const { user } = useTelegram();
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [showMatchOverlay, setShowMatchOverlay] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const fetchUsers = async () => {
            // In real app: fetch from DB, filter seen, etc.
            const { data } = await supabase.from('users').select('*').limit(20);
            if (data) {
                const shuffled = data.sort(() => 0.5 - Math.random());
                setMatches(shuffled);
            }
        };
        fetchUsers();
    }, []);

    const handleSpin = useCallback(() => {
        if (spinning || matches.length === 0) return;
        setSpinning(true);
        setShowMatchOverlay(false);

        let spinCount = 0;
        const maxSpins = 15; // Number of flickers

        const spinInterval = setInterval(() => {
            // Pick a random index for "slot" effect
            const randomIndex = Math.floor(Math.random() * matches.length);
            setCurrentMatch(matches[randomIndex]);

            spinCount++;
            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);
                setSpinning(false);
                // Trigger Match Overlay
                setTimeout(() => {
                    setShowMatchOverlay(true);
                }, 500);
            }
        }, 120); // Speed of flickering
    }, [spinning, matches]);

    const handleChat = () => {
        if (currentMatch) {
            navigate(`/chat/${currentMatch.id}`);
        }
    };

    const handleKeepSwiping = () => {
        setShowMatchOverlay(false);
    };

    return (
        <Layout>
            <main className="flex flex-col h-full bg-[#0f1014] text-white p-4 relative overflow-hidden">
                {/* Match Overlay */}
                <AnimatePresence>
                    {showMatchOverlay && currentMatch && (
                        <MatchOverlay
                            user1={user}
                            user2={currentMatch}
                            onChat={handleChat}
                            onKeepSwiping={handleKeepSwiping}
                        />
                    )}
                </AnimatePresence>

                {/* Semantic background blobs */}
                <div role="presentation" className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
                <div role="presentation" className="absolute top-1/2 -right-20 w-80 h-80 bg-red-500/10 rounded-full blur-[100px]" />

                {/* Header Section */}
                <header className="flex justify-between items-center relative z-10 mb-2 px-2">
                    {/* Left: Back Button (Preserved) */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Right: User Profile & Name */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-lg ml-auto">
                        <span className="text-xs font-bold text-white max-w-[80px] truncate">
                            {user?.first_name || 'Guest'}
                        </span>
                        <div className="w-8 h-8 rounded-full border border-purple-500 overflow-hidden">
                            <img
                                src={user?.photo_url || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                alt="Me"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* Face UI Section */}
                <section className="flex-1 flex flex-col items-center justify-center relative z-10 mb-12" aria-label="Interactive Face Interface">

                    {/* Eyes Row */}
                    <div className="flex items-center justify-center gap-6 mb-8 w-full max-w-sm">

                        {/* LEFT EYE: User Profile */}
                        <article className="flex flex-col items-center">
                            <EyeContainer borderColor="border-blue-500" shadowColor="shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <div onClick={() => navigate('/profile')} className="cursor-pointer w-full h-full">
                                    <UserAvatar
                                        url={user?.photo_url || "https://i.pravatar.cc/300?img=11"}
                                        alt="My Profile"
                                    />
                                </div>
                            </EyeContainer>
                        </article>

                        {/* RIGHT EYE: Match Output */}
                        <article className="flex flex-col items-center">
                            <EyeContainer borderColor="border-red-500" shadowColor="shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                <SlotMachine
                                    currentMatch={currentMatch}
                                    spinning={spinning}
                                    onNavigate={() => currentMatch && setShowMatchOverlay(true)}
                                />
                            </EyeContainer>
                        </article>

                    </div>

                    {/* Nose & Mouth Column */}
                    <div className="flex flex-col items-center">
                        {/* NOSE: Trigger */}
                        <NoseButton spinning={spinning} onClick={handleSpin} />

                        {/* MOUTH: Visuals */}
                        <MouthBar />
                    </div>

                </section>

            </main>
        </Layout>
    );
}
