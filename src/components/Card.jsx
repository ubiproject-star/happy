import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function Card({ profile, onSwipe, style }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 150], [-18, 18]);
    const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full p-4"
            style={{ x, rotate, opacity, ...style }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.05, cursor: 'grabbing' }}
        >
            <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                <img
                    src={profile.photo_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"}
                    alt={profile.username}
                    className="w-full h-4/5 object-cover pointer-events-none"
                />
                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                    <h2 className="text-3xl font-bold mb-1">{profile.first_name || "Unknown"}</h2>
                    <p className="text-sm opacity-90 line-clamp-2">{profile.bio || "No bio available"}</p>
                </div>
            </div>
        </motion.div>
    );
}
