import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useTelegram from '../hooks/useTelegram';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import MatchOverlay from '../components/MatchOverlay';
import PurchaseModal from '../components/PurchaseModal';
import { ChevronLeft, Volume2, VolumeX, Sparkles, Play, Pause, SkipForward, SkipBack, Flame } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// --- Artistic Components ---

const CrystalLens = ({ children, borderColor = "border-white/20", glowColor = "shadow-blue-500/20" }) => (
    <div className={`
        relative w-36 h-44 rounded-[2.5rem] 
        bg-gradient-to-br from-white/10 to-transparent 
        backdrop-blur-md border border-white/20 
        overflow-hidden 
        shadow-[0_0_30px_rgba(0,0,0,0.2)] ${glowColor}
        group transition-transform duration-500 hover:scale-105 hover:border-white/40
        will-change-transform
    `}>
        {/* Prismatic Glint */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Inner Content */}
        <div className="relative w-full h-full p-1.5">
            <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black/60 relative">
                {children}
            </div>
            {/* Glass Reflection */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[8px] z-20 pointer-events-none" />
        </div>
    </div>
);

const UserAvatar = ({ url, alt }) => (
    <img src={url} alt={alt} loading="lazy" className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" />
);

const SlotMachine = ({ currentMatch, spinning, onNavigate }) => (
    <div className="w-full h-full flex items-center justify-center relative bg-black">
        {/* Render optimized raw image during spin, Motion image for reveal */}
        {spinning ? (
            /* Fast-swap raw image for performance */
            currentMatch ? (
                <img
                    src={currentMatch.avatar_url || `https://i.pravatar.cc/300?u=${currentMatch.id}`}
                    alt="Spinning"
                    className="w-full h-full object-cover filter blur-sm opacity-80"
                />
            ) : (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )
        ) : (
            /* Stable view with smooth Reveal */
            <AnimatePresence>
                {currentMatch ? (
                    <motion.img
                        key={currentMatch.id}
                        src={currentMatch.avatar_url || `https://i.pravatar.cc/300?u=${currentMatch.id}`}
                        alt="Match"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover cursor-pointer hover:brightness-110 transition-all"
                        onClick={onNavigate}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-50 bg-gradient-to-br from-red-900/40 to-black">
                        {/* Enlarged, more intense flame */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Flame
                                size={56}
                                className="text-red-500 fill-red-500/20 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] filter blur-[0.5px]"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        )}

        {/* Digital Noise Overlay when spinning */}
        {spinning && (
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay z-10" />
        )}
    </div>
);

const EnergyCore = ({ spinning, onClick }) => (
    <div className="relative z-30 group flex items-center justify-center">
        {/* Outer Ring - Simplified */}
        <div className={`
            absolute inset-0 rounded-full border border-white/10 
            transition-transform duration-500
            ${spinning ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
        `} />

        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={spinning}
            className={`
                relative w-24 h-24 rounded-full flex items-center justify-center
                bg-gradient-to-br from-white/10 via-white/5 to-transparent
                backdrop-blur-sm border border-white/20
                shadow-[0_0_50px_rgba(255,255,255,0.05)]
                transition-all duration-300
                group-hover:shadow-[0_0_60px_rgba(255,75,75,0.2)]
                group-hover:border-red-500/30
            `}
        >
            {/* The Core */}
            <div className={`
                w-12 h-12 rounded-full 
                bg-gradient-to-tr from-red-600 to-orange-500
                shadow-[0_0_20px_rgba(239,68,68,0.5)]
                transition-all duration-500
                ${spinning ? 'animate-pulse scale-90 brightness-150' : 'scale-100 group-hover:scale-110'}
            `} />

            {/* Spinning Orbitals - CSS Only */}
            {spinning && (
                <div className="absolute inset-0 border-2 border-t-white/30 border-transparent rounded-full animate-spin" />
            )}
        </motion.button>
    </div>
);

const SonicWave = ({ spinning }) => (
    <div className="w-48 h-12 flex items-center justify-center gap-1.5 opacity-60">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                layout
                className="w-1 bg-gradient-to-t from-transparent via-white/50 to-transparent rounded-full"
                animate={{
                    height: spinning ? [10, 24, 10] : 8,
                    opacity: spinning ? 1 : 0.4
                }}
                transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.05
                }}
            />
        ))}
    </div>
);

const AuroraBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        {/* Static Gradients - Much lighter on GPU */}
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_70%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 left-20 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_60%)]" />
    </div>
);

// --- Main Page Component ---

export default function Welcome() {
    const { user } = useAuth(); // Gets DB user with updated photo
    const navigate = useNavigate();
    const { playSound, initAudio, muted, toggleMute, nextTrack, prevTrack } = useSound();
    const { t } = useLanguage();

    // --- STATE ---
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [showMatchOverlay, setShowMatchOverlay] = useState(false);

    // Credits System
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [credits, setCredits] = useState(() => {
        const saved = localStorage.getItem('searchCredits');
        return saved !== null ? parseInt(saved, 10) : 3;
    });

    useEffect(() => {
        localStorage.setItem('searchCredits', credits);
    }, [credits]);

    const handlePurchase = (amount) => {
        setCredits(prev => prev + amount);
        setShowPurchaseModal(false);
        playSound('match'); // Success sound
    };

    // Initial Data Fetch
    useEffect(() => {
        const fetchUsers = async () => {
            // Fallback ID for dev/testing if not logged in via Telegram
            const myId = user?.id || 1001;

            console.log("Fetching compatible users for:", myId);

            // Use the RPC function to get tailored matches
            const { data, error } = await supabase
                .rpc('get_compatible_users', { requesting_user_id: myId });

            if (error) {
                console.error("Matching Error:", error);
                // Fallback to random if RPC fails (e.g. function not created yet)
                const { data: fallback } = await supabase.from('users').select('*').limit(20);
                if (fallback) setMatches(fallback.sort(() => 0.5 - Math.random()));
            } else if (data && data.length > 0) {
                console.log(`Found ${data.length} compatible matches`);
                const shuffled = data.sort(() => 0.5 - Math.random());
                setMatches(shuffled);
            } else {
                console.log("No specific matches found, showing random pool");
                const { data: fallback } = await supabase.from('users').select('*').limit(20);
                if (fallback) setMatches(fallback.sort(() => 0.5 - Math.random()));
            }
        };

        if (user) fetchUsers();
        // If no user immediately, wait a bit or let auth settle. 
        // But for now, we trigger if user exists or not (using fallback).
        if (!user) {
            // Try fetching anyway with fallback ID for testing
            fetchUsers();
        }
    }, [user]);

    // Provide a way to interact first
    const handleInteractionStart = useCallback(() => {
        initAudio();
    }, [initAudio]);

    const handleSpin = useCallback(() => {
        handleInteractionStart();

        // CHECK CREDITS
        if (credits <= 0) {
            setShowPurchaseModal(true);
            return;
        }

        if (spinning || matches.length === 0) return;

        // DECREMENT CREDIT
        setCredits(prev => prev - 1);

        setSpinning(true);
        setShowMatchOverlay(false);
        playSound('power_click'); // Ultra Dopamine Start

        let spinCount = 0;
        const maxSpins = 15;
        const speed = 100;

        const spinInterval = setInterval(() => {
            playSound('spin'); // Tick every spin

            const randomIndex = Math.floor(Math.random() * matches.length);
            setCurrentMatch(matches[randomIndex]);

            spinCount++;
            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);
                setSpinning(false);

                // Trigger Match
                playSound('match');
                setShowMatchOverlay(true);
            }
        }, speed);
    }, [spinning, matches, playSound, handleInteractionStart, credits]);

    const handleChat = async () => {
        playSound('click');
        if (currentMatch) {
            // Navigate only. Saving happens explicitly on the Profile page.
            navigate(`/user/${currentMatch.id}`);
        }
    };

    const handleKeepSwiping = () => {
        playSound('refresh');
        setShowMatchOverlay(false);
    };

    return (
        <Layout>
            <main onClick={handleInteractionStart} className="flex flex-col h-full relative overflow-hidden font-sans">
                <AuroraBackground />

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

                {/* Purchase Modal */}
                <AnimatePresence>
                    {showPurchaseModal && (
                        <PurchaseModal
                            onClose={() => setShowPurchaseModal(false)}
                            onPurchase={handlePurchase}
                        />
                    )}
                </AnimatePresence>

                {/* Header Section */}
                <header className="flex justify-between items-center relative z-10 mb-8 px-4 pt-4 md:pt-10">
                    {/* Left: Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Center: Music Player (Premium) */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevTrack(); }}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                        >
                            <SkipBack size={14} className="fill-white text-white" />
                        </button>

                        <div className="h-4 w-[1px] bg-white/10" />

                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
                        >
                            {muted ? <Play size={16} className="fill-white text-white ml-0.5" /> : <Pause size={16} className="fill-white text-white" />}
                        </button>

                        <div className="h-4 w-[1px] bg-white/10" />

                        <button
                            onClick={(e) => { e.stopPropagation(); nextTrack(); }}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                        >
                            <SkipForward size={14} className="fill-white text-white" />
                        </button>
                    </div>

                    {/* Right: Credits Counter */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowPurchaseModal(true); }}
                        className="h-10 px-4 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-lg hover:bg-white/10 transition-all active:scale-95"
                    >
                        <span className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            {credits}
                        </span>
                    </button>
                </header>

                {/* The Oracle Interface */}
                <section className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-10" aria-label="Digital Oracle">

                    {/* The Eyes: Crystal Lenses */}
                    <div className="flex items-center justify-center gap-6 mb-16 w-full max-w-md px-4">

                        {/* Left Lens: Me */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <CrystalLens borderColor="border-blue-400/20" glowColor="group-hover:shadow-blue-500/40">
                                <UserAvatar
                                    url={user?.photo_url || "https://i.pravatar.cc/300?img=11"}
                                    alt="My Profile"
                                />
                            </CrystalLens>
                        </motion.div>

                        {/* Right Lens: The Unknown */}
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <CrystalLens borderColor="border-pink-400/20" glowColor="group-hover:shadow-pink-500/40">
                                <SlotMachine
                                    currentMatch={currentMatch}
                                    spinning={spinning}
                                    onNavigate={() => currentMatch && setShowMatchOverlay(true)}
                                />
                            </CrystalLens>
                        </motion.div>

                    </div>

                    {/* The Core: Action & Feedback */}
                    <div className="flex flex-col items-center gap-8">
                        {/* The Trigger */}
                        <EnergyCore spinning={spinning} onClick={handleSpin} />

                        {/* The Voice */}
                        <SonicWave spinning={spinning} />
                    </div>

                </section>

                {/* Footer / Status */}
                <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
                        {spinning ? t('searching') : t('system_ready')}
                    </span>
                </div>



            </main>
        </Layout>
    );
}
