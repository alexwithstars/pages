"use strict";
skipWaiting()
const VERSIONS={
    font:"f-1.0.0", //fonts
    image:"i-1.0.0", //images
    resouce:"r-1.0.0"  //resources
}
self.addEventListener("activate",async (e)=>{
    let keys =await caches.keys() // Limpieza de cache
    for(let i in VERSIONS){
        if(keys.includes(VERSIONS[i])){
            continue
        }
        for(let key of keys){
            if(key.startsWith(VERSIONS[i][0])){
                await caches.delete(key)
                break
            }
        }
    }
})
self.addEventListener("fetch",(e)=>{
    e.respondWith((async ()=>{
        let cacheRequest=await caches.match(e.request)
        if(cacheRequest){
            return cacheRequest // respuesta en cache
        }
        let cache
        if(VERSIONS[e.request.destination]){ // guardamos en cache
            cache = await caches.open(VERSIONS[e.request.destination])
        }
        else{
            cache = await caches.open(VERSIONS.resouce)
        }
        let newRequest = e.request
        cache.add(newRequest)
        return fetch(newRequest) // respuesta en red
    })())
})