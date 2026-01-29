import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, MessageCircle, Flame } from 'lucide-react'; // Swapped Flame for Discover
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const location = useLocation();

    // Order: Profile (Left) - Discover (Center) - Matches (Right)
    const navItems = [
        { path: '/profile', icon: User, label: 'Profile' },
        { path: '/', icon: Flame, label: 'Discover', isCenter: true },
        { path: '/matches', icon: MessageCircle, label: 'Matches' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-[2rem] bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 flex justify-between items-center px-2 py-2 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                if (item.isCenter) {
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative -mt-8"
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={clsx(
                                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-[3px] transition-all duration-300",
                                    isActive
                                        ? "bg-gradient-to-tr from-pink-600 to-rose-600 border-[#1a1a1a] shadow-[0_0_20px_rgba(225,29,72,0.6)]"
                                        : "bg-[#2a2a2a] border-[#1a1a1a] text-gray-400 hover:text-white"
                                )}
                            >
                                <item.icon size={28} fill={isActive ? "currentColor" : "none"} className={isActive ? "text-white" : ""} />
                            </motion.div>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'flex flex-col items-center justify-center w-16 h-full py-2 rounded-2xl transition-all duration-300',
                            isActive ? 'text-pink-500' : 'text-gray-500 hover:text-pink-300/50'
                        )}
                    >
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            animate={isActive ? { y: -2 } : { y: 0 }}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </motion.div>
                    </Link>
                );
            })}
        </div>
    );
}
