import React from 'react';
import { motion } from 'framer-motion';

const LiveBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050511]">
            {/* Ambient Gradients - Deep and moving */}
            <motion.div
                className="absolute -top-[20%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-blue-900/20 blur-[100px]"
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, 30, -50, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]"
                animate={{
                    x: [0, -40, 20, 0],
                    y: [0, -60, 40, 0],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            />

            {/* Floating Orbs - "Live" feel */}
            <motion.div
                className="absolute top-1/4, left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-[1px]"
                animate={{ y: [-10, 10, -10], opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ top: '20%', left: '30%' }}
            />
            <motion.div
                className="absolute w-1 h-1 bg-purple-400 rounded-full blur-[1px]"
                animate={{ y: [10, -20, 10], opacity: [0, 0.8, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                style={{ top: '70%', left: '80%' }}
            />

            {/* Grid Overlay for Tech feel (optional, subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        </div>
    );
};

export default LiveBackground;
