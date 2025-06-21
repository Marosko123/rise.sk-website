'use client';

import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Eye } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState, useRef } from 'react';

// Portfolio projects data - real projects from rise.sk
const portfolioProjects = [
  {
    id: 1,
    title: 'Viac Ako Ni(c)K',
    description: 'Flutter mobilná aplikácia pre chat detskej linky pomoci. Bezpečná komunikácia pre deti a mladých ľudí.',
    category: 'mobileApps',
    image: '/viac_ako_nick.svg',
    tags: ['Flutter', 'Dart', 'Firebase', 'Chat', 'Security'],
    liveUrl: 'https://viacakonick.gov.sk/mam-viac-ako-12-rokov/',
    githubUrl: null,
    featured: true,
    metrics: {
      platform: 'Gov.sk',
      impact: 'Detská pomoc',
      security: 'Enterprise'
    }
  },
  {
    id: 2,
    title: 'RUNology',
    description: 'React Native mobilná aplikácia pre iOS a Android. Bežecká aplikácia so sledovaním tréningov, štatistík a komunitou bežcov.',
    category: 'mobileApps',
    image: '/runology.jpg',
    tags: ['React Native', 'iOS', 'Android', 'GPS', 'Analytics'],
    liveUrl: 'https://runology.app/',
    githubUrl: null,
    featured: true,
    metrics: {
      platform: 'App Store',
      users: 'Active',
      rating: '4.5/5'
    }
  },
  {
    id: 3,
    title: '2 Ring Slovensko',
    description: 'Dlhodobá individuálna spolupráca s 2 Ring na vývoji komplexných business aplikácií.',
    category: 'webapp',
    image: '/2ring.svg',
    tags: ['Vue.js', 'C#', 'SQL', 'Aurelia', 'Enterprise'],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    metrics: {
      duration: '2+ roky',
      type: 'Spolupráca',
      status: 'Aktívne'
    }
  }
];

interface PortfolioProps {
  className?: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ className = '' }) => {
  const t = useTranslations('portfolio');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const projectVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
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
      className={`py-24 relative overflow-hidden ${className}`}
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-50" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center rounded-full glass px-6 py-3 text-sm font-medium text-white/90 mb-6">
              <span className="text-2xl mr-2">🎨</span>
              {t('badge')}
            </span>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {t('title')}{' '}
            <span className="gradient-text-animated">
              {t('titleHighlight')}
            </span>
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {[
            { key: 'projectsCompleted', icon: '📊', color: 'from-blue-500 to-cyan-500' },
            { key: 'clientSatisfaction', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { key: 'avgDeliveryTime', icon: '🚀', color: 'from-green-500 to-emerald-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className="glass-effect rounded-2xl p-8 text-center group hover:glow-hover transition-all duration-500 magnetic"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4 float-animation">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                {t(`stats.${stat.key}.number`)}
              </div>
              <div className="text-white/60 font-medium">
                {t(`stats.${stat.key}.label`)}
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 gradient-text-animated">
              {t('projects.featured.title')}
            </h3>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t('projects.featured.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={projectVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Card */}
                <div className="glass-effect rounded-3xl overflow-hidden h-full transition-all duration-500 hover:glow-hover">
                  {/* Project Image/Preview */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className={`h-full w-full bg-gradient-to-br ${getCategoryGradient(project.category)} flex items-center justify-center relative`}>
                      {/* Background image */}
                      {project.image ? (
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          className="object-cover opacity-80"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          quality={85}
                          onError={() => {
                            // Fallback handled by Next.js
                          }}
                        />
                      ) : (
                        <div className="text-8xl opacity-30">
                          {getCategoryIcon(project.category)}
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Project title overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h4 className="text-white font-bold text-lg drop-shadow-lg">
                          {project.title}
                        </h4>
                      </div>
                      
                      {/* Overlay on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex space-x-4">
                          {project.liveUrl && (
                            <motion.a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn-modern flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
                            >
                              <Eye className="h-4 w-4" />
                              <span>{t('projects.actions.demo')}</span>
                            </motion.a>
                          )}
                          {project.githubUrl && (
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="glass flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              <span>{t('projects.actions.code')}</span>
                            </motion.a>
                          )}
                          {!project.liveUrl && !project.githubUrl && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="glass flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-white/60"
                            >
                              <span>{t('projects.actions.privateProject')}</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                        {project.title}
                      </h4>
                      {project.liveUrl && (
                        <ExternalLink className="h-5 w-5 text-white/40 group-hover:text-[var(--primary)] transition-colors" />
                      )}
                    </div>
                    
                    <p className="text-white/70 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="glass px-3 py-1 rounded-full text-xs font-medium text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                            {value}
                          </div>
                          <div className="text-xs text-white/50 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-dark)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="glass-effect rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 gradient-text-animated">
                {t('cta.title')}
              </h3>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-modern px-8 py-4 rounded-full text-lg font-semibold text-white shadow-2xl"
                >
                  {t('cta.startProject')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass border-2 border-[var(--primary)]/50 px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-[var(--primary)]/10 transition-all"
                >
                  {t('cta.viewMore')}
                </motion.button>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
