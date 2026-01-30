import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './contexts/AuthContext.jsx'
import { SoundProvider } from './contexts/SoundContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SoundProvider>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </SoundProvider>
  </StrictMode>,
)
