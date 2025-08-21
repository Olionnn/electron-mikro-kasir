import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.jsx'
import { AuthProvider } from './hooks/useAuth.jsx';
import "leaflet/dist/leaflet.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider defaultPalette="brand" defaultMode="light">
        <AuthProvider>
            <App />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
