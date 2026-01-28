import React, { useState } from 'react';

import useTelegram from '../hooks/useTelegram';
import Layout from '../components/Layout';
import { Camera, Save } from 'lucide-react';

export default function Profile() {
    const { user: tgUser } = useTelegram();
    const [profile, setProfile] = useState(() => {
        if (tgUser) {
            return {
                first_name: tgUser.first_name,
                bio: '',
                looking_for: 'all',
                photo_url: tgUser.photo_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
            };
        } else {
            return {
                first_name: 'Demo User',
                bio: 'I love coding and coffee.',
                looking_for: 'female',
                photo_url: 'https://randomuser.me/api/portraits/men/99.jpg'
            };
        }
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulate save
        setTimeout(() => {
            setLoading(false);
            alert('Profile Updated!');
        }, 1000);
        // In real app: await supabase.from('users').upsert({...})
    };

    return (
        <Layout>
            <div className="p-4 pb-24">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <img
                            src={profile.photo_url}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md">
                            <Camera size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={profile.first_name}
                            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                            disabled
                        />
                        <span className="text-xs text-gray-400">Name is synced with Telegram</span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                            placeholder="Tell others about yourself..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
                        <select
                            value={profile.looking_for}
                            onChange={(e) => setProfile({ ...profile, looking_for: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white border border-gray-200 outline-none"
                        >
                            <option value="male">Men</option>
                            <option value="female">Women</option>
                            <option value="all">Everyone</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full mt-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
