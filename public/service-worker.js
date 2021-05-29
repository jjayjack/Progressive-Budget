const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.js',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
];

const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction"))
  )
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            } else {
                return fetch(event.request)
                    .then(res => {
                        return caches.open(DATA_CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch(err => {
                        return cache.match(event.request);
                    })
            .catch(err => console.log(err));
                }
            })           
    )
})


// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keyList) => {
                return Promise.all(
                    keyList.map(key => {
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log("Remove old cache data", key)
                            return caches.delete(key)
                        }
                    })
                )
            })
    )
    self.clients.claim();
})

