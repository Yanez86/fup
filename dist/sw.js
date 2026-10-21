/* Service worker della web app: tiene in memoria il gioco per giocare anche senza connessione.
   La pagina si scarica sempre fresca quando c'è rete (così gli aggiornamenti arrivano subito), altrimenti si usa la copia salvata.
   7798c3c245 viene sostituito da build.py: a ogni build cambia e la vecchia copia viene buttata. */
const CACHE = 'fup-7798c3c245';
const CORE = ['./', 'manifest.webmanifest', 'icona_180.png', 'icona_192.png', 'icona_512.png', 'icona_maskable_512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // caratteri di Google Fonts: prima la copia salvata
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // il sito di presentazione non fa parte del gioco: niente copia salvata, così non prende il posto della pagina del gioco
  if (url.pathname.startsWith(new URL('sito/', self.registration.scope).pathname)) return;
  // file del gioco: prima la rete, poi la copia salvata
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './' : req, cp)); }
    return r;
  }).catch(() => caches.match(req.mode === 'navigate' ? './' : req, {ignoreSearch: true})));
});
