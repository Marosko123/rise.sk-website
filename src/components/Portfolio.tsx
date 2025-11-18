'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Github, Lock } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import OptimizedImage from './OptimizedImage';

// Portfolio projects data - real projects from rise.sk
const getPortfolioProjects = (t: (key: string) => string) => [
  {
    id: 1,
    title: 'Horilla Payroll',
    descriptionKey: 'horilla',
    category: 'webapp',
    image: '/portfolio/horilla.svg',
    tags: ['Python', 'Django', 'Economy', 'HexaTech'],
    liveUrl: 'https://demo.horilla.com/',
    githubUrl: 'https://github.com/horilla-opensource/horilla',
    featured: true,
    metrics: {
      status: t('projects.horilla.metrics.status'),
      duration: t('projects.horilla.metrics.duration'),
      satisfaction: t('projects.horilla.metrics.satisfaction')
    }
  },
  {
    id: 2,
    title: 'Viac Ako Ni(c)K',
    descriptionKey: 'viacAkoNick',
    category: 'mobileApps',
    image: '/viac_ako_nick.svg',
    tags: ['PHP', 'Flutter', 'Dart', 'iOS', 'Android'],
    liveUrl: 'https://viacakonick.gov.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.viacAkoNick.metrics.status'),
      duration: t('projects.viacAkoNick.metrics.duration'),
      satisfaction: t('projects.viacAkoNick.metrics.satisfaction')
    }
  },
  {
    id: 3,
    title: 'Lumturi Auction',
    descriptionKey: 'lumturi',
    category: 'webapp',
    image: '/portfolio/lumturi_favicon.png',
    tags: ['WordPress', 'PHP', 'Auction', 'Try Art'],
    liveUrl: 'https://www.lumturi.com',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.lumturi.metrics.status'),
      duration: t('projects.lumturi.metrics.duration'),
      satisfaction: t('projects.lumturi.metrics.satisfaction')
    }
  },
  {
    id: 4,
    title: 'Pixel Corporation',
    descriptionKey: 'pixelCorporation',
    category: 'mobileApps',
    image: '/portfolio/pixel-corporation-logo.png',
    tags: ['Expo', 'React Native', 'Mobile App', 'Running', 'Pixel Corp'],
    liveUrl: 'https://www.pixelcorporation.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.pixelCorporation.metrics.status'),
      duration: t('projects.pixelCorporation.metrics.duration'),
      satisfaction: t('projects.pixelCorporation.metrics.satisfaction')
    }
  },
  {
    id: 5,
    title: 'Dating Platform',
    descriptionKey: 'trulink',
    category: 'webapp',
    image: '/portfolio/trulee.webp',
    tags: ['Next.js', 'React', 'Web App', 'TypeScript'],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.trulink.metrics.status'),
      duration: t('projects.trulink.metrics.duration'),
      satisfaction: t('projects.trulink.metrics.satisfaction')
    }
  },
  {
    id: 6,
    title: 'Rise.sk',
    descriptionKey: 'riseWeb',
    category: 'corporate',
    image: '/rise/Rise_logo_transparent.png',
    tags: ['Next.js', 'Website', 'IT Company'],
    liveUrl: 'https://www.rise.sk',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.riseWeb.metrics.status'),
      duration: t('projects.riseWeb.metrics.duration'),
      satisfaction: t('projects.riseWeb.metrics.satisfaction')
    }
  },
  {
    id: 7,
    title: 'Doucma Education',
    descriptionKey: 'doucma',
    category: 'education',
    image: '/portfolio/doucma.svg',
    tags: ['Tutoring', 'Education'],
    liveUrl: 'https://www.doucma.sk/272129-doucovanie-posun-svoje-matematicke-a-it-zrucnosti-na-novy-level',
    githubUrl: null,
    featured: false,
    metrics: {
      status: t('projects.doucma.metrics.status'),
      duration: t('projects.doucma.metrics.duration'),
      satisfaction: t('projects.doucma.metrics.satisfaction')
    }
  },
  {
    id: 8,
    title: 'Rozvoj dopravy Trnava',
    descriptionKey: 'rozvojDopravy',
    category: 'webapp',
    image: '/portfolio/trnava.jpg',
    tags: ['Vue.js', 'Node.js', 'Charts', 'Transport'],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    metrics: {
      status: t('projects.rozvojDopravy.metrics.status'),
      duration: t('projects.rozvojDopravy.metrics.duration'),
      satisfaction: t('projects.rozvojDopravy.metrics.satisfaction')
    }
  },
  {
    id: 9,
    title: '2 Ring',
    descriptionKey: 'twoRing',
    category: 'webapp',
    image: '/portfolio/2ring.svg',
    tags: ['C#', 'SQL', 'Vue.js', 'Enterprise'],
    liveUrl: 'https://www.2ring.com',
    githubUrl: null,
    featured: true,
    metrics: {
      status: t('projects.twoRing.metrics.status'),
      duration: t('projects.twoRing.metrics.duration'),
      satisfaction: t('projects.twoRing.metrics.satisfaction')
    }
  },
];

const Portfolio: React.FC = () => {
  const t = useTranslations('portfolio');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [isHovered, setIsHovered] = useState(false);

  const portfolioProjects = getPortfolioProjects(t);  // Calculate items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, portfolioProjects.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide functionality - pause on hover
  useEffect(() => {
    if (isHovered) return; // Don't auto-slide when hovering

    const interval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobileApps':
        return '�';
      case 'webapp':
        return '�';
      case 'ecommerce':
        return '🛒';
      case 'saas':
        return '�';
      default:
        return '💻';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'mobileApps':
        return 'from-pink-500/20 via-rose-500/20 to-orange-500/20';
      case 'webapp':
        return 'from-blue-500/20 via-indigo-500/20 to-purple-500/20';
      case 'ecommerce':
        return 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20';
      case 'saas':
        return 'from-blue-500/20 via-indigo-500/20 to-purple-500/20';
      default:
        return 'from-gray-500/20 via-slate-500/20 to-zinc-500/20';
    }
  };

  return (
    <section
      id="portfolio"
      ref={ref}
      className="py-16 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--background) 0%, rgba(15, 23, 42, 0.8) 50%, var(--background) 100%)',
        color: 'var(--foreground)'
      }}
    >
      {/* Different background pattern for Portfolio */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)`,
          backgroundSize: '800px 800px'
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('title')}{' '}
            <span className="gradient-text-animated">
              {t('titleHighlight')}
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            { key: 'projectsCompleted', icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { key: 'clientSatisfaction', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { key: 'avgDeliveryTime', icon: '🚀', color: 'from-green-500 to-emerald-500' }
          ].map((stat) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center group hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {t(`stats.${stat.key}.number`)}
              </div>
              <div className="text-white/60 font-medium">
                {t(`stats.${stat.key}.label`)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 gradient-text-animated">
              {t('projects.featured.title')}
            </h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('projects.featured.description')}
            </p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
            >
              <ChevronLeft className="h-6 w-6 text-[var(--primary)]" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[var(--primary)]/20 backdrop-blur-sm hover:bg-[var(--primary)]/40 p-3 rounded-full transition-all duration-300 hover:scale-110 select-none"
            >
              <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
            </button>

            {/* Carousel Content */}
            <div className="overflow-hidden mx-4 md:mx-8">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out items-start"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                }}
              >
                {portfolioProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="group relative flex-shrink-0 px-2 md:px-3"
                    style={{
                      width: `${100 / itemsPerView}%`
                    }}
                    variants={itemVariants}
                  >
                {/* Compact Project Card */}
                <div
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden h-[520px] flex flex-col transition-all duration-500 hover:scale-105 hover:bg-white/10"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Project Image/Preview */}
                  <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
                    <div className={`h-full w-full bg-gradient-to-br ${getCategoryGradient(project.category)} flex items-center justify-center relative`}>
                      {/* Background image */}
                      {project.image ? (
                        project.title === 'Horilla Payroll' ? (
                          <OptimizedImage
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                            quality={85}
                            placeholder="empty"
                          />
                        ) : (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            quality={85}
                            onError={() => {
                              // Fallback handled by Next.js
                            }}
                          />
                        )
                      ) : (
                        <div className="text-6xl opacity-30">
                          {getCategoryIcon(project.category)}
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                      {/* Action buttons - icons only */}
                      <div className="absolute top-3 right-3 flex space-x-1">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[var(--primary)]/30 backdrop-blur-sm p-2 rounded-full text-[var(--primary)] hover:bg-[var(--primary)]/50 transition-colors hover:scale-110"
                            title={t('projects.actions.demo')}
                          >
                            <Eye className="h-3 w-3" />
                          </a>
                        ) : (
                          <div
                            className="bg-gray-500/40 backdrop-blur-md p-2 rounded-full text-gray-400/90 cursor-not-allowed opacity-80"
                            title="Demo nie je dostupné"
                          >
                            <Eye className="h-3 w-3" />
                          </div>
                        )}

                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[var(--primary)]/30 backdrop-blur-sm p-2 rounded-full text-[var(--primary)] hover:bg-[var(--primary)]/50 transition-colors hover:scale-110"
                            title={t('projects.actions.code')}
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        ) : (
                          <div
                            className="bg-gray-500/40 backdrop-blur-md p-2 rounded-full text-gray-400/90 cursor-not-allowed opacity-80 group relative"
                            title="Privátny projekt - kód nie je verejne dostupný"
                          >
                            <Lock className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4 flex flex-col h-full">
                    {/* Title */}
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {project.title}
                    </h4>

                    {/* Technology Tags */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags && project.tags.length > 0 && (
                          project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-500/30 transition-all duration-200"
                            >
                              {tag}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Description section with fixed button position */}
                    <div className="mb-2 flex-grow flex flex-col">
                      {/* Text content with controlled scrolling */}
                      <div
                        className={`transition-all duration-500 ${
                          expandedCards.has(project.id)
                            ? 'max-h-[100px] overflow-y-auto scrollbar-thin'
                            : 'h-[4rem] overflow-hidden'
                        }`}
                        onWheel={(e) => {
                          // Allow wheel scrolling only within the text area when expanded
                          if (expandedCards.has(project.id)) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        <p className={`text-white/70 text-sm leading-relaxed ${
                          !expandedCards.has(project.id) ? 'line-clamp-5' : ''
                        }`}>
                          {t(`projects.descriptions.${project.descriptionKey}`)}
                        </p>
                      </div>

                      {/* Fixed button area - always visible */}
                      <div className="mt-1 flex-shrink-0">
                        {!expandedCards.has(project.id) && (
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedCards);
                              newExpanded.add(project.id);
                              setExpandedCards(newExpanded);
                            }}
                            className="text-[var(--primary)] hover:text-yellow-300 text-sm font-medium transition-colors underline hover:no-underline"
                          >
                            {t('projects.actions.showMore')}
                          </button>
                        )}

                        {expandedCards.has(project.id) && (
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedCards);
                              newExpanded.delete(project.id);
                              setExpandedCards(newExpanded);
                            }}
                            className="text-[var(--primary)] hover:text-yellow-300 text-sm font-medium transition-colors underline hover:no-underline"
                          >
                            {t('projects.actions.showLess')}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status Tags - Always visible at bottom with less margin */}
                    <div className="mt-1">
                      <div className="flex flex-nowrap gap-1 justify-center">
                        {Object.entries(project.metrics).map(([key, value]) => {
                          // Map metric keys to translated labels
                          const getMetricLabel = (metricKey: string) => {
                            const labelMap: { [key: string]: string } = {
                              'status': t('projects.tags.status'),
                              'duration': t('projects.tags.duration'),
                              'satisfaction': t('projects.tags.satisfaction')
                            };
                            return labelMap[metricKey] || metricKey;
                          };

                          return (
                            <div key={key} className="bg-white/5 rounded-lg px-2 py-2 text-center flex-1 min-w-0">
                              <span className="text-white/50 text-xs uppercase tracking-wide block mb-1">
                                {getMetricLabel(key)}
                              </span>
                              <span className="text-sm font-bold whitespace-nowrap" style={{ color: '#d4af37' }}>
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-dark)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
              </motion.div>
            ))}
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 gap-1">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[var(--primary)] scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  style={{ minWidth: 'auto', minHeight: 'auto' }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom border for visual separation */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
};

export default Portfolio;
