import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

// Sound Assets (Using reliable public CDNs)
// Sound Assets
const SOUNDS = {
    // Playlist: Fashion -> Deep -> Chill -> Wave
    playlist: [
        'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=fashion-house-126667.mp3', // Current (Upbeat)
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',    // Chill
        'https://cdn.pixabay.com/download/audio/2022/03/15/audio_19aa14df20.mp3?filename=summer-nights-10023.mp3', // Deep
        'https://cdn.pixabay.com/download/audio/2020/09/14/audio_33ee2687d4.mp3?filename=both-of-us-14037.mp3'      // Emotional
    ],
    spin: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_cdae11a6c4.mp3?filename=ui-click-43196.mp3',
    match: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3',
    click: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73685e9aa2.mp3?filename=pop-39222.mp3',
    refresh: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_14275994b6.mp3?filename=whoosh-6316.mp3',
    // Ultra Dopamine Button Sound (Magical/Reward)
    power_click: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_8db1f1117d.mp3?filename=arcade-magic-notification-2-6326.mp3'
};

export const SoundProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    // Singleton ref for music player
    const musicRef = useRef(null);
    const [audioInitialized, setAudioInitialized] = useState(false);

    // Initialize Audio Object Once
    useEffect(() => {
        musicRef.current = new Audio(SOUNDS.playlist[0]);
        musicRef.current.volume = 0.4;
        musicRef.current.loop = false; // Important: No loop, we handle playlist

        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
        };
    }, []);

    // Handle Playlist Progression
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        const handleEnded = () => {
            console.log("Track ended. Advancing.");
            setCurrentTrackIndex(prev => (prev + 1) % SOUNDS.playlist.length);
        };

        music.addEventListener('ended', handleEnded);
        return () => music.removeEventListener('ended', handleEnded);
    }, []);

    // Handle Track Change & Playback
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        // Changing Track
        if (music.src !== SOUNDS.playlist[currentTrackIndex]) {
            // Pause current track before changing source to ensure clean transition
            music.pause();
            music.src = SOUNDS.playlist[currentTrackIndex];
            music.load();

            // If we are allowed to play, play the new track
            if (audioInitialized && !muted) {
                music.play().catch(e => console.log("Auto-advance play error:", e));
            }
        }
    }, [currentTrackIndex, audioInitialized, muted]);

    // Handle Mute/Unmute
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        if (muted) {
            music.pause();
        } else if (audioInitialized) {
            // Resume if unmuted and initialized
            music.play().catch(() => { });
        }
    }, [muted, audioInitialized]);

    const initAudio = () => {
        if (!audioInitialized) {
            setAudioInitialized(true);
            // Unlock audio context
            const music = musicRef.current;
            if (music && !muted) {
                music.play().catch(e => console.log("Init play error:", e));
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
