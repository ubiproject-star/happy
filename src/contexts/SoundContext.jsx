import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';


const SoundContext = createContext();

// Sound Assets (Using reliable public CDNs)
// Sound Assets
// Sound Assets (Using reliable Freesound Previews)
const SOUNDS = {
    // Playlist: Fashion -> LoFi -> Dreamy -> Ambient Wave
    playlist: [
        // 1. Original Favorites
        'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=fashion-house-126667.mp3', // Fashion House
        'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',    // LoFi Study
        'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5575ad51c5.mp3?filename=abstract-fashion-pop-123760.mp3', // Dreamy
        'https://cdn.pixabay.com/download/audio/2021/09/06/audio_349944df3e.mp3?filename=chill-abstract-intention-12099.mp3', // Ambient

        // 2. New Erotic & Chill Additions (High Dopamine)
        'https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3', // "Hazy After Hours" - Deep, Sensual
        'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',      // "Serene View" - Relaxing
        'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3',       // "Sleepy Cat" - Cozy, Intimate
        'https://cdn.pixabay.com/download/audio/2022/05/20/audio_2c647ec631.mp3?filename=hiding-place-in-the-forest-111724.mp3', // "Hiding Place" - Ethereal, Nature
        'https://assets.mixkit.co/music/preview/mixkit-valley-sunset-127.mp3',    // "Valley Sunset" - Warm, Romantic
        'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',       // "Deep Urban" - Cool, Confident
        'https://assets.mixkit.co/music/preview/mixkit-complicated-281.mp3',      // "Complicated" - Emotional Depth
        'https://assets.mixkit.co/music/preview/mixkit-cat-walk-371.mp3',         // "Cat Walk" - Sassy, Playful
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

    // Dynamic Playlist State
    const [playlist, setPlaylist] = useState(SOUNDS.playlist);

    // Singleton ref for music player
    const musicRef = useRef(null);
    const [audioInitialized, setAudioInitialized] = useState(false);



    // Initialize Audio Object Once (or re-init if playlist changes significantly?)
    // Actually, we just update the source naturally via the effect below.
    // However, if playlist changes, we might want to start from track 0 or keep index.

    useEffect(() => {
        // Initial setup only
        if (!musicRef.current) {
            musicRef.current = new Audio(playlist[0]);
            musicRef.current.volume = 0.4;
            musicRef.current.loop = false;
        }
    }, []); // Run once to Create Ref

    // Handle Playlist Progression
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        const handleEnded = () => {
            console.log("Track ended. Advancing.");
            setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
        };

        music.addEventListener('ended', handleEnded);
        return () => music.removeEventListener('ended', handleEnded);
    }, [playlist]);

    // Handle Track Change & Playback
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        // Changing Track
        if (playlist.length > 0 && music.src !== playlist[currentTrackIndex]) {
            // Pause current track before changing source to ensure clean transition
            music.pause();
            music.src = playlist[currentTrackIndex]; // Use Dynamic Playlist
            music.load();

            // If we are allowed to play, play the new track
            if (audioInitialized && !muted) {
                music.play().catch(e => console.log("Auto-advance play error:", e));
            }
        }
    }, [currentTrackIndex, audioInitialized, muted, playlist]);

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

    const playSound = useCallback((type) => {
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
    }, [muted]);

    const nextTrack = useCallback(() => {
        setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
    }, [playlist]);

    const prevTrack = useCallback(() => {
        setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    }, [playlist]);

    const toggleMute = useCallback(() => {
        setMuted(prev => !prev);
    }, []);

    const initAudio = useCallback(() => {
        if (!audioInitialized) {
            setAudioInitialized(true);
            // Unlock audio context
            const music = musicRef.current;
            if (music && !muted) {
                music.play().catch(e => console.log("Init play error:", e));
            }
        }
    }, [audioInitialized, muted]);

    const value = useMemo(() => ({
        muted, toggleMute, playSound, initAudio, nextTrack, prevTrack
    }), [muted, toggleMute, playSound, initAudio, nextTrack, prevTrack]);

    return (
        <SoundContext.Provider value={value}>
            {children}
        </SoundContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSound = () => useContext(SoundContext);
