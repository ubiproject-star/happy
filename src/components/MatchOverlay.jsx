import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle } from 'lucide-react';

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    useEffect(() => {
        // Trigger confetti explosion on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 250);

        // Big initial burst
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#EF4444', '#3B82F6', '#A855F7', '#FFFFFF']
        });

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-hidden"
        >
            {/* Background Rays/Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent animate-pulse" />

            {/* Match Heading */}
            <motion.div
                initial={{ scale: 0.5, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="relative z-10 text-center mb-12"
            >
                <h2 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    IT'S A HAPPI<br />MATCH!
                </h2>
            </motion.div>

            {/* Avatars Collision Animation */}
            <div className="relative flex items-center justify-center h-48 w-full mb-12">
                {/* Connecting Ring */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute w-64 h-64 rounded-full border-4 border-neon-blue shadow-[0_0_30px_#00f3ff] opacity-50"
                />

                {/* Left User (You) */}
                <motion.div
                    initial={{ x: -150, opacity: 0 }}
                    animate={{ x: -30, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="w-32 h-32 rounded-full border-4 border-red-500 overflow-hidden shadow-[0_0_20px_#ef4444]">
                        <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="You" />
                    </div>
                </motion.div>

                {/* Right User (Match) */}
                <motion.div
                    initial={{ x: 150, opacity: 0 }}
                    animate={{ x: 30, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden shadow-[0_0_20px_#3b82f6]">
                        <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Match" />
                    </div>
                </motion.div>

                {/* Lightning/Spark in center */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    // Flash in middle when they meet
                    animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="absolute z-20"
                >
                    <div className="w-20 h-20 bg-white rounded-full blur-xl" />
                </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-xs z-20">
                <motion.button
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={onChat}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-red-500 to-purple-600 font-bold text-white text-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                    <MessageCircle fill="currentColor" size={24} />
                    SAY HI
                </motion.button>

                <motion.button
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    onClick={onKeepSwiping}
                    className="w-full py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                    KEEP SWIPING
                </motion.button>
            </div>

        </motion.div>
    );
}
