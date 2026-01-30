import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import UserProfile from './pages/UserProfile';
import LanguageSelection from './pages/LanguageSelection';
import Splash from './components/Splash';

import { useSound } from './contexts/SoundContext';
import { useLanguage } from './contexts/LanguageContext';

// Inner component to handle routing logic with hooks
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { initAudio } = useSound();
  const { language, isLoading } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not loading, no language set, and not on selection page, redirect
    if (!isLoading && !language && !showSplash && location.pathname !== '/language') {
      navigate('/language');
    }
  }, [isLoading, language, showSplash, location, navigate]);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} onInteract={initAudio} />;
  }

  // Determine start page based on language presence
  // If language is missing, we basically force /language via the effect, 
  // but we can also render it directly to avoid flash if we were at root.

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/language" element={<LanguageSelection />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/user/:id" element={<UserProfile />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
