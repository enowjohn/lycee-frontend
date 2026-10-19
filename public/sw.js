/* eslint-disable no-restricted-globals */
// ---------------------------------------------------------------------------
// Lycée Bilingue Ombessa — service worker.
// Goal: make the site installable on Android and give it a fast, resilient
// shell. Uses a simple "network-first for navigations/API, cache-first for
// static assets" strategy so users always get fresh data when online.
// ---------------------------------------------------------------------------

const CACHE_NAME = 'lycee-obessa-v1';

// Minimal app shell. Everything referenced here ships in /public or is the
// built index.html, so precaching never fails the install if one file is
// missing (we cache individually and ignore failures).
const PRECACHE_URLS = [
  '/',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            /* ignore individual precache failures */
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GETs from our own origin.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API + navigation requests: always try the network first so data is live.
  const isNavigation = request.mode === 'navigate';
  const isApi = url.pathname.startsWith('/api/');

  if (isNavigation || isApi) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isNavigation) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(isNavigation ? '/' : request).then((c) => c || Response.error()))
    );
    return;
  }

  // Static assets: cache-first, then network (and cache the result).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
