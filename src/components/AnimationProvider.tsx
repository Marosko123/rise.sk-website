'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnimationContextType {
  animationTime: number;
  mounted: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  animationTime: 0,
  mounted: false
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Single animation loop for the entire application - optimized but smooth
  useEffect(() => {
    if (!mounted) return;

    let animationId: number;
    let lastTime = Date.now();

    const updateAnimationTime = () => {
      const now = Date.now();
      // 30fps for smooth animations while maintaining performance
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
  }, [mounted]);

  return (
    <AnimationContext.Provider value={{ animationTime, mounted }}>
      {children}
    </AnimationContext.Provider>
  );
}
