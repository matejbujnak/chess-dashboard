// Chess Dashboard — Service Worker
// Caches static assets and API responses for offline / fast repeat visits.

const CACHE_NAME = "chess-dashboard-v1"

// App shell — pages and static assets to cache immediately on install
const PRECACHE_URLS = ["/", "/favicon.ico", "/icon-192x192.png", "/icon-512x512.png"]

// ── Install: pre-cache the app shell ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

// ── Fetch: network-first for API calls, cache-first for everything else ───────
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin + chess API requests
  if (request.method !== "GET") return

  // API routes — network first, fall back to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for up to 5 minutes
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Navigation requests — network first, fall back to cached index
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/") )
    )
    return
  }

  // Static assets — cache first, fall back to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
