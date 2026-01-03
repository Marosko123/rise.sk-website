'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AnimationContextType {
  animationTime: number;
  mounted: boolean;
  isMobile: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  animationTime: 0,
  mounted: false,
  isMobile: false
});

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect mobile once on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
  }, []);

  // Single animation loop - DISABLED on mobile for performance
  useEffect(() => {
    if (!mounted) return;

    // On mobile, don't run animation loop at all - just set initial time
    if (isMobile) {
      setAnimationTime(Date.now());
      return;
    }

    let animationId: number;
    let lastTime = Date.now();

    const updateAnimationTime = () => {
      const now = Date.now();
      // 30fps for desktop smooth animations
      if (now - lastTime >= 33) {
        setAnimationTime(now);
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
  }, [mounted, isMobile]);

  return (
    <AnimationContext.Provider value={{ animationTime, mounted, isMobile }}>
      {children}
    </AnimationContext.Provider>
  );
}
