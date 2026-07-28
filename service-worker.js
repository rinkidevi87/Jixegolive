const CACHE_NAME = "jixego-shell-v1";
const SHELL = [
  "/", "/index.html", "/videos.html", "/shorts.html", "/about.html", "/contact.html",
  "/privacy.html", "/terms.html", "/404.html", "/assets/css/styles.css",
  "/assets/js/youtube.js", "/assets/js/app.js", "/assets/icons/favicon.svg", "/assets/icons/channel-backdrop.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => {
    const fresh = fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => cached || caches.match("/404.html"));
    return cached || fresh;
  }));
});
