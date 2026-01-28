export const MOCK_PROFILES = [
    {
        id: '101',
        first_name: 'Ezgi',
        age: 24,
        bio: 'Sanat tarihi okuyorum, müze gezmeyi severim. 🎨',
        photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
        location: 'Istanbul, TR'
    },
    {
        id: '102',
        first_name: 'Can',
        age: 27,
        bio: 'Yazılımcı, kahve bağımlısı ve kedi babası. ☕️🐱',
        photo_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=80',
        location: 'Izmir, TR'
    },
    {
        id: '103',
        first_name: 'Zeynep',
        age: 22,
        bio: 'Fotoğraf çekmek ve dünyayı gezmek benim tutkum. 📸✈️',
        photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        location: 'Ankara, TR'
    },
    {
        id: '104',
        first_name: 'Mert',
        age: 29,
        bio: 'Crossfit ve doğa yürüyüşleri. Haftasonu kamp? ⛺️',
        photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        location: 'Antalya, TR'
    },
    {
        id: '105',
        first_name: 'Elif',
        age: 25,
        bio: 'Müzik ruhun gıdasıdır. Gitar çalıyorum. 🎸',
        photo_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80',
        location: 'Bursa, TR'
    }
];

export const MOCK_MATCHES = [
    {
        id: '103',
        first_name: 'Zeynep',
        photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        last_message: 'Hafta sonu planın var mı?',
        unread_count: 2
    },
    {
        id: '104',
        first_name: 'Mert',
        photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
        last_message: 'Harika görünüyordu!',
        unread_count: 0
    }
];

export const MOCK_MESSAGES = [
    {
        id: 1,
        sender_id: '103', // Zeynep
        content: 'Selam! Profilini çok beğendim.',
        is_me: false,
        created_at: '2023-10-27T10:00:00Z'
    },
    {
        id: 2,
        sender_id: 'me',
        content: 'Selam Zeynep! Teşekkürler, senin fotoğraflar da harika.',
        is_me: true,
        created_at: '2023-10-27T10:05:00Z'
    },
    {
        id: 3,
        sender_id: '103',
        content: 'Hafta sonu planın var mı? Belki bir kahve içeriz?',
        is_me: false,
        created_at: '2023-10-27T10:10:00Z'
    }
];
