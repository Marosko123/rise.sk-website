'use client';

import Footer from '@/components/sections/Footer';
import { teamMembers } from '@/data/team';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { ArrowDown, Facebook, Github, Instagram, Linkedin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import FadeIn from '@/components/animations/FadeIn';

const MultiStepContactForm = dynamic(() => import('@/components/features/MultiStepContactForm'));

const gradients = [
  "from-primary/40 via-amber-500/20 to-yellow-500/20",
  "from-yellow-600/40 via-primary/20 to-amber-400/20",
  "from-amber-500/40 via-orange-500/20 to-primary/20",
  "from-primary/40 via-yellow-500/20 to-orange-400/20",
  "from-orange-500/40 via-primary/20 to-amber-500/20",
  "from-yellow-500/40 via-amber-500/20 to-primary/20",
];

export default function TeamPage() {
  const t = useTranslations('team');
  const tMembers = useTranslations('team.members');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>('');

  const contactId = locale === 'sk' ? 'kontakt' : 'contact';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              window.history.replaceState(null, '', `#${id}`);
              setActiveId(id);
            } else {
              // Clear hash when on hero section (which has no ID)
              window.history.replaceState(null, '', ' ');
              setActiveId('');
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.5,
      }
    );

    // Observe all sections including hero (which is the first child)
    Array.from(container.children).forEach((child) => {
      if (child.tagName === 'SECTION') {
        observer.observe(child);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Handle initial hash scroll and hash changes
  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Handle initial load
    setTimeout(handleHashScroll, 100);

    // Handle hash changes (e.g. from navbar)
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  const scrollToMember = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFirstMember = () => {
    const firstMember = document.getElementById(teamMembers[0].id);
    if (firstMember) {
      firstMember.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-proximity scroll-smooth text-white relative select-none">
      {/* Side Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden 2xl:flex flex-col gap-4 items-start">
        {teamMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => scrollToMember(member.id)}
            className={cn(
              "transition-all duration-300 text-left origin-left",
              activeId === member.id
                ? "text-base text-primary font-bold scale-110"
                : "text-xs text-gray-600 hover:text-gray-400 font-medium"
            )}
            aria-label={`Scroll to ${member.name}`}
          >
            {member.name}
          </button>
        ))}
        <button
          onClick={() => scrollToMember('join-us')}
          className={cn(
            "transition-all duration-300 text-left origin-left mt-4",
            activeId === 'join-us'
              ? "text-base text-primary font-bold scale-110"
              : "text-xs text-gray-600 hover:text-gray-400 font-medium"
          )}
          aria-label="Scroll to Join Us"
        >
          {t('joinUs.title')}
        </button>
      </div>

      {/* Hero Section */}
      <section className="min-h-[100dvh] md:h-full snap-start flex flex-col items-center justify-center relative overflow-hidden px-4 pb-32">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            {t('title')} <span className="gradient-text">{t('titleHighlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed select-text"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <motion.button
          onClick={scrollToFirstMember}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 text-gray-300 hover:text-primary transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-sm uppercase tracking-widest font-medium">{t('scrollDown')}</span>
          <ArrowDown className="animate-bounce w-6 h-6" />
        </motion.button>
      </section>

      {/* Team Members */}
      {teamMembers.map((member, index) => (
        <section
          key={member.id}
          id={member.id}
          className="min-h-[100dvh] md:h-full snap-start flex items-center justify-center relative overflow-hidden"
        >
          {/* Background Gradient */}
          <div className={cn(
            "absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000",
            index % 2 === 0
              ? "bg-gradient-to-br from-primary/20 via-transparent to-transparent"
              : "bg-gradient-to-bl from-primary/20 via-transparent to-transparent"
          )} />

          <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 py-12 md:py-0">
            {/* Image Section */}
            <FadeIn
              className={cn(
                "relative w-full max-w-[160px] md:max-w-[350px] aspect-square flex-shrink-0",
                index % 2 !== 0 && "md:order-2"
              )}
              direction="none"
              once={false}
              amount={0.2}
            >
              {/* Animated Background Gradient */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute -inset-10 bg-gradient-to-tr rounded-3xl blur-3xl opacity-60",
                  gradients[index % gradients.length]
                )}
              />

              {/* Decorative Ring */}
              <div
                 className="absolute -inset-1 rounded-3xl border border-white/10 border-dashed opacity-50"
              />

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl group"
              >
                {member.image.includes('rise-team.png') ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.15),transparent_70%)]" />
                    <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-light to-primary-dark font-serif z-10">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 160px, (max-width: 1200px) 300px, 350px"
                    priority={index === 0}
                  />
                )}

                {/* Subtle Inner Shadow/Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </motion.div>
            </FadeIn>

            {/* Content Section */}
            <FadeIn
              direction={index % 2 === 0 ? 'right' : 'left'}
              delay={0.2}
              once={false}
              amount={0.2}
              className={cn(
                "flex flex-col text-center md:text-left max-w-xl pb-10 md:pb-0",
                index % 2 !== 0 && "md:items-end md:text-right"
              )}
            >
              <h2 className="text-3xl md:text-6xl font-bold mb-2 text-white select-text">
                {member.name}
              </h2>
              <p className="text-lg md:text-2xl text-primary font-medium mb-6 select-text">
                {tMembers(`${member.id}.role`)}
              </p>

              <div className="w-20 h-1 bg-primary mb-6 md:mb-8 mx-auto md:mx-0" />

              <p className="text-sm md:text-lg text-gray-300 leading-relaxed mb-6 md:mb-8 text-justify select-text">
                {tMembers(`${member.id}.bio`)}
              </p>

              {/* Personal Details */}
              <div className={cn(
                "flex flex-col gap-6 md:gap-8 w-full mt-2 md:mt-4 items-center",
                index % 2 !== 0 ? "md:items-end" : "md:items-start"
              )}>
                {/* Motto Section */}
                <FadeIn
                  delay={0.4}
                  className={cn(
                    "relative max-w-lg py-2",
                    index % 2 !== 0
                      ? "md:border-r-4 md:border-primary md:pr-6 md:text-right"
                      : "md:border-l-4 md:border-primary md:pl-6 md:text-left",
                    "border-l-4 border-primary pl-4 text-left md:border-l-0 md:pl-0" // Mobile default: left border
                  )}
                >
                  <p className="text-xl md:text-3xl font-serif italic text-white/90 leading-relaxed whitespace-pre-line select-text">
                    {tMembers(`${member.id}.motto`)}
                  </p>
                </FadeIn>

                {/* Social Links Section */}
                <FadeIn
                  delay={0.5}
                  className={cn(
                    "flex gap-4",
                    index % 2 !== 0 ? "justify-end" : "justify-start"
                  )}
                >
                  {member.socials?.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all duration-300"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {member.socials?.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all duration-300"
                      aria-label={`${member.name} GitHub`}
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {member.socials?.instagram && (
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all duration-300"
                      aria-label={`${member.name} Instagram`}
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {member.socials?.facebook && (
                    <a
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all duration-300"
                      aria-label={`${member.name} Facebook`}
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                  )}
                </FadeIn>
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* Join Us Section */}
      <section
        id="join-us"
        className="min-h-[100dvh] md:h-full snap-start flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-bold mb-6 text-white">
              {t('joinUs.title')}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-12 select-text">
              {t('joinUs.description')}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <button
              onClick={() => scrollToMember(contactId)}
              className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary/90 transition-colors inline-block cursor-pointer"
            >
              {t('joinUs.button')}
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id={contactId}
        className="min-h-[100dvh] md:h-full snap-start flex items-center justify-center relative overflow-hidden"
      >
        <MultiStepContactForm id={contactId} />
      </section>

      {/* Footer Section */}
      <section className="snap-start">
        <Footer />
      </section>
    </div>
  );
}
