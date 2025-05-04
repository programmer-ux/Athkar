
// public/sw.js

// Basic install event - can be used for caching assets later
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // event.waitUntil(
  //   caches.open('athkarpal-cache-v1').then((cache) => {
  //     return cache.addAll([
  //       '/',
  //       // Add other assets to cache here
  //     ]);
  //   })
  // );
  self.skipWaiting(); // Activate worker immediately
});

// Basic activate event - can be used for cleaning up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  // Claim clients immediately allows the service worker to control pages loaded
  // in its scope immediately, instead of waiting for the next navigation.
  event.waitUntil(self.clients.claim());
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  event.notification.close(); // Close the notification

  // Define the URL to open when the notification is clicked
  const urlToOpen = new URL('/', self.location.origin).href;

  // Check if there's an open window/tab for this app
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true, // Important to find clients immediately after activation
    }).then((clientList) => {
      // If a window is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        // Check if the client URL matches the app's URL
        // You might need to adjust this check based on your routing
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );

  // Example of handling specific actions if you added them:
  // if (event.action === 'open-app') {
  //   console.log('Open App action clicked');
  //   event.waitUntil(clients.openWindow('/'));
  // }
});

// Optional: Add fetch event listener for offline capabilities later
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// Optional: Add message event listener to communicate with the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    console.log('Received schedule reminder message:', event.data.payload);
    // You could potentially use this to trigger notifications directly from SW
    // based on messages from the client, but using client-side setTimeout
    // is often simpler for basic reminders tied to app state.
  }
});
