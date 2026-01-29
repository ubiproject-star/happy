import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, X } from 'lucide-react';

// Reusing the Crystal aesthetic, but circular for avatars
const CrystalCircle = ({ children, color = "blue", delay = 0 }) => (
    <div className="relative group">
        {/* Outer Glow Ring */}
        <motion.div
            initial={{ scale: 0, rotation: 0 }}
            animate={{ scale: 1, rotation: 180 }}
            transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
                delay: delay
            }}
            className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-${color}-500 to-transparent opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Glass Container */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: delay + 0.1 }}
            className={`
                relative w-32 h-32 md:w-40 md:h-40 rounded-full 
                border-2 border-white/20 backdrop-blur-xl bg-white/5
                shadow-[0_0_30px_rgba(0,0,0,0.3)]
                flex items-center justify-center
                overflow-hidden
                z-10
            `}
        >
            {/* Inner Glint */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* The Image */}
            <div className="w-[92%] h-[92%] rounded-full overflow-hidden border border-white/10 relative z-10">
                {children}
            </div>
        </motion.div>
    </div>
);

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    useEffect(() => {
        // Trigger confetti explosion on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100, gravity: 0.8 };

        // Initial burst
        confetti({ ...defaults, particleCount: 100, origin: { x: 0.5, y: 0.5 } });

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 40 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden font-sans"
        >
            {/* Deep Space Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.3),transparent_70%)] animate-pulse-slow" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.2),transparent_70%)]" />
                {/* Starfield / Noise */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center w-full px-4 max-w-md">

                {/* Header Text */}
                <motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mix-blend-screen text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-purple-400 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">
                        IT'S A<br />
                        <span className="bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent">MATCH!</span>
                    </h2>
                </motion.div>

                {/* The Twin Planets (Avatars) */}
                <div className="relative flex items-center justify-center gap-4 mb-16">
                    {/* Connecting Energy Beam */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="absolute h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px] z-0"
                    />

                    {/* Glowing Cosmos behind */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />

                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 10, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                        <CrystalCircle color="pink" delay={0.2}>
                            <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="Me" />
                        </CrystalCircle>
                    </motion.div>

                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: -10, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                        {/* Overlap effect */}
                        <CrystalCircle color="blue" delay={0.3}>
                            <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Match" />
                        </CrystalCircle>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col gap-4 w-full px-8">
                    <motion.button
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onClick={onChat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                            group relative w-full py-4 rounded-full 
                            bg-gradient-to-r from-neon-red to-purple-600 
                            text-white font-bold text-lg tracking-wider
                            shadow-[0_0_30px_rgba(239,68,68,0.4)]
                            border border-white/20
                            overflow-hidden
                        "
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <MessageCircle className="fill-current" size={22} />
                            SAY HELLO
                        </span>
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </motion.button>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={onKeepSwiping}
                        className="w-full py-3 text-white/50 text-sm font-medium tracking-widest hover:text-white transition-colors uppercase"
                    >
                        Keep Swiping
                    </motion.button>
                </div>

            </div>
        </motion.div>
    );
}
