const CACHE_NAME = 'financeiro-igreja-v6'; // Mudei para v6 para forçar a atualização no celular

const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// 1. INSTALAÇÃO: Baixa os arquivos e assume o controle imediatamente
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Força o novo Service Worker a assumir sem esperar o usuário fechar o app
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// 2. ATIVAÇÃO: Limpa os caches antigos (v1, v2, v3...) para não lotar o celular
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
        }).then(() => self.clients.claim()) // Garante que a tela atual já use o código novo
    );
});

// 3. INTERCEPTAÇÃO (Estratégia: Internet Primeiro, Falha para o Cache)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Se a internet funcionou, pega o arquivo novo no GitHub e salva uma cópia nova no cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Se estiver offline ou a internet falhar, abre a cópia salva no celular
                return caches.match(e.request);
            })
    );
});
