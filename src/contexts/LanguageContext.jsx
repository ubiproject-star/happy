import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
        }
        setIsLoading(false);
    }, []);

    const changeLanguage = (langCode) => {
        if (translations[langCode]) {
            setLanguage(langCode);
            localStorage.setItem('appLanguage', langCode);
        }
    };

    const t = (key) => {
        if (!language) return ''; // Or default fallback
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading, languages: translations }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
