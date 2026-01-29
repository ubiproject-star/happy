import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/happi-logo.png';
import { Sparkles } from 'lucide-react';

export default function Splash({ onComplete, onInteract }) {
    useEffect(() => {
        // Try autoplay logic hook
        if (onInteract) onInteract();

        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // Slightly longer to appreciate the art
        return () => clearTimeout(timer);
    }, [onComplete, onInteract]);

    // Floating Gold Dust Particles
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.5 + 0.2, // Small dust
            opacity: Math.random() * 0.5 + 0.2,
            duration: Math.random() * 10 + 10,
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <div onClick={onInteract} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden cursor-pointer">
            {/* 1. Canvas Background (Painterly) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Deep Void Base */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2e1065_0%,#000000_80%)]" />

                {/* Nebula Highlights */}
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-pink-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            {/* 2. Floating Gold Dust */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.scale}rem`,
                        height: `${p.scale}rem`,
                    }}
                    animate={{
                        y: [0, -50],
                        opacity: [0, p.opacity, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.5, 1]
                    }}
                />
            ))}

            {/* 3. The Centerpiece (Logo) */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Elegant easeOutExpo-ish
                className="relative z-10 flex flex-col items-center"
            >
                {/* Back Light (Halo) */}
                <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-150 transform -translate-y-4" />

                {/* The Logo */}
                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-64 md:w-80 h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    animate={{
                        y: [0, -10, 0],
                        filter: ["drop-shadow(0 0 0px rgba(255,255,255,0))", "drop-shadow(0 0 20px rgba(236,72,153,0.3))", "drop-shadow(0 0 0px rgba(255,255,255,0))"]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 4. Artistic Loading Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-12 flex flex-col items-center gap-3"
                >
                    <span className="text-sm tracking-[0.5em] font-light text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white/80 to-transparent uppercase">
                        Initializing Art
                    </span>

                    {/* Gold Progress Line */}
                    <div className="w-32 h-[1px] bg-white/10 overflow-hidden relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
