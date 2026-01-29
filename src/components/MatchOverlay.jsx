import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    // 🎭 "Liquid Metal" Avatar Frame
    // Uses randomized border-radius to create organic, breathing shapes
    const LiquidFrame = ({ children, delay = 0 }) => (
        <div className="relative group w-32 h-32 md:w-64 md:h-64 flex items-center justify-center">
            {/* 1. The Glowing Aura (Gold/Violet Bleed) */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
                className="absolute inset-[-10px] bg-gradient-to-tr from-yellow-500/40 via-purple-600/30 to-blue-600/30 blur-2xl opacity-60"
            />

            {/* 2. The Golden Kintsugi Rim (Actual Border) */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
                className="absolute inset-0 border-[3px] border-yellow-200/50 backdrop-blur-sm overflow-hidden z-10 shadow-[0_0_50px_rgba(253,224,71,0.2)]"
            >
                {/* Image Container */}
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <div className="absolute inset-0 bg-yellow-900/20 mix-blend-overlay z-10" /> {/* Warm Filter */}
                    {children}
                </motion.div>

                {/* 3. Glossy Specular Highlight (The "Wet" Look) */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/40 to-transparent blur-md rounded-full pointer-events-none z-20" />
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0A09] text-stone-100 overflow-hidden font-sans"
        >
            {/* ==========================================
                 LAYER 0: ATMOSPHERE & BACKGROUND
               ========================================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Void Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#292524_0%,#0C0A09_100%)]" />

                {/* Floating Celestial Dust */}
                <div className="absolute inset-0 opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                {/* Moving Spotlights */}
                <motion.div
                    animate={{ x: [-100, 100], y: [-50, 50], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ x: [100, -100], y: [50, -50], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-900/10 blur-[150px] rounded-full mix-blend-screen"
                />
            </div>

            {/* ==========================================
                 LAYER 1: MAIN COMPOSITION
               ========================================== */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-12 md:py-20 px-6">

                {/* SECTION: TYPOGRAPHY (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-20 text-center mix-blend-hard-light"
                    >
                        <span className="block text-xl md:text-3xl font-light tracking-[0.6em] text-stone-400 mb-2 md:mb-4 uppercase">
                            Cosmic
                        </span>
                        <span className="block text-5xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 drop-shadow-[0_20px_50px_rgba(234,179,8,0.2)]">
                            CONNECTION
                        </span>
                    </motion.h2>

                    {/* SECTION: AVATARS (Middle) */}
                    <div className="relative flex items-center justify-center gap-4 md:gap-16 mt-8 md:mt-12 w-full max-w-4xl z-10">

                        {/* GOLDEN THREAD (Anchored to Container) */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] pointer-events-none z-0 opacity-50 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#FDE047" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <motion.path
                                d="M 0,100 C 150,100 150,50 300,100 C 450,150 450,100 600,100"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                filter="url(#glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            />
                        </svg>

                        {/* Avatar 1: Left */}
                        <motion.div
                            initial={{ x: -50, opacity: 0, rotate: -15 }}
                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.2 }}
                        >
                            <LiquidFrame delay={0}>
                                <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="You" />
                            </LiquidFrame>
                        </motion.div>

                        {/* Avatar 2: Right */}
                        <motion.div
                            initial={{ x: 50, opacity: 0, rotate: 15 }}
                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 40, damping: 20, delay: 0.4 }}
                        >
                            <LiquidFrame delay={2}>
                                <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Them" />
                            </LiquidFrame>
                        </motion.div>
                    </div>
                </div>

                {/* SECTION: INTERACTIONS (Bottom) */}
                <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto relative z-20 mt-8">

                    {/* Primary Action: Glass & Light */}
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onChat}
                        className="
                            group relative w-full py-5 rounded-sm
                            bg-gradient-to-r from-stone-800 to-stone-900
                            border border-stone-700
                            hover:border-yellow-500/50
                            transition-all duration-500
                            overflow-visible
                        "
                    >
                        {/* Button Glow Behind */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-sm" />

                        <span className="relative z-10 flex items-center justify-center gap-4 text-yellow-100 font-serif text-xl tracking-widest uppercase">
                            <MessageCircle size={20} className="text-yellow-500" />
                            Initiate
                        </span>
                    </motion.button>

                    {/* Secondary Action: Minimalist */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        onClick={onKeepSwiping}
                        className="relative group text-xs text-stone-500 uppercase tracking-[0.4em] font-medium"
                    >
                        <span className="group-hover:text-stone-300 transition-colors duration-300">Dismiss & Continue</span>
                        <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-stone-500 group-hover:w-full transition-all duration-500 ease-out" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
