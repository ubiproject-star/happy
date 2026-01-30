import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './contexts/AuthContext.jsx'
import DebugLogger from './components/DebugLogger.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DebugLogger />
    <SoundProvider>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </SoundProvider>
  </StrictMode>,
)
