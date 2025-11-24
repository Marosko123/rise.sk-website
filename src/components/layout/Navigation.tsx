'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Brain, ChevronDown, Code2, Laptop, LucideIcon, Menu, ShoppingCart, Smartphone, User, Users, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useThrottledCallback } from 'use-debounce';

import { Button } from '@/components/ui/Button';
import { teamMembers } from '@/data/team';
import { AppPathnames, Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

import LanguageSwitcher from './LanguageSwitcher';
import LogoAndText from './LogoAndText';

type NavLink = {
  href: AppPathnames | { pathname: AppPathnames; hash: string };
  label: string;
  section: string;
  isHash: boolean;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: AppPathnames | { pathname: AppPathnames; hash: string }; icon?: LucideIcon; description?: string }[];
};

interface NavigationProps {
  alternateLinks?: Record<string, string>;
  transparent?: boolean;
  hideLinks?: boolean;
}

export default function Navigation({ alternateLinks, transparent, hideLinks }: NavigationProps) {
  const t = useTranslations('navigation');
  const tMembers = useTranslations('team.members');
  const tTeam = useTranslations('team');
  const locale = useLocale();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [initialHashHandled, setInitialHashHandled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const prefetchRoute = (href: AppPathnames | { pathname: AppPathnames; hash: string }) => {
    if (typeof href === 'string') {
      router.prefetch(href);
    } else if (typeof href === 'object' && href.pathname) {
      router.prefetch(href.pathname);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const sectionMap = getSectionMappings(locale);

    if (isHomePage) {
      // On homepage, scroll to locale-specific contact section (kontakt/contact)
      const element = document.getElementById(sectionMap.contact);
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
      // On other pages, navigate to homepage with locale-specific hash
      setIsMenuOpen(false);
      router.push(`/#${sectionMap.contact}` as AppPathnames);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Dynamic section mappings based on language
  const getSectionMappings = useCallback((lang: string) => {
    if (lang === 'sk') {
      return {
        development: 'vyvoj',
        about: 'o-nas',
        services: 'sluzby',
        portfolio: 'portfolio',
        reviews: 'recenzie',
        contact: 'kontakt'
      };
    } else {
      return {
        development: 'development',
        about: 'about',
        services: 'services',
        portfolio: 'portfolio',
        reviews: 'reviews',
        contact: 'contact'
      };
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = useMemo<NavLink[]>(() => {
    // Use dynamic section names based on language
    const sectionMap = getSectionMappings(locale);

    return [
      {
        href: '/vyvoj' as AppPathnames,
        label: t('development'),
        section: sectionMap.development,
        isHash: false
      },
      {
        href: '/o-nas' as AppPathnames,
        label: t('about'),
        section: sectionMap.about,
        isHash: false
      },
      {
        href: '/sluzby' as AppPathnames,
        label: t('services'),
        section: sectionMap.services,
        isHash: false,
        hasDropdown: true,
        dropdownItems: [
          {
            label: t('serviceItems.webDevelopment'),
            href: '/sluzby/tvorba-web-stranok' as AppPathnames,
            icon: Laptop,
            description: locale === 'sk' ? 'Moderné a responzívne webové stránky' : 'Modern and responsive websites'
          },
          {
            label: t('serviceItems.ecommerce'),
            href: '/sluzby/tvorba-eshopu' as AppPathnames,
            icon: ShoppingCart,
            description: locale === 'sk' ? 'Komplexné e-commerce riešenia' : 'Complete e-commerce solutions'
          },
          {
            label: t('serviceItems.mobileApps'),
            href: '/sluzby/vyvoj-mobilnych-aplikacii' as AppPathnames,
            icon: Smartphone,
            description: locale === 'sk' ? 'iOS a Android aplikácie' : 'iOS and Android applications'
          },
          {
            label: t('serviceItems.customSoftware'),
            href: '/sluzby/softver-na-mieru' as AppPathnames,
            icon: Code2,
            description: locale === 'sk' ? 'Riešenia šité na mieru vašim potrebám' : 'Solutions tailored to your needs'
          },
          {
            label: t('serviceItems.ai'),
            href: '/sluzby/ai-automatizacia' as AppPathnames,
            icon: Brain,
            description: locale === 'sk' ? 'Optimalizácia procesov a školenia' : 'Process optimization and training'
          },
          {
            label: t('serviceItems.outsourcing'),
            href: '/sluzby/it-outsourcing' as AppPathnames,
            icon: Users,
            description: locale === 'sk' ? 'Prenájom vývojárskych tímov' : 'Dedicated development teams'
          },
        ]
      },
      {
        href: '/portfolio' as AppPathnames,
        label: t('portfolio'),
        section: sectionMap.portfolio,
        isHash: false
      },
      {
        href: '/recenzie' as AppPathnames,
        label: t('reviews'),
        section: sectionMap.reviews,
        isHash: false
      },
      {
        href: '/team' as AppPathnames,
        label: t('team'),
        section: 'team',
        isHash: false,
        hasDropdown: true,
        dropdownItems: [
          ...teamMembers.map(member => ({
            label: member.name,
            href: { pathname: '/team' as AppPathnames, hash: member.id },
            icon: User,
            description: tMembers(`${member.id}.role`)
          })),
          {
            label: tTeam('joinUs.title'),
            href: { pathname: '/team' as AppPathnames, hash: 'join-us' },
            icon: Users,
            description: tTeam('joinUs.subtitle')
          }
        ]
      },
      {
        href: '/blog' as AppPathnames,
        label: t('blog'),
        section: 'blog',
        isHash: false
      },
      {
        href: '/kontakt' as AppPathnames,
        label: t('contact'),
        section: sectionMap.contact,
        isHash: false
      },
    ];
  }, [t, tMembers, tTeam, locale, getSectionMappings]);

    const handleScrollBasedSection = useThrottledCallback(() => {
      const sectionMap = getSectionMappings(locale);
      const sections = [
        sectionMap.development,
        sectionMap.about,
        sectionMap.services,
        sectionMap.portfolio,
        sectionMap.reviews,
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
    }, 100);

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
  }, [mounted, activeSection, pathname, locale, getSectionMappings, initialHashHandled, isHomePage, handleScrollBasedSection]);

  // Function to check if a nav link is active
  const isLinkActive = (link: NavLink) => {
    // Check if we are on the specific page
    if (typeof link.href === 'string') {
        // Exact match
        if (pathname === link.href) return true;

        // Handle sub-routes (e.g. /sluzby/...)
        // But exclude root '/' to avoid matching everything
        if (link.href !== '/' && pathname.startsWith(link.href)) return true;
    }

    // Check scroll spy on homepage
    if (isHomePage && activeSection === link.section) {
        return true;
    }

    return false;
  };



  return (
    <>
    <motion.nav
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        (transparent && !isScrolled)
          ? 'bg-transparent border-transparent'
          : 'bg-black/95 backdrop-blur-xl border-b border-white/10'
      }`}
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
                    if (window.location.hash) {
                      // Clear hash to trigger Landing Page transition
                      window.history.pushState("", document.title, window.location.pathname + window.location.search);
                      // Dispatch hashchange event manually to notify LandingPage
                      window.dispatchEvent(new Event('hashchange'));
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    router.push('/');
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Navigation Links - Center */}
          {!hideLinks && (
            <div className='hidden lg:flex'>
              <div className='flex items-center space-x-2 xl:space-x-4 whitespace-nowrap'>
                {navLinks.map((link, index) => {
                  const isActive = isLinkActive(link);

                  if (link.hasDropdown) {
                    return (
                      <div
                        key={index}
                        className="relative group"
                        onMouseEnter={() => {
                          setActiveDropdown(link.section);
                          prefetchRoute(link.href);
                        }}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <motion.div
                          className={`px-1.5 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-300 relative select-none whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                            isActive || activeDropdown === link.section
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
                              if (typeof link.href === 'object' && 'pathname' in link.href) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                router.push(`${link.href.pathname}#${link.href.hash}` as any);
                              } else {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                router.push(link.href as any);
                              }
                            }
                          }}>
                            {link.label}
                          </span>
                          <ChevronDown className='w-4 h-4' />
                        </motion.div>

                        {/* Simple Dropdown Menu */}
                        <AnimatePresence>
                          {activeDropdown === link.section && (
                            <motion.div
                              className='absolute top-full left-0 pt-5 w-80 z-50'
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.2 }}
                              onMouseLeave={() => setActiveDropdown(null)}
                            >
                              <div className='bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden'>
                                <div className='py-2'>
                                {link.dropdownItems?.map((item, itemIndex) => {
                                  const Icon = item.icon;
                                  return (
                                    <Link
                                      key={itemIndex}
                                      href={item.href}
                                      className='flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors duration-200 group/item'
                                      onMouseEnter={() => prefetchRoute(item.href)}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsMenuOpen(false);
                                      }}
                                    >
                                      <div className='p-2 rounded-lg bg-white/5 group-hover/item:bg-primary/20 transition-colors duration-200'>
                                        {Icon && <Icon className='w-5 h-5 text-gray-300 group-hover/item:text-primary transition-colors duration-200' />}
                                      </div>
                                      <div className='flex-1'>
                                        <div className='text-base font-semibold text-gray-200 group-hover/item:text-white transition-colors duration-200'>
                                          {item.label}
                                        </div>
                                      </div>
                                      <ArrowRight className='w-4 h-4 text-gray-600 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all duration-200' />
                                    </Link>
                                  );
                                })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={index}
                      href={link.href}
                      className={`px-1.5 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-300 relative select-none whitespace-nowrap ${
                        isActive ? 'text-primary' : 'text-gray-300 hover:text-primary'
                      }`}
                      onMouseEnter={() => prefetchRoute(link.href)}
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
          )}

          {/* Right Side - Language Switcher & Menu Toggle */}
          <div className='flex items-center pr-6 space-x-4'>
            {/* Desktop CTA Button */}
            <div className='hidden lg:block'>
              <Button
                href={`#${getSectionMappings(locale).contact}`}
                variant="primary"
                size="sm"
                onClick={handleContactClick}
                className="shadow-lg shadow-primary/20"
              >
                {t('startProject')}
              </Button>
            </div>

            {/* Language Switcher - Always visible */}
            <div className='hidden lg:flex'>
              <LanguageSwitcher alternateLinks={alternateLinks} />
            </div>

            {/* Mobile Menu Toggle */}
            {!hideLinks && (
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
            )}
          </div>
        </div>

      </div>
    </motion.nav>

    {/* Mobile Navigation Menu - Full Width Overlay */}
    {mounted && isMenuOpen && createPortal(
      <motion.div
        className='fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm overflow-y-auto flex flex-col'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className='flex flex-col items-center w-full min-h-full pt-20 pb-10 relative'>
          {/* Close Button (Top Right) */}
          <button
            onClick={toggleMenu}
            className='absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-primary hover:text-white transition-all duration-200 z-50'
            aria-label="Close menu"
          >
            <X className='w-8 h-8' />
          </button>

          {/* Navigation Links */}
          <div className='flex flex-col items-center space-y-6 w-full px-6'>
            {navLinks.map((link, index) => {
              const isActive = isLinkActive(link);

              if (link.hasDropdown) {
                return (
                  <div
                    key={index}
                    id={`mobile-dropdown-${link.section}`}
                    className="relative group w-full flex flex-col items-center scroll-mt-24"
                  >
                    <div
                      className={`px-4 py-3 text-xl font-bold transition-all duration-300 relative select-none flex items-center justify-center gap-2 w-full cursor-pointer ${
                        isActive || activeDropdown === link.section
                          ? 'text-primary'
                          : 'text-white hover:text-primary'
                      }`}
                      onClick={() => {
                        const newActive = activeDropdown === link.section ? null : link.section;
                        setActiveDropdown(newActive);
                        if (newActive) {
                          setTimeout(() => {
                            const element = document.getElementById(`mobile-dropdown-${link.section}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform ${activeDropdown === link.section ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === link.section && (
                        <motion.div
                          className='w-full bg-white/5 rounded-xl overflow-hidden mt-4 border border-white/10'
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
                                href={item.href}
                                className='flex items-center gap-4 px-6 py-5 text-gray-200 hover:bg-primary hover:text-white transition-colors duration-200 border-b border-white/5 last:border-b-0'
                                onMouseEnter={() => prefetchRoute(item.href)}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setActiveDropdown(null);
                                }}
                              >
                                {Icon && <Icon className='w-6 h-6 flex-shrink-0' />}
                                <div className='flex-1 text-left'>
                                  <div className='font-bold text-lg'>{item.label}</div>
                                  <div className='text-sm text-gray-400 mt-1'>{item.description}</div>
                                </div>
                                <ArrowRight className='w-5 h-5 flex-shrink-0' />
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
                  href={link.href}
                  className={`px-4 py-3 text-xl font-bold transition-all duration-300 relative select-none w-full text-center ${
                    isActive ? 'text-primary' : 'text-white hover:text-primary'
                  }`}
                  onMouseEnter={() => prefetchRoute(link.href)}
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
          <div className='flex lg:hidden mt-8'>
            <LanguageSwitcher alternateLinks={alternateLinks} />
          </div>
        </div>
      </motion.div>,
      document.body
    )}

    </>
  );
}
