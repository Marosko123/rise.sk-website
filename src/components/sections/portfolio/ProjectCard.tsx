import { Project } from '@/data/projects';
import { m as motion } from 'framer-motion';
import { Eye, Github, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import OptimizedImage from '../../ui/OptimizedImage';

interface ProjectCardProps {
  project: Project;
  setIsHovered: (isHovered: boolean) => void;
}

export default function ProjectCard({ project, setIsHovered }: ProjectCardProps) {
  const t = useTranslations('portfolio');
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobileApps': return '📱';
      case 'webapp': return '💻';
      case 'ecommerce': return '🛒';
      case 'saas': return '☁️';
      default: return '💻';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'mobileApps': return 'from-pink-500/20 via-rose-500/20 to-orange-500/20';
      case 'webapp': return 'from-blue-500/20 via-indigo-500/20 to-purple-500/20';
      case 'ecommerce': return 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20';
      case 'saas': return 'from-blue-500/20 via-indigo-500/20 to-purple-500/20';
      default: return 'from-gray-500/20 via-slate-500/20 to-zinc-500/20';
    }
  };

  return (
    <motion.div
      className="group relative flex-shrink-0 h-full"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
    >
      <div
        className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden h-[520px] flex flex-col transition-all duration-500 hover:scale-105 hover:bg-white/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Project Image/Preview */}
        <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
          <div className={`h-full w-full bg-gradient-to-br ${getCategoryGradient(project.category)} flex items-center justify-center relative`}>
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
                  onError={() => {}}
                />
              )
            ) : (
              <div className="text-6xl opacity-30">
                {getCategoryIcon(project.category)}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

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
                <div className="bg-gray-500/40 backdrop-blur-md p-2 rounded-full text-gray-400/90 cursor-not-allowed opacity-80">
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
                <div className="bg-gray-500/40 backdrop-blur-md p-2 rounded-full text-gray-400/90 cursor-not-allowed opacity-80">
                  <Lock className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-4 flex flex-col h-full">
          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
            {project.title}
          </h4>

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

          <div className="mb-2 flex-grow flex flex-col">
            <div
              className={`transition-all duration-500 ${
                isExpanded
                  ? 'max-h-[100px] overflow-y-auto scrollbar-thin'
                  : 'h-[4rem] overflow-hidden'
              }`}
              onWheel={(e) => {
                if (isExpanded) e.stopPropagation();
              }}
            >
              <p className={`text-white/70 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-5' : ''}`}>
                {t(`projects.descriptions.${project.descriptionKey}`)}
              </p>
            </div>

            <div className="mt-1 flex-shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[var(--primary)] hover:text-yellow-300 text-sm font-medium transition-colors underline hover:no-underline"
              >
                {isExpanded ? t('projects.actions.showLess') : t('projects.actions.showMore')}
              </button>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex flex-nowrap gap-1 justify-center">
              {Object.entries(project.metrics).map(([key, value]) => {
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

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-dark)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
    </motion.div>
  );
}
