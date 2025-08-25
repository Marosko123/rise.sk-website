'use client';

import { useLocale, useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { useAnimation } from './AnimationProvider';
import LogoAndText from './LogoAndText';

// Import all the components we'll need for the full page
import About from './About';
import FAQ from './FAQ';
import Footer from './Footer';
import Hero from './Hero';
import Hiring from './Hiring';
import InteractiveRiseIcons from './InteractiveRiseIcons';
import MultiStepContactForm from './MultiStepContactForm';
import Navigation from './Navigation';
import Portfolio from './Portfolio';
import Reviews from './Reviews';
import ServicesEnhanced from './ServicesEnhanced';

import LanguageSwitcher from './LanguageSwitcher';

// Configuration variables for floating shapes physics
const SHAPE_CONFIG = {
  // Shape generation
  INITIAL_COUNT: 7, // Initial number of floating shapes (reduced for performance)
  MAX_COUNT: 50, // Maximum number of shapes before reset (reduced for performance)
  MIN_SIZE: 10, // Minimum shape size in pixels
  MAX_SIZE: 100, // Maximum shape size in pixels

  // Physics
  GRAVITY_STRENGTH: 0.0002, // How strong the pull to center is
  DAMPING: 0.98, // Velocity damping (0.98 = slight decay)
  HOVER_PUSH_FORCE: 1.2, // Force applied when hovering
  HOVER_RADIUS: 100, // Hover detection radius in pixels

  // Collision physics
  COLLISION_ENABLED: false, // Disable collision detection for better performance
  COLLISION_DAMPING: 0.8, // How much velocity is retained after collision (0-1)
  COLLISION_REPULSION: 0.5, // How much shapes repel each other during collision

  // Animation
  FLOAT_SPEED: 0.001, // Speed of natural floating motion
  FLOAT_AMPLITUDE: 0.8, // Amplitude of floating motion
  ROTATION_SPEED: 0.02, // Speed of shape rotation

  // Visual
  BASE_OPACITY: 0.15, // Base opacity of shapes
  HOVER_OPACITY: 0.35, // Opacity when hovered
  GLOW_INTENSITY: 0.4, // Intensity of glow effect

  // Circle formation
  CIRCLE_RADIUS: 25, // Percentage of screen for circle formation (25% = quarter screen)
  CENTER_X: 50, // Center X position (percentage)
  CENTER_Y: 45, // Center Y position (percentage)

  // Logo effects
  LOGO_PULSE_SPEED: 0.002, // Speed of logo pulsing animation
  LOGO_MIN_SCALE: 1.0, // Minimum scale of logo (normal size)
  LOGO_MAX_SCALE: 2, // Maximum scale of logo
  LOGO_ROTATION_INTENSITY: 2, // How much the logo rotates (degrees)

  // Logo scaling based on element count
  LOGO_SCALE_MIN: 1.0, // Minimum scale when few elements
  LOGO_SCALE_MAX: 3.0, // Maximum scale when approaching MAX_COUNT (more dramatic scaling)

  // Logo glow effects
  LOGO_GLOW_INTERVAL: 1000, // Glow interval in milliseconds (1000ms = 1 second)
  LOGO_GLOW_INTENSITY: 3, // How intense the golden glow is (0-1)
  LOGO_GLOW_RADIUS: 30, // Glow radius in pixels

  // Explosion effects
  EXPLOSION_FORCE: 80, // How strong the explosion force is
  EXPLOSION_VELOCITY_MULTIPLIER: 3, // Additional velocity multiplier for dramatic effect
  EXPLOSION_CLEANUP_TIME: 1500, // How long before shapes disappear after explosion (1.5 seconds)
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  size: number;
  rotation: number;
  speed: number;
  vx: number;
  vy: number;
}

export default function LandingPage() {
  const t = useTranslations('landing');
  const locale = useLocale();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const { animationTime } = useAnimation();
  const [mounted, setMounted] = useState(false);
  const [shapeCount, setShapeCount] = useState(SHAPE_CONFIG.INITIAL_COUNT);
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [explosionStartTime, setExplosionStartTime] = useState(0);
  const [shiverCycleStart, setShiverCycleStart] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Check if we should show full website (when hash is present)
  const [showFullWebsite, setShowFullWebsite] = useState(false);

  // Dynamic section mappings based on language
  const getSectionMappings = (lang: string) => {
    if (lang === 'sk') {
      return {
        development: 'vyvoj',
        about: 'o-nas',
        services: 'sluzby',
        portfolio: 'portfolio',
        reviews: 'recenzie',
        faq: 'faq',
        hiring: 'kariera',
        contact: 'kontakt'
      };
    } else {
      return {
        development: 'development',
        about: 'about',
        services: 'services',
        portfolio: 'portfolio',
        reviews: 'reviews',
        faq: 'faq',
        hiring: 'hiring',
        contact: 'contact'
      };
    }
  };

  const sectionMap = getSectionMappings(locale);

  const particleIdRef = useRef(0);

  // Check hash changes to switch between landing and full website
  useEffect(() => {
    const checkHash = () => {
      const hasHash = window.location.hash.length > 0;
      setShowFullWebsite(hasHash);

      // Hide body scrollbar when on landing page
      if (hasHash) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
    };

    // Check initially
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      // Reset body overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle initial hash scroll when full website is shown
  useEffect(() => {
    if (showFullWebsite && window.location.hash) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showFullWebsite]);

  // Function to determine if logo should be shivering
  const isShivering = useCallback(() => {
    // Don't shiver if user is hovering the logo
    if (isLogoHovered) return false;

    const timeSinceLastInteraction = animationTime - shiverCycleStart;
    const waitTime = 8000; // Wait 8 seconds after last interaction
    const shiverDuration = 1000; // Shiver for 1 second
    const totalCycle = waitTime + shiverDuration; // 9 seconds total

    // Only shiver after waiting period has passed
    if (timeSinceLastInteraction < waitTime) {
      return false; // Still in waiting period, don't shiver
    }

    // Check if we're in the shiver portion of the cycle
    const timeInShiverCycle = (timeSinceLastInteraction - waitTime) % totalCycle;
    return timeInShiverCycle < shiverDuration;
  }, [animationTime, shiverCycleStart, isLogoHovered]);

  // Function to reset shiver cycle (called on hover/click)
  const resetShiverCycle = useCallback(() => {
    setShiverCycleStart(Date.now());
  }, []);

  // Set mounted state and start animation timer
  useEffect(() => {
    setMounted(true);
    setShiverCycleStart(Date.now()); // Initialize shiver cycle timing
  }, []);

  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setMousePosition({ x, y });
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Update mouse trail (limit to 5 points for better performance)
      setMouseTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY, opacity: 1 }, ...prev.slice(0, 4)];
        return newTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, 1 - index * 0.3)
        }));
      });
    };

    const handleClick = (e: MouseEvent) => {
      // Create particle explosion (minimal particles for performance)
      const newParticles: Particle[] = [];
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 30,
          maxLife: 30,
        });
      }
      setParticles(prev => [...prev.slice(-10), ...newParticles]); // Limit total particles
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Animate particles using shared animation context
  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98,
          }))
          .filter(particle => particle.life > 0)
      );
    };

    // Use shared animation context instead of separate requestAnimationFrame
    animate();
  }, [animationTime]);

  const getMagneticOffset = (elementX: number, elementY: number, strength: number = 30) => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };

    const deltaX = cursorPosition.x - elementX;
    const deltaY = cursorPosition.y - elementY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      return {
        x: (deltaX * force * strength) / maxDistance,
        y: (deltaY * force * strength) / maxDistance,
      };
    }
    return { x: 0, y: 0 };
  };

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const updateWindowSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100); // Debounce resize events
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Collision detection function with performance optimization
  const detectAndResolveCollisions = useCallback((shapes: FloatingShape[], windowWidth: number, windowHeight: number, frameCount: number) => {
    if (!SHAPE_CONFIG.COLLISION_ENABLED) return shapes;

    // Skip collision detection occasionally for better performance
    const skipFrame = frameCount % 2; // Only run collision detection every other frame (~30fps for collisions)
    if (skipFrame !== 0) return shapes;

    const updatedShapes = [...shapes];

    for (let i = 0; i < updatedShapes.length; i++) {
      for (let j = i + 1; j < updatedShapes.length; j++) {
        const shape1 = updatedShapes[i];
        const shape2 = updatedShapes[j];

        // Quick distance check - skip expensive calculations if shapes are far apart
        const roughDistance = Math.abs(shape1.x - shape2.x) + Math.abs(shape1.y - shape2.y);
        if (roughDistance > 20) continue; // Skip if roughly more than 20% screen distance apart

        // Convert percentage positions to screen coordinates
        const shape1X = (shape1.x / 100) * windowWidth;
        const shape1Y = (shape1.y / 100) * windowHeight;
        const shape2X = (shape2.x / 100) * windowWidth;
        const shape2Y = (shape2.y / 100) * windowHeight;

        // Calculate distance between shape centers
        const deltaX = shape2X - shape1X;
        const deltaY = shape2Y - shape1Y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Calculate minimum distance for collision (sum of radii)
        const minDistance = (shape1.size + shape2.size) / 2;

        // Check for collision
        if (distance < minDistance && distance > 0) {
          // Calculate collision normal (unit vector from shape1 to shape2)
          const normalX = deltaX / distance;
          const normalY = deltaY / distance;

          // Calculate overlap amount
          const overlap = minDistance - distance;

          // Separate the shapes by moving them apart
          const separationX = (overlap / 2) * normalX;
          const separationY = (overlap / 2) * normalY;

          // Convert back to percentage coordinates for separation
          const separationPercentX1 = -(separationX / windowWidth) * 100;
          const separationPercentY1 = -(separationY / windowHeight) * 100;
          const separationPercentX2 = (separationX / windowWidth) * 100;
          const separationPercentY2 = (separationY / windowHeight) * 100;

          updatedShapes[i] = {
            ...shape1,
            x: shape1.x + separationPercentX1,
            y: shape1.y + separationPercentY1
          };

          updatedShapes[j] = {
            ...shape2,
            x: shape2.x + separationPercentX2,
            y: shape2.y + separationPercentY2
          };

          // Calculate relative velocity in collision normal direction
          const relativeVelX = shape2.vx - shape1.vx;
          const relativeVelY = shape2.vy - shape1.vy;
          const velocityAlongNormal = relativeVelX * normalX + relativeVelY * normalY;

          // Don't resolve if velocities are separating
          if (velocityAlongNormal > 0) {
            continue;
          }

          // Calculate restitution (bounciness)
          const restitution = 0.8;

          // Calculate impulse scalar
          const impulse = -(1 + restitution) * velocityAlongNormal;

          // Apply impulse to velocities
          updatedShapes[i] = {
            ...updatedShapes[i],
            vx: shape1.vx - impulse * normalX,
            vy: shape1.vy - impulse * normalY
          };

          updatedShapes[j] = {
            ...updatedShapes[j],
            vx: shape2.vx + impulse * normalX,
            vy: shape2.vy + impulse * normalY
          };
        }
      }
    }

    return updatedShapes;
  }, []);

  // Animate floating shapes with gravity and mouse interaction - dedicated 60fps loop
  useEffect(() => {
    if (!mounted || floatingShapes.length === 0 || !windowSize.width || !windowSize.height) {
      return;
    }

    let animationId: number;
    let frameCount = 0;

    const animateShapes = () => {
      frameCount++;

      setFloatingShapes(prev => {
        // First, update all shapes with physics
        const updatedShapes = prev.map(shape => {
          // During explosion, skip all physics except position updates
          if (isExploding) {
            // Update position based on velocity only
            const velocityScaleX = 100 / windowSize.width;
            const velocityScaleY = 100 / windowSize.height;
            shape.x += shape.vx * velocityScaleX;
            shape.y += shape.vy * velocityScaleY;

            return {
              ...shape,
              rotation: shape.rotation + SHAPE_CONFIG.ROTATION_SPEED * 2, // Faster rotation during explosion
            };
          }

          // Normal physics when not exploding
          // Calculate distance from mouse to shape center
          const shapeScreenX = (shape.x / 100) * windowSize.width;
          const shapeScreenY = (shape.y / 100) * windowSize.height;
          const deltaX = cursorPosition.x - shapeScreenX;
          const deltaY = cursorPosition.y - shapeScreenY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // Mouse hover push effect
          if (distance < SHAPE_CONFIG.HOVER_RADIUS && distance > 0) {
            const angle = Math.atan2(deltaY, deltaX);
            const force = (SHAPE_CONFIG.HOVER_RADIUS - distance) / SHAPE_CONFIG.HOVER_RADIUS;
            const pushX = -Math.cos(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;
            const pushY = -Math.sin(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;

            shape.vx += pushX;
            shape.vy += pushY;
          }

          // Gravity: Pull towards circular formation center
          const targetScreenX = (shape.originalX / 100) * windowSize.width;
          const targetScreenY = (shape.originalY / 100) * windowSize.height;

          // Calculate gravity force towards original position in circle
          const gravityDeltaX = targetScreenX - shapeScreenX;
          const gravityDeltaY = targetScreenY - shapeScreenY;
          const gravityDistance = Math.sqrt(gravityDeltaX * gravityDeltaX + gravityDeltaY * gravityDeltaY);

          if (gravityDistance > 0) {
            const gravityForce = SHAPE_CONFIG.GRAVITY_STRENGTH * gravityDistance;
            shape.vx += (gravityDeltaX / gravityDistance) * gravityForce;
            shape.vy += (gravityDeltaY / gravityDistance) * gravityForce;
          }

          // Apply damping
          shape.vx *= SHAPE_CONFIG.DAMPING;
          shape.vy *= SHAPE_CONFIG.DAMPING;

          // Update position based on velocity
          const velocityScaleX = 100 / windowSize.width; // Convert px velocity to % velocity
          const velocityScaleY = 100 / windowSize.height;
          shape.x += shape.vx * velocityScaleX;
          shape.y += shape.vy * velocityScaleY;

          // Add subtle floating animation using current time
          const floatTime = Date.now() * SHAPE_CONFIG.FLOAT_SPEED;
          const floatOffsetX = Math.sin(floatTime + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE;
          const floatOffsetY = Math.cos(floatTime * 1.3 + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.7;

          return {
            ...shape,
            x: shape.x + floatOffsetX * 0.1, // Small floating motion
            y: shape.y + floatOffsetY * 0.1,
            rotation: shape.rotation + SHAPE_CONFIG.ROTATION_SPEED,
          };
        });

        // Skip collision detection during explosion
        if (isExploding) {
          return updatedShapes;
        }

        // Then apply collision detection and resolution (only when not exploding)
        return detectAndResolveCollisions(updatedShapes, windowSize.width, windowSize.height, frameCount);
      });

      // Continue the animation loop at 60fps
      animationId = requestAnimationFrame(animateShapes);
    };

    // Start the animation loop
    animationId = requestAnimationFrame(animateShapes);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted, cursorPosition.x, cursorPosition.y, windowSize.width, windowSize.height, floatingShapes.length, isExploding, detectAndResolveCollisions]);

  // Function to create a new floating shape
  const createFloatingShape = (id: number, totalCount: number, isInitial: boolean = false): FloatingShape => {
    let originalX, originalY;

    if (isInitial) {
      // Initial shapes: Create circular distribution around center point
      const angle = (id / totalCount) * 2 * Math.PI + (Math.random() - 0.5) * 0.8;
      const radius = SHAPE_CONFIG.CIRCLE_RADIUS * (0.3 + Math.random() * 0.7);

      originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
      originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;

      // Add some additional random offset for more organic look
      const randomOffsetX = (Math.random() - 0.5) * 10;
      const randomOffsetY = (Math.random() - 0.5) * 10;

      originalX += randomOffsetX;
      originalY += randomOffsetY;
    } else {
      // New shapes: Place within the same circular area as initial shapes
      const angle = Math.random() * 2 * Math.PI; // Random angle
      const radius = SHAPE_CONFIG.CIRCLE_RADIUS * (0.2 + Math.random() * 0.8); // Random radius within circle

      originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
      originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;

      // Add some random offset for variety
      const randomOffsetX = (Math.random() - 0.5) * 15;
      const randomOffsetY = (Math.random() - 0.5) * 15;

      originalX += randomOffsetX;
      originalY += randomOffsetY;
    }

    return {
      id: Date.now() + Math.random(), // Ensure unique ID
      x: originalX,
      y: originalY,
      originalX,
      originalY,
      size: SHAPE_CONFIG.MIN_SIZE + Math.random() * (SHAPE_CONFIG.MAX_SIZE - SHAPE_CONFIG.MIN_SIZE),
      rotation: Math.random() * 360,
      speed: 0.5 + Math.random() * 1.5,
      vx: 0,
      vy: 0,
    };
  };

  // Initialize floating shapes
  useEffect(() => {
    if (mounted) {
      const shapes = Array.from({ length: SHAPE_CONFIG.INITIAL_COUNT }, (_, i) =>
        createFloatingShape(i, SHAPE_CONFIG.INITIAL_COUNT, true) // Pass true for initial shapes
      );
      setFloatingShapes(shapes);
    }
  }, [mounted]);

  // Handle logo click to add/remove shapes
  const handleLogoClick = () => {
    // Reset shiver cycle on click
    resetShiverCycle();

    if (shapeCount >= SHAPE_CONFIG.MAX_COUNT) {
      // Reset to 0 shapes when reaching maximum
      setFloatingShapes([]);
      setShapeCount(0);
    } else {
      // Add one more shape (not in circular formation, but randomly placed)
      const newShape = createFloatingShape(shapeCount, shapeCount + 1, false); // Pass false for new shapes
      setFloatingShapes(prev => [...prev, newShape]);
      setShapeCount(prev => prev + 1);
    }
  };

  // Function to get logo color based on shape count (memoized for performance)
  const logoColorFilter = useMemo(() => {
    // Calculate percentage of shapes relative to MAX_COUNT
    const shapePercentage = Math.min(floatingShapes.length / SHAPE_CONFIG.MAX_COUNT, 1.0);

    if (shapePercentage < 0.33) {
      // Bronze phase (0-33% of MAX_COUNT) - Original bronze
      return {
        brightness: 1,
        contrast: 1,
        saturate: 1,
        sepia: 0,
        dropShadowColor: 'rgba(176, 145, 85, 0.8)'
      };
    } else if (shapePercentage < 0.66) {
      // Rich bronze phase (33-66% of MAX_COUNT) - Deeper, richer bronze
      const phaseProgress = (shapePercentage - 0.33) / 0.33;
      return {
        brightness: 1 + 0.2 * phaseProgress, // Slightly brighter
        contrast: 1 + 0.2 * phaseProgress, // More contrast
        saturate: 1 + 0.4 * phaseProgress, // More saturated
        sepia: 0.1 * phaseProgress, // Slight sepia for warmer tone
        dropShadowColor: `rgba(${176 + 20 * phaseProgress}, ${145 + 15 * phaseProgress}, ${85 + 10 * phaseProgress}, ${0.8 + 0.1 * phaseProgress})`
      };
    } else {
      // Gold phase (66-100% of MAX_COUNT) - Bronze to bright yellow gold transition
      const phaseProgress = (shapePercentage - 0.66) / 0.34;
      return {
        brightness: 1.2 + 0.5 * phaseProgress, // Much brighter for gold effect
        contrast: 1.2 + 0.3 * phaseProgress, // High contrast
        saturate: 1.4 + 0.8 * phaseProgress, // Very saturated for golden glow
        sepia: 0.1 + 0.3 * phaseProgress, // More sepia for golden warmth
        dropShadowColor: `rgba(${196 + 59 * phaseProgress}, ${160 + 95 * phaseProgress}, ${95 + 160 * phaseProgress}, ${0.9 + 0.1 * phaseProgress})` // Transition to bright gold (255, 255, 255)
      };
    }
  }, [floatingShapes.length]);

  // Function to calculate logo scale based on shape count
  const calculateLogoScale = useCallback(() => {
    // During explosion, immediately return to normal size
    if (isExploding) {
      return 1.0;
    }

    // Direct scale based on number of objects - immediate response
    const objectCount = floatingShapes.length;

    // Pure object-based scaling: 0 objects = 1.0x, each object adds 0.05x scale
    const scale = 1.0 + (objectCount * 0.05);

    // Cap the scale at the configured maximum
    return Math.min(scale, SHAPE_CONFIG.LOGO_SCALE_MAX);
  }, [floatingShapes.length, isExploding]);

  // Function to trigger explosion
  const triggerExplosion = useCallback(() => {
    if (!isExploding) {
      setIsExploding(true);
      setExplosionStartTime(animationTime);

      // Apply explosion force to all shapes
      setFloatingShapes(prev => prev.map(shape => {
        const centerX = SHAPE_CONFIG.CENTER_X;
        const centerY = SHAPE_CONFIG.CENTER_Y;

        // Calculate direction from center to shape
        const deltaX = shape.x - centerX;
        const deltaY = shape.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) {
          // Use direct explosion force without distance division for more dramatic effect
          const force = SHAPE_CONFIG.EXPLOSION_FORCE;
          const directionX = deltaX / distance;
          const directionY = deltaY / distance;

          return {
            ...shape,
            vx: directionX * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
            vy: directionY * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER
          };
        } else {
          // If shape is exactly at center, give it a random direction
          const randomAngle = Math.random() * 2 * Math.PI;
          const force = SHAPE_CONFIG.EXPLOSION_FORCE;

          return {
            ...shape,
            vx: Math.cos(randomAngle) * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
            vy: Math.sin(randomAngle) * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER
          };
        }
      }));
    }
  }, [isExploding, animationTime]);

  // Handle explosion when reaching maximum shapes
  useEffect(() => {
    if (!mounted) return;

    // Trigger explosion when reaching MAX_COUNT
    if (floatingShapes.length >= SHAPE_CONFIG.MAX_COUNT && !isExploding) {
      triggerExplosion();
    }

    // Clean up shapes after explosion
    if (isExploding && (animationTime - explosionStartTime) >= SHAPE_CONFIG.EXPLOSION_CLEANUP_TIME) {
      setFloatingShapes([]);
      setShapeCount(0);
      setIsExploding(false);
    }

    // Restart with new shapes after a brief pause with 0 objects
    if (!isExploding && floatingShapes.length === 0 && shapeCount === 0 && (animationTime - explosionStartTime) >= (SHAPE_CONFIG.EXPLOSION_CLEANUP_TIME + 1000)) {
      const shapes = Array.from({ length: SHAPE_CONFIG.INITIAL_COUNT }, (_, i) =>
        createFloatingShape(i, SHAPE_CONFIG.INITIAL_COUNT, true)
      );
      setFloatingShapes(shapes);
      setShapeCount(SHAPE_CONFIG.INITIAL_COUNT);
    }
  }, [animationTime, mounted, isExploding, explosionStartTime, floatingShapes.length, shapeCount, triggerExplosion]);

  // Don't render animations until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className='min-h-screen relative overflow-hidden flex flex-col' style={{ backgroundColor: '#1a1a1a' }}>
        {/* Header */}
        <header className='relative z-50 px-6 py-6'>
          <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt={companyConfig.company.name}
                  width={50}
                  height={50}
                  className='select-none'
                  draggable={false}
                />
              </div>
              <span className='text-2xl font-bold text-white select-none'>
                {companyConfig.company.domain}
              </span>
            </div>
            <div className="relative z-50">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className='relative z-10 flex-1 flex items-center justify-center px-6'>
          <div className='text-center max-w-3xl'>
            <div className='mb-8'>
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto select-none'
                draggable={false}
              />
            </div>

            <div className='mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 select-none'>
                {t('tagline.weAre')} <span style={{ color: '#B09155' }}>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p className='text-xl text-white/80 font-light select-none'>
                {t('description')}
              </p>
            </div>

            <div className='flex justify-center'>
              <button
                className='px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105 shadow-lg'
                style={{
                  borderColor: '#D4AF37',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                }}
                onClick={() => {
                  // Fallback button navigation
                  window.location.href = `/${locale}/development`;
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.borderColor = '#F4E07A';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <span className='flex items-center justify-center space-x-3 select-none'>
                  <span>👉</span>
                  <span>{t('development.title')}</span>
                </span>
              </button>
            </div>
          </div>
        </main>

        <footer className='relative z-10 px-6 py-6'>
          <div className='text-center'>
            <p className='text-white/60 text-sm select-none'>
              {t('footer')}
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${!showFullWebsite ? 'overflow-hidden' : ''}`}
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Show Navigation only when hash is present */}
      {showFullWebsite && <Navigation />}

      {!showFullWebsite ? (
        // Pure landing page with animated squares only
        <div className="relative overflow-hidden min-h-screen">
          {/* Top Navigation Elements */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
            {/* Logo in top left - using LogoAndText component */}
            <LogoAndText />

            {/* Language switcher in top right */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Interactive Background with Large Logo */}
          <div className='absolute inset-0'>
            {/* Floating Geometric Shapes */}
            {floatingShapes.map((shape) => (
              <div
                key={shape.id}
                className='absolute select-none will-change-transform transition-opacity duration-300 hover:opacity-40 cursor-pointer'
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  opacity: SHAPE_CONFIG.BASE_OPACITY,
                  transform: `translate3d(-50%, -50%, 0) rotate(${shape.rotation}deg)`,
                  backgroundColor: '#B09155',
                  borderRadius: shape.id % 4 === 0 ? '50%' :
                               shape.id % 3 === 0 ? '0%' :
                               shape.id % 2 === 0 ? '20%' : '10%',
                  transition: 'opacity 0.3s ease-out',
                  boxShadow: `0 4px 20px rgba(176, 145, 85, ${SHAPE_CONFIG.GLOW_INTENSITY})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = SHAPE_CONFIG.HOVER_OPACITY.toString();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = SHAPE_CONFIG.BASE_OPACITY.toString();
                }}
              />
            ))}

            {/* Large background logo with minimal effects for performance */}
            <div
              className='absolute inset-0 flex items-center justify-center'
              style={{
                transform: `translate3d(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px, 0)`,
              }}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={600}
                height={600}
                priority
                className='select-none pointer-events-none'
            style={{
              opacity: 0.04,
            }}
          />
        </div>

        {/* Mouse Trail */}
        {mouseTrail.map((point, index) => (
          <div
            key={index}
            className='absolute w-2 h-2 rounded-full pointer-events-none select-none will-change-transform'
            style={{
              transform: `translate3d(${point.x - 4}px, ${point.y - 4}px, 0) scale(${point.opacity})`,
              backgroundColor: '#B09155',
              opacity: point.opacity * 0.5,
            }}
          />
        ))}

        {/* Click Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className='absolute w-1.5 h-1.5 rounded-full pointer-events-none select-none will-change-transform'
            style={{
              transform: `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${particle.life / particle.maxLife})`,
              backgroundColor: '#B09155',
              opacity: particle.life / particle.maxLife,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20'></div>
      </div>

      {/* Hero Section */}
      <section id="hero" className='relative z-10 flex items-center justify-center px-6 min-h-screen'>
        <div className='text-center max-w-3xl'>
          {/* Logo with enhanced glow and scaling effects */}
          <div className='mb-8'>
            <div
              className='inline-block transition-transform duration-300 ease-out cursor-pointer group'
              style={{
                transform: `translate(${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).x}px, ${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).y}px)`,
              }}
              onClick={handleLogoClick}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto cursor-pointer select-none'
                style={{
                  transform: `
                    scale(${calculateLogoScale() + (isLogoHovered ? 0.2 : 0)})
                    rotate(${isLogoHovered ? 5 : (isShivering() ? Math.sin(animationTime * 0.02) * 12 : 0)}deg)
                    translateX(${Math.sin(animationTime * 0.003) * 3}px)
                  `,
                  filter: `
                    brightness(${logoColorFilter.brightness * (isLogoHovered ? 1.2 : 1)})
                    contrast(${logoColorFilter.contrast * (isLogoHovered ? 1.1 : 1)})
                    saturate(${logoColorFilter.saturate * (isLogoHovered ? 1.1 : 1)})
                    sepia(${logoColorFilter.sepia})
                    drop-shadow(0 0 ${SHAPE_CONFIG.LOGO_GLOW_RADIUS * (isLogoHovered ? 1.5 : 1)}px ${logoColorFilter.dropShadowColor})
                  `,
                  transition: 'transform 0.2s ease-out, filter 0.2s ease-out', // Smooth transitions
                }}
                draggable={false}
                onMouseEnter={() => {
                  // Set hover state and reset shiver cycle
                  setIsLogoHovered(true);
                  resetShiverCycle();
                }}
                onMouseLeave={() => {
                  // Clear hover state and reset shiver cycle
                  setIsLogoHovered(false);
                  resetShiverCycle();
                }}
              />
            </div>
          </div>

          {/* Engaging Tagline with floating effect */}
          <div className='mb-12'>
            <h1
              className='text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-500 select-none'
              style={{
                transform: `translateY(${Math.sin(animationTime * 0.001) * 3}px)`,
                textShadow: '0 0 30px rgba(176, 145, 85, 0.3)',
              }}
            >
              {t('tagline.weAre')} <span style={{ color: '#B09155' }}>{t('tagline.innovativeSolutions')}</span>
            </h1>
            <p
              className='text-xl text-white/80 font-light transition-all duration-700 select-none'
              style={{
                transform: `translateY(${Math.sin(animationTime * 0.001 + 1) * 2}px)`,
              }}
            >
              {t('description')}
            </p>
          </div>

          {/* Main Button with magnetic attraction */}
          <div className='flex justify-center'>
            <div
              className='transition-transform duration-300 ease-out'
              style={{
                transform: `translate(${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 + 100).x}px, ${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 + 100).y}px)`,
              }}
            >
              <a
                href={`#${sectionMap.development}`}
                className='relative px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105 overflow-hidden group shadow-lg inline-block'
                style={{
                  borderColor: '#D4AF37',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.borderColor = '#F4E07A';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {/* Ripple effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 select-none pointer-events-none'></div>
                <span className='relative flex items-center justify-center space-x-3 select-none'>
                  <span>👉</span>
                  <span>{t('development.title')}</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-center">
        <p className="text-white/60 text-sm select-none">
          © 2025 Rise.sk s.r.o. Všetky práva vyhradené.
        </p>
      </div>

      {/* Interactive Rise Components - Landing Page */}
      <InteractiveRiseIcons />
        </div>
      ) : (
        // Full website with all sections
        <div className="relative">
          {/* All sections as full page sections */}
          <div id={sectionMap.development}>
            <Hero />
          </div>

          <div id={sectionMap.about}>
            <About />
          </div>

          <div id={sectionMap.services}>
            <ServicesEnhanced />
          </div>

          <div id={sectionMap.portfolio}>
            <Portfolio />
          </div>

          <div id={sectionMap.reviews}>
            <Reviews />
          </div>

          <div id={sectionMap.faq}>
            <FAQ />
          </div>

          <div id={sectionMap.hiring}>
            <Hiring />
          </div>

          <div id={sectionMap.contact}>
            <MultiStepContactForm />
          </div>

          <Footer />

          {/* Interactive Rise Components - Full Website */}
          <InteractiveRiseIcons />
        </div>
      )}
    </div>
  );
}
