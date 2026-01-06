'use client';

import { LazyMotion, domMax } from 'framer-motion';
import { ReactNode } from 'react';

interface LazyMotionProviderProps {
  children: ReactNode;
}

/**
 * LazyMotion provider that loads motion features lazily.
 * Using domMax to support all features including:
 * - animate, exit, initial props
 * - Variants
 * - AnimatePresence
 * - useAnimate, useScroll, useSpring, useTransform hooks
 * - Layout animations
 * - Drag gestures
 *
 * The 'strict' prop ensures all motion components use lazy-loaded features.
 */
export default function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return (
    <LazyMotion features={domMax}>
      {children}
    </LazyMotion>
  );
}
