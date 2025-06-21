'use client';

import { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: 'default' | 'gradient' | 'dark' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

const backgroundVariants = {
  default: 'bg-[var(--background)]',
  gradient: 'bg-gradient-to-br from-[var(--background)] via-[var(--surface)] to-[var(--background)]',
  dark: 'bg-[var(--surface)]',
  transparent: 'bg-transparent'
};

const paddingVariants = {
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24'
};

const maxWidthVariants = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-8xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
};

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  background = 'default',
  padding = 'lg',
  maxWidth = '7xl',
  ...props
}) => {
  const baseClasses = `
    relative overflow-hidden
    ${backgroundVariants[background]} ${paddingVariants[padding]} ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <section id={id} className={baseClasses} {...props}>
      <div className={`mx-auto px-6 lg:px-8 ${maxWidthVariants[maxWidth]}`}>
        {children}
      </div>
    </section>
  );
};
