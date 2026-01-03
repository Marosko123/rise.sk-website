'use client';

import { getPortfolioProjects } from '@/data/projects';
import { useCarousel } from '@/hooks/useCarousel';
import { useSwipe } from '@/hooks/useSwipe';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import PortfolioControls from './PortfolioControls';
import PortfolioStats from './PortfolioStats';
import ProjectCard from './ProjectCard';

export default function Portfolio({ id = 'portfolio' }: { id?: string }) {
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
  } = useCarousel(portfolioProjects.length, { mobileItems: 1.2, autoPlayInterval: 3000 });

  const swipeHandlers = useSwipe({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
  });

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
      id={id}
      ref={ref}
      className="py-16 relative overflow-hidden"
    >
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
          <div className="relative" {...swipeHandlers}>
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
    </section>
  );
}
