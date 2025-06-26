'use client';

import { useCallback, useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  const showUpdateNotification = useCallback(() => {
    // Show a subtle notification that an update is available
    if (window.confirm('A new version is available. Reload to update?')) {
      window.location.reload();
    }
  }, []);

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              showUpdateNotification();
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload();
        }
      });

    } catch {
      // Service Worker registration failed
    }
  }, [showUpdateNotification]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker();
    }
  }, [registerServiceWorker]);

  return null; // This component doesn't render anything
}

// Helper function to check if service worker is supported
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

// Helper function to send messages to service worker
export async function sendMessageToServiceWorker(message: unknown) {
  if (!isServiceWorkerSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  
  if (registration.active) {
    registration.active.postMessage(message);
  }
}

// Helper function to trigger background sync
export async function requestBackgroundSync(tag: string) {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if ('sync' in registration && registration.sync) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (registration as any).sync.register(tag);
    }
  } catch {
    // Background sync registration failed
  }
}
