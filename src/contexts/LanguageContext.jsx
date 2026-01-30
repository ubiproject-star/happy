import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

    const t = useCallback((key) => {
        if (!language) return '';
        return translations[language]?.[key] || translations['en']?.[key] || key;
    }, [language]);

    const value = useMemo(() => ({
        language,
        changeLanguage,
        t,
        isLoading,
        languages: translations
    }), [language, isLoading, t]);

    return (
        <LanguageContext.Provider value={value}>
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
