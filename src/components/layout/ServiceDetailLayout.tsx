'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import EnhancedSchema from '@/components/seo/EnhancedSchema';
import Footer from '@/components/sections/Footer';
import MultiStepContactForm from '@/components/features/MultiStepContactForm';
import Navigation from '@/components/layout/Navigation';
import { useTranslations } from '@/hooks/useTranslations';

interface ServiceDetailProps {
  serviceId: string; // e.g., 'webDevelopment', 'ecommerce'
  icon?: React.ReactNode;
}

export default function ServiceDetailLayout({ serviceId, icon }: ServiceDetailProps) {
  const t = useTranslations(`services.${serviceId}`);
  // const tCommon = useTranslations('common');
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Helper to safely get array from translations
  // In a real app, we might need a more robust way to get arrays if useTranslations doesn't support it directly like this in all versions
  // But assuming standard next-intl behavior where we can iterate if we know the keys or count.
  // For now, I will assume we have a fixed number or we try to fetch them.
  // A better pattern with next-intl is to use `t.raw('features')` if it returns an array, but that depends on config.
  // Alternatively, we can just try to get keys 0, 1, 2... until missing.
  
  /* const getArray = (key: string) => {
    const items = [];
    let i = 0;
    while (true) {
      try {
        const item = t(`${key}.${i}`);
        if (item === `${key}.${i}`) break; // Fallback returned key
        if (!item) break;
        items.push(item);
        i++;
      } catch {
        break;
      }
    }
    return items;
  }; */

  // Actually, a safer way with the current hook might be to just hardcode a reasonable limit or use a specific structure.
  // Let's assume we will populate 4-6 items.
  const features = [0, 1, 2, 3, 4, 5].map(i => {
    try {
      const title = t(`features.${i}.title`);
      const desc = t(`features.${i}.description`);
      if (title.includes('features.')) return null;
      return { title, desc };
    } catch { return null; }
  }).filter(Boolean);

  const processSteps = [0, 1, 2, 3].map(i => {
    try {
      const title = t(`process.${i}.title`);
      const desc = t(`process.${i}.description`);
      if (title.includes('process.')) return null;
      return { title, desc };
    } catch { return null; }
  }).filter(Boolean);

  const faqs = [0, 1, 2, 3, 4].map(i => {
    try {
      const q = t(`faq.${i}.question`);
      const a = t(`faq.${i}.answer`);
      if (q.includes('faq.')) return null;
      return { q, a };
    } catch { return null; }
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navigation />
      
      {/* Schema for SEO */}
      <EnhancedSchema type="Service" data={{
        name: t('title'),
        description: t('description'),
        serviceType: t('serviceType'),
        provider: {
          "@type": "Organization",
          "name": "Rise.sk"
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          "name": t('title'),
          "itemListElement": features.map(feature => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": feature?.title,
              "description": feature?.desc
            }
          }))
        }
      }} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6 p-4 rounded-full bg-primary/10 border border-primary/20 text-primary">
              {icon}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {t('cta.primary')} <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/10 transition-all"
              >
                {t('cta.secondary')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('featuresTitle')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors"
              >
                <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">{feature?.title}</h3>
                <p className="text-gray-400">{feature?.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">{t('processTitle')}</h2>
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent md:-translate-x-1/2" />
            
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-8 mb-12 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="hidden md:block w-1/2" />
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-primary border-4 border-[#1a1a1a] z-10 md:-translate-x-1/2 flex items-center justify-center font-bold text-xs text-black">
                  {idx + 1}
                </div>
                <div className="flex-1 ml-12 md:ml-0 p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold mb-2 text-primary">{step?.title}</h3>
                  <p className="text-gray-400">{step?.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq?.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-4 text-gray-400 border-t border-white/10 pt-4">
                    {faq?.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contact">
        <MultiStepContactForm />
      </div>

      <Footer />
    </div>
  );
}
