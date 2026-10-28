var CACHE='tasklog-v1';
var CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
var XLSX_URL='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(CORE).then(function(){return fetch(XLSX_URL,{mode:'no-cors'}).then(function(r){return c.put(XLSX_URL,r)}).catch(function(){})});
  }));self.skipWaiting()});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
    return hit||fetch(r).then(function(res){
      if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res
    }).catch(function(){return caches.match('index.html')})}))});
