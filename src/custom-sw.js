//custom dynamic caching to append to service worker
self.addEventListener('fetch', function(event) {
if (event.request.method === 'GET' && (event.request.url.indexOf('https://newsapi.org') !== -1 || event.request.url.indexOf('https://us-central1-worldnews-bf737.cloudfunctions.net/api') !== -1) && event.request.url.indexOf('q=') === -1) {
event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
    return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
    });
    })
);
}
});
 