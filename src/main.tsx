import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ops/testing helper: visiting with ?reset (or ?fresh) wipes this device's
// saved progress and returns to the very start. Handy between test runs.
if (typeof location !== 'undefined' && /[?&](reset|fresh)\b/i.test(location.search)) {
  try {
    localStorage.removeItem('lattice-session-v1')
  } catch {
    /* ignore */
  }
  history.replaceState(null, '', location.pathname)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
