const CACHE_NAME = 'financeiro-igreja-limpeza-v15';

// Instala imediatamente
self.addEventListener('install', (e) => {
    self.skipWaiting(); 
});

// Ativa e DELETA todas as memórias travadas antigas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => caches.delete(key)));
        }).then(() => self.clients.claim()) 
    );
});

// Passa direto pela internet, sem bloquear o Firebase
self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});
