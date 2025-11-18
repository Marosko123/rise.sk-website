const CACHE_NAME = 'rise-sk-v3';
const STATIC_CACHE = 'rise-sk-static-v3';
const DYNAMIC_CACHE = 'rise-sk-dynamic-v3';
const IMAGE_CACHE = 'rise-sk-images-v3';
const FONT_CACHE = 'rise-sk-fonts-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/en',
  '/sk',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/rise/Rise_logo_circle.png',
  '/rise/logo-circle-white-bg.png',
  '/rise/Rise_logo_transparent.png',
  '/rise/logo-text-rectangle.png',
  '/favicon.ico'
];

// Critical CSS and JS files to cache
const CRITICAL_RESOURCES = [
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/_next/static/media/'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Message event - handle skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip API calls in development
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  // Don't cache Next.js image optimization requests - let them pass through
  if (url.pathname.startsWith('/_next/image')) {
    return fetch(request);
  }
  
  try {
    // Handle different types of requests
    if (isImageRequest(request)) {
      return handleImageRequest(request);
    } else if (isStaticAsset(request)) {
      return handleStaticAsset(request);
    } else if (isPageRequest(request)) {
      return handlePageRequest(request);
    } else {
      return handleDynamicRequest(request);
    }
  } catch (error) {
    console.error('Fetch handler error:', error);
    return fetch(request);
  }
}

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(request.url);
}

// Check if request is for a static asset
function isStaticAsset(request) {
  return /\.(css|js|woff|woff2|ttf|eot)(\?.*)?$/i.test(request.url);
}

// Check if request is for a page
function isPageRequest(request) {
  return request.destination === 'document';
}

// Handle image requests with long-term caching
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    // Only cache successful responses for actual image files, not optimized images
    if (response.status === 200 && !request.url.includes('/_next/image')) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    
    // Try to return from cache if network fails
    const cachedFallback = await cache.match(request);
    if (cachedFallback) {
      return cachedFallback;
    }
    
    // Return a proper 404 response
    return new Response('', {
      status: 404,
      statusText: 'Image not found'
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    return new Response('', { status: 404 });
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Network failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or basic response
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Rise.sk</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
              padding: 2rem;
              background: #000;
              color: #fff;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 2rem;
              background: #b09155;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 24px;
            }
          </style>
        </head>
        <body>
          <div class="logo">R</div>
          <h1>You're Offline</h1>
          <p>Please check your internet connection and try again.</p>
          <button onclick="location.reload()">Retry</button>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle other dynamic requests
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Dynamic request failed:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('', { status: 404 });
  }
}

// Background sync for analytics and vitals
self.addEventListener('sync', (event) => {
  if (event.tag === 'vitals-sync') {
    event.waitUntil(syncVitals());
  }
});

async function syncVitals() {
  // Get stored vitals data from IndexedDB or localStorage
  // Send to analytics endpoint when online
  console.log('Syncing Web Vitals data...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/rise/Rise_logo_circle.png',
    badge: '/rise/Rise_logo_circle.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Rise.sk', options)
  );
});

console.log('Service Worker loaded and ready!');
