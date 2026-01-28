import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Heart, MessageCircle, Flame } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Flame, label: 'Discover' }, // Left
        { path: '/profile', icon: User, label: 'Profile' }, // Right
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 shadow-lg">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'flex flex-col items-center p-2 rounded-lg transition-colors duration-200',
                            isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                        )}
                    >
                        <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-xs mt-1 font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
