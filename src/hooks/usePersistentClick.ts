'use client';

import { useEffect, useState } from 'react';

const EVENT_KEY = 'rise_persistent_click_update';

export function usePersistentClick(key: string) {
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    // Guard against SSR - only run on client
    if (typeof window === 'undefined') return;

    // Initial check
    const checkStorage = () => {
      const stored = localStorage.getItem(key);
      if (stored) {
        setHasClicked(true);
      }
    };

    checkStorage();

    // Listen for custom event
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.key === key) {
        setHasClicked(true);
      }
    };

    // Listen for storage event (cross-tab)
    const handleCrossTabStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setHasClicked(true);
      }
    };

    window.addEventListener(EVENT_KEY, handleStorageChange);
    window.addEventListener('storage', handleCrossTabStorage);

    return () => {
      window.removeEventListener(EVENT_KEY, handleStorageChange);
      window.removeEventListener('storage', handleCrossTabStorage);
    };
  }, [key]);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, 'true');
    setHasClicked(true);

    // Dispatch custom event to notify other components
    const event = new CustomEvent(EVENT_KEY, { detail: { key } });
    window.dispatchEvent(event);
  };

  return { hasClicked, handleClick };
}
