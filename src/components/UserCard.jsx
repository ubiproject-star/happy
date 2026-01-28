import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function UserCard({ user, onSwipe }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

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
            className="absolute top-0 left-0 w-full h-full p-4 cursor-grab active:cursor-grabbing"
        >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl bg-white">
                <img
                    src={user.photo_url}
                    alt={user.first_name}
                    className="w-full h-full object-cover pointer-events-none"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-left text-white">
                    <h2 className="text-3xl font-bold">{user.first_name}, <span className="text-2xl font-normal">24</span></h2>

                    <div className="flex items-center mt-2 text-gray-200">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">Istanbul, TR</span>
                    </div>

                    <p className="mt-4 text-sm line-clamp-2 opacity-90">
                        {user.bio}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
