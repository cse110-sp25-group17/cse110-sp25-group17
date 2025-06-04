// const CACHE_NAME = "pokehub-cache-v1";
// const urlsToCache = [
//   "specs/home_page.html",
//   "specs/main_page.html",
//   "specs/game_page.html",
//   "specs/collection.html",
//   "specs/edit_page.html",
//   "specs/styles/style.css",
//   "specs/scripts/app.js",
//   "specs/scripts/collection.js",
//   "specs/scripts/edit_page.js",
//   "specs/scripts/game.js",
//   "manifest.json",
//   "assets\images\icons\icon-192x192.png",
//   "assets\images\icons\icon-512x512.png"
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => cache.addAll(urlsToCache))
//       .catch((err) => console.error("Cache install error:", err))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
