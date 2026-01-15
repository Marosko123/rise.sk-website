'use client';

import { PerformanceConfig } from '@/hooks/useDevicePerformance';
import { SHAPE_CONFIG, useFloatingShapes } from '@/hooks/useFloatingShapes';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface FloatingShapesProps {
  cursorPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  windowSize: { width: number; height: number };
  mounted: boolean;
  onStateChange?: (length: number, isExploding: boolean, explosionStartTime?: number) => void;
  isMobile?: boolean;
  performanceConfig?: PerformanceConfig;
  recordFrame?: () => void;
}

export interface FloatingShapesRef {
  handleLogoClick: () => void;
  isExploding: boolean;
  floatingShapesLength: number;
}


const FloatingShapes = forwardRef<FloatingShapesRef, FloatingShapesProps>(({ cursorPositionRef, windowSize, mounted, onStateChange, isMobile = false, performanceConfig, recordFrame }, ref) => {
  // Store refs to DOM elements for direct manipulation
  const shapeRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const { floatingShapes, isExploding, handleLogoClick, explosionStartTime } = useFloatingShapes({
    cursorPositionRef,
    windowSize,
    mounted,
    isMobile,
    shapeRefs,
    performanceConfig,
    recordFrame
  });

  useEffect(() => {
    onStateChange?.(floatingShapes.length, isExploding, explosionStartTime);
  }, [floatingShapes.length, isExploding, explosionStartTime, onStateChange]);

  useImperativeHandle(ref, () => ({
    handleLogoClick,
    isExploding,
    floatingShapesLength: floatingShapes.length
  }));

  if (!mounted) return null;

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
              opacity: shape.isStuck ? 0.6 : SHAPE_CONFIG.BASE_OPACITY,
              // Rich Gold Metallic Gradient with balanced contrast
              background: 'linear-gradient(135deg, #725A1E 0%, #C9A227 35%, #E8D47A 50%, #C9A227 65%, #725A1E 100%)',
              borderRadius: Math.floor(shape.id) % 4 === 0 ? '50%' :
                           Math.floor(shape.id) % 3 === 0 ? '0%' :
                           Math.floor(shape.id) % 2 === 0 ? '20%' : '10%',
              // Subtle glow + 3D metallic effect - less intense
              boxShadow: isMobile ? 'none' : (shape.isStuck ? `
                0 0 15px rgba(212, 175, 55, 0.5),
                0 0 30px rgba(212, 175, 55, 0.25),
                inset 0 0 12px rgba(255, 255, 255, 0.4),
                inset 2px 2px 4px rgba(255, 255, 255, 0.4),
                inset -2px -2px 4px rgba(0, 0, 0, 0.3)
              ` : `
                0 0 12px rgba(212, 175, 55, 0.35),
                0 0 25px rgba(212, 175, 55, 0.15),
                0 8px 20px rgba(0, 0, 0, 0.5),
                inset 0 0 10px rgba(255, 255, 255, 0.3),
                inset 2px 2px 4px rgba(255, 255, 255, 0.3),
                inset -2px -2px 4px rgba(0, 0, 0, 0.35)
              `),
              border: shape.isStuck ? '2px solid rgba(244, 226, 122, 0.7)' : '1px solid rgba(212, 175, 55, 0.45)',
              filter: isMobile ? 'none' : (shape.isStuck ? 'brightness(1.15)' : 'none'),
            }}
            onMouseEnter={(e) => {
              if (shape.isStuck || isMobile) return;
              e.currentTarget.style.opacity = SHAPE_CONFIG.HOVER_OPACITY.toString();
              e.currentTarget.style.transform = 'scale(1.15) rotate(12deg)';
              e.currentTarget.style.boxShadow = `
                0 0 20px rgba(212, 175, 55, 0.5),
                0 0 40px rgba(244, 226, 122, 0.3),
                0 12px 30px rgba(0, 0, 0, 0.45),
                inset 0 0 15px rgba(255, 255, 255, 0.45),
                inset 2px 2px 5px rgba(255, 255, 255, 0.45),
                inset -2px -2px 4px rgba(0, 0, 0, 0.25)
              `;
            }}
            onMouseLeave={(e) => {
              if (shape.isStuck || isMobile) return;
              e.currentTarget.style.opacity = SHAPE_CONFIG.BASE_OPACITY.toString();
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = `
                0 0 12px rgba(212, 175, 55, 0.35),
                0 0 25px rgba(212, 175, 55, 0.15),
                0 8px 20px rgba(0, 0, 0, 0.5),
                inset 0 0 10px rgba(255, 255, 255, 0.3),
                inset 2px 2px 4px rgba(255, 255, 255, 0.3),
                inset -2px -2px 4px rgba(0, 0, 0, 0.35)
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
