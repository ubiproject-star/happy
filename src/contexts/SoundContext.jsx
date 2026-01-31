import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';


const SoundContext = createContext();

// Sound Assets (Using reliable public CDNs)
// Sound Assets
// Sound Assets (Using reliable Freesound Previews)
const SOUNDS = {
    // Playlist: Fashion -> LoFi -> Dreamy -> Ambient Wave
    playlist: [
        '/music/fashion-house.mp3', // Fashion House
        '/music/lofi-study.mp3',    // LoFi Study
        '/music/track_01.mp3',      // Midnight Velvet (Erotic)
        '/music/track_04.mp3',      // Slow Touch (Erotic)
        '/music/track_08.mp3',      // Bedroom Eyes (Erotic)
        '/music/track_11.mp3',      // Euphoria Rising (Dopamine)
        '/music/track_13.mp3',      // Skin to Skin (Erotic)
        '/music/track_14.mp3',      // Pulse (Dopamine)
        '/music/track_18.mp3',      // Neuro Bliss (Dopamine)
        '/music/track_24.mp3',      // Endorphin Hit (Dopamine)
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
