/// <reference lib="webworker" />

const CACHE_NAME = 'zero-faf-builder-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
	'/',
	'/manifest.json'
];

// Install event - precache assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(PRECACHE_ASSETS);
		})
	);
	self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			);
		})
	);
	self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
	// Skip non-GET requests and API calls
	if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// Clone and cache successful responses
				if (response.ok) {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, clone);
					});
				}
				return response;
			})
			.catch(() => {
				// Fallback to cache
				return caches.match(event.request);
			})
	);
});
