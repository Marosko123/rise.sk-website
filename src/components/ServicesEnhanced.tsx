'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Code,
  Database,
  Settings,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Services() {
  const t = useTranslations('contact');

  // Function to map service titles to dropdown categories
  const mapServiceToCategory = (serviceTitle: string) => {
    const mapping = {
      'Moderné Weby': 'webDevelopment',
      'Mobilné Aplikácie': 'mobileApps', 
      'Softvér na Mieru': 'customSoftware',
      'E-commerce Riešenia': 'ecommerce',
      'AI & Data Analytics': 'aiAnalytics',
      'Digital Marketing Tech': 'digitalMarketing',
      'Špeciálne Požiadavky': 'specialRequests'
    };
    return mapping[serviceTitle as keyof typeof mapping] || 'other';
  };

  // Function to get localized service name for dropdown (same as Contact component)
  const getLocalizedServiceName = (serviceTitle: string) => {
    const categoryKey = mapServiceToCategory(serviceTitle);
    
    // Use the same translation keys as Contact component
    const translationKey = `services.${categoryKey}`;
    return t(translationKey);
  };

  // Function to generate pre-filled message based on service and locale using translations
  const generateServiceMessage = (serviceTitle: string) => {
    const categoryKey = mapServiceToCategory(serviceTitle);
    const translationKey = `templateMessages.${categoryKey}`;
    return t(translationKey);
  };

  // Function to scroll to contact with pre-filled form
  const handleServiceInquiry = (serviceTitle: string) => {
    const message = generateServiceMessage(serviceTitle);
    // Get the exact same service name that will be in the dropdown
    const localizedServiceName = getLocalizedServiceName(serviceTitle);
    
    // Store form data in localStorage
    localStorage.setItem('contactFormData', JSON.stringify({
      service: localizedServiceName, // This should match dropdown option values
      message
    }));

    // Dispatch custom event to notify Contact component
    window.dispatchEvent(new Event('contactFormUpdate'));
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      // Scroll to contact section without changing URL
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const services = [
    {
      id: 1,
      icon: Code,
      title: 'Moderné Weby',
      description: 'Vytvárame profesionálne webové stránky, ktoré oslovujú zákazníkov a posilňujú vašu značku.',
      features: [
        'Responzívny dizajn pre všetky zariadenia',
        'SEO optimalizácia pre lepšiu viditeľnosť',
        'Rýchle načítanie a bezpečnosť',
        'Integrácia s modernými nástrojmi',
        'CMS systémy pre jednoduchú správu'
      ],
      gradient: 'from-[#b09155] to-[#d4af37]',
      experience: '10+ rokov skúseností',
    },
    {
      id: 2,
      icon: Smartphone,
      title: 'Mobilné Aplikácie',
      description: 'Vyvíjame iOS a Android aplikácie, ktoré zjednodušujú procesy a zvyšujú spokojnosť používateľov.',
      features: [
        'Native vývoj pre iOS a Android',
        'Offline funkcionalita a synchronizácia',
        'Push notifikácie a real-time funkcie',
        'Integrácia s existujúcimi systémami',
        'App Store optimalizácia'
      ],
      gradient: 'from-[#9a7f4b] to-[#b8860b]',
      experience: 'Preverené na trhu',
    },
    {
      id: 3,
      icon: Settings,
      title: 'Softvér na Mieru',
      description: 'Navrhujeme a implementujeme komplexné riešenia šité presne na mieru vašich potrieb.',
      features: [
        'Detailná analýza procesov',
        'Automatizácia rutinných úloh',
        'Integrácia s existujúcimi systémami',
        'Školenie tímu a dokumentácia',
        'Dlhodobá podpora a údržba'
      ],
      gradient: 'from-[#d4af37] to-[#b09155]',
      experience: 'Komplexné projekty',
    },
    {
      id: 4,
      icon: ShoppingCart,
      title: 'E-commerce Riešenia',
      description: 'Budujeme online obchody s pokročilými funkciami pre maximalizáciu predaja a spokojnosti zákazníkov.',
      features: [
        'Moderný UX/UI dizajn obchodu',
        'Platobné brány a logistické riešenia',
        'Správa produktov a objednávok',
        'Marketing automation nástroje',
        'Analytika a reportovanie'
      ],
      gradient: 'from-[#b8860b] to-[#9a7f4b]',
      experience: 'Úspešné obchody',
    },
    {
      id: 5,
      icon: Database,
      title: 'AI & Data Analytics',
      description: 'Implementujeme inteligentné riešenia pre lepšie rozhodovanie a prediktívnu analýzu vašich dát.',
      features: [
        'Prediktívne modely a forecasting',
        'Automatizácia rozhodovacích procesov',
        'Real-time dashboardy a vizualizácie',
        'Machine learning algoritmy',
        'Big Data spracovanie'
      ],
      gradient: 'from-[#d4af37] to-[#b8860b]',
      experience: 'Pokročilé technológie',
    },
    {
      id: 6,
      icon: Sparkles,
      title: 'Špeciálne Požiadavky',
      description: 'Máte jedinečný projekt alebo špecifické potreby? Sme všestranní a dokážeme realizovať aj netradičné riešenia.',
      features: [
        'Konzultácie a analýza požiadaviek',
        'Prototypovanie a testovanie',
        'Kombinovanie rôznych technológií',
        'Inovatívne prístupy k problémom',
        'Flexibilita v implementácii'
      ],
      gradient: 'from-[#d4af37] to-[#b09155]',
      experience: 'Riešime aj to neriešiteľné',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

  return (
    <section
      id='services'
      className='py-24 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]'
    >
      <motion.div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className='text-center mb-20'>
          <div className='inline-flex items-center gap-2 bg-[var(--glass)] backdrop-blur-sm border border-[var(--primary)]/20 rounded-full px-6 py-3 mb-6'>
            <Sparkles size={16} className='text-[var(--primary)]' />
            <span className='text-sm font-medium text-[var(--primary)]'>
              Naše Služby
            </span>
          </div>
          <h2 className='text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6'>
            Čo pre vás
            <span className='gradient-text block'>dokážeme vytvoriť</span>
          </h2>
          <p className='text-xl text-[var(--neutral-dark)] max-w-3xl mx-auto leading-relaxed'>
            Sme technologickí experti s dlhoročnými skúsenosťami. Vytvárame riešenia, ktoré fungují a prinášajú výsledky.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className='group relative'
            >
              <div className='h-full p-8 bg-[var(--glass)] backdrop-blur-sm border border-[var(--border)]/50 rounded-2xl hover:border-[var(--primary)]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2'>
                {/* Icon & Gradient */}
                <div className='relative mb-6'>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className='text-white' />
                  </div>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>

                {/* Title */}
                <h3 className='text-2xl font-bold text-[var(--foreground)] mb-4 group-hover:text-[var(--primary)] transition-colors duration-300'>
                  {service.title}
                </h3>

                {/* Description */}
                <p className='text-[var(--neutral-dark)] mb-6 leading-relaxed'>
                  {service.description}
                </p>

                {/* Features */}
                <div className='space-y-3 mb-6'>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className='flex items-start gap-3'>
                      <CheckCircle size={16} className='text-[var(--primary)] flex-shrink-0 mt-0.5' />
                      <span className='text-sm text-[var(--accent)]'>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Experience Badge */}
                <div className='flex items-center justify-center p-4 bg-[var(--secondary)]/50 rounded-xl mb-6'>
                  <div className='text-center'>
                    <div className='text-sm text-[var(--accent)] mb-1'>Naša expertíza</div>
                    <div className='text-lg font-bold text-[var(--primary)]'>{service.experience}</div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleServiceInquiry(service.title)}
                  className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 group-hover:scale-105'
                >
                  Prediskutujme projekt
                  <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform duration-300' />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className='text-center mt-20 p-8 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-dark)]/10 rounded-3xl border border-[var(--primary)]/20'
        >
          <h3 className='text-3xl font-bold text-[var(--foreground)] mb-4'>
            Chcete prediskutovať váš projekt?
          </h3>
          <p className='text-lg text-[var(--neutral-dark)] mb-8 max-w-2xl mx-auto'>
            Radi sa s vami porozprávame o vašich potrebách. Máme skúsenosti s rôznymi typmi projektov a dokážeme nájsť riešenie aj pre zložité požiadavky.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button 
              onClick={() => handleServiceInquiry('Špeciálne Požiadavky')}
              className='flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 hover:scale-105'
            >
              <Target size={20} />
              Kontaktujte nás
            </button>
            <button 
              onClick={() => {
                // Scroll to engagement or portfolio section
                const engagementSection = document.getElementById('engagement');
                if (engagementSection) {
                  engagementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className='flex items-center gap-2 border-2 border-[var(--primary)] text-[var(--primary)] font-semibold py-4 px-8 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all duration-300'
            >
              <TrendingUp size={20} />
              Naše referencie
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
