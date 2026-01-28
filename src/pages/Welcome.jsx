import React from 'react';
import useTelegram from '../hooks/useTelegram';

export default function Welcome() {
    const { user } = useTelegram();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary to-pink-500 text-white p-6">
            <div className="mb-8 p-4 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">Happi</h1>
            <p className="text-lg opacity-90 mb-12">Find your perfect match on Telegram</p>

            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md w-full max-w-xs">
                {user ? (
                    <p>Welcome, {user.first_name}!</p>
                ) : (
                    <p>Loading your profile...</p>
                )}
            </div>

            <button className="mt-8 px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:scale-105 transition-transform" onClick={() => window.location.href = '/profile'}>
                Get Started
            </button>
        </div>
    );
}
