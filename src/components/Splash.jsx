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

    // Floating hearts background animation
    const hearts = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // random position %
        y: Math.random() * 100,
        scale: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 2 + 3,
    }));

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden">
            {/* Background Hearts */}
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ opacity: 0, y: `${heart.y}%`, x: `${heart.x}vw` }}
                    animate={{
                        opacity: [0, 0.2, 0],
                        y: [`${heart.y}%`, `${heart.y - 20}%`]
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute text-pink-200 pointer-events-none"
                    style={{ fontSize: `${heart.scale * 2}rem` }}
                >
                    ♥
                </motion.div>
            ))}

            {/* Main Logo Animation */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-48 h-auto mb-8 drop-shadow-xl"
                    animate={{
                        filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 2,
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
