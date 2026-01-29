import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    // 🎭 "Passion" Avatar Frame (Warm & Energetic)
    const PulseFrame = ({ children, delay = 0 }) => (
        <div className="relative group w-32 h-32 md:w-64 md:h-64 flex items-center justify-center will-change-transform">
            {/* 1. Heartbeat Shockwave */}
            <motion.div
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay }}
                className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-red-500/40 to-orange-500/40 blur-xl"
            />

            {/* 2. The Molten Rim */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "40% 60% 70% 30% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    rotate: [0, 3, -3, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay }}
                className="absolute inset-0 border-[3px] border-orange-300/60 overflow-hidden z-10 bg-red-950/30 shadow-[0_0_30px_rgba(251,146,60,0.3)]"
            >
                {/* Image Container */}
                <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay z-10" />
                    {children}
                </div>

                {/* Gloss */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/30 to-transparent blur-md rounded-full pointer-events-none z-20" />
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1c0505] text-rose-50 overflow-hidden font-sans"
        >
            {/* ==========================================
                 LAYER 0: PASSION ATMOSPHERE
               ========================================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Warm Radical Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#450a0a_0%,#000000_100%)]" />

                {/* Textured Noise */}
                <div className="absolute inset-0 opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                {/* Subtle Pulse Background */}
                <motion.div
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent"
                />
            </div>

            {/* ==========================================
                 LAYER 1: MAIN COMPOSITION
               ========================================== */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-10 md:py-20 px-6">

                {/* SECTION: TYPOGRAPHY (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                        className="relative z-20 text-center"
                    >
                        <span className="block text-xl md:text-3xl font-medium tracking-[0.4em] text-red-300/80 mb-2 md:mb-4 uppercase">
                            Divine
                        </span>
                        <span className="block text-6xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-200 drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)]">
                            CHEMISTRY
                        </span>
                    </motion.div>

                    {/* SECTION: AVATARS & RIVER OF LIGHT */}
                    <div className="relative flex items-center justify-center gap-4 md:gap-16 mt-10 md:mt-16 w-full max-w-5xl z-10">

                        {/* RIVER OF LIGHT CONNECTION (Multiple Layers) */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] pointer-events-none z-0 opacity-80 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="warmFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" /> {/* Amber-400 */}
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Layer 1: Wide pulsing flow */}
                            <motion.path
                                d="M 0,100 C 150,120 450,80 600,100"
                                fill="none"
                                stroke="#f87171" // Red-400
                                strokeWidth="8"
                                strokeLinecap="round"
                                className="opacity-30 blur-md"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1, strokeWidth: [8, 12, 8] }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />

                            {/* Layer 2: Core Bright Line */}
                            <motion.path
                                d="M 0,100 C 150,100 450,100 600,100"
                                fill="none"
                                stroke="url(#warmFlow)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                            />

                            {/* Layer 3: Dancing Sine Wave */}
                            <motion.path
                                d="M 0,100 Q 150,50 300,100 T 600,100"
                                fill="none"
                                stroke="#fcd34d" // Amber-300
                                strokeWidth="2"
                                className="opacity-70"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.7, d: ["M 0,100 Q 150,50 300,100 T 600,100", "M 0,100 Q 150,150 300,100 T 600,100", "M 0,100 Q 150,50 300,100 T 600,100"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            />
                        </svg>

                        {/* Avatar 1: Left */}
                        <motion.div
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 60, damping: 20 }}
                        >
                            <PulseFrame delay={0}>
                                <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="You" />
                            </PulseFrame>
                        </motion.div>

                        {/* Avatar 2: Right */}
                        <motion.div
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.1 }}
                        >
                            <PulseFrame delay={0.5}>
                                <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Them" />
                            </PulseFrame>
                        </motion.div>
                    </div>
                </div>

                {/* SECTION: INTERACTIONS (Bottom) */}
                <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto relative z-20 mt-6">

                    {/* Primary Action: Hot Button */}
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onChat}
                        className="
                            group relative w-full py-4 rounded-xl
                            bg-gradient-to-r from-red-600 to-orange-600
                            shadow-[0_10px_30px_rgba(220,38,38,0.4)]
                            overflow-hidden
                        "
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

                        <span className="relative z-10 flex items-center justify-center gap-3 text-white font-bold text-lg tracking-widest uppercase">
                            <MessageCircle size={22} className="text-yellow-200" />
                            Send a Message
                        </span>
                    </motion.button>

                    {/* Secondary Action: Minimalist */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={onKeepSwiping}
                        className="text-xs text-red-200/60 uppercase tracking-[0.3em] font-medium hover:text-white transition-colors py-2"
                    >
                        Keep Searching
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
