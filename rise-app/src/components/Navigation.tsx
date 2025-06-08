'use client';


import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors"
            >
              Rise
            </Link>
          </div>{' '}
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="#about"
                className="text-[var(--foreground)] hover:text-[var(--primary)] px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                href="#services"
                className="text-[var(--foreground)] hover:text-[var(--primary)] px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('services')}
              </Link>
              <Link
                href="#contact"
                className="text-[var(--foreground)] hover:text-[var(--primary)] px-3 py-2 text-sm font-medium transition-colors"
              >
                {t('contact')}
              </Link>
              <LanguageSwitcher />
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>{' '}
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--secondary)] border-t border-[var(--border)]">
            <Link
              href="#about"
              className="text-[var(--foreground)] hover:text-[var(--primary)] block px-3 py-2 text-base font-medium transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="#services"
              className="text-[var(--foreground)] hover:text-[var(--primary)] block px-3 py-2 text-base font-medium transition-colors"
            >
              {t('services')}
            </Link>
            <Link
              href="#contact"
              className="text-[var(--foreground)] hover:text-[var(--primary)] block px-3 py-2 text-base font-medium transition-colors"
            >
              {t('contact')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            <button className="w-full mt-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg text-base font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
