import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/happi-logo.png';

export default function Splash({ onComplete, onInteract }) {
    useEffect(() => {
        // Try autoplay
        if (onInteract) onInteract();

        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete, onInteract]);

    // Simplified hearts: Pale Red only
    // Gentle floating animation (hovering), not flying up.
    const [hearts, setHearts] = React.useState([]);

    useEffect(() => {
        const generatedHearts = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random() * 1.5 + 0.8,
            duration: Math.random() * 3 + 3,
            delay: Math.random() * 2
        }));
        // Avoid synchronous set state warning
        setTimeout(() => setHearts(generatedHearts), 0);
    }, []);

    return (
        <div onClick={onInteract} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden cursor-pointer">
            {/* Background Hearts - Gentle Float */}
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    style={{
                        left: `${heart.left}%`,
                        top: `${heart.y}%`,
                        fontSize: `${heart.scale}rem`
                    }}
                    animate={{
                        y: [0, -20, 0], // Gentle up and down hover
                        opacity: [0.1, 0.3, 0.1] // Subtle fade (silik)
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: heart.delay
                    }}
                    className="absolute text-red-500 pointer-events-none"
                >
                    ♥
                </motion.div>
            ))}

            {/* Main Logo Animation - Clean & Pure Movement */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <motion.img
                    src={logo}
                    alt="Happi Logo"
                    className="w-56 h-auto mb-12" // Removed drop-shadows entirely
                    animate={{
                        y: [0, -10, 0], // Only movement
                        scale: [1, 1.02, 1] // Subtle breathing
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Rotating Spinner - Matching Logo Color */}
                <motion.div
                    // Using text-red-500/primary directly via style or class to ensure exact match if needed, 
                    // but border-primary is defined as brand color.
                    // Assuming logo is reddish, ensuring spinner is specific red.
                    className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
}
