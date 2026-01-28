import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export default function useTelegram() {
    const [user, setUser] = useState(WebApp.initDataUnsafe?.user || null);

    useEffect(() => {
        // Expand the mini app to full height
        WebApp.expand();

        // Ready to show
        WebApp.ready();
    }, []);

    const onClose = () => {
        WebApp.close();
    };

    return {
        tg: WebApp,
        user,
        onClose,
    };
}
