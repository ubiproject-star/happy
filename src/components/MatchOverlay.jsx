import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    // 🎭 "Liquid Metal" Avatar Frame
    // OPTIMIZATION: Reduced shadow spread and blur for performance.
    // Removed backdrop-filter inside moving elements.
    const LiquidFrame = ({ children, delay = 0 }) => (
        <div className="relative group w-32 h-32 md:w-64 md:h-64 flex items-center justify-center will-change-transform">
            {/* 1. The Glowing Aura (Simpler Gradient) */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "50% 50% 50% 50% / 50% 50% 50% 50%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay }}
                className="absolute inset-[-4px] bg-gradient-to-tr from-yellow-500/30 to-purple-600/30 blur-lg opacity-50"
            />

            {/* 2. The Golden Kintsugi Rim (Actual Border) */}
            <motion.div
                animate={{
                    borderRadius: [
                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                        "50% 50% 50% 50% / 50% 50% 50% 50%",
                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay }}
                // OPTIMIZATION: Removed backdrop-blur-sm (expensive on moving element), reduced shadow
                className="absolute inset-0 border-[2px] border-yellow-200/60 overflow-hidden z-10 bg-stone-900/40"
            >
                {/* Image Container */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <div className="absolute inset-0 bg-yellow-900/10 mix-blend-overlay z-10" />
                    {children}
                </motion.div>

                {/* 3. Glossy Specular Highlight (Simplified) */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent blur-md rounded-full pointer-events-none z-20" />
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0A09] text-stone-100 overflow-hidden font-sans"
        >
            {/* ==========================================
                 LAYER 0: ATMOSPHERE & BACKGROUND
               ========================================== */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Static Background Gradient (Cheap) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1c1917_0%,#000000_100%)]" />

                {/* Static Noise (Cheap) */}
                <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                {/* OPTIMIZATION: Removed moving spotlights with massive blurs. 
                    Replaced with static vignette or subtle pulse if needed, effectively "Deep Void". */}
            </div>

            {/* ==========================================
                 LAYER 1: MAIN COMPOSITION
               ========================================== */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-10 md:py-20 px-6">

                {/* SECTION: TYPOGRAPHY (Top) */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-20 text-center"
                    >
                        <span className="block text-xl md:text-3xl font-light tracking-[0.6em] text-stone-500 mb-2 md:mb-4 uppercase">
                            Cosmic
                        </span>
                        {/* OPTIMIZATION: Removed bg-clip-text on large text if causing lag, but usually okay. 
                            Reduced drop-shadow complexity. */}
                        <span className="block text-5xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 drop-shadow-xl">
                            CONNECTION
                        </span>
                    </motion.div>

                    {/* SECTION: AVATARS (Middle) */}
                    <div className="relative flex items-center justify-center gap-4 md:gap-16 mt-8 md:mt-12 w-full max-w-4xl z-10">

                        {/* GOLDEN THREAD (Optimized) */}
                        {/* OPTIMIZATION: Removed <filter> logic. Used simple stroke. */}
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] pointer-events-none z-0 opacity-60 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="20%" stopColor="#FDE047" />
                                    <stop offset="80%" stopColor="#FDE047" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d="M 0,100 C 150,100 150,50 300,100 C 450,150 450,100 600,100"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                // Removed filter="url(#glow)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
                            />
                        </svg>

                        {/* Avatar 1: Left */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
                        >
                            <LiquidFrame delay={0}>
                                <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="You" />
                            </LiquidFrame>
                        </motion.div>

                        {/* Avatar 2: Right */}
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
                        >
                            <LiquidFrame delay={2}>
                                <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Them" />
                            </LiquidFrame>
                        </motion.div>
                    </div>
                </div>

                {/* SECTION: INTERACTIONS (Bottom) */}
                <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto relative z-20 mt-6">

                    {/* Primary Action: Optimized Glass */}
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={onChat}
                        className="
                            group relative w-full py-4 rounded-sm
                            bg-stone-800
                            border border-stone-700
                            shadow-lg
                            transition-colors duration-300
                            hover:bg-stone-700
                        "
                    >
                        {/* Removed blurry glow behind button for performance */}
                        <span className="relative z-10 flex items-center justify-center gap-4 text-yellow-100 font-serif text-xl tracking-widest uppercase">
                            <MessageCircle size={20} className="text-yellow-500" />
                            Initiate
                        </span>
                    </motion.button>

                    {/* Secondary Action: Minimalist */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        onClick={onKeepSwiping}
                        className="text-xs text-stone-500 uppercase tracking-[0.4em] font-medium hover:text-stone-300 transition-colors py-2"
                    >
                        Dismiss & Continue
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
