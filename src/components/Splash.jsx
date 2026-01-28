import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/happi-logo.png';

export default function Splash({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Colors for hearts: Vibrant & Premium
    const colors = [
        'text-red-600', 'text-pink-600', 'text-purple-600',
        'text-rose-500', 'text-fuchsia-600', 'text-orange-500',
        'text-indigo-500', 'text-violet-600'
    ];

    // Denser, faster, multi-colored hearts
    const hearts = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        // Spread evenly across the width (0% to 100%)
        left: Math.random() * 100,
        y: Math.random() * 100 + 100,
        // Even Larger hearts: 3rem to 8rem base (Previously 1.5 to 2.5)
        scale: Math.random() * 2.5 + 1.5,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        // Removing rotation for straight upward float
    }));

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Background Hearts */}
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    // Use 'left' for positioning to cover full screen width
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.scale}rem`
                    }}
                    initial={{ opacity: 0, y: "110vh" }}
                    animate={{
                        opacity: [0, 1, 1, 0], // Fully visible (1) for most of the flight
                        y: "-20vh",
                        // Removed rotation
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: heart.delay
                    }}
                    className={`absolute ${heart.color} drop-shadow-md`}
                >
                    ♥
                </motion.div>
            ))}

            {/* Main Logo Animation w/ Premium Reveal */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1] // Custom refined easing (cubic-bezier)
                }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-pink-500 rounded-full blur-3xl opacity-20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-64 h-auto mb-12 drop-shadow-2xl"
                    animate={{
                        y: [0, -8, 0],
                        // Removed colored reflections as requested
                        filter: [
                            "drop-shadow(0 10px 10px rgba(0,0,0,0.1))",
                            "drop-shadow(0 20px 20px rgba(0,0,0,0.2))",
                            "drop-shadow(0 10px 10px rgba(0,0,0,0.1))"
                        ]
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Rotating Spinner */}
                <motion.div
                    className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}
