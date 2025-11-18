'use client';

import { getPortfolioProjects } from '@/data/projects';
import { useCarousel } from '@/hooks/useCarousel';
import { useTranslations } from '@/hooks/useTranslations';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import PortfolioControls from './PortfolioControls';
import PortfolioStats from './PortfolioStats';
import ProjectCard from './ProjectCard';

export default function Portfolio() {
  const t = useTranslations('portfolio');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const portfolioProjects = getPortfolioProjects(t);

  const {
    currentIndex,
    itemsPerView,
    maxIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsHovered,
  } = useCarousel(portfolioProjects.length);

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
      {/* Background Effects */}
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

        <PortfolioStats />

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
            <div className="overflow-hidden mx-4 md:mx-8">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out items-start"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                }}
              >
                {portfolioProjects.map((project) => (
                  <div
                    key={project.id}
                    className="px-2 md:px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <ProjectCard project={project} setIsHovered={setIsHovered} />
                  </div>
                ))}
              </motion.div>
            </div>

            <PortfolioControls
              prevSlide={prevSlide}
              nextSlide={nextSlide}
              currentIndex={currentIndex}
              maxIndex={maxIndex}
              goToSlide={goToSlide}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </section>
  );
}
