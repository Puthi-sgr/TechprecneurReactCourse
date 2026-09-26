const CACHE_NAME = 'habit-tracker-shell-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/offline.html']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone()
      void caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
      return response
    }).catch(() => caches.match('/index.html').then((response) => response || caches.match('/offline.html'))))
    return
  }

  const isStaticAsset = ['script', 'style', 'font', 'image'].includes(request.destination)
  if (!isStaticAsset) return

  // Serve precached bundles first so offline navigations can boot the app.
  event.respondWith(caches.match(request).then((cached) => {
    if (cached) return cached
    return fetch(request).then((response) => {
      if (response.ok && request.destination === 'image') {
        void caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
      }
      return response
    })
  }))
})
