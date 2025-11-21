import { useAnimation } from '@/components/providers/AnimationProvider';
import { useCallback, useEffect, useState } from 'react';

// Configuration variables for floating shapes physics
export const SHAPE_CONFIG = {
  // Shape generation
  INITIAL_COUNT: 7, // Initial number of floating shapes (reduced for performance)
  MAX_COUNT: 50, // Maximum number of shapes before reset (reduced for performance)
  MIN_SIZE: 10, // Minimum shape size in pixels
  MAX_SIZE: 100, // Maximum shape size in pixels

  // Physics
  GRAVITY_STRENGTH: 0.0002, // How strong the pull to center is
  DAMPING: 0.98, // Velocity damping (0.98 = slippery)
  HOVER_PUSH_FORCE: 1.5, // Force applied when hovering
  HOVER_RADIUS: 160, // Hover detection radius in pixels

  // Collision physics
  COLLISION_ENABLED: true, // Enable collision detection for better performance
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

interface UseFloatingShapesProps {
  cursorPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  windowSize: { width: number; height: number };
  mounted: boolean;
}

export function useFloatingShapes({ cursorPositionRef, windowSize, mounted }: UseFloatingShapesProps) {
  const { animationTime } = useAnimation();
  const [shapeCount, setShapeCount] = useState(SHAPE_CONFIG.INITIAL_COUNT);
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [explosionStartTime, setExplosionStartTime] = useState(0);

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
          // If both are stuck, don't move either
          if (shape1.isStuck && shape2.isStuck) {
            continue;
          }

          // Calculate collision normal (unit vector from shape1 to shape2)
          const normalX = deltaX / distance;
          const normalY = deltaY / distance;

          // Calculate overlap amount
          const overlap = minDistance - distance;

          // If one is stuck, only move the other one
          if (shape1.isStuck) {
             // Move shape2 away from shape1
             const separationX = overlap * normalX;
             const separationY = overlap * normalY;
             
             const separationPercentX2 = (separationX / windowWidth) * 100;
             const separationPercentY2 = (separationY / windowHeight) * 100;

             updatedShapes[j] = {
                ...shape2,
                x: shape2.x + separationPercentX2,
                y: shape2.y + separationPercentY2,
                // Bounce shape2
                vx: shape2.vx + normalX * 2, // Add some bounce
                vy: shape2.vy + normalY * 2
             };
             continue;
          }

          if (shape2.isStuck) {
             // Move shape1 away from shape2
             const separationX = overlap * normalX;
             const separationY = overlap * normalY;
             
             const separationPercentX1 = -(separationX / windowWidth) * 100;
             const separationPercentY1 = -(separationY / windowHeight) * 100;

             updatedShapes[i] = {
                ...shape1,
                x: shape1.x + separationPercentX1,
                y: shape1.y + separationPercentY1,
                // Bounce shape1
                vx: shape1.vx - normalX * 2, // Add some bounce
                vy: shape1.vy - normalY * 2
             };
             continue;
          }

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

          // If stuck, stay stuck
          if (shape.isStuck) {
             return shape;
          }

          // Normal physics when not exploding
          // Calculate distance from mouse to shape center
          const shapeScreenX = (shape.x / 100) * windowSize.width;
          const shapeScreenY = (shape.y / 100) * windowSize.height;
          const deltaX = cursorPositionRef.current.x - shapeScreenX;
          const deltaY = cursorPositionRef.current.y - shapeScreenY;
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
          
          let newX = shape.x + shape.vx * velocityScaleX;
          let newY = shape.y + shape.vy * velocityScaleY;

          // Wall Sticking Logic
          const sizePercentX = (shape.size / windowSize.width) * 100;
          const sizePercentY = (shape.size / windowSize.height) * 100;
          const halfSizeX = sizePercentX / 2;
          const halfSizeY = sizePercentY / 2;
          
          let isStuck = false;
          
          if (newX < halfSizeX) { newX = halfSizeX; isStuck = true; }
          if (newX > 100 - halfSizeX) { newX = 100 - halfSizeX; isStuck = true; }
          if (newY < halfSizeY) { newY = halfSizeY; isStuck = true; }
          if (newY > 100 - halfSizeY) { newY = 100 - halfSizeY; isStuck = true; }

          if (isStuck) {
             return {
                 ...shape,
                 x: newX,
                 y: newY,
                 vx: 0,
                 vy: 0,
                 isStuck: true
             };
          }

          // Add subtle floating animation using current time
          const floatTime = Date.now() * SHAPE_CONFIG.FLOAT_SPEED;
          const floatOffsetX = Math.sin(floatTime + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE;
          const floatOffsetY = Math.cos(floatTime * 1.3 + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.7;

          return {
            ...shape,
            x: newX + floatOffsetX * 0.1, // Small floating motion
            y: newY + floatOffsetY * 0.1,
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
  }, [mounted, windowSize.width, windowSize.height, floatingShapes.length, isExploding, detectAndResolveCollisions, cursorPositionRef]);

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

    // Check for win condition (all stuck)
    if (floatingShapes.length > 0 && !isExploding) {
        const allStuck = floatingShapes.every(s => s.isStuck);
        if (allStuck) {
            triggerExplosion();
        }
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
  }, [animationTime, mounted, isExploding, explosionStartTime, floatingShapes, shapeCount, triggerExplosion]);

  // Handle logo click to add/remove shapes
  const handleLogoClick = useCallback(() => {
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
  }, [shapeCount]);

  return {
    floatingShapes,
    isExploding,
    handleLogoClick,
    shapeCount,
    createFloatingShape,
    explosionStartTime
  };
}
