import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, MessageCircle, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import clsx from 'clsx';

export default function BottomNav() {
    const location = useLocation();
    const { t } = useLanguage();

    // Order: Profile (Left) - Discover (Center) - Matches (Right)
    const navItems = [
        { path: '/profile', icon: User, label: t('nav_profile') },
        { path: '/', icon: Flame, label: t('nav_discover') },
        { path: '/matches', icon: MessageCircle, label: t('nav_matches') },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-around items-center z-50 shadow-lg">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            'flex flex-col items-center p-2 rounded-lg transition-colors duration-200',
                            isActive ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'
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
