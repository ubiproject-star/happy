import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

// Sound Assets (Using reliable public CDNs)
// Sound Assets
// Sound Assets (Using reliable Freesound Previews)
const SOUNDS = {
    // Playlist: Fashion -> LoFi -> Dreamy -> Ambient Wave
    playlist: [
        'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=fashion-house-126667.mp3', // 1. Upbeat (Kept)
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',    // 2. Chill (Kept)
        'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5575ad51c5.mp3?filename=abstract-fashion-pop-123760.mp3', // 3. Dreamy
        'https://cdn.pixabay.com/download/audio/2021/09/06/audio_349944df3e.mp3?filename=chill-abstract-intention-12099.mp3' // 4. Ambient
    ],
    // Mechanical Tick
    spin: 'https://cdn.freesound.org/previews/254/254316_4062622-lq.mp3',
    // Win Jingle
    match: 'https://cdn.freesound.org/previews/518/518308_240833-lq.mp3',
    // Generic Click
    click: 'https://cdn.freesound.org/previews/618/618376_11108226-lq.mp3',
    // Swoosh
    refresh: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
    // Coin/Reward (Power Click)
    power_click: 'https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3',
    // Dislike/Nope
    nope: 'https://cdn.freesound.org/previews/648/648432_14167180-lq.mp3'
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

    // Audio Pool for high-frequency sounds (Spin) to prevent GC lag
    const spinPool = useRef([]);
    const poolIndex = useRef(0);
    const POOL_SIZE = 5;

    useEffect(() => {
        // Initialize pool
        for (let i = 0; i < POOL_SIZE; i++) {
            const audio = new Audio(SOUNDS.spin);
            audio.volume = 0.4;
            spinPool.current.push(audio);
        }
    }, []);

    const playSound = (type) => {
        if (muted) return;
        if (!SOUNDS[type]) {
            console.warn(`Sound type '${type}' not found.`);
            return;
        }

        if (type === 'spin') {
            // Use Pool
            const audio = spinPool.current[poolIndex.current];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => { }); // Ignore play errors
                poolIndex.current = (poolIndex.current + 1) % POOL_SIZE;
            }
        } else {
            // Normal creation for infrequent sounds
            const audio = new Audio(SOUNDS[type]);
            // Boost volume for important effects
            audio.volume = (type === 'power_click' || type === 'match') ? 1.0 : 0.7;
            audio.play().catch(e => console.error(`SFX play error for ${type}:`, e));
        }
    };

    const nextTrack = () => {
        setCurrentTrackIndex(prev => (prev + 1) % SOUNDS.playlist.length);
    };

    return (
        <SoundContext.Provider value={{ muted, toggleMute, playSound, initAudio, nextTrack }}>
            {children}
        </SoundContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSound = () => useContext(SoundContext);
