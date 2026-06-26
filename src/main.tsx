import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Heebo is the Hebrew UI face; Space Mono is kept only for isolated Latin /
// formula runs via the .code helper. Self-hosted so the PWA works offline.
import '@fontsource/heebo/400.css'
import '@fontsource/heebo/500.css'
import '@fontsource/heebo/700.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'

// index.html already sets these; guarantee RTL belt-and-suspenders.
document.documentElement.setAttribute('dir', 'rtl')
document.documentElement.setAttribute('lang', 'he')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
