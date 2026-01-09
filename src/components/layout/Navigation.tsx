'use client';

import { AnimatePresence, m as motion } from 'framer-motion';
import { ArrowRight, Brain, ChevronDown, Code2, Laptop, LucideIcon, Menu, ShoppingCart, Smartphone, User, Users, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { teamMembers } from '@/data/team';
import { usePersistentClick } from '@/hooks/usePersistentClick';
import { AppPathnames, Link, usePathname, useRouter } from '@/i18n/routing';

import LanguageSwitcher from './LanguageSwitcher';
import LogoAndText from './LogoAndText';

type NavLink = {
  href: AppPathnames | { pathname: AppPathnames; hash: string };
  label: string;
  section: string;
  isHash: boolean;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: AppPathnames | { pathname: AppPathnames; hash: string }; icon?: LucideIcon; image?: string; description?: string }[];
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
  const [clickedLink, setClickedLink] = useState<string | null>(null); // Pre vizuálnu spätnú väzbu
  const { hasClicked: hasClickedCheckup, handleClick: handleCheckupClickInternal } = usePersistentClick('rise_has_clicked_checkup');
  const { hasClicked: hasClickedStartProject, handleClick: handleStartProjectClickInternal } = usePersistentClick('rise_has_clicked_start_project');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const prefetchRoute = (href: AppPathnames | { pathname: AppPathnames; hash: string }) => {
    if (typeof href === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.prefetch(href as any);
    } else if (typeof href === 'object' && href.pathname) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.prefetch(href.pathname as any);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    handleStartProjectClickInternal();

    e.preventDefault();
    const sectionMap = getSectionMappings(locale);
    const contactSectionId = sectionMap.contact;
    const element = document.getElementById(contactSectionId);

    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    } else {
      // On other pages where contact section is missing, navigate to homepage with locale-specific hash
      setIsMenuOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/#${contactSectionId}` as any);
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

  const handleCheckupClick = () => {
    handleCheckupClickInternal();
    if (isMenuOpen) setIsMenuOpen(false);
  };

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
            description: t('serviceDescriptions.webDevelopment')
          },
          {
            label: t('serviceItems.ecommerce'),
            href: '/sluzby/tvorba-eshopu' as AppPathnames,
            icon: ShoppingCart,
            description: t('serviceDescriptions.ecommerce')
          },
          {
            label: t('serviceItems.mobileApps'),
            href: '/sluzby/vyvoj-mobilnych-aplikacii' as AppPathnames,
            icon: Smartphone,
            description: t('serviceDescriptions.mobileApps')
          },
          {
            label: t('serviceItems.customSoftware'),
            href: '/sluzby/softver-na-mieru' as AppPathnames,
            icon: Code2,
            description: t('serviceDescriptions.customSoftware')
          },
          {
            label: t('serviceItems.ai'),
            href: '/sluzby/ai-automatizacia' as AppPathnames,
            icon: Brain,
            description: t('serviceDescriptions.ai')
          },
          {
            label: t('serviceItems.outsourcing'),
            href: '/sluzby/it-outsourcing' as AppPathnames,
            icon: Users,
            description: t('serviceDescriptions.outsourcing')
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
            image: member.image,
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

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!mounted || !isHomePage) return;

    const sectionMap = getSectionMappings(locale);
    const sections = [
      sectionMap.development,
      sectionMap.about,
      sectionMap.services,
      sectionMap.portfolio,
      sectionMap.reviews,
      sectionMap.contact
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Active when element is in the top part of the screen
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newSection = entry.target.id;

          // Only update if it's different and we are confirmed ensuring it's a valid section
          if (newSection !== activeSection) {
            setActiveSection(newSection);

            // Update URL hash safely if initial hash is handled
            if (initialHashHandled && window.location.hash !== `#${newSection}`) {
               // Use replaceState to avoid history stack pollution
               window.history.replaceState(null, '', `#${newSection}`);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [mounted, isHomePage, locale, getSectionMappings, initialHashHandled, activeSection]); // Include activeSection to avoid stale closures if needed, though observer callback usually fresh? No, it's defined inside.

  // Simple scroll listener JUST for the transparent background toggle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash handling
  useEffect(() => {
     if (!mounted) return;

     const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setActiveSection(hash);
        }
     };

     // Initial hash
     if (window.location.hash && !initialHashHandled) {
         const hash = window.location.hash.replace('#', '');
         setActiveSection(hash);
         setTimeout(() => setInitialHashHandled(true), 1000);
     } else if (!window.location.hash && !initialHashHandled) {
         setInitialHashHandled(true);
     }

     window.addEventListener('hashchange', handleHashChange);
     return () => window.removeEventListener('hashchange', handleHashChange);
  }, [mounted, initialHashHandled]);

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
      className={`sticky top-0 left-0 right-0 z-[100]`}
      style={{ position: 'sticky', top: 0 }}
    >
      {/* Optimized Background Layer - uses opacity to avoid layout thrashing */}
      <div
         className={`absolute inset-0 z-0 transition-opacity duration-300 bg-black/95 backdrop-blur-xl border-b border-white/10 pointer-events-none ${
            (transparent && !isScrolled) ? 'opacity-0' : 'opacity-100'
         }`}
      />
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
                      window.history.pushState(null, document.title, window.location.pathname + window.location.search);
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
                                  const isPlaceholder = item.image?.includes('rise-team.png');

                                  return (
                                    <Link
                                      key={itemIndex}
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      href={item.href as any}
                                      className='flex items-center gap-4 px-5 py-4 hover:bg-white/5 active:bg-primary/20 active:scale-[0.98] transition-all duration-150 group/item'
                                      onMouseEnter={() => prefetchRoute(item.href)}
                                      onClick={() => {
                                        setClickedLink(item.label);
                                        setActiveDropdown(null);
                                        setIsMenuOpen(false);
                                        setTimeout(() => setClickedLink(null), 300);
                                      }}
                                    >
                                      {item.image && !isPlaceholder ? (
                                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                          <Image
                                            src={item.image}
                                            alt={item.label}
                                            fill
                                            className="object-cover"
                                            sizes="36px"
                                          />
                                        </div>
                                      ) : isPlaceholder ? (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 flex-shrink-0">
                                          <span className="text-xs font-bold text-primary">
                                            {item.label.split(' ').map(n => n[0]).join('')}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className='p-2 rounded-lg bg-white/5 group-hover/item:bg-primary/20 transition-colors duration-200'>
                                          {Icon && <Icon className='w-5 h-5 text-gray-300 group-hover/item:text-primary transition-colors duration-200' />}
                                        </div>
                                      )}
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      href={link.href as any}
                      className={`px-1.5 xl:px-2 py-2 text-sm xl:text-base font-bold transition-all duration-150 relative select-none whitespace-nowrap ${
                        clickedLink === link.section
                          ? 'text-primary scale-95 opacity-70'
                          : isActive
                            ? 'text-primary'
                            : 'text-gray-300 hover:text-primary active:scale-95 active:opacity-70'
                      }`}
                      onMouseEnter={() => prefetchRoute(link.href)}
                      onClick={(e) => {
                        // Okamžitá vizuálna spätná väzba
                        setClickedLink(link.section);
                        setTimeout(() => setClickedLink(null), 300);

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
            {/* Desktop CTA Buttons */}
            <div className='hidden lg:flex items-center gap-4'>
              <Button
                href="/otestujte-podnikanie"
                variant="outline"
                size="sm"
                className="glow hover:glow-hover border-2 relative overflow-hidden"
                onClick={handleCheckupClick}
              >
                <span className="relative z-10">{t('testYourBusiness')}</span>
                {!hasClickedCheckup && (
                  <div className="absolute inset-0 -translate-x-full animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                )}
              </Button>
              <Button
                href={`#${getSectionMappings(locale).contact}`}
                variant="primary"
                size="sm"
                onClick={handleContactClick}
                className="relative overflow-hidden shadow-lg shadow-primary/20 group"
              >
                <span className="relative z-10">{t('startProject')}</span>
                {!hasClickedStartProject && (
                  <div className="absolute inset-0 -translate-x-full animate-sheen bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" style={{ animationDelay: '0.4s' }} />
                )}
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
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
                            const isPlaceholder = item.image?.includes('rise-team.png');

                            return (
                              <Link
                                key={itemIndex}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                href={item.href as any}
                                className='flex items-center gap-4 px-6 py-5 text-gray-200 hover:bg-primary hover:text-white active:bg-primary/80 active:scale-[0.98] transition-all duration-150 border-b border-white/5 last:border-b-0'
                                onMouseEnter={() => prefetchRoute(item.href)}
                                onClick={() => {
                                  setClickedLink(item.label);
                                  setIsMenuOpen(false);
                                  setActiveDropdown(null);
                                  setTimeout(() => setClickedLink(null), 300);
                                }}
                              >
                                {item.image && !isPlaceholder ? (
                                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.label}
                                      fill
                                      className="object-cover"
                                      sizes="36px"
                                    />
                                  </div>
                                ) : isPlaceholder ? (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 flex-shrink-0">
                                    <span className="text-xs font-bold text-primary">
                                      {item.label.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                ) : (
                                  Icon && <Icon className='w-6 h-6 flex-shrink-0' />
                                )}
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={link.href as any}
                  className={`px-4 py-3 text-xl font-bold transition-all duration-150 relative select-none w-full text-center ${
                    clickedLink === link.section
                      ? 'text-primary scale-95 opacity-70'
                      : isActive
                        ? 'text-primary'
                        : 'text-white hover:text-primary active:scale-95 active:opacity-70'
                  }`}
                  onMouseEnter={() => prefetchRoute(link.href)}
                  onClick={(e) => {
                    // Okamžitá vizuálna spätná väzba
                    setClickedLink(link.section);

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
                    setTimeout(() => setClickedLink(null), 300);
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Free Checkup Button */}
            <Button
              href="/otestujte-podnikanie"
              variant="outline"
              className="w-full text-xl py-3 border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary mt-4 glow relative overflow-hidden"
              onClick={handleCheckupClick}
            >
              <span className="relative z-10">{t('testYourBusiness')}</span>
              {!hasClickedCheckup && (
                <div className="absolute inset-0 -translate-x-full animate-sheen bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              )}
            </Button>
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
