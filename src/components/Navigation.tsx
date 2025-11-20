'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ClipboardCheck, Code2, Laptop, Menu, ShoppingCart, Smartphone, TestTube, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLocale, useTranslations } from '@/hooks/useTranslations';
import { Link, usePathname, useRouter } from '@/i18n/routing';

import LanguageSwitcher from './layout/LanguageSwitcher';
import LogoAndText from './layout/LogoAndText';

export default function Navigation({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [initialHashHandled, setInitialHashHandled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

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
          {
            label: t('serviceItems.webDevelopment'),
            href: '/sluzby/tvorba-web-stranok',
            icon: Laptop,
            description: locale === 'sk' ? 'Moderné a responzívne webové stránky' : 'Modern and responsive websites'
          },
          {
            label: t('serviceItems.ecommerce'),
            href: '/sluzby/tvorba-eshopu',
            icon: ShoppingCart,
            description: locale === 'sk' ? 'Komplexné e-commerce riešenia' : 'Complete e-commerce solutions'
          },
          {
            label: t('serviceItems.mobileApps'),
            href: '/sluzby/vyvoj-mobilnych-aplikacii',
            icon: Smartphone,
            description: locale === 'sk' ? 'iOS a Android aplikácie' : 'iOS and Android applications'
          },
          {
            label: t('serviceItems.customSoftware'),
            href: '/sluzby/softver-na-mieru',
            icon: Code2,
            description: locale === 'sk' ? 'Riešenia šité na mieru vašim potrebám' : 'Solutions tailored to your needs'
          },
          {
            label: locale === 'sk' ? 'Testovanie' : 'Testing',
            href: '/kontakt',
            icon: TestTube,
            description: locale === 'sk' ? 'Komplexné testovanie kvality softvéru' : 'Comprehensive software quality testing'
          },
          {
            label: locale === 'sk' ? 'Tech Audit' : 'Tech Audit',
            href: '/kontakt',
            icon: ClipboardCheck,
            description: locale === 'sk' ? 'Odborný audit vašich technológií' : 'Professional technology audit'
          },
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
      className={`sticky top-0 left-0 right-0 z-[100] border-b transition-all duration-300 ${
        transparent && !isScrolled && !isMenuOpen
          ? 'bg-transparent border-transparent'
          : 'bg-black/95 backdrop-blur-xl border-white/10'
      }`}
      style={{ position: 'sticky', top: 0 }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='w-full px-0 relative'>
        <div className='grid grid-cols-[1fr_auto_1fr] items-center h-20 px-0'>
          {/* Left Side - Logo & Company Name (absolutely flush left) */}
          <div className='flex items-center space-x-3 pl-6 justify-start'>
            <motion.div className='flex-shrink-0' whileHover={{ scale: 1.05 }}>
              <LogoAndText
                onClick={() => {
                  if (isHomePage) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Clear hash and trigger event for LandingPage transition
                    window.history.pushState("", document.title, window.location.pathname + window.location.search);
                    window.dispatchEvent(new Event('hashchange'));
                  } else {
                    router.push('/');
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          <div className='hidden xl:flex justify-center'>
            <div className='flex items-center space-x-2 xl:space-x-4 whitespace-nowrap'>
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(link.section);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={index}
                      className="relative group h-full flex items-center"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
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
          <div className='flex items-center pr-6 space-x-4 justify-end'>
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

        {/* Mega Dropdown Menu - Positioned Fixed to viewport for full width */}
        <AnimatePresence>
          {isServicesOpen && navLinks.find(l => l.hasDropdown) && (
            <motion.div
              className='fixed left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-50 shadow-2xl'
              style={{ top: '80px' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className='max-w-7xl mx-auto px-6 py-10'>
                <div className='grid grid-cols-3 gap-6 w-full'>
                  {navLinks.find(l => l.hasDropdown)?.dropdownItems?.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={itemIndex}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        href={item.href as any}
                        className='group relative p-7 rounded-xl bg-gradient-to-br from-white/5 to-white/0 hover:from-primary/20 hover:to-primary/5 border border-white/10 hover:border-primary/50 transition-all duration-300 min-h-[160px]'
                        onClick={() => {
                          setIsServicesOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        <div className='flex items-start gap-5'>
                          <div className='p-3.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300'>
                            {Icon && <Icon className='w-7 h-7 text-primary group-hover:text-white transition-colors duration-300' />}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2.5'>
                              <h3 className='text-xl font-bold text-white group-hover:text-primary transition-colors duration-300'>
                                {item.label}
                              </h3>
                              <ArrowRight className='w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300' />
                            </div>
                            <p className='text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed'>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                                className='w-full bg-white/5 rounded-lg overflow-hidden mt-2'
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {link.dropdownItems?.map((item, itemIndex) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={itemIndex}
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      href={item.href as any}
                                      className='flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-primary hover:text-white transition-colors duration-200 border-b border-white/5 last:border-b-0'
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsServicesOpen(false);
                                      }}
                                    >
                                      {Icon && <Icon className='w-5 h-5 flex-shrink-0' />}
                                      <div className='flex-1 text-left'>
                                        <div className='font-semibold text-base'>{item.label}</div>
                                        <div className='text-xs text-gray-400 mt-1'>{item.description}</div>
                                      </div>
                                      <ArrowRight className='w-4 h-4 flex-shrink-0' />
                                    </Link>
                                  );
                                })}
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
