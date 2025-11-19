'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocale, useTranslations } from '@/hooks/useTranslations';
import { Link, usePathname, useRouter } from '@/i18n/routing';

import LanguageSwitcher from './layout/LanguageSwitcher';
import LogoAndText from './layout/LogoAndText';

export default function Navigation() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [initialHashHandled, setInitialHashHandled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = useMemo(() => {
    // Use dynamic section names based on language
    const sectionMap = getSectionMappings(locale);

    return [
      { 
        href: isHomePage ? `#${sectionMap.development}` : { pathname: '/', hash: sectionMap.development }, 
        label: t('development'), 
        section: sectionMap.development, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.about}` : { pathname: '/', hash: sectionMap.about }, 
        label: t('about'), 
        section: sectionMap.about, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.services}` : { pathname: '/', hash: sectionMap.services }, 
        label: t('services'), 
        section: sectionMap.services, 
        isHash: isHomePage,
        hasDropdown: true,
        dropdownItems: [
          { label: t('serviceItems.webDevelopment'), href: '/sluzby/tvorba-web-stranok' },
          { label: t('serviceItems.ecommerce'), href: '/sluzby/tvorba-eshopu' },
          { label: t('serviceItems.mobileApps'), href: '/sluzby/vyvoj-mobilnych-aplikacii' },
          { label: t('serviceItems.customSoftware'), href: '/sluzby/softver-na-mieru' },
        ]
      },
      { 
        href: isHomePage ? `#${sectionMap.portfolio}` : { pathname: '/', hash: sectionMap.portfolio }, 
        label: t('portfolio'), 
        section: sectionMap.portfolio, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.reviews}` : { pathname: '/', hash: sectionMap.reviews }, 
        label: t('reviews'), 
        section: sectionMap.reviews, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.faq}` : { pathname: '/', hash: sectionMap.faq }, 
        label: t('faq'), 
        section: sectionMap.faq, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.hiring}` : { pathname: '/', hash: sectionMap.hiring }, 
        label: t('hiring'), 
        section: sectionMap.hiring, 
        isHash: isHomePage 
      },
      { 
        href: isHomePage ? `#${sectionMap.contact}` : { pathname: '/', hash: sectionMap.contact }, 
        label: t('contact'), 
        section: sectionMap.contact, 
        isHash: isHomePage 
      },
    ];
  }, [t, locale, getSectionMappings, isHomePage]);

  // Scroll tracking effect to highlight active section
  useEffect(() => {
    if (!mounted) return;

    // Check if we're on a page route first
    const checkActivePage = () => {
      // If we're on the main page, use scroll-based detection
      if (isHomePage) {
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

    if (isHomePage) {
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
  }, [mounted, activeSection, pathname, locale, getSectionMappings, initialHashHandled, isHomePage]);

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
                  if (isHomePage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.history.pushState(null, '', window.location.pathname);
                  } else {
                    router.push('/');
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          <div className='hidden xl:flex absolute left-1/2 transform -translate-x-1/2'>
            <div className='flex items-center space-x-2 xl:space-x-4 whitespace-nowrap'>
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(link.section);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <motion.div
                        className={`px-1.5 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-300 relative select-none whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                          isActive || isServicesOpen
                            ? 'text-primary'
                            : 'text-gray-300 hover:text-primary'
                        }`}
                      >
                        <span onClick={() => {
                          if (isHomePage) {
                            const element = document.getElementById(link.section);
                            if (element) {
                              const navHeight = 80;
                              const elementPosition = element.offsetTop;
                              const offsetPosition = elementPosition - navHeight;

                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                            }
                          } else {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            router.push(link.href as any);
                          }
                        }}>
                          {link.label}
                        </span>
                        <ChevronDown className='w-4 h-4' />
                      </motion.div>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isServicesOpen && (
                          <motion.div
                            className='absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-black rounded-lg shadow-lg overflow-hidden z-50'
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {link.dropdownItems?.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                href={item.href as any}
                                className='block px-4 py-2 text-sm text-gray-300 hover:bg-primary hover:text-white transition-colors duration-200'
                                onClick={() => {
                                  // Close menu on item click
                                  setIsMenuOpen(false);
                                }}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    href={link.href as any}
                    className={`px-1.5 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-300 relative select-none whitespace-nowrap ${
                      isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
                    }`}
                    onClick={(e) => {
                      if (isHomePage && link.isHash) {
                        e.preventDefault();
                        const element = document.getElementById(link.section);
                        if (element) {
                          const navHeight = 80;
                          const elementPosition = element.offsetTop;
                          const offsetPosition = elementPosition - navHeight;

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side - Language Switcher & Menu Toggle */}
          <div className='flex items-center pr-6 space-x-4'>
            {/* Language Switcher - Always visible */}
            <div className='hidden lg:flex'>
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Toggle */}
            <div className='flex lg:hidden'>
              <button
                onClick={toggleMenu}
                className='p-2 rounded-md text-gray-300 hover:bg-primary hover:text-white transition-all duration-200'
              >
                {isMenuOpen ? (
                  <X className='w-6 h-6' />
                ) : (
                  <Menu className='w-6 h-6' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Full Width Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className='fixed inset-0 z-50 bg-black bg-opacity-90 overflow-y-auto'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex flex-col items-center pt-20 pb-10'>
                {/* Close Button (Top Right) */}
                <div className='absolute top-4 right-4'>
                  <button
                    onClick={toggleMenu}
                    className='p-2 rounded-md text-gray-300 hover:bg-primary hover:text-white transition-all duration-200'
                  >
                    <X className='w-6 h-6' />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className='flex flex-col items-center space-y-4'>
                  {navLinks.map((link, index) => {
                    const isActive = isLinkActive(link.section);

                    if (link.hasDropdown) {
                      return (
                        <div
                          key={index}
                          className="relative group w-full flex flex-col items-center"
                        >
                          <motion.div
                            className={`px-4 py-3 text-lg font-semibold transition-all duration-300 relative select-none flex items-center justify-center gap-2 w-full cursor-pointer ${
                              isActive || isServicesOpen
                                ? 'text-primary'
                                : 'text-gray-300 hover:text-primary'
                            }`}
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                          >
                            <span>{link.label}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                          </motion.div>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {isServicesOpen && (
                              <motion.div
                                className='w-full bg-white/5 rounded-lg overflow-hidden'
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {link.dropdownItems?.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    href={item.href as any}
                                    className='block px-4 py-3 text-base text-center text-gray-300 hover:bg-primary hover:text-white transition-colors duration-200'
                                    onClick={() => {
                                      // Close menu on item click
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={index}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        href={link.href as any}
                        className={`px-4 py-3 text-lg font-semibold transition-all duration-300 relative select-none w-full text-center ${
                          isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
                        }`}
                        onClick={(e) => {
                          if (isHomePage && link.isHash) {
                            e.preventDefault();
                            const element = document.getElementById(link.section);
                            if (element) {
                              const navHeight = 80;
                              const elementPosition = element.offsetTop;
                              const offsetPosition = elementPosition - navHeight;

                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                              setIsMenuOpen(false);
                            }
                          } else {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Language Switcher - Mobile */}
                <div className='flex lg:hidden mt-4'>
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
