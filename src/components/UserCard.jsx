import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function UserCard({ user, onSwipe }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Border Glow Color based on drag direction (subtle)
    const borderColor = useTransform(
        x,
        [-200, 0, 200],
        ["rgba(255, 0, 85, 0.8)", "rgba(255, 255, 255, 0.1)", "rgba(0, 243, 255, 0.8)"]
    );

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute top-0 left-0 w-full h-full p-2 cursor-grab active:cursor-grabbing"
            whileTap={{ scale: 0.98 }}
        >
            {/* Main Card Container */}
            <motion.div
                className="relative w-full h-full rounded-[32px] overflow-hidden bg-[#121212] shadow-2xl"
                style={{ border: "1px solid", borderColor }}
            >
                {/* Image */}
                <img
                    src={user.photo_url || "https://randomuser.me/api/portraits/lego/1.jpg"}
                    alt={user.first_name}
                    className="w-full h-full object-cover pointer-events-none"
                />

                {/* Top overlay gradient for readability of any top indicators */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Bottom Glass Panel - Info */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-2xl p-4 text-left border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    {/* Name & Age */}
                    <div className="flex items-end justify-between mb-1">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                            {user.first_name || 'User'}
                            <span className="text-2xl font-light text-gray-300 ml-2">24</span>
                        </h2>
                        {/* Optional 'New' or 'Online' badge */}
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] mb-2 mr-1" />
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-blue-200 mb-3">
                        <MapPin size={14} className="mr-1 drop-shadow" />
                        <span className="text-xs font-semibold tracking-wide uppercase">Istanbul, TR</span>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 opacity-90 font-light mix-blend-screen">
                        {user.bio || "No bio available."}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
