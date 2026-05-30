// D'todoReu — Service Worker
// Estrategia: Cache First para assets estáticos, Network First para datos

const CACHE_NAME = "dtodoreu-v1";
const STATIC_ASSETS = [
  "/",
  "/directorio",
  "/login",
  "/manifest.json",
  "/offline.html",
];

// ── Instalación ──────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activación ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones a Firebase / APIs externas (siempre red)
  if (
    url.hostname.includes("firebaseapp.com") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("google.com") ||
    url.hostname.includes("maps.google.com") ||
    request.method !== "GET"
  ) {
    return;
  }

  // Assets estáticos: Cache First
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/icons") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Páginas: Network First con fallback a caché, luego offline.html
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/offline.html"))
      )
  );
});
