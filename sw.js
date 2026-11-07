const CACHE_NAME = 'rba-cache-v2.2.2';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/style.css?v=2.2.2',
    './js/data.js?v=2.2.2',
    './js/data-extra.js?v=2.2.2',
    './js/storage.js?v=2.2.2',
    './js/audio.js?v=2.2.2',
    './js/ai.js?v=2.2.2',
    './js/gamification.js?v=2.2.2',
    './js/games.js?v=2.2.2',
    './js/adventure.js?v=2.2.2',
    './js/teacher.js?v=2.2.2',
    './js/parent.js?v=2.2.2',
    './js/focus.js?v=2.2.2',
    './js/accessibility.js?v=2.2.2',
    './js/pwa.js?v=2.2.2',
    './js/app.js?v=2.2.2',
    './icons/icon.svg',
    './icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(async () => {
                    const cached = await caches.match(request);
                    if (cached) return cached;
                    const shell = await caches.match('./index.html');
                    return shell || new Response('Aplikasi sedang offline dan halaman belum tersimpan di cache.', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                    });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') return response;
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                return response;
            }).catch(() => new Response('Aset tidak tersedia saat offline.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            }));
        })
    );
});
