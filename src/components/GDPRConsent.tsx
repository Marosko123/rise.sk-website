'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, Settings, Shield, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const GDPRConsent = () => {
  const t = useTranslations('gdpr');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('gdpr-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(savedConsent);
      setConsent(parsed);

      // Initialize analytics if consented
      if (parsed.analytics && typeof window.gtag !== 'undefined') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };

    setConsent(newConsent);
    localStorage.setItem('gdpr-consent', JSON.stringify(newConsent));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());

    // Update Google Analytics consent
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted'
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const newConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };

    setConsent(newConsent);
    localStorage.setItem('gdpr-consent', JSON.stringify(newConsent));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());

    // Update Google Analytics consent
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied'
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('gdpr-consent', JSON.stringify(consent));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());

    // Update Google Analytics consent based on settings
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        functionality_storage: consent.functional ? 'granted' : 'denied',
        personalization_storage: consent.marketing ? 'granted' : 'denied'
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const cookieCategories = [
    {
      key: 'necessary',
      title: t('categories.necessary.title'),
      description: t('categories.necessary.description'),
      required: true
    },
    {
      key: 'analytics',
      title: t('categories.analytics.title'),
      description: t('categories.analytics.description'),
      required: false
    },
    {
      key: 'functional',
      title: t('categories.functional.title'),
      description: t('categories.functional.description'),
      required: false
    },
    {
      key: 'marketing',
      title: t('categories.marketing.title'),
      description: t('categories.marketing.description'),
      required: false
    }
  ];

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-white/10 gdpr-modal-mobile"
          style={{ 
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-7xl mx-auto p-6 pb-2 gdpr-container-mobile">
            {!showSettings ? (
              // Main banner
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <Shield className="w-8 h-8 text-[#b09155] flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('title')}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {t('message')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto sm:gap-3 mb-6 sm:mb-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="min-h-[48px] px-4 py-3 text-white border border-white/20 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    <Settings className="w-4 h-4" />
                    {t('settings')}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="min-h-[48px] px-6 py-3 text-white bg-slate-700 rounded-lg hover:bg-slate-600 active:bg-slate-500 transition-colors text-sm font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    {t('reject')}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="min-h-[48px] px-6 py-3 text-white bg-[#b09155] rounded-lg hover:bg-[#9a7f4b] active:bg-[#8b6914] transition-colors text-sm font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    {t('accept')}
                  </button>
                </div>
              </div>
            ) : (
              // Settings panel
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-[#b09155]" />
                    <h3 className="text-xl font-semibold text-white">
                      {t('settingsTitle')}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {cookieCategories.map((category) => (
                    <div
                      key={category.key}
                      className="bg-slate-800/50 p-4 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">
                            {category.title}
                          </h4>
                          {category.required && (
                            <span className="text-xs bg-[#b09155] text-white px-2 py-1 rounded">
                              {t('categories.necessary.required')}
                            </span>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consent[category.key as keyof typeof consent]}
                            disabled={category.required}
                            onChange={(e) => {
                              if (!category.required) {
                                setConsent(prev => ({
                                  ...prev,
                                  [category.key]: e.target.checked
                                }));
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`
                            w-11 h-6 rounded-full transition-colors
                            ${consent[category.key as keyof typeof consent] || category.required
                              ? 'bg-[#b09155]'
                              : 'bg-slate-600'
                            }
                          `}>
                            <div className={`
                              w-5 h-5 bg-white rounded-full transition-transform mt-0.5
                              ${consent[category.key as keyof typeof consent] || category.required
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                              }
                            `} />
                          </div>
                        </label>
                      </div>
                      <p className="text-sm text-white/70">
                        {category.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 justify-end w-full sm:flex-row sm:w-auto sm:gap-3 mt-6">
                  <button
                    onClick={handleRejectAll}
                    className="min-h-[48px] px-6 py-3 text-white bg-slate-700 rounded-lg hover:bg-slate-600 active:bg-slate-500 transition-colors text-sm font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    {t('reject')}
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="min-h-[48px] px-6 py-3 text-white bg-[#b09155] rounded-lg hover:bg-[#9a7f4b] active:bg-[#8b6914] transition-colors flex items-center justify-center gap-2 text-sm font-medium touch-manipulation"
                    style={{ minHeight: '48px' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('saveSettings')}
                  </button>
                </div>

                {/* Additional info */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3 text-sm text-white/60">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mb-2">
                        {t('moreInfo')}{' '}
                        <Link href="/ochrana-osobnych-udajov" target='_blank' className="text-[#b09155] hover:underline">
                          {t('privacyPolicy')}
                        </Link>
                        {' '}{t('and')}{' '}
                        <Link href="/obchodne-podmienky" target='_blank' className="text-[#b09155] hover:underline">
                          {t('terms')}
                        </Link>.
                      </p>
                      <p>
                        {t('footerNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GDPRConsent;
