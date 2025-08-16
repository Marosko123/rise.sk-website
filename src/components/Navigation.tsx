'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

import { GameCounter } from './InteractiveRiseIcons';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const tServices = useTranslations('servicesEnhanced');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  // Check if we're on a subpage (not the main landing page)
  const isSubpage =
    pathname.includes('/development');

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
      // Reduce frequency significantly to improve performance (20fps)
      if (now - lastTime >= 50) {
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

  // Mouse tracking for magnetic effects (disabled for performance)
  // useEffect(() => {
  //   if (!mounted) return;

  //   const handleMouseMove = (e: MouseEvent) => {
  //     setCursorPosition({ x: e.clientX, y: e.clientY });
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, [mounted]);

  // Magnetic effect disabled for performance
  // const getMagneticOffset = (elementX: number, elementY: number, strength: number = 30) => {
  //   return { x: 0, y: 0 };
  // };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = useMemo(() => {
    // Check current page context to determine navigation behavior
    const getCurrentPageType = () => {
      if (pathname.includes('/development') || pathname.includes('/vyvoj')) {
        return 'development'; // Has sections
      }
      return 'main'; // No sections, navigate to pages
    };

    const pageType = getCurrentPageType();

    if (pageType === 'development') {
      // On development page, link to sections within the page
      return [
        { href: '#about', label: t('about'), section: 'about' },
        { href: '#services', label: t('services'), section: 'services' },
        { href: '#portfolio', label: t('portfolio'), section: 'portfolio' },
        { href: '#reviews', label: t('reviews'), section: 'reviews' },
        { href: '#hiring', label: t('hiring'), section: 'hiring' },
        { href: '#contact', label: t('contact'), section: 'contact' },
      ];
    } else {

      return [
        { href: '/development#about', label: t('about'), section: 'about' },
        { href: '/development#services', label: t('services'), section: 'services' },
        { href: '/development#portfolio', label: t('portfolio'), section: 'portfolio' },
        { href: '/development#reviews', label: t('reviews'), section: 'reviews' },
        { href: '/development#hiring', label: t('hiring'), section: 'hiring' },
        { href: '/development#contact', label: t('contact'), section: 'contact' },
      ];
    }
  }, [t, pathname]);

  // Scroll tracking effect to highlight active section
  useEffect(() => {
    if (!mounted) return;

    // Check if we're on a page route first
    const checkActivePage = () => {
      const path = pathname.toLowerCase();

      if (path.includes('/development') || path.includes('/vyvoj')) {
        // On development page, use scroll-based detection for sections
        handleScrollBasedSection();
        return;
      }

      // If we're on the main page, use scroll-based detection
      if (path === '/' || path.match(/^\/[a-z]{2}$/)) {
        handleScrollBasedSection();
        return;
      }

      // Default: no active section
      setActiveSection('');
    };

    const handleScrollBasedSection = () => {
      const sections = ['about', 'services', 'portfolio', 'reviews', 'hiring', 'contact'];
      const sectionElements = sections.map(section => document.getElementById(section));

      // Find which section is currently in view
      let currentSection = '';
      const scrollPosition = window.scrollY + 100; // Offset for header height

      sectionElements.forEach((element, index) => {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = sections[index];
          }
        }
      });

      // Update active section
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Initial check
    checkActivePage();

    // For pages with sections, add scroll listener
    const hasScrollableSections = pathname === '/' || pathname.match(/^\/[a-z]{2}$/) ||
                                  pathname.includes('/development') || pathname.includes('/vyvoj');

    if (hasScrollableSections) {
      window.addEventListener('scroll', handleScrollBasedSection);

      return () => window.removeEventListener('scroll', handleScrollBasedSection);
    }
  }, [mounted, activeSection, pathname]);

  // Function to check if a nav link is active
  const isLinkActive = (section: string) => {
    return activeSection === section;
  };

  return (
    <motion.nav
      className='sticky top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='w-full px-0 relative'>
        <div className='flex items-center justify-between h-20 px-0'>
          {/* Left Side - Logo & Company Name (absolutely flush left) */}
          <div className='flex items-center space-x-3 pl-6'>
            <motion.div className='flex-shrink-0' whileHover={{ scale: 1.05 }}>
              <Link href='/' className='flex items-center space-x-3'>
              <div
                className='transition-transform duration-300 ease-out relative'
              >
                <Image
                  src={companyConfig.website.logo.logoGoldTransparent}
                  alt={companyConfig.company.name}
                  width={50}
                  height={50}
                  priority
                  className='transition-all duration-300 hover:scale-110 cursor-pointer select-none'
                  style={mounted ? {
                    transform: `rotate(${Math.sin(animationTime * 0.001) * 2}deg) scale(${1 + Math.sin(animationTime * 0.0015) * 0.05})`,
                    filter: `drop-shadow(0 0 10px rgba(176, 145, 85, 0.5))`,
                  } : {
                    transform: 'rotate(0deg) scale(1)',
                    filter: 'drop-shadow(0 0 10px rgba(176, 145, 85, 0.5))',
                  }}
                  onMouseEnter={(e) => {
                    if (mounted) {
                      e.currentTarget.style.transform += ' scale(1.2) rotate(15deg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mounted) {
                      e.currentTarget.style.transform = `rotate(${Math.sin(animationTime * 0.001) * 2}deg) scale(${1 + Math.sin(animationTime * 0.0015) * 0.05})`;
                    }
                  }}
                  draggable={false}
                />
                {/* Simplified floating elements */}
                {mounted && (
                  <>
                    <div
                      className='absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40 select-none pointer-events-none'
                      style={{
                        top: '10%',
                        right: '10%',
                        transform: `translate(${Math.sin(animationTime * 0.002) * 1.5}px, ${Math.cos(animationTime * 0.002) * 1.5}px)`,
                      }}
                    />
                  </>
                )}
              </div>
              <div className='relative'>
                <span
                  className='text-2xl font-bold text-white cursor-pointer inline-block transition-all duration-300 hover:scale-105 select-none'
                  style={mounted ? {
                    textShadow: `0 0 15px rgba(176, 145, 85, 0.4)`,
                  } : {}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B09155';
                    e.currentTarget.style.textShadow = '0 0 25px rgba(176, 145, 85, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    if (mounted) {
                      e.currentTarget.style.textShadow = `0 0 15px rgba(176, 145, 85, 0.4)`;
                    }
                  }}
                >
                  {companyConfig.company.domain.split('').map((letter, index) => (
                    <span
                      key={index}
                      className='inline-block transition-all duration-200 select-none'
                      style={mounted ? {
                        transform: `translateY(${Math.sin(animationTime * 0.004 + index * 0.5) * 1}px)`,
                        animationDelay: `${index * 100}ms`,
                      } : {}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.2)';
                        e.currentTarget.style.color = '#B09155';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.color = 'inherit';
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
                {/* Static underline */}
                {mounted && (
                  <div
                    className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 select-none pointer-events-none'
                    style={{
                      width: '60%',
                    }}
                  />
                )}
              </div>
            </Link>
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          <div className='hidden md:flex absolute left-1/2 transform -translate-x-1/2'>
            <div className='flex items-center space-x-6'>
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(link.section);

                return (
                  <motion.div
                    key={index}
                    className={`px-2 py-2 text-base font-bold transition-all duration-300 relative group select-none ${
                      isActive
                        ? 'text-[#b09155]'
                        : 'text-gray-300 hover:text-[#b09155]'
                    }`}
                    data-cursor='link'
                  >
                    {link.href.includes('#') ? (
                      <a href={link.href} className="block w-full h-full">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href as '/development'} className="block w-full h-full">
                        {link.label}
                      </Link>
                    )}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#b09155] to-[#d4af37] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Game Counter, Language Switcher, Contact Button & CTA Button */}
          <div className='hidden md:flex items-center space-x-3 pr-6'>
            {/* Game Counter */}
            <GameCounter />

            {/* Language Switcher - vertically centered */}
            <div className='flex items-center'>
              <LanguageSwitcher />
            </div>

            <motion.a
              href='#contact'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='border border-[#b09155] text-[#b09155] hover:bg-[#b09155] hover:text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 select-none'
              data-cursor='button'
            >
              {tServices('buttons.contact')}
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden pr-4'>
            <motion.button
              onClick={toggleMenu}
              className='text-gray-300 hover:text-white p-2 select-none'
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
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(link.section);

                return (
                  <motion.div
                    key={index}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-300 select-none ${
                      isActive
                        ? 'text-[#b09155] bg-[#b09155]/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.href.includes('#') ? (
                      <a href={link.href} className="block w-full h-full">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href as '/development'} className="block w-full h-full">
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              {/* CTA Button for main page only */}
              {!isSubpage && (
                <motion.a
                  href='#contact'
                  className='bg-gradient-to-r from-[#b09155] to-[#9a7f4b] text-white block px-3 py-2 text-base font-medium rounded-lg mt-4 select-none'
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
                className='px-3 py-3 border-t border-gray-600 mt-4 pt-4'
              >
                <div className='text-gray-400 text-sm font-medium mb-2'>Language</div>
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
