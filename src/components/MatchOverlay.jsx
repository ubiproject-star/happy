import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    // 🎭 "Erotic Flux" Avatar Frame
    // Deep, sensual colors: Magenta, Deep Red, Violet
    const PulseFrame = ({ children, delay = 0 }) => (
        <div className="relative group w-32 h-32 md:w-64 md:h-64 flex items-center justify-center will-change-transform">
            {/* 1. Sensual Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
                className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-800 blur-2xl opacity-60"
            />

            {/* 2. The Liquid Form */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "40% 60% 70% 30% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
                className="absolute inset-0 border-[3px] border-pink-400/50 overflow-hidden z-10 bg-rose-950/40 shadow-[0_0_40px_rgba(219,39,119,0.3)]"
            >
                {/* Image Container */}
                <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-fuchsia-900/20 mix-blend-overlay z-10" />
                    {children}
                </div>

                {/* Gloss */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent blur-md rounded-full pointer-events-none z-20" />
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a050b] text-rose-50 overflow-hidden font-sans"
        >
            {/* ==========================================
                 LAYER 0: ATMOSPHERE
               ========================================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Erotic Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4c0519_0%,#000000_100%)]" />

                {/* Textured Noise */}
                <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                {/* Slow Passionate Pulse */}
                <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-transparent"
                />
            </div>

            {/* ==========================================
                 LAYER 1: MAIN COMPOSITION
               ========================================== */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-10 md:py-20 px-6">

                {/* SECTION: TYPOGRAPHY (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-20 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                                filter: ["drop-shadow(0 0 10px rgba(236,72,153,0.3))", "drop-shadow(0 0 20px rgba(236,72,153,0.6))", "drop-shadow(0 0 10px rgba(236,72,153,0.3))"]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-4"
                        >
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
                                {/* Intertwined Mars & Venus */}
                                <motion.path
                                    d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                                    className="opacity-0"
                                /> {/* Hidden bounding box fix if needed, but using direct paths below */}

                                {/* Venus (Female) */}
                                <path d="M10 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10" className="stroke-pink-400" />
                                <path d="M10 16v4" className="stroke-pink-400" />
                                <path d="M7 18h6" className="stroke-pink-400" />

                                {/* Mars (Male) - Interlocking */}
                                <path d="M17.5 7.5a4.5 4.5 0 1 1-4.5 4.5" className="stroke-pink-300" />
                                <path d="M17.5 7.5l2.5-2.5" className="stroke-pink-300" />
                                <path d="M17 2h5v5" className="stroke-pink-300" />
                            </svg>
                        </motion.div>
                        <span className="block text-5xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-rose-500 to-purple-600 drop-shadow-[0_10px_25px_rgba(219,39,119,0.3)]">
                            COSMIC<br />CONNECTION
                        </span>
                    </motion.div>

                    {/* SECTION: AVATARS & SENSUAL THREAD */}
                    <div className="relative flex items-center justify-center gap-4 md:gap-16 mt-10 md:mt-12 w-full max-w-5xl z-10">

                        {/* SENSUAL THREAD CONNECTION */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] pointer-events-none z-0 opacity-80 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="sensualFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#db2777" stopOpacity="0" />
                                    <stop offset="50%" stopColor="#f472b6" stopOpacity="1" /> {/* Pink-400 */}
                                    <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Layer 1: Deep slow undulation */}
                            <motion.path
                                d="M 0,100 C 200,80 400,120 600,100"
                                fill="none"
                                stroke="#be185d" // Pink-700
                                strokeWidth="12"
                                strokeLinecap="round"
                                className="opacity-20 blur-xl"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1, d: ["M 0,100 C 200,80 400,120 600,100", "M 0,100 C 200,120 400,80 600,100", "M 0,100 C 200,80 400,120 600,100"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Layer 2: Main glowing artery */}
                            <motion.path
                                d="M 0,100 C 150,100 450,100 600,100"
                                fill="none"
                                stroke="url(#sensualFlow)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            />

                            {/* Layer 3: Entwining Silk */}
                            <motion.path
                                d="M 0,100 Q 150,60 300,100 T 600,100"
                                fill="none"
                                stroke="#fbcfe8" // Pink-200
                                strokeWidth="1"
                                className="opacity-60"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.6, d: ["M 0,100 Q 150,60 300,100 T 600,100", "M 0,100 Q 150,140 300,100 T 600,100", "M 0,100 Q 150,60 300,100 T 600,100"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            />
                        </svg>

                        {/* Avatar 1: Left */}
                        <motion.div
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 45, damping: 20 }}
                        >
                            <PulseFrame delay={0}>
                                <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="You" />
                            </PulseFrame>
                        </motion.div>

                        {/* Avatar 2: Right */}
                        <motion.div
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 45, damping: 20, delay: 0.2 }}
                        >
                            <PulseFrame delay={0.8}>
                                <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Them" />
                            </PulseFrame>
                        </motion.div>
                    </div>
                </div>

                {/* SECTION: INTERACTIONS (Bottom) */}
                <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto relative z-20 mt-6">

                    {/* Primary Action: Lush Button */}
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onChat}
                        className="
                            group relative w-full py-4 rounded-full
                            bg-gradient-to-r from-pink-700 to-rose-900
                            border border-pink-500/30
                            shadow-[0_10px_40px_rgba(190,24,93,0.4)]
                            overflow-hidden
                        "
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <span className="relative z-10 flex items-center justify-center gap-3 text-pink-50 font-bold text-lg tracking-widest uppercase">
                            <MessageCircle size={20} className="text-pink-300" />
                            Connect Now
                        </span>
                    </motion.button>

                    {/* Secondary Action: Minimalist */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        onClick={onKeepSwiping}
                        className="text-xs text-pink-300/50 uppercase tracking-[0.3em] font-medium hover:text-pink-100 transition-colors py-2"
                    >
                        Keep Searching
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
