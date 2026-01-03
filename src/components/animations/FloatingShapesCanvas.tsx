'use client';

import { SHAPE_CONFIG } from '@/hooks/useFloatingShapes';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

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
  isStuck?: boolean;
  borderRadius: number; // 0 = square, 0.5 = full circle
}

interface FloatingShapesCanvasProps {
  cursorPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  windowSize: { width: number; height: number };
  mounted: boolean;
  onStateChange?: (length: number, isExploding: boolean, explosionStartTime?: number) => void;
  isMobile?: boolean;
}

export interface FloatingShapesCanvasRef {
  handleLogoClick: () => void;
  isExploding: boolean;
  floatingShapesLength: number;
}

// Create a floating shape with random properties
const createFloatingShape = (id: number, totalCount: number, isInitial: boolean = false): FloatingShape => {
  let originalX, originalY;

  if (isInitial) {
    const angle = (id / totalCount) * 2 * Math.PI + (Math.random() - 0.5) * 0.8;
    const radius = SHAPE_CONFIG.CIRCLE_RADIUS * (0.3 + Math.random() * 0.7);
    originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
    originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;
    originalX += (Math.random() - 0.5) * 10;
    originalY += (Math.random() - 0.5) * 10;
  } else {
    const angle = Math.random() * 2 * Math.PI;
    const radius = SHAPE_CONFIG.CIRCLE_RADIUS * (0.2 + Math.random() * 0.8);
    originalX = SHAPE_CONFIG.CENTER_X + Math.cos(angle) * radius;
    originalY = SHAPE_CONFIG.CENTER_Y + Math.sin(angle) * radius;
    originalX += (Math.random() - 0.5) * 15;
    originalY += (Math.random() - 0.5) * 15;
  }

  const shapeType = Math.floor(Math.random() * 4);
  let borderRadius = 0;
  if (shapeType === 0) borderRadius = 0.5; // circle
  else if (shapeType === 1) borderRadius = 0; // square
  else if (shapeType === 2) borderRadius = 0.2; // rounded square
  else borderRadius = 0.1; // slightly rounded

  return {
    id: Date.now() + Math.random(),
    x: originalX,
    y: originalY,
    originalX,
    originalY,
    size: SHAPE_CONFIG.MIN_SIZE + Math.random() * (SHAPE_CONFIG.MAX_SIZE - SHAPE_CONFIG.MIN_SIZE),
    rotation: Math.random() * 360,
    speed: 0.5 + Math.random() * 1.5,
    vx: 0,
    vy: 0,
    borderRadius,
  };
};

const FloatingShapesCanvas = forwardRef<FloatingShapesCanvasRef, FloatingShapesCanvasProps>(
  ({ cursorPositionRef, windowSize, mounted, onStateChange, isMobile = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapesRef = useRef<FloatingShape[]>([]);
    const animationIdRef = useRef<number>(0);
    const isExplodingRef = useRef(false);
    const explosionStartTimeRef = useRef(0);
    const shapeCountRef = useRef(0);

    const [forceUpdate, setForceUpdate] = useState(0);

    const initialCount = isMobile ? 3 : SHAPE_CONFIG.INITIAL_COUNT;
    const maxCount = isMobile ? 15 : SHAPE_CONFIG.MAX_COUNT;

    // Initialize shapes
    useEffect(() => {
      if (mounted && shapesRef.current.length === 0) {
        shapesRef.current = Array.from({ length: initialCount }, (_, i) =>
          createFloatingShape(i, initialCount, true)
        );
        shapeCountRef.current = initialCount;
        setForceUpdate(f => f + 1);
      }
    }, [mounted, initialCount]);

    // Notify parent of state changes
    useEffect(() => {
      onStateChange?.(shapesRef.current.length, isExplodingRef.current, explosionStartTimeRef.current);
    }, [forceUpdate, onStateChange]);

    // Trigger explosion
    const triggerExplosion = useCallback(() => {
      if (!isExplodingRef.current) {
        isExplodingRef.current = true;
        explosionStartTimeRef.current = Date.now();

        shapesRef.current = shapesRef.current.map(shape => {
          const centerX = SHAPE_CONFIG.CENTER_X;
          const centerY = SHAPE_CONFIG.CENTER_Y;
          const deltaX = shape.x - centerX;
          const deltaY = shape.y - centerY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > 0) {
            const force = SHAPE_CONFIG.EXPLOSION_FORCE;
            const directionX = deltaX / distance;
            const directionY = deltaY / distance;
            return {
              ...shape,
              vx: directionX * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
              vy: directionY * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
            };
          } else {
            const randomAngle = Math.random() * 2 * Math.PI;
            const force = SHAPE_CONFIG.EXPLOSION_FORCE;
            return {
              ...shape,
              vx: Math.cos(randomAngle) * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
              vy: Math.sin(randomAngle) * force * SHAPE_CONFIG.EXPLOSION_VELOCITY_MULTIPLIER,
            };
          }
        });
        setForceUpdate(f => f + 1);
      }
    }, []);

    // Handle logo click
    const handleLogoClick = useCallback(() => {
      if (shapeCountRef.current >= maxCount) {
        shapesRef.current = [];
        shapeCountRef.current = 0;
      } else {
        const newShape = createFloatingShape(shapeCountRef.current, shapeCountRef.current + 1, false);
        shapesRef.current = [...shapesRef.current, newShape];
        shapeCountRef.current++;
      }
      setForceUpdate(f => f + 1);
    }, [maxCount]);

    useImperativeHandle(ref, () => ({
      handleLogoClick,
      isExploding: isExplodingRef.current,
      floatingShapesLength: shapesRef.current.length,
    }));

    // Main animation loop using Canvas
    useEffect(() => {
      if (!mounted || isMobile || !windowSize.width || !windowSize.height) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      // Set canvas size with device pixel ratio for crisp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = windowSize.width * dpr;
      canvas.height = windowSize.height * dpr;
      canvas.style.width = `${windowSize.width}px`;
      canvas.style.height = `${windowSize.height}px`;
      ctx.scale(dpr, dpr);

      let lastFrameTime = 0;
      const targetFPS = 24; // Lower FPS for better performance
      const frameInterval = 1000 / targetFPS;

      const animate = (currentTime: number) => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Throttle to target FPS
        const deltaTime = currentTime - lastFrameTime;
        if (deltaTime < frameInterval) return;
        lastFrameTime = currentTime - (deltaTime % frameInterval);

        // Clear canvas
        ctx.clearRect(0, 0, windowSize.width, windowSize.height);

        const shapes = shapesRef.current;
        const now = Date.now();

        // Check for explosion cleanup
        if (isExplodingRef.current && (now - explosionStartTimeRef.current) >= SHAPE_CONFIG.EXPLOSION_CLEANUP_TIME) {
          shapesRef.current = [];
          shapeCountRef.current = 0;
          isExplodingRef.current = false;
          setForceUpdate(f => f + 1);
          return;
        }

        // Restart after explosion
        if (!isExplodingRef.current && shapes.length === 0 && shapeCountRef.current === 0 &&
            explosionStartTimeRef.current > 0 && (now - explosionStartTimeRef.current) >= (SHAPE_CONFIG.EXPLOSION_CLEANUP_TIME + 1000)) {
          shapesRef.current = Array.from({ length: initialCount }, (_, i) =>
            createFloatingShape(i, initialCount, true)
          );
          shapeCountRef.current = initialCount;
          setForceUpdate(f => f + 1);
          return;
        }

        // Update and render shapes
        for (let i = 0; i < shapes.length; i++) {
          const shape = shapes[i];

          if (isExplodingRef.current) {
            // During explosion, just move by velocity
            const velocityScaleX = 100 / windowSize.width;
            const velocityScaleY = 100 / windowSize.height;
            shape.x += shape.vx * velocityScaleX;
            shape.y += shape.vy * velocityScaleY;
            shape.rotation += SHAPE_CONFIG.ROTATION_SPEED * 2;
          } else if (!shape.isStuck) {
            // Normal physics
            const shapeScreenX = (shape.x / 100) * windowSize.width;
            const shapeScreenY = (shape.y / 100) * windowSize.height;
            const deltaX = cursorPositionRef.current.x - shapeScreenX;
            const deltaY = cursorPositionRef.current.y - shapeScreenY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Mouse push effect
            if (distance < SHAPE_CONFIG.HOVER_RADIUS && distance > 0) {
              const angle = Math.atan2(deltaY, deltaX);
              const force = (SHAPE_CONFIG.HOVER_RADIUS - distance) / SHAPE_CONFIG.HOVER_RADIUS;
              shape.vx += -Math.cos(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;
              shape.vy += -Math.sin(angle) * force * SHAPE_CONFIG.HOVER_PUSH_FORCE;
            }

            // Gravity towards original position
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

            // Damping
            shape.vx *= SHAPE_CONFIG.DAMPING;
            shape.vy *= SHAPE_CONFIG.DAMPING;

            // Update position
            const velocityScaleX = 100 / windowSize.width;
            const velocityScaleY = 100 / windowSize.height;
            let newX = shape.x + shape.vx * velocityScaleX;
            let newY = shape.y + shape.vy * velocityScaleY;

            // Wall sticking
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
              shape.vx = 0;
              shape.vy = 0;
              shape.isStuck = true;
            }

            // Float animation
            const floatTime = now * SHAPE_CONFIG.FLOAT_SPEED;
            const floatOffsetX = Math.sin(floatTime + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.1;
            const floatOffsetY = Math.cos(floatTime * 1.3 + shape.id) * SHAPE_CONFIG.FLOAT_AMPLITUDE * 0.07;

            shape.x = newX + floatOffsetX;
            shape.y = newY + floatOffsetY;
            shape.rotation += SHAPE_CONFIG.ROTATION_SPEED;
          }

          // Draw shape
          const screenX = (shape.x / 100) * windowSize.width;
          const screenY = (shape.y / 100) * windowSize.height;
          const size = shape.size;
          const halfSize = size / 2;

          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate((shape.rotation * Math.PI) / 180);

          // Simple solid color for better performance (no gradients)
          ctx.fillStyle = shape.isStuck ? '#A08030' : '#B8963A';
          ctx.globalAlpha = shape.isStuck ? 0.4 : SHAPE_CONFIG.BASE_OPACITY;

          // Draw rounded rectangle
          const radius = halfSize * shape.borderRadius;
          ctx.beginPath();
          ctx.moveTo(-halfSize + radius, -halfSize);
          ctx.lineTo(halfSize - radius, -halfSize);
          ctx.quadraticCurveTo(halfSize, -halfSize, halfSize, -halfSize + radius);
          ctx.lineTo(halfSize, halfSize - radius);
          ctx.quadraticCurveTo(halfSize, halfSize, halfSize - radius, halfSize);
          ctx.lineTo(-halfSize + radius, halfSize);
          ctx.quadraticCurveTo(-halfSize, halfSize, -halfSize, halfSize - radius);
          ctx.lineTo(-halfSize, -halfSize + radius);
          ctx.quadraticCurveTo(-halfSize, -halfSize, -halfSize + radius, -halfSize);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }

        // Check win condition (all stuck) or max count
        if (!isExplodingRef.current && shapes.length > 0) {
          const allStuck = shapes.every(s => s.isStuck);
          if (allStuck || shapes.length >= maxCount) {
            triggerExplosion();
          }
        }
      };

      animationIdRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
      };
    }, [mounted, windowSize.width, windowSize.height, isMobile, cursorPositionRef, initialCount, maxCount, triggerExplosion]);

    if (!mounted || isMobile) return null;

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    );
  }
);

FloatingShapesCanvas.displayName = 'FloatingShapesCanvas';

export default FloatingShapesCanvas;
