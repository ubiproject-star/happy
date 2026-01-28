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
    // Ultra Dopamine Button Sound (Futuristic/Power)
    power_click: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=interface-124464.mp3'
};

export const SoundProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    // Initialize with first track
    const musicRef = useRef(new Audio(SOUNDS.playlist[0]));
    const [audioInitialized, setAudioInitialized] = useState(false);

    useEffect(() => {
        const music = musicRef.current;
        music.volume = 0.4;
        music.loop = false; // Playlist mode

        const handleEnded = () => {
            setCurrentTrackIndex(prev => (prev + 1) % SOUNDS.playlist.length);
        };

        music.addEventListener('ended', handleEnded);

        return () => {
            music.pause();
            music.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Effect to handle track changes
    useEffect(() => {
        const music = musicRef.current;
        // If track changed (and we've initialized), load and play new track
        if (music.src !== SOUNDS.playlist[currentTrackIndex]) {
            const wasPlaying = !music.paused && !muted;
            music.src = SOUNDS.playlist[currentTrackIndex];
            music.load();
            if (wasPlaying || (audioInitialized && !muted)) {
                music.play().catch(console.error);
            }
        }
    }, [currentTrackIndex, audioInitialized, muted]);

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
