// Service Worker Cache Cleaner
// Run this in browser console to clear all service worker caches and unregister

(async function clearServiceWorkerCache() {
  console.log('🧹 Starting cache cleanup...');

  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('✅ Unregistered service worker:', registration.scope);
    }
  }

  // Clear all caches
  const cacheNames = await caches.keys();
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName);
    console.log('✅ Deleted cache:', cacheName);
  }

  console.log('✨ Cache cleanup complete! Reload the page to register fresh service worker.');
  console.log('Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) for a hard reload.');
})();
