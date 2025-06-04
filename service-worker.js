const CACHE_NAME = "pokehub-cache-v1";
const urlsToCache = [
  "source/home_page.html",
  "source/main_page.html",
  "source/game_page.html",
  "source/collection.html",
  "source/edit_page.html",
  "source/styles/style.css",
  "source/scripts/app.js",
  "source/scripts/collection.js",
  "source/scripts/edit_page.js",
  "source/scripts/game.js",
  "manifest.json",
  "assets/images/icons/icon-192x192.png",
  "assets/images/icons/icon-512x512.png"
];


// Install event: cache initial resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error("Cache install error:", err))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: respond with cache, then network, and cache new resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid, same-origin responses
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              event.request.url.startsWith(self.location.origin)
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            // Optionally handle fetch errors (e.g., offline fallback)
            return new Response("Network error occurred", { status: 408 });
          });
      })
    )
  );
});