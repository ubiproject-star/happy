import { useEffect, useState } from 'react';

// MOCK VERSION - NO REAL TELEGRAM SDK
// This ensures the app works perfectly in a browser for UI testing
export function useTelegram() {
    const [tg, setTg] = useState(null);
    const [user, setUser] = useState(null);

    // Real Telegram SDK Initialization
    useEffect(() => {
        try {
            // @ts-ignore
            const telegram = window.Telegram.WebApp;
            setTg(telegram);

            if (telegram.initDataUnsafe?.user) {
                setUser(telegram.initDataUnsafe.user);
            }
            telegram.expand();
            telegram.ready();
        } catch (e) {
            console.error("Telegram SDK failed:", e);
            // Fallback to mock user if SDK fails (e.g., not in Telegram environment)
            setUser({
                id: 12345678,
                first_name: "Test",
                last_name: "User",
                username: "testuser",
                photo_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
            });
        }
    }, []);

    const onClose = () => {
        tg?.close();
    };

    return {
        tg,
        user,
        onClose,
    };
}
