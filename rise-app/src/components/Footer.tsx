'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#1a1a1a] text-[var(--neutral-light)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-3xl font-bold text-[var(--primary)] mb-4 block"
            >
              Rise{' '}
            </Link>{' '}
            <p className="text-[#d1d5db] mb-6 max-w-md">{t('tagline')}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.754-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499-.043.944-.196 1.944-.84.135-.077.218-.135.302-.196V12.91h-1.922V12h1.922v-.83c0-1.917 1.34-3.04 2.935-3.04.843 0 1.654.15 1.654.15v1.82h-.927c-.913 0-1.197.567-1.197 1.147V12h2.037l-.326 1.91h-1.711v6.987C17.163 19.119 20.02 15.38 20.02 10.974 20.02 6.465 15.556 2 12.026 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>{' '}
          {/* Quick Links */}{' '}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-[#d1d5db] hover:text-[var(--primary)] transition-colors"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-[#d1d5db] hover:text-[var(--primary)] transition-colors"
                >
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-[#d1d5db] hover:text-[var(--primary)] transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="#blog"
                  className="text-[#d1d5db] hover:text-[var(--primary)] transition-colors"
                >
                  {t('blog')}
                </Link>
              </li>
            </ul>
          </div>{' '}
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('getInTouch')}
            </h3>{' '}
            <div className="space-y-2">
              <p className="text-[#d1d5db] flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hello@risedev.com
              </p>
              <p className="text-[#d1d5db] flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +1 (555) 123-4567
              </p>
              <p className="text-[#d1d5db] flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {t('address')
                  .split('\n')
                  .map((line, index) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
              </p>
            </div>
          </div>
        </div>{' '}
        <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#9ca3af] text-sm">
            {t('copyright')} {t('rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-[#9ca3af] hover:text-[var(--primary)] text-sm transition-colors"
            >
              {t('privacyPolicy')}
            </Link>
            <Link
              href="#"
              className="text-[#9ca3af] hover:text-[var(--primary)] text-sm transition-colors"
            >
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
