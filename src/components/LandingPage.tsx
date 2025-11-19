'use client';

import { useLocale, useTranslations } from '@/hooks/useTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { SHAPE_CONFIG, useFloatingShapes } from '@/hooks/useFloatingShapes';
import { useParticles } from '@/hooks/useParticles';
import { useAnimation } from './AnimationProvider';
import LogoAndText from './LogoAndText';

// Dynamic imports for better performance
const About = dynamic(() => import('./About'));
const FAQ = dynamic(() => import('./FAQ'));
const Footer = dynamic(() => import('./Footer'));
const Hero = dynamic(() => import('./Hero'));
const Hiring = dynamic(() => import('./Hiring'));
const MultiStepContactForm = dynamic(() => import('./MultiStepContactForm'));
const Navigation = dynamic(() => import('./Navigation'));
const Portfolio = dynamic(() => import('./Portfolio'));
const Reviews = dynamic(() => import('./Reviews'));
const ServicesEnhanced = dynamic(() => import('./ServicesEnhanced'));

import LanguageSwitcher from './LanguageSwitcher';



export default function LandingPage() {
  const t = useTranslations('landing');
  const locale = useLocale();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const { animationTime } = useAnimation();
  const [mounted, setMounted] = useState(false);
  const [shiverCycleStart, setShiverCycleStart] = useState(0);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const updateWindowSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100); // Debounce resize events
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const { floatingShapes, isExploding, handleLogoClick } = useFloatingShapes({
    cursorPosition,
    windowSize,
    mounted
  });

  const { particles, createExplosion } = useParticles();

  // Check if we should show full website (when hash is present)
  const [showFullWebsite, setShowFullWebsite] = useState(false);

  // Dynamic section mappings based on language
  const getSectionMappings = (lang: string) => {
    if (lang === 'sk') {
      return {
        development: 'vyvoj',
        about: 'o-nas',
        services: 'sluzby',
        portfolio: 'portfolio',
        reviews: 'recenzie',
        faq: 'faq',
        hiring: 'kariera',
        contact: 'kontakt'
      };
    } else {
      return {
        development: 'development',
        about: 'about',
        services: 'services',
        portfolio: 'portfolio',
        reviews: 'reviews',
        faq: 'faq',
        hiring: 'hiring',
        contact: 'contact'
      };
    }
  };

  const sectionMap = getSectionMappings(locale);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollAccumulator = useRef(0);
  const scrollResetTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      window.location.hash = sectionMap.development;
    }, 800); // 800ms animation
  }, [isTransitioning, sectionMap.development]);

  useEffect(() => {
    if (showFullWebsite || isTransitioning) return;

    const handleWheel = (e: WheelEvent) => {
      // Accumulate scroll (only positive for down, but allow up to reduce)
      scrollAccumulator.current = Math.max(0, scrollAccumulator.current + e.deltaY);

      // Threshold to trigger transition (e.g. 400px)
      const threshold = 400;
      const progress = Math.min(scrollAccumulator.current / threshold, 1);

      setScrollProgress(progress);
      setIsScrolling(true);

      // Clear existing reset timer
      if (scrollResetTimer.current) clearTimeout(scrollResetTimer.current);

      if (progress >= 1) {
        triggerTransition();
      } else {
        // Reset after inactivity
        scrollResetTimer.current = setTimeout(() => {
          setIsScrolling(false);
          setScrollProgress(0);
          scrollAccumulator.current = 0;
        }, 150);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      setIsScrolling(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 0) { // Swipe up
        const threshold = 200; // Lower threshold for touch
        const progress = Math.min(deltaY / threshold, 1);
        setScrollProgress(progress);

        if (progress >= 1) {
          triggerTransition();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isTransitioning) {
        setIsScrolling(false);
        setScrollProgress(0);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showFullWebsite, isTransitioning, triggerTransition]);


  // Check hash changes to switch between landing and full website
  useEffect(() => {
    const checkHash = () => {
      const hasHash = window.location.hash.length > 0;
      setShowFullWebsite(hasHash);

      // Reset transition state when returning to landing page
      if (!hasHash) {
        setIsTransitioning(false);
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    // Check initially
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      // Reset body overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle initial hash scroll when full website is shown
  useEffect(() => {
    if (showFullWebsite && window.location.hash) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showFullWebsite]);

  // Function to determine if logo should be shivering
  const isShivering = useCallback(() => {
    // Don't shiver if user is hovering the logo
    if (isLogoHovered) return false;

    const timeSinceLastInteraction = animationTime - shiverCycleStart;
    const waitTime = 8000; // Wait 8 seconds after last interaction
    const shiverDuration = 1000; // Shiver for 1 second
    const totalCycle = waitTime + shiverDuration; // 9 seconds total

    // Only shiver after waiting period has passed
    if (timeSinceLastInteraction < waitTime) {
      return false; // Still in waiting period, don't shiver
    }

    // Check if we're in the shiver portion of the cycle
    const timeInShiverCycle = (timeSinceLastInteraction - waitTime) % totalCycle;
    return timeInShiverCycle < shiverDuration;
  }, [animationTime, shiverCycleStart, isLogoHovered]);

  // Function to reset shiver cycle (called on hover/click)
  const resetShiverCycle = useCallback(() => {
    setShiverCycleStart(Date.now());
  }, []);

  // Set mounted state and start animation timer
  useEffect(() => {
    setMounted(true);
    setShiverCycleStart(Date.now()); // Initialize shiver cycle timing
  }, []);

  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setMousePosition({ x, y });
      setCursorPosition({ x: e.clientX, y: e.clientY });

      // Update mouse trail (limit to 5 points for better performance)
      setMouseTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY, opacity: 1 }, ...prev.slice(0, 4)];
        return newTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, 1 - index * 0.3)
        }));
      });
    };

    const handleClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [createExplosion]);



  const getMagneticOffset = (elementX: number, elementY: number, strength: number = 30) => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };

    const deltaX = cursorPosition.x - elementX;
    const deltaY = cursorPosition.y - elementY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance;
      return {
        x: (deltaX * force * strength) / maxDistance,
        y: (deltaY * force * strength) / maxDistance,
      };
    }
    return { x: 0, y: 0 };
  };





  // Function to get logo color based on shape count (memoized for performance)
  const logoColorFilter = useMemo(() => {
    // Calculate percentage of shapes relative to MAX_COUNT
    const shapePercentage = Math.min(floatingShapes.length / SHAPE_CONFIG.MAX_COUNT, 1.0);

    if (shapePercentage < 0.33) {
      // Bronze phase (0-33% of MAX_COUNT) - Original bronze
      return {
        brightness: 1,
        contrast: 1,
        saturate: 1,
        sepia: 0,
        dropShadowColor: 'rgba(176, 145, 85, 0.8)'
      };
    } else if (shapePercentage < 0.66) {
      // Rich bronze phase (33-66% of MAX_COUNT) - Deeper, richer bronze
      const phaseProgress = (shapePercentage - 0.33) / 0.33;
      return {
        brightness: 1 + 0.2 * phaseProgress, // Slightly brighter
        contrast: 1 + 0.2 * phaseProgress, // More contrast
        saturate: 1 + 0.4 * phaseProgress, // More saturated
        sepia: 0.1 * phaseProgress, // Slight sepia for warmer tone
        dropShadowColor: `rgba(${176 + 20 * phaseProgress}, ${145 + 15 * phaseProgress}, ${85 + 10 * phaseProgress}, ${0.8 + 0.1 * phaseProgress})`
      };
    } else {
      // Gold phase (66-100% of MAX_COUNT) - Bronze to bright yellow gold transition
      const phaseProgress = (shapePercentage - 0.66) / 0.34;
      return {
        brightness: 1.2 + 0.5 * phaseProgress, // Much brighter for gold effect
        contrast: 1.2 + 0.3 * phaseProgress, // High contrast
        saturate: 1.4 + 0.8 * phaseProgress, // Very saturated for golden glow
        sepia: 0.1 + 0.3 * phaseProgress, // More sepia for golden warmth
        dropShadowColor: `rgba(${196 + 59 * phaseProgress}, ${160 + 95 * phaseProgress}, ${95 + 160 * phaseProgress}, ${0.9 + 0.1 * phaseProgress})` // Transition to bright gold (255, 255, 255)
      };
    }
  }, [floatingShapes.length]);

  // Function to calculate logo scale based on shape count
  const calculateLogoScale = useCallback(() => {
    // During explosion, immediately return to normal size
    if (isExploding) {
      return 1.0;
    }

    // Direct scale based on number of objects - immediate response
    const objectCount = floatingShapes.length;

    // Pure object-based scaling: 0 objects = 1.0x, each object adds 0.05x scale
    const scale = 1.0 + (objectCount * 0.05);

    // Cap the scale at the configured maximum
    return Math.min(scale, SHAPE_CONFIG.LOGO_SCALE_MAX);
  }, [floatingShapes.length, isExploding]);



  // Don't render animations until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className='min-h-screen relative overflow-hidden flex flex-col' style={{ backgroundColor: '#1a1a1a' }}>
        {/* Header */}
        <header className='relative z-50 px-6 py-6'>
          <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <div className='relative'>
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt={companyConfig.company.name}
                  width={50}
                  height={50}
                  className='select-none'
                  draggable={false}
                />
              </div>
              <span className='text-2xl font-bold text-white select-none'>
                {companyConfig.company.domain}
              </span>
            </div>
            <div className="relative z-50">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content - Centered */}
        <main className='relative z-10 flex-1 flex items-center justify-center px-6'>
          <div className='text-center max-w-3xl'>
            <div className='mb-8'>
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto select-none'
                draggable={false}
              />
            </div>

            <div className='mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 select-none'>
                {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p className='text-xl text-white/80 font-light select-none'>
                {t('description')}
              </p>
            </div>

            <div className='flex justify-center'>
              <button
                className='px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 border-primary transition-all duration-300 hover:scale-105 shadow-lg'
                style={{
                  backgroundColor: 'var(--primary)',
                  opacity: 0.1,
                  boxShadow: '0 4px 15px var(--glow)'
                }}
                onClick={() => {
                  // Fallback button navigation
                  window.location.href = `/${locale}/development`;
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4AF37';
                  e.currentTarget.style.borderColor = '#F4E07A';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <span className='flex items-center justify-center space-x-3 select-none'>
                  <span>👉</span>
                  <span>{t('development.title')}</span>
                </span>
              </button>
            </div>
          </div>
        </main>

        <footer className='relative z-10 px-6 py-6'>
          <div className='text-center'>
            <p className='text-white/60 text-sm select-none'>
              {t('footer')}
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${!showFullWebsite ? 'overflow-hidden' : ''}`}
      style={{ backgroundColor: '#1a1a1a' }}
    >
      {/* Show Navigation only when hash is present */}
      {showFullWebsite && <Navigation />}

      {!showFullWebsite ? (
        // Pure landing page with animated squares only
        <div
          className={`relative overflow-hidden min-h-screen`}
          style={{
            transform: isTransitioning
              ? 'scale(2)'
              : `scale(${1 + scrollProgress * 0.15})`,
            opacity: isTransitioning
              ? 0
              : 1 - scrollProgress * 0.2,
            filter: isTransitioning
              ? 'blur(4px)'
              : `blur(${scrollProgress * 2}px)`,
            transition: isTransitioning
              ? 'all 1s ease-in-out'
              : (isScrolling ? 'all 0.1s ease-out' : 'all 0.5s ease-out')
          }}
        >
          {/* Top Navigation Elements */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
            {/* Logo in top left - using LogoAndText component */}
            <LogoAndText />

            {/* Language switcher in top right */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Interactive Background with Large Logo */}
          <div className='absolute inset-0'>
            {/* Floating Geometric Shapes */}
            {floatingShapes.map((shape) => (
              <div
                key={shape.id}
                className='absolute select-none will-change-transform cursor-pointer'
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  transform: `translate3d(-50%, -50%, 0) rotate(${shape.rotation}deg)`,
                  zIndex: 1,
                }}
              >
                <div
                  className='w-full h-full transition-all duration-300 ease-out'
                  style={{
                    opacity: SHAPE_CONFIG.BASE_OPACITY,
                    // Metallic Gradient: Dark Bronze -> Gold -> Dark Bronze
                    background: 'linear-gradient(135deg, #8B7355 0%, #F4E07A 50%, #8B7355 100%)',
                    borderRadius: Math.floor(shape.id) % 4 === 0 ? '50%' :
                                 Math.floor(shape.id) % 3 === 0 ? '0%' :
                                 Math.floor(shape.id) % 2 === 0 ? '20%' : '10%',
                    // Inner glow + Drop shadow for 3D metallic effect
                    boxShadow: `
                      0 10px 25px rgba(0, 0, 0, 0.5),
                      inset 0 0 15px rgba(255, 255, 255, 0.4),
                      inset 2px 2px 5px rgba(255, 255, 255, 0.4),
                      inset -2px -2px 5px rgba(0, 0, 0, 0.4)
                    `,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = SHAPE_CONFIG.HOVER_OPACITY.toString();
                    e.currentTarget.style.transform = 'scale(1.2) rotate(15deg)';
                    e.currentTarget.style.boxShadow = `
                      0 15px 35px rgba(212, 175, 55, 0.4),
                      inset 0 0 20px rgba(255, 255, 255, 0.6),
                      inset 2px 2px 5px rgba(255, 255, 255, 0.6),
                      inset -2px -2px 5px rgba(0, 0, 0, 0.2)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = SHAPE_CONFIG.BASE_OPACITY.toString();
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = `
                      0 10px 25px rgba(0, 0, 0, 0.5),
                      inset 0 0 15px rgba(255, 255, 255, 0.4),
                      inset 2px 2px 5px rgba(255, 255, 255, 0.4),
                      inset -2px -2px 5px rgba(0, 0, 0, 0.4)
                    `;
                  }}
                />
              </div>
            ))}

            {/* Large background logo with minimal effects for performance */}
            <div
              className='absolute inset-0 flex items-center justify-center'
              style={{
                transform: `translate3d(${(mousePosition.x - 50) * 0.1}px, ${(mousePosition.y - 50) * 0.1}px, 0)`,
              }}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={600}
                height={600}
                priority
                className='select-none pointer-events-none'
            style={{
              opacity: 0.04,
            }}
          />
        </div>

        {/* Mouse Trail */}
        {mouseTrail.map((point, index) => (
          <div
            key={index}
            className='absolute w-2 h-2 rounded-full pointer-events-none select-none will-change-transform'
            style={{
              transform: `translate3d(${point.x - 4}px, ${point.y - 4}px, 0) scale(${point.opacity})`,
              backgroundColor: '#B09155',
              opacity: point.opacity * 0.5,
            }}
          />
        ))}

        {/* Click Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className='absolute w-1.5 h-1.5 rounded-full pointer-events-none select-none will-change-transform'
            style={{
              transform: `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${particle.life / particle.maxLife})`,
              backgroundColor: '#B09155',
              opacity: particle.life / particle.maxLife,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20'></div>
      </div>

      {/* Hero Section */}
      <section id="hero" className='relative z-10 flex items-center justify-center px-6 min-h-screen'>
        <div className='text-center max-w-3xl'>
          {/* Logo with enhanced glow and scaling effects */}
          <div className='mb-8'>
            <div
              className='inline-block transition-transform duration-300 ease-out cursor-pointer group'
              style={{
                transform: `translate(${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).x}px, ${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).y}px)`,
              }}
              onClick={handleLogoClick}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto cursor-pointer select-none'
                style={{
                  transform: `
                    scale(${calculateLogoScale() + (isLogoHovered ? 0.2 : 0)})
                    rotate(${isLogoHovered ? 5 : (isShivering() ? Math.sin(animationTime * 0.02) * 12 : 0)}deg)
                    translateX(${Math.sin(animationTime * 0.003) * 3}px)
                  `,
                  filter: `
                    brightness(${logoColorFilter.brightness * (isLogoHovered ? 1.2 : 1)})
                    contrast(${logoColorFilter.contrast * (isLogoHovered ? 1.1 : 1)})
                    saturate(${logoColorFilter.saturate * (isLogoHovered ? 1.1 : 1)})
                    sepia(${logoColorFilter.sepia})
                    drop-shadow(0 0 ${SHAPE_CONFIG.LOGO_GLOW_RADIUS * (isLogoHovered ? 1.5 : 1)}px ${logoColorFilter.dropShadowColor})
                  `,
                  transition: 'transform 0.2s ease-out, filter 0.2s ease-out', // Smooth transitions
                }}
                draggable={false}
                onMouseEnter={() => {
                  // Set hover state and reset shiver cycle
                  setIsLogoHovered(true);
                  resetShiverCycle();
                }}
                onMouseLeave={() => {
                  // Clear hover state and reset shiver cycle
                  setIsLogoHovered(false);
                  resetShiverCycle();
                }}
              />
            </div>
          </div>

          {/* Engaging Tagline with floating effect */}
          <div className='mb-12'>
            <h1
              className='text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-500 select-none'
              style={{
                transform: `translateY(${Math.sin(animationTime * 0.001) * 3}px)`,
                textShadow: '0 0 30px rgba(176, 145, 85, 0.3)',
              }}
            >
              {t('tagline.weAre')} <span className='text-primary'>{t('tagline.innovativeSolutions')}</span>
            </h1>
            <p
              className='text-xl text-white/80 font-light transition-all duration-700 select-none'
              style={{
                transform: `translateY(${Math.sin(animationTime * 0.001 + 1) * 2}px)`,
              }}
            >
              {t('description')}
            </p>
          </div>

          {/* Bottom Actions Container */}
          <div
            className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
            style={{
              opacity: isTransitioning ? 0 : 1 - scrollProgress * 2,
              transform: `translate(-50%, ${scrollProgress * 50}px)`
            }}
          >
            {/* Primary CTA Button */}
            <button
              onClick={triggerTransition}
              className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-500 hover:scale-105 focus:outline-none"
            >
              {/* Button Background & Border */}
              <div className="absolute inset-0 border border-primary/70 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-full group-hover:bg-primary/10 transition-all duration-500" />

              {/* Continuous Sheen Animation - "Press Me" effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sheen" />
              </div>

              {/* Button Text */}
              <span className="relative text-sm font-bold tracking-[0.25em] text-white/90 group-hover:text-primary transition-colors duration-300 uppercase drop-shadow-md">
                {locale === 'sk' ? 'Objavte viac' : 'Discover More'}
              </span>
            </button>

            {/* Scroll Indicator (Mouse) */}
            <div
              className="flex flex-col items-center gap-2 cursor-pointer group/scroll"
              onClick={triggerTransition}
            >
              <div className="w-[24px] h-[40px] rounded-full border-2 border-primary/60 flex justify-center p-1.5 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover/scroll:border-primary group-hover/scroll:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
                <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce group-hover/scroll:bg-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-center">
        <p className="text-white/60 text-sm select-none">
          © 2025 Rise.sk s.r.o. Všetky práva vyhradené.
        </p>
      </div>

      {/* Interactive Rise Components - Landing Page */}
      {/* <InteractiveRiseIcons /> */}
        </div>
      ) : (
        // Full website with all sections
        <div className="relative">
          {/* All sections as full page sections */}
          <div id={sectionMap.development}>
            <Hero />
          </div>

          <div id={sectionMap.about}>
            <About />
          </div>

          <div id={sectionMap.services}>
            <ServicesEnhanced />
          </div>

          <div id={sectionMap.portfolio}>
            <Portfolio />
          </div>

          <div id={sectionMap.reviews}>
            <Reviews />
          </div>

          <div id={sectionMap.faq}>
            <FAQ />
          </div>

          <div id={sectionMap.hiring}>
            <Hiring />
          </div>

          <div id={sectionMap.contact}>
            <MultiStepContactForm />
          </div>

          <Footer />

          {/* Interactive Rise Components - Full Website */}
          {/* <InteractiveRiseIcons /> */}
        </div>
      )}
    </div>
  );
}
