import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

// Sound Assets (Using reliable public CDNs)
const SOUNDS = {
    // Upbeat, stylish background music
    music: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=fashion-house-126667.mp3',
    // Mechanical click/tick for spinning
    spin: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cdae11a6c4.mp3?filename=ui-click-43196.mp3',
    // Success/Match sound
    match: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3',
    // Button click
    click: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=click-button-140881.mp3'
};

export const SoundProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const musicRef = useRef(new Audio(SOUNDS.music));
    const [audioInitialized, setAudioInitialized] = useState(false);

    useEffect(() => {
        // Configure Music
        const music = musicRef.current;
        music.loop = true;
        music.volume = 0.4;

        // Cleanup
        return () => {
            music.pause();
        };
    }, []);

    useEffect(() => {
        if (muted) {
            musicRef.current.pause();
        } else if (audioInitialized) {
            // Only play if we have interacted/initialized
            musicRef.current.play().catch(e => console.log("Audio autoplay prevented:", e));
        }
    }, [muted, audioInitialized]);

    const initAudio = () => {
        if (!audioInitialized) {
            setAudioInitialized(true);
            if (!muted) {
                musicRef.current.play().catch(e => console.log("Play failed:", e));
            }
        }
    };

    const toggleMute = () => {
        setMuted(prev => !prev);
    };

    const playSound = (type) => {
        if (muted || !SOUNDS[type]) return;

        const audio = new Audio(SOUNDS[type]);
        audio.volume = 0.6;
        audio.play().catch(e => console.error("SFX error:", e));
    };

    return (
        <SoundContext.Provider value={{ muted, toggleMute, playSound, initAudio }}>
            {children}
        </SoundContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSound = () => useContext(SoundContext);
