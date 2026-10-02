const CACHE_NAME = "wardeal-v2.6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./js/constants.js",
  "./js/player.js",
  "./js/storage.js",
  "./js/recruit.js",
  "./js/economy.js",
  "./js/properties.js",
  "./js/business.js",
  "./js/jobs.js",
  "./js/daily.js",
  "./js/headquarters.js",
  "./js/city.js",
  "./js/combat.js",
  "./js/boss.js",
  "./js/monsters.js",
  "./js/shop.js",
  "./js/core.js",
  "./js/ui.js",
  "./js/app.js"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./index.html"))));
});
