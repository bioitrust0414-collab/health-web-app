// 大華醫事檢驗所 PWA service worker
// 策略：靜態資源 cache-first，其餘走網路。
//
// ⚠️ 改動站上結構（尤其是移除頁面或入口）時，務必同步遞增 CACHE_NAME 的
// 版本號。activate 只會刪掉「名稱不同」的舊快取，版本號不變則舊訪客的
// 快取永遠不會失效，會繼續看到已經下線的功能。
//
// v3：移除瀏覽器分頁圖示與 PWA 安裝圖示（favicon、apple-touch-icon、
// icon-192/512.png），APP_SHELL 需同步移除已刪除的檔案，否則安裝快取
// 會因為找不到檔案而整批失敗。
const CACHE_NAME = "dahua-site-shell-v3";
const APP_SHELL = ["/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
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
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
            return res;
          }),
      ),
    );
    return;
  }
});
