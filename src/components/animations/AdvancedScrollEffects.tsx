'use client';

import {
    m as motion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Scroll-based section navigation with active indicators
export function ScrollSectionNavigator({
  sections,
}: {
  sections: Array<{ id: string; label: string }>;
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className='fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block'>
      <div className='flex flex-col space-y-4'>
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className='group relative flex items-center'
          >
            <motion.div
              className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
                activeSection === id
                  ? 'bg-primary border-primary'
                  : 'bg-transparent border-gray-400 hover:border-primary'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 15 }}
              className='absolute left-5 whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded text-sm pointer-events-none'
            >
              {label}
            </motion.span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// Advanced parallax with multiple layers and 3D perspective
export function MultiLayerParallax({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Different speeds for different layers
  const yBackground = useTransform(scrollYProgress, [0, 1], ['-30%', '30%']);
  const yMidground = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const yForeground = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  return (
    <div
      ref={ref}
      className='relative overflow-hidden'
      style={{ perspective: '1000px' }}
    >
      {/* Background layer */}
      <motion.div
        style={{ y: yBackground, rotateX, scale }}
        className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-dark/20 to-primary-light/20'
      />

      {/* Midground layer */}
      <motion.div
        style={{ y: yMidground }}
        className='absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary-light/10'
      />

      {/* Foreground content */}
      <motion.div style={{ y: yForeground }}>{children}</motion.div>
    </div>
  );
}

// Velocity-based scroll animations
export function VelocityScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Transform velocity to usable values
  const velocityFactor = useTransform(
    smoothVelocity,
    [-1000, 0, 1000],
    [2, 1, 2]
  );
  const scale = useTransform(velocityFactor, [1, 2], [1, 1.05]);
  const skew = useTransform(smoothVelocity, [-1000, 0, 1000], [-2, 0, 2]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, skewY: skew }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// Direction-aware scroll animations
export function DirectionAwareScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    return scrollY.on('change', latest => {
      const direction = latest > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      setLastScrollY(latest);
    });
  }, [scrollY, lastScrollY]);

  return (
    <motion.div
      animate={{
        y: scrollDirection === 'up' ? -10 : 0,
        opacity: scrollDirection === 'up' ? 0.8 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Character-by-character text reveal
export function CharacterReveal({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.2'],
  });

  const characters = text.split('');

  return (
    <div ref={ref} className={className}>
      {characters.map((char, index) => (
        <CharacterRevealChar
          key={index}
          char={char}
          index={index}
          totalChars={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function CharacterRevealChar({
  char,
  index,
  totalChars,
  scrollYProgress,
}: {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const start = index / totalChars;
  const end = start + 1 / totalChars;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);

  return (
    <motion.span style={{ opacity, y }} className='inline-block'>
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

// Morphing elements based on scroll
export function ScrollMorph({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ borderRadius, rotate, scale }}
      className='overflow-hidden'
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered stagger animations for cards/elements
export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

// Color theme transition based on scroll position
export function ScrollColorTransition() {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b']
  );

  return (
    <motion.div
      style={{ backgroundColor }}
      className='fixed inset-0 -z-10 transition-colors duration-1000'
    />
  );
}

// Curtain reveal effect for images/content
export function CurtainReveal({
  children,
  direction = 'horizontal',
}: {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.2'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal'
      ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
      : ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']
  );

  return (
    <div ref={ref} className='overflow-hidden'>
      <motion.div style={{ clipPath }}>{children}</motion.div>
    </div>
  );
}
