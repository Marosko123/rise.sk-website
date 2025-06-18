'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'>
      {children}
    </div>
  );
}

export function BentoCard({
  children,
  className = '',
  spotlight = false,
  tilt = true,
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
        z: 30,
      }}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {spotlight && isHovered && (
        <motion.div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none'
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
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm' />
        </div>
      )}

      {/* Content */}
      <div className='relative z-10'>{children}</div>

      {/* Enhanced border glow - simplified */}
      <div className='absolute inset-0 rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none' />
    </motion.div>
  );
}

export function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
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

  const baseClasses =
    'relative px-8 py-4 font-bold rounded-lg transition-all duration-300 overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm',
    ghost: 'bg-transparent hover:bg-white/5 border border-white/10 text-white',
  };

  const Component = href ? motion.a : motion.button;
  const props = href ? { href } : { onClick };

  return (
    <Component
      {...props}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      data-cursor='button'
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
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Ripple effect */}
      {isHovered && (
        <motion.div
          className='absolute inset-0 bg-white/20 rounded-lg'
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Content */}
      <span className='relative z-10'>{children}</span>

      {/* Glow effect */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-sm' />
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
    <div className='fixed inset-0 overflow-hidden pointer-events-none z-0'>
      {dots.map(dot => (
        <motion.div
          key={dot.id}
          className='absolute bg-white/20 rounded-full'
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
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
