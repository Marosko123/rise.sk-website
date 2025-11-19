'use client';

import Link from 'next/link';
import React from 'react';

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
}

export function BentoCard({ children, className = '', spotlight = false, ...props }: BentoCardProps) {
  const spotlightClass = spotlight ? 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-pulse' : '';
  
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 ${spotlightClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: string;
}

export function MagneticButton({ children, className = '', href, variant = 'primary', ...props }: MagneticButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95';
  const variantClasses = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-amber-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
  };
  
  const finalClassName = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={finalClassName}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={finalClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
