'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface AnimationContextType {
  animationTime: number;
  mounted: boolean;
  isMobile: boolean;
  getAnimationTime: () => number;
}

const AnimationContext = createContext<AnimationContextType>({
  animationTime: 0,
  mounted: false,
  isMobile: false,
  getAnimationTime: () => Date.now()
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
  const [isMobile, setIsMobile] = useState(false);
  const animationTimeRef = useRef(Date.now());

  // Stable getter that doesn't cause re-renders
  const getAnimationTime = useCallback(() => animationTimeRef.current, []);

  useEffect(() => {
    setMounted(true);
    // Detect mobile once on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
  }, []);

  // Update animation time ref without causing re-renders
  useEffect(() => {
    if (!mounted || isMobile) return;

    let animationId: number;

    const updateAnimationTime = () => {
      animationTimeRef.current = Date.now();
      animationId = requestAnimationFrame(updateAnimationTime);
    };

    animationId = requestAnimationFrame(updateAnimationTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted, isMobile]);

  // Static value - doesn't change to avoid re-renders
  const staticAnimationTime = mounted ? Date.now() : 0;

  return (
    <AnimationContext.Provider value={{ 
      animationTime: staticAnimationTime, 
      mounted, 
      isMobile,
      getAnimationTime 
    }}>
      {children}
    </AnimationContext.Provider>
  );
}
