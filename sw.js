const V = "20261029001417";
const SHELL = ["./", "index.html", "data.js", "why.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
const AUDIO = ["audio/beat.n.json", "audio/beat.s.json", "audio/blow.n.json", "audio/blow.s.json", "audio/break.n.json", "audio/break.s.json", "audio/bring.n.json", "audio/bring.s.json", "audio/buy.n.json", "audio/buy.s.json", "audio/call.n.json", "audio/call.s.json", "audio/calm.n.json", "audio/calm.s.json", "audio/carry.n.json", "audio/carry.s.json", "audio/catch.n.json", "audio/catch.s.json", "audio/check.n.json", "audio/check.s.json", "audio/cheer.n.json", "audio/cheer.s.json", "audio/come.n.json", "audio/come.s.json", "audio/cut.n.json", "audio/cut.s.json", "audio/drop.n.json", "audio/drop.s.json", "audio/end.n.json", "audio/end.s.json", "audio/fall.n.json", "audio/fall.s.json", "audio/figure.n.json", "audio/figure.s.json", "audio/fill.n.json", "audio/fill.s.json", "audio/find.n.json", "audio/find.s.json", "audio/get.n.json", "audio/get.s.json", "audio/give.n.json", "audio/give.s.json", "audio/go.n.json", "audio/go.s.json", "audio/grow.n.json", "audio/grow.s.json", "audio/hang.n.json", "audio/hang.s.json", "audio/have.n.json", "audio/have.s.json", "audio/hit.n.json", "audio/hit.s.json", "audio/hold.n.json", "audio/hold.s.json", "audio/keep.n.json", "audio/keep.s.json", "audio/knock.n.json", "audio/knock.s.json", "audio/leave.n.json", "audio/leave.s.json", "audio/let.n.json", "audio/let.s.json", "audio/live.n.json", "audio/live.s.json", "audio/look.n.json", "audio/look.s.json", "audio/lose.n.json", "audio/lose.s.json", "audio/make.n.json", "audio/make.s.json", "audio/mean.n.json", "audio/mean.s.json", "audio/nail.n.json", "audio/nail.s.json", "audio/name.n.json", "audio/name.s.json", "audio/pass.n.json", "audio/pass.s.json", "audio/pick.n.json", "audio/pick.s.json", "audio/play.n.json", "audio/play.s.json", "audio/point.n.json", "audio/point.s.json", "audio/pull.n.json", "audio/pull.s.json", "audio/put.n.json", "audio/put.s.json", "audio/puzzle.n.json", "audio/puzzle.s.json", "audio/rub.n.json", "audio/rub.s.json", "audio/run.n.json", "audio/run.s.json", "audio/set.n.json", "audio/set.s.json", "audio/show.n.json", "audio/show.s.json", "audio/sleep.n.json", "audio/sleep.s.json", "audio/slow.n.json", "audio/slow.s.json", "audio/sort.n.json", "audio/sort.s.json", "audio/stand.n.json", "audio/stand.s.json", "audio/step.n.json", "audio/step.s.json", "audio/stick.n.json", "audio/stick.s.json", "audio/take.n.json", "audio/take.s.json", "audio/think.n.json", "audio/think.s.json", "audio/turn.n.json", "audio/turn.s.json", "audio/wing.n.json", "audio/wing.s.json", "audio/work.n.json", "audio/work.s.json", "audio/write.n.json", "audio/write.s.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open("shell-" + V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.endsWith(V) && !k.startsWith("font")).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", e => {
  if(e.data === "precache-audio") e.waitUntil(caches.open("audio-" + V).then(c => Promise.all(AUDIO.map(u => c.match(u).then(hit => hit || c.add(u).catch(() => {}))))));
});
self.addEventListener("fetch", e => {
  const req = e.request; if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin === location.origin){
    if(url.pathname.includes("/audio/")){
      e.respondWith(caches.open("audio-" + V).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { if(r.ok) c.put(req, r.clone()); return r; }))));
      return;
    }
    /* 画面は保存版をすぐ出し、裏で最新版を取ってくる(次に開いたときに反映) */
    e.respondWith(caches.open("shell-" + V).then(c => c.match(req, {ignoreSearch:true}).then(hit => {
      const net = fetch(req).then(r => { if(r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  if(url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(caches.open("font-v1").then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()); return r; }))));
  }
});
