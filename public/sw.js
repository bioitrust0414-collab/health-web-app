// 大華醫事檢驗所 PWA service worker
// 策略：靜態資源 cache-first，其餘走網路。
//
// ⚠️ 改動站上結構（尤其是移除頁面或入口）時，務必同步遞增 CACHE_NAME 的
// 版本號。activate 只會刪掉「名稱不同」的舊快取，版本號不變則舊訪客的
// 快取永遠不會失效，會繼續看到已經下線的功能。
//
// v2：會員系統與健康 App 下線（2026-08-10）。舊版快取中含有已移除的
// 會員入口資源，必須強制失效。
const CACHE_NAME = "dahua-site-shell-v2";
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
