const CACHE_NAME = 'financeiro-igreja-v7'; 

const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); 
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) 
    );
});

self.addEventListener('fetch', (e) => {
    // REGRA SALVADORA: Ignora conexões do Firebase (POST) e extensões.
    // Só faz cache de requisições normais (GET).
    if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(e.request);
            })
    );
});
