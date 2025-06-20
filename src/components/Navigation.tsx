'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const pathname = usePathname();

  // Check if we're on a subpage (not the main landing page)
  const isSubpage =
    pathname.includes('/development') || pathname.includes('/education');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation loop for smooth effects
  useEffect(() => {
    if (!mounted) return;

    let animationId: number;
    let lastTime = Date.now();

    const updateAnimationTime = () => {
      const now = Date.now();
      // Only update if enough time has passed (60fps throttling)
      if (now - lastTime >= 16) {
        setAnimationTime(now);
        lastTime = now;
      }
      animationId = requestAnimationFrame(updateAnimationTime);
    };

    animationId = requestAnimationFrame(updateAnimationTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mounted]);

  // Mouse tracking for magnetic effects
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#services', label: t('services') },
    { href: '#portfolio', label: t('portfolio') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <motion.nav
      className='sticky top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='w-full px-0 relative'>
        {/* Language Switcher - top right corner */}
        <div className='absolute top-3 right-4 z-10'>
          <LanguageSwitcher />
        </div>

        <div className='flex items-center justify-between h-20 px-0'>
          {/* Left Side - Logo & Company Name (absolutely flush left) */}
          <div className='flex items-center space-x-3 pl-8'>
            <motion.div className='flex-shrink-0' whileHover={{ scale: 1.05 }}>
              <Link href='/' className='flex items-center space-x-3'>
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
            </Link>
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          <div className='hidden md:flex absolute left-1/2 transform -translate-x-1/2'>
            <div className='flex items-center space-x-8'>
              {navLinks.map((link, index) => {
                const isRoute = link.href.startsWith('/');
                const Component = isRoute ? Link : motion.a;
                const props = isRoute
                  ? { href: link.href }
                  : { href: link.href };

                return (
                  <Component
                    key={index}
                    {...props}
                    className='text-gray-300 hover:text-[#b09155] px-3 py-2 text-lg font-bold transition-all duration-300 relative group'
                    data-cursor='link'
                  >
                    {link.label}
                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#b09155] to-[#d4af37] group-hover:w-full transition-all duration-300'></span>
                  </Component>
                );
              })}
            </div>
          </div>

          {/* Right Side - Contact Button & CTA Button */}
          <div className='hidden md:flex items-center space-x-4 pr-32'>
            <motion.a
              href='#contact'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='border border-[#b09155] text-[#b09155] hover:bg-[#b09155] hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300'
              data-cursor='button'
            >
              Kontaktujte nás
            </motion.a>
            {!isSubpage && (
              <motion.a
                href='#contact'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-[#b09155] to-[#9a7f4b] hover:from-[#9a7f4b] hover:to-[#b09155] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300'
                data-cursor='button'
              >
                {t('getStarted')}
              </motion.a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <motion.button
              onClick={toggleMenu}
              className='text-gray-300 hover:text-white p-2'
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10'
          >
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {/* Navigation Links for mobile */}
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className='text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300'
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* CTA Button for main page only */}
              {!isSubpage && (
                <motion.a
                  href='#contact'
                  className='bg-gradient-to-r from-[#b09155] to-[#9a7f4b] text-white block px-3 py-2 text-base font-medium rounded-lg mt-4'
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  {t('getStarted')}
                </motion.a>
              )}

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className='px-3 py-2 border-t border-gray-600 mt-2 pt-2'
              >
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
