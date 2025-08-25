'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/hooks/useTranslations';

import { GameCounter } from './InteractiveRiseIcons';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from './LocalizedLink';
import LogoAndText from './LogoAndText';

export default function Navigation() {
  const t = useTranslations('navigation');
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [initialHashHandled, setInitialHashHandled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic section mappings based on language
  const getSectionMappings = useCallback((lang: string) => {
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
  }, []);

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
    // Use dynamic section names based on language
    const sectionMap = getSectionMappings(locale);

    return [
      { href: `#${sectionMap.development}`, label: t('development'), section: sectionMap.development },
      { href: `#${sectionMap.about}`, label: t('about'), section: sectionMap.about },
      { href: `#${sectionMap.services}`, label: t('services'), section: sectionMap.services },
      { href: `#${sectionMap.portfolio}`, label: t('portfolio'), section: sectionMap.portfolio },
      { href: `#${sectionMap.reviews}`, label: t('reviews'), section: sectionMap.reviews },
      { href: `#${sectionMap.faq}`, label: t('faq'), section: sectionMap.faq },
      { href: `#${sectionMap.hiring}`, label: t('hiring'), section: sectionMap.hiring },
      { href: `#${sectionMap.contact}`, label: t('contact'), section: sectionMap.contact },
    ];
  }, [t, locale, getSectionMappings]);

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
      const sectionMap = getSectionMappings(locale);
      const sections = [
        sectionMap.development,
        sectionMap.about,
        sectionMap.services,
        sectionMap.portfolio,
        sectionMap.reviews,
        sectionMap.faq,
        sectionMap.hiring,
        sectionMap.contact
      ];
      const sectionElements = sections.map(section => document.getElementById(section));

      // Find which section is currently in view
      let currentSection = '';
      // Use navigation bar height (80px) plus small buffer for detection
      const navOffset = 100;
      const scrollPosition = window.scrollY + navOffset;

      // Check if we're at the very top (landing area)
      if (window.scrollY < 50) {
        // Only default to development if no initial hash was provided
        if (initialHashHandled) {
          currentSection = sectionMap.development;
        }
      } else {
        sectionElements.forEach((element, index) => {
          if (element) {
            const { offsetTop, offsetHeight } = element;

            // Better section detection: section is active when we're past its start
            // and before the next section's start
            if (scrollPosition >= offsetTop - 50 && scrollPosition < offsetTop + offsetHeight - 50) {
              currentSection = sections[index];
            }
          }
        });
      }

      // Update active section and URL hash
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);

        // Update URL hash without triggering page reload (only if initial hash has been handled)
        if (currentSection && window.location.hash !== `#${currentSection}` && initialHashHandled) {
          window.history.replaceState(null, '', `#${currentSection}`);
        }
      }
    };

    // Initial check
    checkActivePage();

    // Add hash change listener to re-enable scroll detection
    const handleHashChange = () => {
      checkActivePage();
      // Mark that we've handled the initial hash
      if (!initialHashHandled) {
        setTimeout(() => setInitialHashHandled(true), 1000); // Allow 1 second for scrolling
      }
    };

    // For main page with hash (full website mode), add scroll listener
    const hasHash = window.location.hash.length > 0;
    const hasScrollableSections = (pathname === '/' || pathname.match(/^\/[a-z]{2}$/)) && hasHash;

    if (hasScrollableSections) {
      window.addEventListener('scroll', handleScrollBasedSection);

      // Handle initial hash if not yet handled
      if (!initialHashHandled && hasHash) {
        setTimeout(() => setInitialHashHandled(true), 1000); // Allow 1 second for initial scrolling
      }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScrollBasedSection);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [mounted, activeSection, pathname, locale, getSectionMappings, initialHashHandled]);

  // Function to check if a nav link is active
  const isLinkActive = (section: string) => {
    return activeSection === section;
  };

  return (
    <motion.nav
      className='sticky top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300'
      style={{ position: 'sticky', top: 0 }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='w-full px-0 relative'>
        <div className='flex items-center justify-between h-20 px-0'>
          {/* Left Side - Logo & Company Name (absolutely flush left) */}
          <div className='flex items-center space-x-3 pl-6'>
            <motion.div className='flex-shrink-0' whileHover={{ scale: 1.05 }}>
              <LogoAndText
                onClick={() => {
                  // Clear hash to return to landing page
                  window.history.pushState(null, '', '/');
                  // Trigger a page reload to ensure clean state
                  window.location.reload();
                }}
              />
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          <div className='hidden md:flex absolute left-1/2 transform -translate-x-1/2'>
            <div className='flex items-center space-x-3 xl:space-x-5 whitespace-nowrap'>
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(link.section);

                return (
                  <motion.div
                    key={index}
                    className={`px-1 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-300 relative group select-none whitespace-nowrap ${
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
              href={`#${getSectionMappings(locale).contact}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='border border-[#b09155] text-[#b09155] hover:bg-[#b09155] hover:text-white px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 select-none'
              data-cursor='button'
            >
              {t('getStarted')}
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

              {/* CTA Button - always show */}
              <motion.a
                href={`#${getSectionMappings(locale).contact}`}
                className='bg-gradient-to-r from-[#b09155] to-[#9a7f4b] text-white block px-3 py-2 text-base font-medium rounded-lg mt-4 select-none'
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                {t('getStarted')}
              </motion.a>

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
