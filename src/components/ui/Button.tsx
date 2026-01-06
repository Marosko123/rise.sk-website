'use client';

import { cn } from '@/utils/cn';
import { m as motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  href?: string;
  loading?: boolean;
  external?: boolean;
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-slate-900 hover:shadow-lg hover:shadow-[var(--primary)]/25',
  secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm',
  outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white',
  ghost: 'text-white hover:bg-white/10'
};

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const MotionLink = motion.create(Link);

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  href,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  external = false,
  type = 'button',
  ...props
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 transform select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    buttonVariants[variant],
    sizeVariants[size],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </>
  );

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.05 },
    whileTap: disabled ? {} : { scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  // Extract motion-conflicting props
  const {
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragStart: _onDragStart,
    onAnimationStart: _onAnimationStart,
    onAnimationEnd: _onAnimationEnd,
    ...buttonProps
  } = props;

  if (href) {
    return (
      <MotionLink
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={baseClasses}
        {...motionProps}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...buttonProps as any}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...motionProps}
      {...buttonProps}
    >
      {content}
    </motion.button>
  );
};
