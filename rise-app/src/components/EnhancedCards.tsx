'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface InteractiveCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  number?: string;
  label?: string;
  className?: string;
  delay?: number;
}

export function InteractiveCard({ 
  icon: Icon, 
  title, 
  description, 
  number, 
  label, 
  className = "",
  delay = 0 
}: InteractiveCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMousePosition({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`interactive-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent backdrop-blur-sm border border-white/10 p-6 transition-all duration-500 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.03,
        rotateX: isHovered ? mousePosition.y / 20 : 0,
        rotateY: isHovered ? mousePosition.x / 20 : 0,
        z: 50
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${isHovered ? mousePosition.y / 30 : 0}deg) rotateY(${isHovered ? mousePosition.x / 30 : 0}deg)`,
      }}
      data-cursor="card"
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x + 200}px ${mousePosition.y + 200}px, rgba(59, 130, 246, 0.15), transparent 50%)`,
        }}
      />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? {
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            } : { opacity: 0, scale: 0 }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon with glow */}
        <motion.div
          className="mb-6 relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center relative overflow-hidden">
            <Icon className="w-8 h-8 text-blue-400 relative z-10" />
            
            {/* Icon glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 180, 360] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Number/Label section */}
        {number && (
          <div className="mb-4">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {number}
            </motion.div>
            {label && (
              <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
                {label}
              </div>
            )}
          </div>
        )}
        
        {/* Title */}
        <motion.h3
          className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300"
          whileHover={{ x: 5 }}
        >
          {title}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          className="text-gray-300 text-sm leading-relaxed flex-grow"
          whileHover={{ x: 5 }}
          transition={{ delay: 0.1 }}
        >
          {description}
        </motion.p>
        
        {/* Hover indicator */}
        <motion.div
          className="mt-6 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -20 }}
          whileHover={{ x: 0 }}
        >
          <span>Explore</span>
          <motion.svg
            className="w-4 h-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.div>
      </div>
      
      {/* Edge glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30" />
      </div>
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ 
  children, 
  className = "",
  onClick
}: MagneticButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-bold text-white transition-all duration-300 ${className}`}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-cursor="button"
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 1 }}
        animate={isHovered ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: "50%",
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
