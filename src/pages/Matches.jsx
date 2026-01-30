import React from 'react';
import Layout from '../components/Layout';
// import { useLanguage } from '../contexts/LanguageContext';

export default function Matches() {
    // const { t } = useLanguage(); 

    return (
        <Layout>
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-3xl font-bold text-green-500 mb-4">SAFE MODE ACTIVE</h1>
                <p className="text-white mb-8">
                    If you can see this page, the previous crash was caused by the data loading logic or the list rendering.
                </p>
                <div className="p-4 border border-white/20 rounded-xl bg-white/5">
                    <p className="text-gray-400 text-sm">Waiting for further instructions...</p>
                </div>
            </div>
        </Layout>
    );
}
