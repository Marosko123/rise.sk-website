'use client';

import { SHAPE_CONFIG, useFloatingShapes } from '@/hooks/useFloatingShapes';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface FloatingShapesProps {
  cursorPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  windowSize: { width: number; height: number };
  mounted: boolean;
  onStateChange?: (length: number, isExploding: boolean, explosionStartTime?: number) => void;
  isMobile?: boolean;
}

export interface FloatingShapesRef {
  handleLogoClick: () => void;
  isExploding: boolean;
  floatingShapesLength: number;
}


const FloatingShapes = forwardRef<FloatingShapesRef, FloatingShapesProps>(({ cursorPositionRef, windowSize, mounted, onStateChange, isMobile = false }, ref) => {
  // Store refs to DOM elements for direct manipulation
  const shapeRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const { floatingShapes, isExploding, handleLogoClick, explosionStartTime } = useFloatingShapes({
    cursorPositionRef,
    windowSize,
    mounted,
    isMobile,
    shapeRefs
  });

  useEffect(() => {
    onStateChange?.(floatingShapes.length, isExploding, explosionStartTime);
  }, [floatingShapes.length, isExploding, explosionStartTime, onStateChange]);

  useImperativeHandle(ref, () => ({
    handleLogoClick,
    isExploding,
    floatingShapesLength: floatingShapes.length
  }));

  if (!mounted || isMobile) return null;

  return (
    <>
      {floatingShapes.map((shape) => (
        <div
          key={shape.id}
          ref={(el) => {
              if (el) shapeRefs.current.set(shape.id, el);
              else shapeRefs.current.delete(shape.id);
          }}
          className={`absolute select-none will-change-transform ${shape.isStuck ? 'pointer-events-none' : 'cursor-pointer'}`}
          style={{
            // Initial positioning
            left: '0',
            top: '0',
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            // transform will be set by the animation loop immediately
            transform: `translate3d(calc(${(shape.x / 100) * windowSize.width}px - 50%), calc(${(shape.y / 100) * windowSize.height}px - 50%), 0) rotate(${shape.rotation}deg)`,
            zIndex: 1,
          }}
        >
          <div
            className='w-full h-full transition-all duration-300 ease-out'
            style={{
              opacity: shape.isStuck ? 0.5 : SHAPE_CONFIG.BASE_OPACITY,
              // Metallic Gradient: Dark Bronze -> Gold -> Dark Bronze
              background: 'linear-gradient(135deg, #8B6723 0%, #DAB549 50%, #8B6723 100%)',
              borderRadius: Math.floor(shape.id) % 4 === 0 ? '50%' :
                           Math.floor(shape.id) % 3 === 0 ? '0%' :
                           Math.floor(shape.id) % 2 === 0 ? '20%' : '10%',
              // Inner glow + Drop shadow for 3D metallic effect
              boxShadow: isMobile ? 'none' : (shape.isStuck ? `
                0 0 15px rgba(244, 224, 122, 0.6),
                inset 0 0 15px rgba(255, 255, 255, 0.4),
                inset 2px 2px 5px rgba(255, 255, 255, 0.4),
                inset -2px -2px 5px rgba(0, 0, 0, 0.4)
              ` : `
                0 10px 25px rgba(0, 0, 0, 0.5),
                inset 0 0 15px rgba(255, 255, 255, 0.4),
                inset 2px 2px 5px rgba(255, 255, 255, 0.4),
                inset -2px -2px 5px rgba(0, 0, 0, 0.4)
              `),
              border: shape.isStuck ? '2px solid rgba(244, 224, 122, 0.8)' : '1px solid rgba(255, 255, 255, 0.4)',
              filter: isMobile ? 'none' : (shape.isStuck ? 'brightness(1.2)' : 'none'),
            }}
            onMouseEnter={(e) => {
              if (shape.isStuck || isMobile) return;
              e.currentTarget.style.opacity = SHAPE_CONFIG.HOVER_OPACITY.toString();
              e.currentTarget.style.transform = 'scale(1.2) rotate(15deg)';
              e.currentTarget.style.boxShadow = `
                0 15px 35px rgba(212, 175, 55, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.6),
                inset 2px 2px 5px rgba(255, 255, 255, 0.6),
                inset -2px -2px 5px rgba(0, 0, 0, 0.2)
              `;
            }}
            onMouseLeave={(e) => {
              if (shape.isStuck || isMobile) return;
              e.currentTarget.style.opacity = SHAPE_CONFIG.BASE_OPACITY.toString();
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = `
                0 10px 25px rgba(0, 0, 0, 0.5),
                inset 0 0 15px rgba(255, 255, 255, 0.4),
                inset 2px 2px 5px rgba(255, 255, 255, 0.4),
                inset -2px -2px 5px rgba(0, 0, 0, 0.4)
              `;
            }}
          />
        </div>
      ))}
    </>
  );
});

FloatingShapes.displayName = 'FloatingShapes';

export default FloatingShapes;
