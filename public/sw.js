// Service Worker for MMA Balkan PWA

const STATIC_CACHE = 'mma-balkan-static-v1';
const DYNAMIC_CACHE = 'mma-balkan-dynamic-v1';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/fighters',
  '/events',
  '/news',
  '/clubs',
  '/manifest.json',
  '/offline.html',
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_FILES);
      }),
      self.skipWaiting(),
    ])
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http/https requests (like chrome-extension://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    event.respondWith(handleStaticRequest(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleNextStaticRequest(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API calls
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - No cached data available',
        offline: true,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Static asset fetch failed:', error);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Handle Next.js static files
async function handleNextStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Static file fetch failed:', error);
    return new Response('Static file not available offline', { status: 404 });
  }
}

// Handle page requests with stale-while-revalidate strategy
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Try cache first for immediate response
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, will use cache if available
    return null;
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response
  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Fallback to offline page
  return caches.match('/offline.html') || new Response('Offline', { status: 503 });
}

// Background sync
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    const cache = await caches.open('background-sync');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const data = await response.json();
        
        // Process background sync data
        console.log('Processing background sync:', data);
        
        // Remove from cache after processing
        await cache.delete(request);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notifikacija',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Pogledaj',
        icon: '/icons/icon-72x72.png',
      },
      {
        action: 'close',
        title: 'Zatvori',
        icon: '/icons/icon-72x72.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('MMA Balkan', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Service Worker message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
