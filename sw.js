// Rota Fácil — service worker: abre rápido e funciona como app instalado.
// Rede primeiro (sempre a versão mais nova); cache só se estiver sem internet.
const C = "rota-facil-v1";
const BASE = ["./", "index.html", "manifest.json", "icone-192.png", "icone-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // mapas, rotas e ativação vão direto para a rede
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
