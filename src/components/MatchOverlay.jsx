import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    // Luxury "Fluid Energy" Background Components
    const FloatingOrb = ({ color, delay, duration, scale }) => (
        <motion.div
            animate={{
                y: [0, -40, 0],
                x: [0, 30, 0],
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
            className={`absolute rounded-full blur-[80px] mix-blend-screen ${color}`}
            style={{ width: scale, height: scale }}
        />
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-950 overflow-hidden font-sans"
        >
            {/* 1. Background: Warm Luxury Depth */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Base Dark Warmth */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-950 to-black" />

                {/* Fluid Energy Flow (Gold/Amber/Deep Red) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg">
                    <FloatingOrb color="bg-yellow-600/30" delay={0} duration={8} scale="300px" />
                    <FloatingOrb color="bg-amber-700/20" delay={2} duration={10} scale="400px" />
                    <FloatingOrb color="bg-orange-900/20" delay={1} duration={12} scale="350px" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/20 blur-[100px] rounded-full" />
                </div>

                {/* Subtle Grain Texture for "Paper" feel */}
                <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            {/* 2. Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-md">

                {/* Header Typography: Gold Foil Effect */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12 relative"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute inset-0 bg-yellow-500/20 blur-3xl"
                    />

                    <h2 className="relative flex flex-col items-center">
                        <span className="text-xl md:text-2xl font-medium tracking-[0.5em] text-stone-400 mb-2 uppercase">It's a</span>
                        <span className="text-5xl md:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-600 drop-shadow-2xl">
                            Match
                        </span>
                    </h2>

                    <motion.div
                        animate={{ rotate: 360, opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-6 -right-4 text-yellow-200"
                    >
                        <Sparkles size={24} />
                    </motion.div>
                </motion.div>

                {/* Avatars: Connected by Gold Energy */}
                <div className="relative flex items-center justify-center mb-16 w-full h-40">

                    {/* Energy Beam */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "80%", opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                        className="absolute h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-[2px] z-0"
                    />

                    {/* Avatar 1 */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: -20, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                        className="relative z-10"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-900 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                            <div className="w-full h-full rounded-full border-4 border-stone-900 overflow-hidden">
                                <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover grayscale-[20%]" alt="You" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Avatar 2 */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 20, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
                        className="relative z-10"
                    >
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-tl from-yellow-300 via-yellow-600 to-yellow-900 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                            <div className="w-full h-full rounded-full border-4 border-stone-900 overflow-hidden">
                                <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover grayscale-[20%]" alt="Them" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Central Spark */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="absolute z-20 bg-yellow-100 rounded-full p-2 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    >
                        <Sparkles className="text-yellow-600 w-6 h-6" />
                    </motion.div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-6 w-full px-8">
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={onChat}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="
                            group relative w-full py-4 rounded-xl overflow-hidden
                            bg-gradient-to-r from-yellow-600 to-yellow-800
                            border border-yellow-500/30
                            shadow-[0_10px_30px_rgba(0,0,0,0.5)]
                        "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center justify-center gap-3 text-stone-950 font-bold tracking-widest text-sm uppercase">
                            <MessageCircle size={18} className="text-stone-900" />
                            Start Conversation
                        </span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        onClick={onKeepSwiping}
                        className="text-stone-500 text-xs tracking-[0.3em] uppercase hover:text-yellow-500 transition-colors"
                    >
                        Keep Browsing
                    </motion.button>
                </div>

            </div>
        </motion.div>
    );
}
