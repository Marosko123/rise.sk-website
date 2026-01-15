import { useCallback, useEffect, useRef, useState } from 'react';

// Configuration variables for floating shapes physics
export const SHAPE_CONFIG = {
  // Shape generation
  INITIAL_COUNT: 5, // Initial number of floating shapes (reduced for performance)
  MAX_COUNT: 25, // Maximum number of shapes before reset (reduced for performance)
  MIN_SIZE: 15, // Minimum shape size in pixels
  MAX_SIZE: 80, // Maximum shape size in pixels

  // Physics
  GRAVITY_STRENGTH: 0.0003, // How strong the pull to center is
  DAMPING: 0.96, // Velocity damping (0.96 = more momentum)
  HOVER_PUSH_FORCE: 4.0, // Force applied when hovering (increased for reactivity)
  HOVER_RADIUS: 200, // Hover detection radius in pixels (increased)

  // Collision physics
  COLLISION_ENABLED: true, // Enable collision detection for better performance
  COLLISION_DAMPING: 0.85, // How much velocity is retained after collision (0-1)
  COLLISION_REPULSION: 0.8, // How much shapes repel each other during collision

  // Animation
  FLOAT_SPEED: 0.002, // Speed of natural floating motion (doubled)
  FLOAT_AMPLITUDE: 1.5, // Amplitude of floating motion (doubled)
  ROTATION_SPEED: 0.05, // Speed of shape rotation (faster)

  // Visual - Balanced visibility for all displays
  BASE_OPACITY: 0.40, // Balanced opacity - visible but not too bright
  HOVER_OPACITY: 0.70, // Hover opacity - enhanced but subtle
  GLOW_INTENSITY: 0.5, // Moderate glow effect

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

export interface FloatingShape {
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
  isStuck?: boolean;
}

// Helper to create shapes - pure function now
const createFloatingShape = (id: number, totalCount: number, isInitial: boolean = false): FloatingShape => {
  let originalX, originalY;
  if (isInitial) {
      const angle = (id / totalCount) * 2 * Math.PI;
      const radius = SHAPE_CONFIG.CIRCLE_RADIUS * 0.5;
      originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
      originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;
  } else {
      const angle = Math.random() * 2 * Math.PI;
      const radius = SHAPE_CONFIG.CIRCLE_RADIUS * Math.random();
      originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
      originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;
  }

  return {
    id: Date.now() + Math.random(),
    x: originalX,
    y: originalY,
    originalX,
    originalY,
    size: SHAPE_CONFIG.MIN_SIZE + Math.random() * (SHAPE_CONFIG.MAX_SIZE - SHAPE_CONFIG.MIN_SIZE),
    rotation: Math.random() * 360,
    speed: 1,
    vx: 0,
    vy: 0,
  };
};

import { PerformanceConfig } from './useDevicePerformance';

interface UseFloatingShapesProps {
  cursorPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  windowSize: { width: number; height: number };
  mounted: boolean;
  isMobile?: boolean;
  performanceConfig?: PerformanceConfig;
  recordFrame?: () => void;
}

export function useFloatingShapes({ cursorPositionRef, windowSize, mounted, isMobile = false, shapeRefs, performanceConfig, recordFrame }: UseFloatingShapesProps & { shapeRefs: React.MutableRefObject<Map<number, HTMLDivElement>> }) {
  // Use performance config if provided, otherwise fall back to defaults
  const initialCount = isMobile ? 3 : (performanceConfig?.initialShapes ?? SHAPE_CONFIG.INITIAL_COUNT);
  const maxCount = isMobile ? 15 : (performanceConfig?.maxShapes ?? SHAPE_CONFIG.MAX_COUNT);
  const collisionEnabled = isMobile ? false : (performanceConfig?.collisionEnabled ?? SHAPE_CONFIG.COLLISION_ENABLED);

  // Render shapes state - ONLY for adding/removing DOM nodes
  const [renderShapes, setRenderShapes] = useState<FloatingShape[]>([]);
  // Physics state - purely internal, no re-renders
  const physicsShapesRef = useRef<FloatingShape[]>([]);
  const shapeCountRef = useRef(initialCount);

  const [isExploding, setIsExploding] = useState(false);
  const [explosionStartTime, setExplosionStartTime] = useState(0);

  // Initialize shapes
  useEffect(() => {
    if (mounted && physicsShapesRef.current.length === 0) {
      const shapes = Array.from({ length: initialCount }, (_, i) =>
        createFloatingShape(i, initialCount, true)
      );
      physicsShapesRef.current = shapes;
      setRenderShapes(shapes);
      shapeCountRef.current = initialCount;
    }
  }, [mounted, initialCount]);

  // Collision detection function with performance optimization
  const detectAndResolveCollisions = useCallback((shapes: FloatingShape[], windowWidth: number, windowHeight: number, frameCount: number) => {
    if (!collisionEnabled) return;

    // Skip collision detection occasionally for better performance
    const skipFrame = frameCount % 2;
    if (skipFrame !== 0) return;

    for (let i = 0; i < shapes.length; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
            const shape1 = shapes[i];
            const shape2 = shapes[j];
            const roughDistance = Math.abs(shape1.x - shape2.x) + Math.abs(shape1.y - shape2.y);
            if (roughDistance > 20) continue;

            const shape1X = (shape1.x / 100) * windowWidth;
            const shape1Y = (shape1.y / 100) * windowHeight;
            const shape2X = (shape2.x / 100) * windowWidth;
            const shape2Y = (shape2.y / 100) * windowHeight;

            const deltaX = shape2X - shape1X;
            const deltaY = shape2Y - shape1Y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const minDistance = (shape1.size + shape2.size) / 2;

            if (distance < minDistance && distance > 0) {
               const normalX = deltaX / distance;
               const normalY = deltaY / distance;
               const overlap = minDistance - distance;

               const separationX = (overlap / 2) * normalX;
               const separationY = (overlap / 2) * normalY;
               const sepPctX = (separationX / windowWidth) * 100;
               const sepPctY = (separationY / windowHeight) * 100;

               if (!shape1.isStuck) {
                 shape1.x -= sepPctX;
                 shape1.y -= sepPctY;
                 shape1.vx -= normalX * 0.5;
                 shape1.vy -= normalY * 0.5;
               }
               if (!shape2.isStuck) {
                 shape2.x += sepPctX;
                 shape2.y += sepPctY;
                 shape2.vx += normalX * 0.5;
                 shape2.vy += normalY * 0.5;
               }
            }
        }
    }
  }, [collisionEnabled]);

  // Animate floating shapes - MAIN LOOP
  useEffect(() => {
    if (!mounted || !windowSize.width || !windowSize.height) return;

    let animationId: number;
    let frameCount = 0;

    const animateShapes = () => {
      frameCount++;
      const shapes = physicsShapesRef.current;

      // PHYSICS UPDATE
      shapes.forEach(shape => {
          if (isExploding) {
            const velocityScaleX = 100 / windowSize.width;
            const velocityScaleY = 100 / windowSize.height;
            shape.x += shape.vx * velocityScaleX;
            shape.y += shape.vy * velocityScaleY;
            shape.rotation += SHAPE_CONFIG.ROTATION_SPEED * 2;
          } else if (!shape.isStuck) {
             const shapeScreenX = (shape.x / 100) * windowSize.width;
             const shapeScreenY = (shape.y / 100) * windowSize.height;
             const deltaX = cursorPositionRef.current.x - shapeScreenX;
             const deltaY = cursorPositionRef.current.y - shapeScreenY;
             const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

             if (distance < SHAPE_CONFIG.HOVER_RADIUS && distance > 0) {
                 const angle = Math.atan2(deltaY, deltaX);
                 const force = (SHAPE_CONFIG.HOVER_RADIUS - distance) / SHAPE_CONFIG.HOVER_RADIUS;
                 shape.vx += -Math.cos(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;
                 shape.vy += -Math.sin(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;
             }

             const targetScreenX = (shape.originalX / 100) * windowSize.width;
             const targetScreenY = (shape.originalY / 100) * windowSize.height;
             const gravityDeltaX = targetScreenX - shapeScreenX;
             const gravityDeltaY = targetScreenY - shapeScreenY;
             const gravityDistance = Math.sqrt(gravityDeltaX * gravityDeltaX + gravityDeltaY * gravityDeltaY);

             if (gravityDistance > 0) {
                 const gravityForce = SHAPE_CONFIG.GRAVITY_STRENGTH * gravityDistance;
                 shape.vx += (gravityDeltaX / gravityDistance) * gravityForce;
                 shape.vy += (gravityDeltaY / gravityDistance) * gravityForce;
             }

             shape.vx *= SHAPE_CONFIG.DAMPING;
             shape.vy *= SHAPE_CONFIG.DAMPING;

             const velocityScaleX = 100 / windowSize.width;
             const velocityScaleY = 100 / windowSize.height;
             shape.x += shape.vx * velocityScaleX;
             shape.y += shape.vy * velocityScaleY;

             if (shape.x < 0) { shape.x = 0; shape.vx *= -1; }
             if (shape.x > 100) { shape.x = 100; shape.vx *= -1; }
             if (shape.y < 0) { shape.y = 0; shape.vy *= -1; }
             if (shape.y > 100) { shape.y = 100; shape.vy *= -1; }

             const floatTime = Date.now() * SHAPE_CONFIG.FLOAT_SPEED;
             shape.x += Math.sin(floatTime + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.1;
             shape.y += Math.cos(floatTime * 1.3 + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.07;
             shape.rotation += SHAPE_CONFIG.ROTATION_SPEED;
          }
      });

      // COLLISIONS
      if (!isExploding) {
          detectAndResolveCollisions(shapes, windowSize.width, windowSize.height, frameCount);
      }

      // DOM UPDATE (Direct Manipulation - High Performance)
      shapes.forEach(shape => {
          const el = shapeRefs.current.get(shape.id);
          if (el) {
              const xPos = (shape.x / 100) * windowSize.width;
              const yPos = (shape.y / 100) * windowSize.height;
              // Use transform for everything to avoid reflows
              const x = xPos.toFixed(1);
              const y = yPos.toFixed(1);
              const r = shape.rotation.toFixed(1);
              el.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0) rotate(${r}deg)`;
          }
      });

      // Record frame for FPS monitoring
      recordFrame?.();

      animationId = requestAnimationFrame(animateShapes);
    };

    animationId = requestAnimationFrame(animateShapes);
    return () => cancelAnimationFrame(animationId);
  }, [mounted, windowSize.width, windowSize.height, isExploding, detectAndResolveCollisions, cursorPositionRef, shapeRefs, recordFrame]);

  const triggerExplosion = useCallback(() => {
    if (!isExploding) {
       setIsExploding(true);
       setExplosionStartTime(Date.now());
       physicsShapesRef.current.forEach(shape => {
           const dx = shape.x - SHAPE_CONFIG.CENTER_X;
           const dy = shape.y - SHAPE_CONFIG.CENTER_Y;
           const mag = Math.sqrt(dx*dx + dy*dy) || 1;
           shape.vx = (dx/mag) * SHAPE_CONFIG.EXPLOSION_FORCE * 3;
           shape.vy = (dy/mag) * SHAPE_CONFIG.EXPLOSION_FORCE * 3;
       });
    }
  }, [isExploding]);

  // No auto-explosion - shapes stay permanently visible
  // The explosion feature is disabled for a cleaner, calmer experience
  // Shapes just float gently without ever disappearing

  const handleLogoClick = useCallback(() => {
      // Only add new shapes if not at max - never reset/delete shapes
      if (shapeCountRef.current < maxCount) {
          const newShape = createFloatingShape(shapeCountRef.current, shapeCountRef.current + 1, false);
          physicsShapesRef.current.push(newShape);
          setRenderShapes([...physicsShapesRef.current]);
          shapeCountRef.current++;
      }
      // At max count, do nothing - shapes stay visible forever
  }, [maxCount]);

  return {
    floatingShapes: renderShapes,
    isExploding,
    handleLogoClick,
    shapeCount: shapeCountRef.current,
    createFloatingShape,
    explosionStartTime
  };
}
