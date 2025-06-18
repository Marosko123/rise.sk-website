'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

import LanguageSwitcher from './LanguageSwitcher';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
}

export default function LandingPage() {
  const t = useTranslations('landing');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [floatingShapes] = useState<FloatingShape[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 20 + (i * 15), // More spaced out
      y: 30 + (i * 12),
      size: 30 + (i * 8),
      rotation: i * 60,
      speed: 0.2 + (i * 0.1),
    }))
  );

  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  // Set mounted state and start animation timer
  useEffect(() => {
    setMounted(true);

    let animationId: number;
    const updateAnimationTime = () => {
      setAnimationTime(Date.now());
      animationId = requestAnimationFrame(updateAnimationTime);
    };

    animationId = requestAnimationFrame(updateAnimationTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
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

      // Update mouse trail (limit to 10 points for performance)
      setMouseTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY, opacity: 1 }, ...prev.slice(0, 9)];
        return newTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, 1 - index * 0.2)
        }));
      });
    };

    const handleClick = (e: MouseEvent) => {
      // Create particle explosion (reduced particles for performance)
      const newParticles: Particle[] = [];
      for (let i = 0; i < 6; i++) {
        newParticles.push({
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 40,
          maxLife: 40,
        });
      }
      setParticles(prev => [...prev.slice(-20), ...newParticles]); // Limit total particles
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98,
          }))
          .filter(particle => particle.life > 0)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
                {t('tagline.weAre')} <span style={{ color: '#B09155' }}>{t('tagline.innovativeSolutions')}</span>
              </h1>
              <p className='text-xl text-white/80 font-light select-none'>
                {t('description')}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-6 justify-center'>
              <Link href='/education'>
                <button
                  className='px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105'
                  style={{
                    borderColor: '#B09155',
                    backgroundColor: 'transparent'
                  }}
                >
                  <span className='flex items-center justify-center space-x-3 select-none'>
                    <span>🎓</span>
                    <span>{t('education.title')}</span>
                  </span>
                </button>
              </Link>

              <Link href='/development'>
                <button
                  className='px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105'
                  style={{
                    borderColor: '#B09155',
                    backgroundColor: 'transparent'
                  }}
                >
                  <span className='flex items-center justify-center space-x-3 select-none'>
                    <span>&lt;/&gt;</span>
                    <span>{t('development.title')}</span>
                  </span>
                </button>
              </Link>
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
    <div className='min-h-screen relative overflow-hidden flex flex-col' style={{ backgroundColor: '#1a1a1a' }}>
      {/* Interactive Background with Large Logo */}
      <div className='absolute inset-0'>
        {/* Floating Geometric Shapes */}
        {floatingShapes.map((shape) => (
          <div
            key={shape.id}
            className='absolute opacity-10 select-none pointer-events-none will-change-transform'
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              transform: `translate3d(${(mousePosition.x - 50) * 0.01}px, ${(mousePosition.y - 50) * 0.01}px, 0) rotate(${shape.rotation + mousePosition.x * 0.2}deg)`,
              backgroundColor: '#B09155',
              borderRadius: shape.id % 3 === 0 ? '50%' : shape.id % 2 === 0 ? '0%' : '20%',
              transition: 'transform 0.2s ease-out',
            }}
          />
        ))}

        {/* Large background logo with morphing effect */}
        <div
          className='absolute inset-0 flex items-center justify-center will-change-transform'
          style={{
            transform: `translate3d(${(mousePosition.x - 50) * 0.2}px, ${(mousePosition.y - 50) * 0.2}px, 0) scale(${1 + Math.sin(animationTime * 0.0005) * 0.03})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <Image
            src={companyConfig.website.logo.logoGoldTransparent}
            alt={companyConfig.company.name}
            width={800}
            height={800}
            className='select-none pointer-events-none'
            style={{
              opacity: 0.06 + Math.sin(animationTime * 0.001) * 0.01,
              filter: `hue-rotate(${mousePosition.x * 0.2}deg)`,
            }}
            priority={false}
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

      {/* Header */}
      <header className='relative z-50 px-6 py-6'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <div
              className='transition-transform duration-300 ease-out relative'
              style={{
                transform: `translate(${getMagneticOffset(100, 50).x}px, ${getMagneticOffset(100, 50).y}px)`,
              }}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={50}
                height={50}
                className='transition-all duration-300 hover:scale-110 cursor-pointer select-none'
                style={{
                  transform: `rotate(${Math.sin(animationTime * 0.002) * 5}deg) scale(${1 + Math.sin(animationTime * 0.003) * 0.1})`,
                  filter: `drop-shadow(0 0 10px rgba(176, 145, 85, ${0.5 + Math.sin(animationTime * 0.004) * 0.3})) hue-rotate(${Math.sin(animationTime * 0.001) * 15}deg)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform += ' scale(1.2) rotate(15deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${Math.sin(animationTime * 0.002) * 5}deg) scale(${1 + Math.sin(animationTime * 0.003) * 0.1})`;
                }}
                draggable={false}
              />
              {/* Floating particles around logo */}
              <div
                className='absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 select-none pointer-events-none'
                style={{
                  top: '10%',
                  right: '10%',
                  transform: `translate(${Math.sin(animationTime * 0.005) * 3}px, ${Math.cos(animationTime * 0.005) * 3}px)`,
                }}
              />
              <div
                className='absolute w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-40 select-none pointer-events-none'
                style={{
                  bottom: '15%',
                  left: '15%',
                  transform: `translate(${Math.cos(animationTime * 0.007) * 2}px, ${Math.sin(animationTime * 0.007) * 2}px)`,
                }}
              />
            </div>
            <div className='relative'>
              <span
                className='text-2xl font-bold text-white cursor-pointer inline-block transition-all duration-300 hover:scale-105 select-none'
                style={{
                  transform: `translateY(${Math.sin(animationTime * 0.002) * 1}px)`,
                  textShadow: `0 0 15px rgba(176, 145, 85, ${0.4 + Math.sin(animationTime * 0.003) * 0.3})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#B09155';
                  e.currentTarget.style.textShadow = '0 0 25px rgba(176, 145, 85, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.textShadow = `0 0 15px rgba(176, 145, 85, ${0.4 + Math.sin(animationTime * 0.003) * 0.3})`;
                }}
              >
                {companyConfig.company.domain.split('').map((letter, index) => (
                  <span
                    key={index}
                    className='inline-block transition-all duration-200 select-none'
                    style={{
                      transform: `translateY(${Math.sin(animationTime * 0.004 + index * 0.5) * 1}px)`,
                      animationDelay: `${index * 100}ms`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.2)';
                      e.currentTarget.style.color = '#B09155';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateY(${Math.sin(animationTime * 0.004 + index * 0.5) * 1}px)`;
                      e.currentTarget.style.color = 'inherit';
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              {/* Subtle underline animation */}
              <div
                className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 select-none pointer-events-none'
                style={{
                  width: `${50 + Math.sin(animationTime * 0.003) * 30}%`,
                  transform: `translateX(${Math.sin(animationTime * 0.002) * 20}px)`,
                }}
              />
            </div>
          </div>
          <div className="relative z-50">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className='relative z-10 flex-1 flex items-center justify-center px-6'>
        <div className='text-center max-w-3xl'>
          {/* Logo with magnetic effect */}
          <div className='mb-8'>
            <div
              className='inline-block transition-transform duration-300 ease-out'
              style={{
                transform: `translate(${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).x}px, ${getMagneticOffset(windowSize.width / 2, windowSize.height / 2 - 100).y}px) scale(${1 + Math.sin(animationTime * 0.003) * 0.05})`,
              }}
            >
              <Image
                src={companyConfig.website.logo.logoGoldTransparent}
                alt={companyConfig.company.name}
                width={120}
                height={120}
                className='mx-auto transition-all duration-300 hover:scale-110 cursor-pointer select-none'
                style={{
                  filter: `drop-shadow(0 0 20px rgba(176, 145, 85, ${0.3 + Math.sin(animationTime * 0.002) * 0.2}))`,
                }}
                draggable={false}
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
              {t('tagline.weAre')} <span style={{ color: '#B09155' }}>{t('tagline.innovativeSolutions')}</span>
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

          {/* Main Buttons with magnetic attraction */}
          <div className='flex flex-col sm:flex-row gap-6 justify-center'>
            <Link href='/education'>
              <div
                className='transition-transform duration-300 ease-out'
                style={{
                  transform: `translate(${getMagneticOffset(windowSize.width / 2 - 100, windowSize.height / 2 + 100).x}px, ${getMagneticOffset(windowSize.width / 2 - 100, windowSize.height / 2 + 100).y}px)`,
                }}
              >
                <button
                  className='relative px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105 overflow-hidden group'
                  style={{
                    borderColor: '#B09155',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B09155';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(176, 145, 85, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Ripple effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 select-none pointer-events-none'></div>
                  <span className='relative flex items-center justify-center space-x-3 select-none'>
                    <span>🎓</span>
                    <span>{t('education.title')}</span>
                  </span>
                </button>
              </div>
            </Link>

            <Link href='/development'>
              <div
                className='transition-transform duration-300 ease-out'
                style={{
                  transform: `translate(${getMagneticOffset(windowSize.width / 2 + 100, windowSize.height / 2 + 100).x}px, ${getMagneticOffset(windowSize.width / 2 + 100, windowSize.height / 2 + 100).y}px)`,
                }}
              >
                <button
                  className='relative px-12 py-6 text-xl font-semibold text-white rounded-xl border-2 transition-all duration-300 hover:scale-105 overflow-hidden group'
                  style={{
                    borderColor: '#B09155',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B09155';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(176, 145, 85, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Ripple effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 select-none pointer-events-none'></div>
                  <span className='relative flex items-center justify-center space-x-3 select-none'>
                    <span>&lt;/&gt;</span>
                    <span>{t('development.title')}</span>
                  </span>
                </button>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
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
