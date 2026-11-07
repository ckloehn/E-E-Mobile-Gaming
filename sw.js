// Keeps the game working offline after the first visit.
// Bump VERSION whenever game files change so devices pick up the update.
const VERSION = 'egg-house-12';
const FILES = [
  './', 'index.html', 'css/style.css', 'js/data.js', 'js/avatar.js', 'js/audio.js', 'js/game.js', 'js/doll-art.js', 'js/painted.js',
  'art/castle-hall.jpg', 'art/runway-stage.jpg', 'art/title-background.jpg',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Game files: use the network when online so updates arrive, fall back to the saved copy offline.
// Fonts: save a copy the first time they load.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else if (url.host.includes('fonts.g')) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res;
    })));
  }
});
