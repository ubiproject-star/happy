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
        // Larger hearts: 2rem to 5rem base
        scale: Math.random() * 1.5 + 1.0,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.random() * 360
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
                    initial={{ opacity: 0, y: "110vh", rotate: heart.rotate }}
                    animate={{
                        opacity: [0, 1, 1, 0], // Fully visible (1) for most of the flight
                        y: "-20vh",
                        rotate: heart.rotate + 180
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
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 1.5
                }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Glow Effect */}
                <motion.div
                    className="absolute inset-0 bg-pink-400 rounded-full blur-3xl opacity-20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-56 h-auto mb-10 drop-shadow-2xl"
                    animate={{
                        y: [0, -10, 0],
                        filter: ["drop-shadow(0 10px 10px rgba(255,100,100,0.2))", "drop-shadow(0 25px 25px rgba(255,100,100,0.4))", "drop-shadow(0 10px 10px rgba(255,100,100,0.2))"]
                    }}
                    transition={{
                        duration: 3,
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
