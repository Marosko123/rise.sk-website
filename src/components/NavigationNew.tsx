'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Home, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import companyConfig from '@/config/company';
import { Link } from '@/i18n/routing';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Check if we're on a subpage (not the main landing page)
  const isSubpage =
    pathname.includes('/development') || pathname.includes('/education');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#engagement', label: 'Engagement Models' },
    { href: '#contact', label: 'Contact' },
    { href: '/scroll-demo', label: 'Scroll Demo' },
    { href: '/test-cursor', label: 'Cursor Test' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <motion.div className='flex-shrink-0' whileHover={{ scale: 1.05 }}>
            <Link href='/' className='flex items-center space-x-2'>
              <Image
                src={companyConfig.website.logo.circle}
                alt={companyConfig.company.name}
                width={32}
                height={32}
                className='rounded-full'
              />
              <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                {companyConfig.company.domain}
              </span>
            </Link>
          </motion.div>

          {/* Show different navigation based on page */}
          {isSubpage ? (
            <div className='hidden md:block'>
              <Link
                href='/'
                className='flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors duration-300'
              >
                <Home className='w-4 h-4' />
                <span>Back to Home</span>
              </Link>
            </div>
          ) : (
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-8'>
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
                      className='text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-300 relative group'
                      whileHover={{ y: -2 }}
                      data-cursor='link'
                    >
                      {link.label}
                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300'></span>
                    </Component>
                  );
                })}
              </div>
            </div>
          )}

          <div className='hidden md:block'>
            {isSubpage ? (
              <div></div>
            ) : (
              <motion.a
                href='#contact'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300'
                data-cursor='button'
              >
                Get Started
              </motion.a>
            )}
          </div>

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
              {isSubpage ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className='px-3 py-2'
                >
                  <Link
                    href='/'
                    className='flex items-center space-x-2 text-gray-300 hover:text-white text-base font-medium transition-colors duration-300'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className='w-4 h-4' />
                    <span>Back to Home</span>
                  </Link>
                </motion.div>
              ) : (
                <>
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
                  <motion.a
                    href='#contact'
                    className='bg-gradient-to-r from-blue-600 to-purple-600 text-white block px-3 py-2 text-base font-medium rounded-lg mt-4'
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    Get Started
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
