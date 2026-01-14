'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PerformanceTier = 'low' | 'medium' | 'high';

export interface PerformanceConfig {
  tier: PerformanceTier;
  initialShapes: number;
  maxShapes: number;
  particleCount: number;
  collisionEnabled: boolean;
}

const PERFORMANCE_CONFIGS: Record<PerformanceTier, PerformanceConfig> = {
  low: {
    tier: 'low',
    initialShapes: 3,
    maxShapes: 10,
    particleCount: 20,
    collisionEnabled: false,
  },
  medium: {
    tier: 'medium',
    initialShapes: 5,
    maxShapes: 18,
    particleCount: 40,
    collisionEnabled: true,
  },
  high: {
    tier: 'high',
    initialShapes: 7,
    maxShapes: 25,
    particleCount: 60,
    collisionEnabled: true,
  },
};

// Detect initial performance tier based on hardware
function detectInitialTier(): PerformanceTier {
  if (typeof navigator === 'undefined') return 'medium';

  const cores = navigator.hardwareConcurrency || 4;
  // deviceMemory is only available in Chrome
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  // Low-end: 1-2 cores or less than 4GB RAM
  if (cores <= 2 || (memory && memory < 4)) {
    return 'low';
  }

  // High-end: 5+ cores and 8GB+ RAM (if available)
  if (cores >= 5 && (!memory || memory >= 8)) {
    return 'high';
  }

  return 'medium';
}

export function useDevicePerformance() {
  const [config, setConfig] = useState<PerformanceConfig>(() => {
    const tier = detectInitialTier();
    return PERFORMANCE_CONFIGS[tier];
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const adaptationCooldownRef = useRef<number>(0);

  // FPS monitoring callback - call this every frame
  const recordFrame = useCallback(() => {
    const now = performance.now();
    if (lastFrameTimeRef.current > 0) {
      const frameTime = now - lastFrameTimeRef.current;
      frameTimesRef.current.push(frameTime);

      // Keep only last 60 frames for average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }
    }
    lastFrameTimeRef.current = now;
  }, []);

  // Calculate current FPS
  const getCurrentFPS = useCallback(() => {
    if (frameTimesRef.current.length < 10) return 60;
    const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    return 1000 / avgFrameTime;
  }, []);

  // Adapt performance based on FPS
  useEffect(() => {
    const adaptInterval = setInterval(() => {
      const fps = getCurrentFPS();
      const now = Date.now();

      // Cooldown to prevent too frequent changes
      if (now - adaptationCooldownRef.current < 3000) return;

      // If FPS is too low, downgrade tier
      if (fps < 40 && config.tier !== 'low') {
        const newTier = config.tier === 'high' ? 'medium' : 'low';
        setConfig(PERFORMANCE_CONFIGS[newTier]);
        adaptationCooldownRef.current = now;
        // Debug: console.log(`[Performance] FPS: ${fps.toFixed(1)} - Downgrading to ${newTier}`);
      }
      // If FPS is consistently high, upgrade tier
      else if (fps > 55 && config.tier !== 'high') {
        const newTier = config.tier === 'low' ? 'medium' : 'high';
        setConfig(PERFORMANCE_CONFIGS[newTier]);
        adaptationCooldownRef.current = now;
        // Debug: console.log(`[Performance] FPS: ${fps.toFixed(1)} - Upgrading to ${newTier}`);
      }
    }, 2000);

    return () => clearInterval(adaptInterval);
  }, [config.tier, getCurrentFPS]);

  return {
    config,
    recordFrame,
    getCurrentFPS,
  };
}
