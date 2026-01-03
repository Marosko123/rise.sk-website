'use client';

import { companyConfig } from '@/config/company';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface RainIcon {
  id: number;
  x: number;
  delay: number;
  size: number;
  rotation: number;
  speed: number;
  wave: number; // For identifying which wave of rain this icon belongs to
}

type RainIntensity = 'light' | 'medium' | 'heavy';

export default function RiseIconRain() {
  const [isRaining, setIsRaining] = useState(false);
  const [rainIcons, setRainIcons] = useState<RainIcon[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [rainIntensity, setRainIntensity] = useState<RainIntensity>('light');
  const [currentWave, setCurrentWave] = useState(0);
  const [inactivityStartTime, setInactivityStartTime] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause animations when tab is not visible (saves CPU)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Generate a single rain icon based on current intensity and progression
  const generateSingleIcon = useCallback((intensity: RainIntensity, elapsed: number) => {
    const now = Date.now();

    // Calculate progression within current intensity level for smoother transitions
    let sizeMultiplier = 1;
    let speedMultiplier = 1;

    if (intensity === 'light') {
      // Gradually increase size/speed within light rain period (30-40s)
      const lightProgress = Math.min((elapsed - 30000) / 10000, 1); // 0-1 over 10 seconds
      sizeMultiplier = 1 + lightProgress * 0.15; // Reduced to 15% size increase
      speedMultiplier = 1 + lightProgress * 0.1; // Reduced to 10% speed increase
    } else if (intensity === 'medium') {
      // Gradually increase within medium rain period (40-50s)
      const mediumProgress = Math.min((elapsed - 40000) / 10000, 1); // 0-1 over 10 seconds
      sizeMultiplier = 1 + mediumProgress * 0.25; // Reduced to 25% size increase
      speedMultiplier = 1 + mediumProgress * 0.2; // Reduced to 20% speed increase
    } else if (intensity === 'heavy') {
      // More gentle heavy rain progression - much less disruptive
      const heavyProgress = Math.min((elapsed - 50000) / 15000, 1); // 0-1 over 15 seconds
      sizeMultiplier = 1.1 + heavyProgress * 0.2; // 110% to 130% size (very gentle)
      speedMultiplier = 1.1 + heavyProgress * 0.15; // 110% to 125% speed increase (very gentle)
    }

    const baseSize = intensity === 'light' ? 8 + Math.random() * 8 :
                     intensity === 'medium' ? 12 + Math.random() * 10 :
                     16 + Math.random() * 12; // Much smaller and more gentle sizes

    const baseSpeed = intensity === 'light' ? 4 + Math.random() * 2 :
                      intensity === 'medium' ? 3.5 + Math.random() * 2 :
                      3 + Math.random() * 1.5; // Slightly slower for gentle effect

    return {
      id: now + Math.random(), // Unique ID
      x: Math.random() * 100, // 0-100% viewport width
      delay: Math.random() * 0.3, // Very short delay for continuous effect
      size: baseSize * sizeMultiplier,
      rotation: Math.random() * 360, // 0-360 degrees
      speed: baseSpeed / speedMultiplier, // Divide because lower = faster in Framer Motion
      wave: currentWave,
    };
  }, [currentWave]);

  // Start continuous rain system
  const startProgressiveRain = useCallback(() => {
    if (!isRaining) {
      setIsRaining(true);
      setInactivityStartTime(Date.now());
      setRainIntensity('light');
      setRainIcons([]); // Start fresh
    }
  }, [isRaining]);

  // Stop all rain
  const stopRain = useCallback(() => {
    setIsRaining(false);
    setRainIcons([]);
    setRainIntensity('light');
    setCurrentWave(0);
    setInactivityStartTime(null);
  }, []);

  // Set viewport height on mount
  useEffect(() => {
    setViewportHeight(window.innerHeight);

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous rain generation system
  useEffect(() => {
    // Don't run intervals when tab is hidden (saves CPU/battery)
    if (!isRaining || !inactivityStartTime || !isVisible) return;

    let lastIconTime = 0;

    const addContinuousRain = () => {
      const elapsed = Date.now() - inactivityStartTime;
      const now = Date.now();

      // Determine current intensity and frequency based on elapsed time
      let currentIntensity: RainIntensity;
      let frequency: number; // milliseconds between new icons

      if (elapsed >= 50000) { // 50+ seconds - heavy rain (20s after start)
        currentIntensity = 'heavy';
        // Much slower frequency for gentle heavy rain - from 600ms to 400ms
        const heavyProgress = Math.min((elapsed - 50000) / 15000, 1);
        frequency = 600 - (heavyProgress * 200); // 600ms down to 400ms (much gentler)
        if (rainIntensity !== 'heavy') setRainIntensity('heavy');
      } else if (elapsed >= 40000) { // 40-50 seconds - medium rain (10-20s after start)
        currentIntensity = 'medium';
        // Gradually increase frequency from 900ms to 600ms
        const mediumProgress = (elapsed - 40000) / 10000;
        frequency = 900 - (mediumProgress * 300); // 900ms down to 600ms
        if (rainIntensity !== 'medium') setRainIntensity('medium');
      } else { // 30-40 seconds - light rain (0-10s after start)
        currentIntensity = 'light';
        // Gradually increase frequency from 1500ms to 900ms
        const lightProgress = Math.max((elapsed - 30000) / 10000, 0);
        frequency = 1500 - (lightProgress * 600); // 1500ms down to 900ms
        if (rainIntensity !== 'light') setRainIntensity('light');
      }

      // Only add new icon if enough time has passed
      if (now - lastIconTime >= frequency) {
        const newIcon = generateSingleIcon(currentIntensity, elapsed);
        setRainIcons(prev => [...prev, newIcon]);
        lastIconTime = now;
      }
    };

    // Start continuous rain generation - check less frequently for better performance
    const rainInterval = setInterval(addContinuousRain, 100); // Check every 100ms instead of 50ms

    return () => clearInterval(rainInterval);
  }, [isRaining, inactivityStartTime, rainIntensity, generateSingleIcon, isVisible]);

  // Cleanup old rain icons to prevent memory buildup
  useEffect(() => {
    if (!isRaining || !isVisible) return;

    const cleanupInterval = setInterval(() => {
      setRainIcons(prev => {
        // Reduced icon limits for gentler effect and better performance
        const maxIcons = rainIntensity === 'heavy' ? 25 : rainIntensity === 'medium' ? 18 : 12;
        return prev.slice(-maxIcons);
      });
    }, 3000); // Clean up every 3 seconds instead of 2

    return () => clearInterval(cleanupInterval);
  }, [isRaining, rainIntensity, isVisible]);

  // Inactivity detection and automatic rain
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const startInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        if (!isRaining) {
          startProgressiveRain();
        }
      }, 30000); // 30 seconds of inactivity
    };

    const handleActivity = () => {
      // Stop all rain immediately when user becomes active
      if (isRaining) {
        stopRain();
      }

      // Start new inactivity timer
      startInactivityTimer();
    };

    // Activity event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial inactivity timer
    startInactivityTimer();

    return () => {
      // Cleanup
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [isRaining, startProgressiveRain, stopRain]);

  // Handle triple click detection (backup trigger)
  useEffect(() => {
    const handleClick = () => {
      setClickCount(prev => prev + 1);

      // Clear existing timer
      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      // Set new timer to reset click count after 800ms
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 800);
      setClickTimer(timer);
    };

    // Check for triple click
    if (clickCount === 3) {
      setClickCount(0);
      if (clickTimer) {
        clearTimeout(clickTimer);
      }

      // Trigger progressive rain animation manually
      startProgressiveRain();
    }

    // Add click listener to document
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickCount, clickTimer, startProgressiveRain]);

  return (
    <AnimatePresence>
      {isRaining && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {rainIcons.map((icon) => (
            <motion.div
              key={icon.id}
              className="absolute"
              initial={{
                y: -150,
                x: 0,
                rotate: icon.rotation,
                opacity: 0
              }}
              animate={{
                y: viewportHeight + 150,
                rotate: icon.rotation + 360,
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: icon.speed,
                delay: icon.delay,
                ease: "linear",
                opacity: {
                  times: [0, 0.1, 0.9, 1],
                  duration: icon.speed
                }
              }}
              style={{
                width: icon.size,
                height: icon.size,
                left: `${icon.x}%`,
                top: 0,
              }}
            >
              <div className="relative w-full h-full drop-shadow-lg">
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt="RISE Logo"
                  fill
                  className="object-contain"
                  draggable={false}
                  priority={false}
                  sizes="50px"
                />
                {/* Glow effect - much more subtle intensity progression */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    rainIntensity === 'heavy' ? 'from-amber-400/15 to-yellow-400/15' :
                    rainIntensity === 'medium' ? 'from-amber-400/10 to-yellow-400/10' :
                    'from-amber-400/8 to-yellow-400/8'
                  } rounded-full blur-sm`}
                  style={{
                    animation: `pulse ${icon.speed * 0.5}s ease-in-out infinite alternate`
                  }}
                />

                {/* Very subtle extra glow for heavy rain */}
                {rainIntensity === 'heavy' && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-amber-300/5 to-yellow-300/5 rounded-full blur-md"
                    style={{
                      animation: `pulse ${icon.speed * 0.4}s ease-in-out infinite alternate`,
                      transform: 'scale(1.1)'
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {/* Background overlay for very subtle effect - much reduced intensity */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/${
              rainIntensity === 'light' ? '1' : rainIntensity === 'medium' ? '2' : '4'
            } to-transparent`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Very subtle overlay for heavy rain */}
          {rainIntensity === 'heavy' && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-amber-800/2 via-yellow-700/1 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
