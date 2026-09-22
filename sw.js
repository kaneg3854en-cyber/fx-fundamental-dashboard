const CACHE = 'fxdash-v47';

self.addEventListener('install', event => {

  self.skipWaiting();

});

self.addEventListener('activate', event => {

  event.waitUntil((async () => {

    const keys = await caches.keys();

    await Promise.all(

      keys

        .filter(k => k.startsWith('fxdash-') && k !== CACHE)

        .map(k => caches.delete(k))

    );

    await self.clients.claim();

  })());

});

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  // HTMLは常に最新版を取得

  if (

    event.request.mode === 'navigate' ||

    url.pathname.endsWith('/index.html')

  ) {

    event.respondWith(

      fetch(event.request, { cache: 'no-store' })

        .then(response => {

          const copy = response.clone();

          caches.open(CACHE)

            .then(cache => cache.put('./index.html', copy))

            .catch(() => {});

          return response;

        })

        .catch(() => caches.match('./index.html'))

    );

    return;

  }

});
