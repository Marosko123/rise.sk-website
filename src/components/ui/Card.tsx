'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const cardVariants = {
  default: 'bg-[var(--surface)]/40 border border-white/10',
  glass: 'bg-white/5 backdrop-blur-sm border border-white/10',
  gradient: 'bg-gradient-to-br from-[var(--surface)]/40 to-[var(--background)]/40 border border-white/10',
  outline: 'border-2 border-[var(--primary)]/30 bg-transparent'
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = `
    rounded-2xl p-6 transition-all duration-300
    ${cardVariants[variant]} ${className}
  `.trim().replace(/\s+/g, ' ');

  const hoverAnimation = hover ? {
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      {...hoverAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};
