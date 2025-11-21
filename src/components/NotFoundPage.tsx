'use client';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/sections/Footer';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Home, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4">
              404
            </h1>
            <h2 className="text-4xl font-bold mb-6 text-white">
              {t('title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
              >
                <Home className="w-5 h-5" />
                {t('home')}
              </Link>
              <Link 
                href="/kontakt" 
                className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10"
              >
                <Mail className="w-5 h-5" />
                {t('contact')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <Link href="/sluzby" className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{t('services')}</h3>
                <p className="text-gray-400 text-sm">{t('webMobile')}</p>
              </Link>
              <Link href="/portfolio" className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{t('portfolio')}</h3>
                <p className="text-gray-400 text-sm">{t('portfolio')}</p>
              </Link>
              <Link href="/sluzby/softver-na-mieru" className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{t('customSoftware')}</h3>
                <p className="text-gray-400 text-sm">{t('customSoftware')}</p>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
