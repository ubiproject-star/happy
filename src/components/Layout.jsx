import React from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 pt-safe">
            <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
