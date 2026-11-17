const CACHE_NAME = 'worktime-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'style.css',
  'app.js',
  'icon.png',
];

//install: cache dei file base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );

  self.skipWaiting(); // Attiva subito il nuovo service worker
});

//Activate: pulizia cache vecchie (semplice)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: strategia cache-first (se manca rete, serve cache) 
self.addEventListener('fetch', (event) => {

  // Gestisci solo le richieste GET
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se trovo nella cache, uso quello
      if (cachedResponse) {
        return cachedResponse;
      }

      // Altrimenti provo rete e (se va) metto in cache
      return fetch(event.request)
        .then((networkResponse) => {
          // Non cachiamo richieste non valide
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Salva in cache il nuovo file trovato online
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Se è una navigazione tra pagine e sei offline, mostra la index in cache
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }

          // Per tutte le altre risorse (immagini, API, font), restituisci sempre una Response valida
          return new Response('Risorsa non disponibile offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
          
          // Se anche la rete fallisce e non ho cache, potresti:
          // - restituire una pagina offline personalizzata
          // Per ora non restituiamo niente di speciale.

          // Se sei totalmente offline e il file non esiste in cache, mostra la pagina offline
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html');
          // }
        });
    })
  );
});
