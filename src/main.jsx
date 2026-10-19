import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// ---------------------------------------------------------------------------
// Session-expiry handling
// Tokens are valid for 7 days. If one is missing/expired, the backend replies
// 401 "Access denied" or 403 "Invalid token". Previously the UI just showed
// that raw message (e.g. "Invalid token" when creating a live session). Now we
// clear the dead session and send the user to log in again, returning them to
// the page they were on.
// ---------------------------------------------------------------------------
function handleDeadSession() {
  const hadToken = !!localStorage.getItem('token')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  if (!window.location.pathname.startsWith('/login')) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `/login?expired=${hadToken ? 1 : 0}&redirect=${redirect}`
  }
}

function isDeadSession(status, errorMessage) {
  if (status !== 401 && status !== 403) return false
  return /invalid token|access denied/i.test(errorMessage || '')
}

// 1) axios calls (Navbar, Dashboard, portals, assignments, ...)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.error || ''
    if (isDeadSession(status, message)) handleDeadSession()
    return Promise.reject(error)
  }
)

// 2) raw fetch calls (LiveClass, Messaging, ...)
const nativeFetch = window.fetch.bind(window)
window.fetch = async (...args) => {
  const response = await nativeFetch(...args)
  if (response.status === 401 || response.status === 403) {
    try {
      const body = await response.clone().json()
      if (isDeadSession(response.status, body?.error)) handleDeadSession()
    } catch {
      /* non-JSON body — ignore */
    }
  }
  return response
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ---------------------------------------------------------------------------
// PWA service worker — makes the site installable on Android ("Add to
// Home screen" / install as an app) and provides an offline shell.
// Only registered in production builds; in dev it would just add noise.
// ---------------------------------------------------------------------------
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
