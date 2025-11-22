'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import EnhancedSchema from '../seo/EnhancedSchema';
import FAQAccordion from '../ui/FAQAccordion';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'pricing' | 'technical' | 'process';
}

const FAQ = () => {
  const t = useTranslations('faq');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAllFAQs, setShowAllFAQs] = useState<boolean>(false);

  // Number of FAQs to show in preview mode
  const PREVIEW_COUNT = 4;

  const faqData: FAQItem[] = [
    // General Services
    {
      question: t('items.0.question'),
      answer: t('items.0.answer'),
      category: 'general'
    },
    {
      question: t('items.1.question'),
      answer: t('items.1.answer'),
      category: 'general'
    },
    {
      question: t('items.2.question'),
      answer: t('items.2.answer'),
      category: 'technical'
    },
    // Pricing & Process
    {
      question: t('items.3.question'),
      answer: t('items.3.answer'),
      category: 'pricing'
    },
    {
      question: t('items.4.question'),
      answer: t('items.4.answer'),
      category: 'pricing'
    },
    {
      question: t('items.5.question'),
      answer: t('items.5.answer'),
      category: 'pricing'
    },
    // Technical Details
    {
      question: t('items.6.question'),
      answer: t('items.6.answer'),
      category: 'technical'
    },
    {
      question: t('items.7.question'),
      answer: t('items.7.answer'),
      category: 'technical'
    },
    {
      question: t('items.8.question'),
      answer: t('items.8.answer'),
      category: 'technical'
    },
    // Process
    {
      question: t('items.9.question'),
      answer: t('items.9.answer'),
      category: 'process'
    },
    {
      question: t('items.10.question'),
      answer: t('items.10.answer'),
      category: 'process'
    },
    {
      question: t('items.11.question'),
      answer: t('items.11.answer'),
      category: 'process'
    }
  ];

  const categories = [
    { key: 'all', label: 'Všetky otázky' },
    { key: 'general', label: 'Všeobecné' },
    { key: 'pricing', label: 'Ceny a platby' },
    { key: 'technical', label: 'Technické' },
    { key: 'process', label: 'Proces a komunikácia' }
  ];

  const filteredFAQ = activeCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  // Apply preview limit when not showing all FAQs
  const displayedFAQ = showAllFAQs ? filteredFAQ : filteredFAQ.slice(0, PREVIEW_COUNT);
  const hasMoreFAQs = filteredFAQ.length > PREVIEW_COUNT;

  return (
    <section className="py-12 bg-transparent">
      <EnhancedSchema type="FAQPage" data={{ faqs: faqData }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
            Často Kladené Otázky
          </h2>
          <p className="text-xl text-[var(--foreground-muted)] max-w-3xl mx-auto leading-relaxed">
            Nájdite odpovede na najčastejšie otázky o našich službách, procesoch a spolupráci
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === category.key
                  ? 'bg-[var(--primary)] text-white shadow-lg'
                  : 'bg-slate-800/50 text-[var(--foreground-muted)] hover:bg-slate-700/50 hover:text-white'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <FAQAccordion items={displayedFAQ} />
        </div>

        {/* Show More/Less Button */}
        {hasMoreFAQs && (
          <div className="text-center mt-8">
            <motion.button
              onClick={() => setShowAllFAQs(!showAllFAQs)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-white/20 rounded-xl text-[var(--foreground)] hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAllFAQs ? (
                <>
                  <span>{t('showLess')}</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{t('showAll')} ({filteredFAQ.length})</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[#9a7f4b]/10 rounded-2xl p-8 border border-[var(--primary)]/20">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
              Nenašli ste odpoveď na svoju otázku?
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-2xl mx-auto">
              Kontaktujte nás a radi vám poskytneme podrobnú konzultáciu a odpovieme na všetky vaše otázky.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[#9a7f4b] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Kontaktovať nás
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
