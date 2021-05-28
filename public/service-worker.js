const cacheAssets = [
    '/',
    '/styles.css',
    '/index.js',
    '/index.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
];
const cacheName = 'v1'
const STATIC_CACHE = "cache-v1";
const RUNTIME_CACHE = "";

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
        .open(cacheName)
            .then(cache =>{
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then( () => {
                return fetch(event.request)
                    .catch(() => caches.match('index.html'))
                })
    )
})

// remove unwanted caches
self.addEventListener('activate', (event) => {
    const cacheClear = [];
    cacheClear.push(cacheName)

    event.waitUntil(
        caches.keys().then((cacheNames => Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheClear.includes(cacheName)) {
                        console.log('Service Worker: Clearing Old Cache')
                        return caches.delete(cacheName);
                    }
                })
            )))
        )
});