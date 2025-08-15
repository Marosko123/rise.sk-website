'use client';

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

  // Generate a single rain icon based on current intensity and progression
  const generateSingleIcon = useCallback((intensity: RainIntensity, elapsed: number) => {
    const now = Date.now();

    // Calculate progression within current intensity level for smoother transitions
    let sizeMultiplier = 1;
    let speedMultiplier = 1;

    if (intensity === 'light') {
      // Gradually increase size/speed within light rain period (30-40s)
      const lightProgress = Math.min((elapsed - 30000) / 10000, 1); // 0-1 over 10 seconds
      sizeMultiplier = 1 + lightProgress * 0.3; // 30% size increase
      speedMultiplier = 1 + lightProgress * 0.2; // 20% speed increase
    } else if (intensity === 'medium') {
      // Gradually increase within medium rain period (40-50s)
      const mediumProgress = Math.min((elapsed - 40000) / 10000, 1); // 0-1 over 10 seconds
      sizeMultiplier = 1 + mediumProgress * 0.5; // 50% size increase
      speedMultiplier = 1 + mediumProgress * 0.4; // 40% speed increase
    } else if (intensity === 'heavy') {
      // More gentle heavy rain progression - less disruptive
      const heavyProgress = Math.min((elapsed - 50000) / 15000, 1); // 0-1 over 15 seconds
      sizeMultiplier = 1.2 + heavyProgress * 0.3; // 120% to 150% size (more gentle)
      speedMultiplier = 1.3 + heavyProgress * 0.2; // 130% to 150% speed increase (less disruptive)
    }

    const baseSize = intensity === 'light' ? 15 + Math.random() * 15 :
                     intensity === 'medium' ? 20 + Math.random() * 20 :
                     25 + Math.random() * 20; // More reasonable base size for heavy rain

    const baseSpeed = intensity === 'light' ? 3 + Math.random() * 1.5 :
                      intensity === 'medium' ? 2.5 + Math.random() * 1.5 :
                      2.2 + Math.random() * 1.3; // More moderate speed for heavy rain

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
    if (!isRaining || !inactivityStartTime) return;

    let lastIconTime = 0;

    const addContinuousRain = () => {
      const elapsed = Date.now() - inactivityStartTime;
      const now = Date.now();

      // Determine current intensity and frequency based on elapsed time
      let currentIntensity: RainIntensity;
      let frequency: number; // milliseconds between new icons

      if (elapsed >= 50000) { // 50+ seconds - heavy rain (20s after start)
        currentIntensity = 'heavy';
        // Slower frequency for heavy rain to be less disruptive - from 400ms to 250ms
        const heavyProgress = Math.min((elapsed - 50000) / 15000, 1);
        frequency = 400 - (heavyProgress * 150); // 400ms down to 250ms (slower and less disruptive)
        if (rainIntensity !== 'heavy') setRainIntensity('heavy');
      } else if (elapsed >= 40000) { // 40-50 seconds - medium rain (10-20s after start)
        currentIntensity = 'medium';
        // Gradually increase frequency from 700ms to 400ms
        const mediumProgress = (elapsed - 40000) / 10000;
        frequency = 700 - (mediumProgress * 300); // 700ms down to 400ms
        if (rainIntensity !== 'medium') setRainIntensity('medium');
      } else { // 30-40 seconds - light rain (0-10s after start)
        currentIntensity = 'light';
        // Gradually increase frequency from 1200ms to 700ms
        const lightProgress = Math.max((elapsed - 30000) / 10000, 0);
        frequency = 1200 - (lightProgress * 500); // 1200ms down to 700ms
        if (rainIntensity !== 'light') setRainIntensity('light');
      }

      // Only add new icon if enough time has passed
      if (now - lastIconTime >= frequency) {
        const newIcon = generateSingleIcon(currentIntensity, elapsed);
        setRainIcons(prev => [...prev, newIcon]);
        lastIconTime = now;
      }
    };

    // Start continuous rain generation - check frequently for smooth progression
    const rainInterval = setInterval(addContinuousRain, 50); // Check every 50ms

    return () => clearInterval(rainInterval);
  }, [isRaining, inactivityStartTime, rainIntensity, generateSingleIcon]);

  // Cleanup old rain icons to prevent memory buildup
  useEffect(() => {
    if (!isRaining) return;

    const cleanupInterval = setInterval(() => {
      setRainIcons(prev => {
        // More reasonable icon limits
        const maxIcons = rainIntensity === 'heavy' ? 80 : rainIntensity === 'medium' ? 60 : 30;
        return prev.slice(-maxIcons);
      });
    }, 2000); // Clean up every 2 seconds

    return () => clearInterval(cleanupInterval);
  }, [isRaining, rainIntensity]);

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
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
                  src="/optimized/rise/logo-bronze-transparent.webp"
                  alt="RISE Logo"
                  fill
                  className="object-contain"
                  draggable={false}
                  priority={false}
                />
                {/* Glow effect - more subtle intensity progression */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    rainIntensity === 'heavy' ? 'from-amber-400/25 to-yellow-400/25' :
                    rainIntensity === 'medium' ? 'from-amber-400/20 to-yellow-400/20' :
                    'from-amber-400/15 to-yellow-400/15'
                  } rounded-full blur-sm`}
                  style={{
                    animation: `pulse ${icon.speed * 0.5}s ease-in-out infinite alternate`
                  }}
                />

                {/* Subtle extra glow for heavy rain */}
                {rainIntensity === 'heavy' && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-amber-300/10 to-yellow-300/10 rounded-full blur-md"
                    style={{
                      animation: `pulse ${icon.speed * 0.4}s ease-in-out infinite alternate`,
                      transform: 'scale(1.2)'
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}

          {/* Background overlay for dramatic effect - intensity based */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/${
              rainIntensity === 'light' ? '3' : rainIntensity === 'medium' ? '6' : '10'
            } to-transparent`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Additional subtle overlay for heavy rain */}
          {rainIntensity === 'heavy' && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-amber-800/5 via-yellow-700/3 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.5, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            />
          )}

          {/* Celebration text */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                �️ RISE RAIN �️
              </h2>
              <p className="text-amber-300 text-lg md:text-xl mt-2 drop-shadow-md">
                {rainIntensity === 'light' ? 'Light rain starting...' :
                 rainIntensity === 'medium' ? 'Rain getting heavier...' :
                 'Heavy rain! Move to stop!'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
