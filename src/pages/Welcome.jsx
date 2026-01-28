import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import MatchOverlay from '../components/MatchOverlay';
import { useSound } from '../contexts/SoundContext';

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
    <div className="relative z-30 group perspective-500">
        <motion.button
            whileTap={{
                scale: 0.95,
                translateY: 10,
                boxShadow: "0px 5px 0px 0px #7f1d1d, 0px 5px 20px rgba(220, 38, 38, 0.4)"
            }}
            onClick={onClick}
            disabled={spinning}
            aria-label="Find Match"
            className={`
                relative w-28 h-36 rounded-[4rem] flex items-center justify-center 
                bg-gradient-to-br from-[#ef4444] to-[#991b1b]
                border-t border-white/20
                shadow-[0px_15px_0px_0px_#7f1d1d,0px_20px_40px_rgba(220,38,38,0.5)]
                transition-transform duration-100
                ${spinning ? 'brightness-110' : ''}
            `}
        >
            <div className="absolute inset-2 rounded-[3.5rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <span className="text-5xl font-black text-white drop-shadow-md font-mono tracking-tighter pb-2">
                {spinning ? '••' : 'GO'}
            </span>
        </motion.button>
        {/* Ambient Glow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-16 bg-red-600/30 rounded-full blur-2xl -z-10" />
    </div>
);

const MouthBar = () => (
    <div className="w-64 h-12 relative mt-8">
        <svg viewBox="0 0 300 60" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
            <motion.path
                d="M 20 20 Q 150 60 280 20"
                fill="none"
                stroke="url(#mouth-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ d: "M 20 20 Q 150 60 280 20" }}
                animate={{ d: ["M 20 20 Q 150 60 280 20", "M 20 25 Q 150 70 280 25", "M 20 20 Q 150 60 280 20"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
    const { playSound, initAudio, muted, toggleMute } = useSound();

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

    // Provide a way to interact first
    const handleInteractionStart = () => {
        initAudio();
    };

    const handleSpin = useCallback(() => {
        handleInteractionStart();
        if (spinning || matches.length === 0) return;

        setSpinning(true);
        setShowMatchOverlay(false);
        playSound('click'); // Button start click

        let spinCount = 0;
        const maxSpins = 15;

        // Sound interval for ticking
        const tickInterval = setInterval(() => {
            playSound('spin');
        }, 120);

        const spinInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * matches.length);
            setCurrentMatch(matches[randomIndex]);

            spinCount++;
            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);
                clearInterval(tickInterval);
                setSpinning(false);

                // Trigger Match
                setTimeout(() => {
                    playSound('match');
                    setShowMatchOverlay(true);
                }, 400);
            }
        }, 120);
    }, [spinning, matches, playSound, initAudio, handleInteractionStart]);

    const handleChat = () => {
        playSound('click');
        if (currentMatch) {
            navigate(`/chat/${currentMatch.id}`);
        }
    };

    const handleKeepSwiping = () => {
        playSound('click');
        setShowMatchOverlay(false);
    };

    return (
        <Layout>
            <main onClick={handleInteractionStart} className="flex flex-col h-full bg-[#0f1014] text-white p-4 relative overflow-hidden">
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
                <header className="flex justify-between items-center relative z-10 mb-6 px-2">
                    {/* Left: Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 active:bg-white/10 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Center: Mute Toggle */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-95 transition-transform"
                    >
                        {muted ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="text-neon-blue" />}
                        <span className="text-xs font-medium text-gray-300">{muted ? 'OFF' : 'ON'}</span>
                    </button>

                    {/* Right: Profile */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-lg">
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
                <section className="flex-1 flex flex-col items-center justify-center relative z-10 mb-20" aria-label="Interactive Face Interface">

                    {/* Eyes Row */}
                    <div className="flex items-center justify-center gap-8 mb-12 w-full max-w-sm">

                        {/* LEFT EYE */}
                        <article className="flex flex-col items-center group">
                            <EyeContainer borderColor="border-blue-500" shadowColor="shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-shadow duration-500">
                                <div onClick={() => navigate('/profile')} className="cursor-pointer w-full h-full">
                                    <UserAvatar
                                        url={user?.photo_url || "https://i.pravatar.cc/300?img=11"}
                                        alt="My Profile"
                                    />
                                </div>
                            </EyeContainer>
                        </article>

                        {/* RIGHT EYE */}
                        <article className="flex flex-col items-center group">
                            <EyeContainer borderColor="border-red-500" shadowColor="shadow-[0_0_40px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_60px_rgba(239,68,68,0.5)] transition-shadow duration-500">
                                <SlotMachine
                                    currentMatch={currentMatch}
                                    spinning={spinning}
                                    onNavigate={() => currentMatch && setShowMatchOverlay(true)}
                                />
                            </EyeContainer>
                        </article>

                    </div>

                    {/* Nose & Mouth */}
                    <div className="flex flex-col items-center gap-8">
                        {/* NOSE: 3D Trigger */}
                        <NoseButton spinning={spinning} onClick={handleSpin} />

                        {/* MOUTH: Animated Visuals */}
                        <MouthBar />
                    </div>

                </section>

            </main>
        </Layout>
    );
}
