'use client';

import Lenis from '@studio-freight/lenis';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-50%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div ref={ref} className='absolute inset-0 overflow-hidden'>
      <motion.div
        style={{ y, opacity }}
        className='absolute inset-0 bg-gradient-to-br from-[#b09155]/10 via-[#9a7f4b]/10 to-[#d4af37]/10'
      />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b09155] via-[#9a7f4b] to-[#d4af37] origin-left z-50'
      style={{ scaleX }}
    />
  );
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.3'],
  });

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return { y: [100, 0] };
      case 'down':
        return { y: [-100, 0] };
      case 'left':
        return { x: [100, 0] };
      case 'right':
        return { x: [-100, 0] };
      default:
        return { y: [100, 0] };
    }
  };

  const transform = getTransform();
  const animatedValue = useTransform(
    scrollYProgress,
    [0, 1],
    transform.y || transform.x
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);

  return (
    <div ref={ref}>
      <motion.div
        style={{
          ...(transform.y ? { y: animatedValue } : { x: animatedValue }),
          opacity,
        }}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function MagneticEffect({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={ref}>
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}

export function TextReveal({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.3'],
  });

  const words = text.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <TextRevealWord
          key={index}
          word={word}
          index={index}
          totalWords={words.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function TextRevealWord({
  word,
  index,
  totalWords,
  scrollYProgress,
}: {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const start = index / totalWords;
  const end = start + 1 / totalWords;
  const opacity = useTransform(scrollYProgress, [start, end], [0.3, 1]);

  return (
    <motion.span style={{ opacity }} className='inline-block mr-2'>
      {word}
    </motion.span>
  );
}
