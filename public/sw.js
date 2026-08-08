// 健康好夥伴 PWA service worker
// 策略：靜態資源 cache-first，API / 動態頁面一律 network-first（避免報告、商城資料顯示過期快取）
const CACHE_NAME = "health-app-shell-v1";
const APP_SHELL = ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // API 與 SSR 頁面：一律 network-first，失敗才退回快取，確保會員資料/報告不會顯示過期內容
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_serverFn")) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // 靜態資源：cache-first
  if (/\.(png|jpg|jpeg|webp|svg|ico|css|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        return res;
      }))
    );
    return;
  }
});
