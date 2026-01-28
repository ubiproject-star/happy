import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTelegram } from '../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useTelegram();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        gender: 'male',
        looking_for: 'female',
    });

    useEffect(() => {
        async function checkUser() {
            if (!user) return;

            const { data } = await supabase.from('users').select('*').eq('id', user.id.toString()).single();

            if (data) {
                setFormData({
                    bio: data.bio || '',
                    gender: data.gender || 'male',
                    looking_for: data.looking_for || 'female',
                });
            }
        }
        checkUser();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!user) {
            alert("Please open this app in Telegram!");
            setLoading(false);
            return;
        }

        const updates = {
            id: user.id.toString(),
            first_name: user.first_name,
            username: user.username,
            ...formData,
            photo_url: user.photo_url,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('users').upsert(updates);

        if (error) {
            alert(error.message);
        } else {
            navigate('/swipe');
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto h-screen flex flex-col justify-center bg-white">
            <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Your Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                    <div className="relative">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none font-medium text-gray-700"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Looking For</label>
                    <div className="relative">
                        <select
                            name="looking_for"
                            value={formData.looking_for}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none font-medium text-gray-700"
                        >
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="everyone">Everyone</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none font-medium text-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Save & Start Swiping' : 'Start Swiping'}
                </button>
            </form>
        </div>
    );
}
