import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './aframe-plugins.js';
import './index.css'
import './chartSetup';
import App from './components/CVAnalyzerPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
