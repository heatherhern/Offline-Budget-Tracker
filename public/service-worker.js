console.log("Hi from your service-worker.js file!");

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map(
    (size) => `/images/icon-${size}x${size}.PNG`
);

const FILES_TO_CACHE = [
    '/',
    '/app.js',
    '/index.html',
    '/manifest.webmanifest',
    '/db.js',
    '/styles.css',
].concat(iconFiles);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    if (
        event.request.method !== 'GET' ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        event.respondWith(fetch(event.request));
        return;
    }

    if (event.request.url.includes('/api/images')) {
        event.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});
