'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function MorphingCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'button' | 'link' | 'card'>('default');
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Check if device supports hover (desktop)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    setIsVisible(true);

    // Throttle mouse move updates for better performance
    let rafId: number;
    const mouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    // Debounce hover state changes
    let hoverTimeout: NodeJS.Timeout;
    const handleMouseOver = (e: MouseEvent) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        const target = e.target as HTMLElement;

        if (target.closest('.interactive-card') || target.closest('[data-cursor="card"]')) {
          setCursorVariant('card');
        } else if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('[data-cursor="button"]')) {
          setCursorVariant('button');
        } else if (target.tagName === 'A' || target.closest('a') || target.closest('[data-cursor="link"]')) {
          setCursorVariant('link');
        } else if (target.closest('[data-cursor="text"]') || target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3') {
          setCursorVariant('text');
        } else {
          setCursorVariant('default');
        }
      }, 10);
    };

    // Click handlers for visual feedback
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', mouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(hoverTimeout);
    };
  }, []);

  if (!isVisible) return null;

  const getCursorColors = () => {
    switch (cursorVariant) {
      case 'text':
        return { primary: '#a855f7', secondary: '#c084fc', accent: '#e879f9' };
      case 'button':
        return { primary: '#ef4444', secondary: '#f87171', accent: '#fb7185' };
      case 'link':
        return { primary: '#22c55e', secondary: '#4ade80', accent: '#34d399' };
      case 'card':
        return { primary: '#3b82f6', secondary: '#60a5fa', accent: '#93c5fd' };
      default:
        return { primary: '#ffffff', secondary: '#f8fafc', accent: '#e2e8f0' };
    }
  };

  const colors = getCursorColors();
  const cursorSize = cursorVariant === 'default' ? 16 :
                   cursorVariant === 'text' ? 14 :
                   cursorVariant === 'button' ? 20 :
                   cursorVariant === 'link' ? 16 : 22;

  return (
    <div
      className="fixed inset-0 pointer-events-none morphing-cursor-container"
      style={{
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        isolation: 'isolate'
      }}
    >
      {/* Main cursor - highly visible with multi-layer design */}
      <motion.div
        className="fixed cursor-main cursor-element"
        animate={{
          x: mousePosition.x - cursorSize/2,
          y: mousePosition.y - cursorSize/2,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 40,
          mass: 0.1
        }}
        style={{
          width: cursorSize,
          height: cursorSize,
          zIndex: 2147483647,
          position: 'fixed',
          isolation: 'isolate',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
          pointerEvents: 'none'
        }}
      >
        {/* Outer glow for visibility */}
        <div
          className="absolute inset-0 rounded-full opacity-60 blur-sm"
          style={{
            background: `radial-gradient(circle, ${colors.accent}40, transparent 70%)`,
            transform: 'scale(2.5)',
          }}
        />

        {/* Main cursor body - high contrast */}
        <div
          className="absolute inset-0 rounded-full border-2 shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: `${colors.primary}95`,
            borderColor: colors.secondary,
            boxShadow: `0 0 20px ${colors.primary}60, inset 0 1px 0 ${colors.secondary}40`,
          }}
        />

        {/* Inner highlight for 3D effect */}
        <div
          className="absolute inset-1 rounded-full opacity-40"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}80, transparent 50%)`,
          }}
        />
      </motion.div>

      {/* Cursor state indicator */}
      {cursorVariant !== 'default' && (
        <motion.div
          className="fixed flex items-center justify-center text-white text-xs font-bold rounded-full shadow-xl cursor-indicator"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: mousePosition.x + 20,
            y: mousePosition.y - 20,
            scale: isClicking ? 1.2 : 1,
            opacity: 1
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          style={{
            width: 24,
            height: 24,
            backgroundColor: colors.primary,
            boxShadow: `0 4px 12px ${colors.primary}40`,
            zIndex: 2147483647,
          }}
        >
          {cursorVariant === 'text' && 'T'}
          {cursorVariant === 'button' && '●'}
          {cursorVariant === 'link' && '→'}
          {cursorVariant === 'card' && '✦'}
        </motion.div>
      )}

      {/* Enhanced outer ring with pulsing effect */}
      <motion.div
        className="fixed rounded-full border opacity-30 cursor-layer"
        animate={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
          scale: cursorVariant !== 'default' ? 1.3 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 0.5
        }}
        style={{
          width: 50,
          height: 50,
          borderColor: colors.primary,
          borderWidth: '1px',
          zIndex: 2147483646,
        }}
      />

      {/* Trailing particles with improved visibility */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full cursor-layer"
          animate={{
            x: mousePosition.x - 2,
            y: mousePosition.y - 2,
          }}
          transition={{
            type: "spring",
            stiffness: 120 - (i * 20),
            damping: 20 + (i * 5),
            mass: 0.3 + (i * 0.1)
          }}
          style={{
            width: 4 - i,
            height: 4 - i,
            backgroundColor: colors.primary,
            opacity: 0.6 - (i * 0.15),
            boxShadow: `0 0 ${8 - i * 2}px ${colors.primary}60`,
            zIndex: 2147483645 - i,
          }}
        />
      ))}

      {/* Dynamic background adaptation ring */}
      <motion.div
        className="fixed rounded-full cursor-layer"
        animate={{
          x: mousePosition.x - 35,
          y: mousePosition.y - 35,
          rotate: Date.now() / 20,
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          },
          x: {
            type: "spring",
            stiffness: 150,
            damping: 20,
          },
          y: {
            type: "spring",
            stiffness: 150,
            damping: 20,
          }
        }}
        style={{
          width: 70,
          height: 70,
          border: `1px dashed ${colors.primary}20`,
          opacity: cursorVariant !== 'default' ? 0.3 : 0,
          zIndex: 2147483644,
        }}
      />
    </div>
  );
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {children}
    </div>
  );
}

export function BentoCard({
  children,
  className = "",
  spotlight = false,
  tilt = true
}: {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
  tilt?: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Reduced tilt intensity and optimized calculations
  const tiltX = tilt && isHovered ? (mousePosition.y - 150) / 50 : 0;
  const tiltY = tilt && isHovered ? (mousePosition.x - 150) / 50 : 0;

  return (
    <motion.div
      className={`interactive-card relative p-6 bg-gradient-to-br from-white/8 to-white/2 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.01,
        z: 30
      }}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {spotlight && isHovered && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 40%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {/* Enhanced glow effect - only render when hovered */}
      {isHovered && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Enhanced border glow - simplified */}
      <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </motion.div>
  );
}

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative px-8 py-4 font-bold rounded-lg transition-all duration-300 overflow-hidden";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm",
    ghost: "bg-transparent hover:bg-white/5 border border-white/10 text-white"
  };

  const Component = href ? motion.a : motion.button;
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      data-cursor="button"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Ripple effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm" />
      </div>
    </Component>
  );
}

export function FloatingDots() {
  const dots = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute bg-white/20 rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
