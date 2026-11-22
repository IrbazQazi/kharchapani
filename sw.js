// Kharcha Pani offline cache. Version: 20261122-102520
var CACHE='kp-20261122-102520', FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
// Open instantly from the phone (works offline); fetch a fresh copy in the background for next time.
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  if(new URL(e.request.url).origin!==self.location.origin) return; // never cache GitHub sync calls
  e.respondWith(caches.open(CACHE).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(hit){
    var net=fetch(e.request).then(function(r){if(r&&r.ok) c.put(e.request,r.clone());return r}).catch(function(){return hit});
    return hit||net;})}));
});
