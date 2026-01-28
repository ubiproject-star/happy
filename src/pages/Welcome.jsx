import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const { user } = useTelegram();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary to-orange-500 text-white p-6">
            <div className="mb-8 p-4 bg-white/20 rounded-full backdrop-blur-sm animate-pulse shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </div>
            <h1 className="text-5xl font-black mb-2 tracking-tight">Happi</h1>
            <p className="text-lg opacity-90 mb-12 font-medium">Find your perfect match on Telegram</p>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md w-full max-w-xs border border-white/10">
                {user ? (
                    <p className="font-semibold">Welcome, {user.first_name}! 👋</p>
                ) : (
                    <p className="font-semibold animate-pulse">Detecting user...</p>
                )}
            </div>

            <button
                className="mt-8 px-10 py-4 bg-white text-primary font-bold text-lg rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-orange-500"
                onClick={() => navigate('/profile')}
            >
                Get Started
            </button>
        </div>
    );
}
