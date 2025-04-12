// Service Worker for DiggiClass PWA

const CACHE_NAME = 'diggi-class-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.svg',
  '/logo192.png',
  '/logo512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim any clients immediately
  self.clients.claim();
});

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'logo192.png',
    badge: 'favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    clients.openWindow('/');
  }
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendance());
  } else if (event.tag === 'sync-fees') {
    event.waitUntil(syncFees());
  }
});

// Functions for background sync
async function syncAttendance() {
  try {
    const outbox = await getAttendanceOutbox();
    await Promise.all(outbox.map(async (record) => {
      await sendToServer('/api/attendance', record);
      await removeFromOutbox('attendance', record.id);
    }));
  } catch (error) {
    console.error('Sync attendance failed:', error);
  }
}

async function syncFees() {
  try {
    const outbox = await getFeesOutbox();
    await Promise.all(outbox.map(async (record) => {
      await sendToServer('/api/fees', record);
      await removeFromOutbox('fees', record.id);
    }));
  } catch (error) {
    console.error('Sync fees failed:', error);
  }
}

// Helper functions (these would connect to IndexedDB in a real app)
async function getAttendanceOutbox() {
  // In a real app, this would fetch from IndexedDB
  return [];
}

async function getFeesOutbox() {
  // In a real app, this would fetch from IndexedDB
  return [];
}

async function sendToServer(url, data) {
  // In a real app, this would make a fetch request to your server
  console.log(`Syncing to ${url}:`, data);
  return Promise.resolve();
}

async function removeFromOutbox(store, id) {
  // In a real app, this would remove from IndexedDB
  console.log(`Removed ${id} from ${store} outbox`);
  return Promise.resolve();
} 