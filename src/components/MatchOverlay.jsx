import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, X, Sparkles } from 'lucide-react';

// Painterly Crystal Circle with Gold Accents
const CrystalCircle = ({ children, color = "blue", delay = 0 }) => (
    <div className="relative group perspective-1000">
        {/* Artistic Painterly Glow */}
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.6 }}
            transition={{ type: "spring", delay: delay, duration: 2 }}
            className={`absolute -inset-2 rounded-full bg-gradient-to-tr from-yellow-500/30 via-purple-500/30 to-blue-500/30 blur-xl group-hover:opacity-80 transition-opacity duration-700`}
        />

        {/* Gold Rim & Glass Structure */}
        <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: delay }}
            className={`
                relative w-36 h-36 md:w-44 md:h-44 rounded-full 
                border-2 border-white/20 
                bg-gradient-to-br from-white/10 to-black/40
                backdrop-blur-md
                shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                flex items-center justify-center
                overflow-hidden
                z-10
                ring-1 ring-white/10
            `}
        >
            {/* Inner Gold Line */}
            <div className="absolute inset-1 rounded-full border border-yellow-200/20 pointer-events-none z-20" />

            {/* Specular Highlight */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 blur-2xl rounded-full z-20 pointer-events-none" />

            {/* Avatar */}
            <div className="w-[94%] h-[94%] rounded-full overflow-hidden relative z-10 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-out">
                {children}
            </div>
        </motion.div>
    </div>
);

export default function MatchOverlay({ user1, user2, onChat, onKeepSwiping }) {

    useEffect(() => {
        // High-End Confetti Config
        const duration = 2500;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 40, spread: 360, ticks: 120, zIndex: 100, gravity: 0.8 };
        // Elegant Colors: Gold, Silver, Soft Pink, Cyan
        const colors = ['#FCD34D', '#E5E7EB', '#F472B6', '#22D3EE'];

        // Initial burst - Mix of Stars and Circles
        const fire = (particleRatio, opts) => {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(60 * particleRatio),
                colors: colors,
                shapes: ['circle', 'star'], // PREMIUM SHAPES
                scalar: 1.2 // Slightly larger
            });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });

        return () => { };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden font-sans"
        >
            {/* Artistic Background - Painterly Noise & Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,20,90,0.4),rgba(0,0,0,0.95))]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 opacity-[0.07] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* Main Composition */}
            <div className="relative z-10 flex flex-col items-center w-full px-4 max-w-lg will-change-transform">

                {/* Typography: Liquid Metal Gradient */}
                <motion.div
                    initial={{ y: -30, opacity: 0, letterSpacing: "10px" }}
                    animate={{ y: 0, opacity: 1, letterSpacing: "0px" }}
                    transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.1 }}
                    className="text-center mb-14 relative"
                >
                    <div className="absolute inset-0 blur-2xl bg-white/10 rounded-full" />
                    <h2 className="relative text-6xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                        IT'S A<br />
                        <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">MATCH!</span>
                    </h2>

                    {/* Decorative Stars */}
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-4 -right-8 text-yellow-300 opacity-60"
                    >
                        <Sparkles size={32} />
                    </motion.div>
                </motion.div>

                {/* The Tableau (Avatars) */}
                <div className="relative flex items-center justify-center gap-2 mb-16">
                    {/* Connection Line */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute w-[120%] h-[1px] bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent blur-[0.5px] z-0"
                    />

                    <motion.div initial={{ x: -100, opacity: 0, rotate: -10 }} animate={{ x: 15, opacity: 1, rotate: -5 }} transition={{ type: "spring", stiffness: 60, delay: 0.3 }} className="z-10">
                        <CrystalCircle color="gold" delay={0.2}>
                            <img src={user1?.photo_url || "https://i.pravatar.cc/300?img=11"} className="w-full h-full object-cover" alt="Me" />
                        </CrystalCircle>
                    </motion.div>

                    <motion.div initial={{ x: 100, opacity: 0, rotate: 10 }} animate={{ x: -15, opacity: 1, rotate: 5 }} transition={{ type: "spring", stiffness: 60, delay: 0.4 }} className="z-20">
                        {/* Overlap effect */}
                        <CrystalCircle color="silver" delay={0.3}>
                            <img src={user2?.avatar_url || "https://i.pravatar.cc/300?img=5"} className="w-full h-full object-cover" alt="Match" />
                        </CrystalCircle>
                    </motion.div>
                </div>

                {/* Buttons (Glass & Gold) */}
                <div className="flex flex-col gap-5 w-full px-12">
                    <motion.button
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onClick={onChat}
                        whileTap={{ scale: 0.98 }}
                        className="
                            relative w-full py-4 rounded-full 
                            bg-white/10 backdrop-blur-xl border border-white/30
                            text-white font-bold text-lg tracking-widest
                            shadow-[0_0_30px_rgba(0,0,0,0.5)]
                            hover:bg-white/20 hover:border-white/50
                            transition-all duration-300
                            group overflow-hidden
                        "
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <MessageCircle className="text-yellow-300" size={24} />
                            <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">SAY HELLO</span>
                        </span>

                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                    </motion.button>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={onKeepSwiping}
                        className="w-full py-2 text-white/30 text-xs font-medium tracking-[0.3em] hover:text-white transition-colors uppercase"
                    >
                        Keep Swiping
                    </motion.button>
                </div>

            </div>
        </motion.div>
    );
}
