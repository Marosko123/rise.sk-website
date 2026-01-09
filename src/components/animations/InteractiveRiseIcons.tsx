'use client';

import { companyConfig } from '@/config/company';
import { AnimatePresence, m as motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  pulseDelay: number;
  opacity: number;
}

// Extracted game counter component for navbar
export function GameCounter() {
  const [gameClicks, setGameClicks] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Load game state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedGameState = localStorage.getItem('riseIconGame');
    if (savedGameState) {
      try {
        const { clicks, started, completed } = JSON.parse(savedGameState);
        setGameClicks(clicks || 0);
        setGameStarted(started || false);
        setGameCompleted(completed || false);
      } catch {
        // Reset to default state if localStorage data is corrupted
        localStorage.removeItem('riseIconGame');
      }
    }
  }, []);

  // Listen for storage changes to sync state across tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      const savedGameState = localStorage.getItem('riseIconGame');
      if (savedGameState) {
        try {
          const { clicks, started, completed } = JSON.parse(savedGameState);
          setGameClicks(clicks || 0);
          setGameStarted(started || false);
          setGameCompleted(completed || false);
        } catch {
          localStorage.removeItem('riseIconGame');
        }
      } else {
        setGameClicks(0);
        setGameStarted(false);
        setGameCompleted(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check less frequently for same-tab updates (1 second instead of 500ms)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!gameStarted) return null;

  return (
    <AnimatePresence>
      {gameStarted && !gameCompleted && (
        <motion.div
          className="bg-white/10 border border-white/20 text-white/90 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm text-sm font-medium"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative flex-shrink-0">
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt="RISE"
                fill
                className="object-contain"
                draggable={false}
                sizes="20px"
              />
            </div>
            <span>{gameClicks}/10</span>
          </div>
        </motion.div>
      )}

      {gameCompleted && (
        <motion.div
          className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm text-sm font-medium"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: [1, 1.1, 1],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            scale: { duration: 0.6, repeat: 2 }
          }}
        >
          <div className="flex items-center gap-2">
            <span>🎉 Wasted time successfully 🎉</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function InteractiveRiseIcons() {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [clickedIcons, setClickedIcons] = useState<Set<number>>(new Set());
  const [documentHeight, setDocumentHeight] = useState(0);
  const [gameClicks, setGameClicks] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Pause intervals when tab is not visible (saves CPU/battery)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Reset game state on component mount (page refresh)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('riseIconGame');
    setGameClicks(0);
    setGameStarted(false);
    setGameCompleted(false);
  }, []);

  // Save game state to localStorage whenever it changes (only for GameCounter component to read)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const gameState = {
      clicks: gameClicks,
      started: gameStarted,
      completed: gameCompleted
    };
    localStorage.setItem('riseIconGame', JSON.stringify(gameState));
  }, [gameClicks, gameStarted, gameCompleted]);

  // Update document height when component mounts and on resize
  useEffect(() => {
    const updateDocumentHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      setDocumentHeight(height);
    };

    updateDocumentHeight();
    window.addEventListener('resize', updateDocumentHeight);

    // Also update when page content changes (useful for dynamic content)
    const observer = new MutationObserver(updateDocumentHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateDocumentHeight);
      observer.disconnect();
    };
  }, []);

  // Generate a random floating icon at a safe position across the entire document
  const generateFloatingIcon = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const currentDocHeight = documentHeight || window.innerHeight;

    // Ensure icons don't spawn too close to edges
    const margin = 50;
    const safeX = margin + Math.random() * (viewportWidth - 2 * margin);

    // Generate Y position anywhere in the document, not just viewport
    const safeY = margin + Math.random() * (currentDocHeight - 2 * margin);

    return {
      id: Date.now() + Math.random(),
      x: safeX,
      y: safeY,
      size: 12 + Math.random() * 8, // Small icons: 12-20px
      rotation: Math.random() * 360,
      pulseDelay: Math.random() * 2, // Random delay for pulse animation
      opacity: 0.6 + Math.random() * 0.3, // 60-90% opacity
    };
  }, [documentHeight]);

  // Spawn new icons periodically - reduced frequency for better performance
  useEffect(() => {
    // Don't spawn icons when tab is hidden
    if (!isVisible) return;

    const spawnInterval = setInterval(() => {
      setFloatingIcons(prev => {
        // Reduced max icons for better performance
        if (prev.length >= 10) return prev;

        const newIcon = generateFloatingIcon();
        return [...prev, newIcon];
      });
    }, 5000 + Math.random() * 5000); // Spawn every 5-10 seconds (increased from 3-7)

    return () => clearInterval(spawnInterval);
  }, [generateFloatingIcon, isVisible]);

  // Clean up old icons that haven't been clicked - less frequent cleanup
  useEffect(() => {
    // Don't run cleanup when tab is hidden
    if (!isVisible) return;

    const cleanupInterval = setInterval(() => {
      setFloatingIcons(prev => {
        const now = Date.now();
        // Remove icons older than 20 seconds that haven't been clicked
        return prev.filter(icon => now - icon.id < 20000);
      });
    }, 8000); // Check every 8 seconds instead of 5

    return () => clearInterval(cleanupInterval);
  }, [isVisible]);

  // Handle icon click
  const handleIconClick = useCallback((iconId: number) => {
    setClickedIcons(prev => new Set([...prev, iconId]));

    // Start the game on first click
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Increment game clicks
    setGameClicks(prev => {
      const newCount = prev + 1;

      // Check if game is completed
      if (newCount >= 10 && !gameCompleted) {
        setGameCompleted(true);
        // Reset game after 3 seconds
        setTimeout(() => {
          setGameCompleted(false);
          setGameStarted(false);
          setGameClicks(0);
          // Clear localStorage when game resets
          localStorage.removeItem('riseIconGame');
        }, 3000);
      }

      return newCount;
    });

    // Remove the icon after animation completes
    setTimeout(() => {
      setFloatingIcons(prev => prev.filter(icon => icon.id !== iconId));
      setClickedIcons(prev => {
        const newSet = new Set(prev);
        newSet.delete(iconId);
        return newSet;
      });
    }, 800); // Match animation duration
  }, [gameStarted, gameCompleted]);

  return (
    <>
      {/* Main icons container */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{
            height: documentHeight || '100vh'
          }}
        >
      <AnimatePresence>
        {floatingIcons.map((icon) => {
          const isClicked = clickedIcons.has(icon.id);

          return (
            <motion.div
              key={icon.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{
                left: icon.x,
                top: icon.y,
                width: icon.size,
                height: icon.size,
              }}
              initial={{
                scale: 0,
                opacity: 0,
                rotate: icon.rotation
              }}
              animate={isClicked ? {
                // Fun disappear animation
                scale: [1, 1.5, 0],
                opacity: [icon.opacity, 1, 0],
                rotate: icon.rotation + 720, // Two full spins
                y: -50, // Float up a bit
              } : {
                // Gentle entrance and idle animation
                scale: [0, 1.1, 1],
                opacity: [0, icon.opacity],
                rotate: icon.rotation,
              }}
              exit={{
                scale: 0,
                opacity: 0,
                transition: { duration: 0.3 }
              }}
              transition={isClicked ? {
                duration: 0.8,
                ease: "easeOut",
                times: [0, 0.3, 1]
              } : {
                duration: 0.6,
                ease: "easeOut"
              }}
              onClick={() => handleIconClick(icon.id)}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt="RISE Logo"
                  fill
                  className="object-contain"
                  draggable={false}
                  sizes="50px"
                />

                {/* Gentle glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-sm"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.8, 1.1, 0.8]
                  }}
                  transition={{
                    duration: 2 + icon.pulseDelay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Sparkle effect on click */}
                {isClicked && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0
                        }}
                        animate={{
                          x: (Math.cos(i * 60 * Math.PI / 180) * 30),
                          y: (Math.sin(i * 60 * Math.PI / 180) * 30),
                          opacity: 0,
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>
      </div>
    </>
  );
}
