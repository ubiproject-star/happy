import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Globe, Check } from 'lucide-react';
import Layout from '../components/Layout';

export default function LanguageSelection() {
    const { languages, changeLanguage, language } = useLanguage();
    const navigate = useNavigate();

    const handleSelect = (code) => {
        changeLanguage(code);
    };

    const handleContinue = () => {
        if (language) {
            navigate('/');
        }
    };

    const langCodes = Object.keys(languages);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center pt-safe px-4 pb-10 text-white font-sans overflow-y-auto">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 mb-8 text-center"
            >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Globe size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    HAPPI
                </h1>
                <p className="text-gray-400 text-xs tracking-[0.2em] mt-2 uppercase">Select Your Language</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-24">
                {langCodes.map((code, index) => {
                    const lang = languages[code];
                    const isSelected = language === code;

                    return (
                        <motion.button
                            key={code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(code)}
                            className={`
                                relative p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300
                                ${isSelected
                                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-[#1a1a1a] border-white/5 hover:bg-[#252525] hover:border-white/10'}
                            `}
                        >
                            <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {lang.nativeName}
                            </span>
                            {/* Flag or Icon could go here if available */}

                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Check size={12} className="text-white" />
                                    </div>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Sticky Bottom Button */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
                <button
                    onClick={handleContinue}
                    disabled={!language}
                    className={`
                        w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transition-all duration-300
                        ${language
                            ? 'bg-white text-black hover:scale-[1.02] active:scale-95 cursor-pointer'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}
                    `}
                >
                    {language ? languages[language].continue : 'Select Language'}
                </button>
            </div>
        </div>
    );
}
