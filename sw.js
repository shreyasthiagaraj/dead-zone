// NECROWAVE service worker — offline-first PWA.
// The DAILY DROP and the whole STACK are fully local, so the installed app
// must work in airplane mode. Bump CACHE on release to invalidate cleanly.
const CACHE = 'necrowave-v2';
const CORE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== location.origin) return;
  // The game shell: network-first (updates land immediately), cache fallback
  // (offline keeps playing).
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('/index.html')))
    );
    return;
  }
  // Static assets (sounds/, sprites/, manifest): cache-first with runtime
  // population — the ~7.5MB sound set caches as it plays.
  e.respondWith(
    caches.match(req).then((m) => m || fetch(req).then((res) => {
      if (res && res.ok) {
        const cp = res.clone();
        caches.open(CACHE).then((c) => c.put(req, cp)).catch(() => {});
      }
      return res;
    }))
  );
});
