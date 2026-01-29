import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/happi-logo.png';
import { Sparkles } from 'lucide-react';

export default function Splash({ onComplete, onInteract }) {
    useEffect(() => {
        // Try autoplay
        if (onInteract) onInteract();

        const timer = setTimeout(() => {
            onComplete();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onComplete, onInteract]);

    // Floating Pastel Particles
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const colors = ['bg-pink-300', 'bg-yellow-300', 'bg-purple-300', 'bg-blue-300'];
        const generatedParticles = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 0.4 + 0.2,
            opacity: Math.random() * 0.4 + 0.2,
            duration: Math.random() * 8 + 8,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setParticles(generatedParticles);
    }, []);

    return (
        <div onClick={onInteract} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden cursor-pointer">
            {/* 1. Canvas Background (Light Artistic) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Soft Gradient Washes */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-200/40 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-200/40 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-purple-200/30 blur-[120px] rounded-full mix-blend-multiply" />

                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </div>

            {/* 2. Floating Pastel Dust */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${p.color} blur-[1px]`}
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.scale}rem`,
                        height: `${p.scale}rem`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, p.opacity, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.5, 1]
                    }}
                />
            ))}

            {/* 3. The Centerpiece (Logo) */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Logo Halo (Light Mode) */}
                <div className="absolute inset-0 bg-white/60 blur-[50px] rounded-full scale-125" />

                {/* The Logo */}
                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-64 md:w-80 h-auto relative z-10"
                    animate={{
                        y: [0, -8, 0],
                        filter: ["drop-shadow(0 10px 15px rgba(0,0,0,0.05))", "drop-shadow(0 20px 25px rgba(236,72,153,0.15))", "drop-shadow(0 10px 15px rgba(0,0,0,0.05))"]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 4. Artistic Loading Indicator (Dark for Contrast) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-12 flex flex-col items-center gap-3"
                >
                    <span className="text-xs tracking-[0.4em] font-medium text-stone-500 uppercase">
                        Happi Match
                    </span>

                    {/* Pink/Gold Progress Line */}
                    <div className="w-24 h-[2px] bg-stone-200 overflow-hidden relative rounded-full">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-pink-300 to-yellow-400"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
