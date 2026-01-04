'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface AnimationContextType {
  getAnimationTime: () => number;
  mounted: boolean;
  subscribe: (callback: () => void) => () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  getAnimationTime: () => 0,
  mounted: false,
  subscribe: () => () => {}
});

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Custom hook for components that need the animation time - only those components will re-render
export const useAnimationTime = () => {
  const { getAnimationTime, subscribe } = useAnimation();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return subscribe(() => forceUpdate(n => n + 1));
  }, [subscribe]);

  return getAnimationTime();
};

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [mounted, setMounted] = useState(false);
  const animationTimeRef = useRef(0);
  const subscribersRef = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAnimationTime = useCallback(() => animationTimeRef.current, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  // Single animation loop - uses ref to avoid triggering re-renders
  useEffect(() => {
    if (!mounted) return;

    let animationId: number;
    let lastTime = Date.now();

    const updateAnimationTime = () => {
      const now = Date.now();
      // 60fps for smooth animations
      if (now - lastTime >= 16) {
        animationTimeRef.current = now;
        // Notify only subscribed components
        subscribersRef.current.forEach(cb => cb());
        lastTime = now;
      }
      animationId = requestAnimationFrame(updateAnimationTime);
    };

    animationId = requestAnimationFrame(updateAnimationTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted]);

  return (
    <AnimationContext.Provider value={{ getAnimationTime, mounted, subscribe }}>
      {children}
    </AnimationContext.Provider>
  );
}
