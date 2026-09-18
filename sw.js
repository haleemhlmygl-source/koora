const CACHE_VERSION = 'v2';
const CACHE_NAME = `goalzone-${CACHE_VERSION}`;
const SHELL_FILES = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // لا نتدخل في طلبات الـ API — دايماً لايف من السيرفر
  if (req.url.includes('workers.dev')) return;

  // الصفحات (HTML): نجيبها لايف من السيرفر أولاً عشان أي تحديث يظهر فورًا.
  // لو مفيش نت (أوفلاين)، نرجع لآخر نسخة متخزنة كحل احتياطي فقط.
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // باقي الملفات (صور، خطوط، JS خارجي..): كاش أولاً، وأسرع في التحميل
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
