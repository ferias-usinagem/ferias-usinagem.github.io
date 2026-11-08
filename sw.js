// Calendário de Férias · app instalável — versão 2.11.0-202611081751
// Tela do app guardada no aparelho (abre rápido e sem internet). Os dados ficam com a própria página (localStorage).
var CACHE = 'cal-ferias-2.11.0-202611081751';
var BASE = ['./', 'index.html', 'manifest.webmanifest', 'icones/icone-192.png', 'icones/icone-512.png', 'icones/apple-180.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('cal-ferias-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  // fontes do Google: guarda depois da 1ª vez
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(CACHE).then(function (c) { return c.match(r).then(function (m) { return m || fetch(r).then(function (n) { c.put(r, n.clone()); return n; }); }); }));
    return;
  }
  if (u.origin !== location.origin) return; // dados da planilha: sempre direto (a página guarda a última cópia)
  // tela do app: tenta a versão nova; sem internet, usa a guardada
  e.respondWith(fetch(r).then(function (n) { var cp = n.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); return n; })
    .catch(function () { return caches.match(r).then(function (m) { return m || caches.match('index.html'); }); }));
});
