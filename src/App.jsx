import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Splash from './components/Splash';

import { useSound } from './contexts/SoundContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { initAudio } = useSound();

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} onInteract={initAudio} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
