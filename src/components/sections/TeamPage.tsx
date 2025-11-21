'use client';

import Footer from '@/components/sections/Footer';
import { teamMembers } from '@/data/team';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { ArrowDown, Facebook, Github, Instagram, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const gradients = [
  "from-amber-500/40 via-orange-500/20 to-yellow-500/20", // Maroš - Gold/Warm
  "from-fuchsia-600/40 via-pink-600/20 to-purple-600/20", // Tatiana - Purple/Pink
  "from-rose-500/40 via-orange-500/20 to-amber-500/20",
  "from-violet-500/40 via-fuchsia-500/20 to-pink-500/20",
  "from-cyan-500/40 via-blue-500/20 to-indigo-500/20",
  "from-emerald-500/40 via-green-500/20 to-lime-500/20",
];

export default function TeamPage() {
  const t = useTranslations('team');
  const tMembers = useTranslations('team.members');
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>('');

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

  // Handle initial hash scroll
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      // Small delay to ensure DOM is ready and layout is stable
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
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
    <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#1a1a1a] text-white relative">
      {/* Side Navigation */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 items-start">
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
      </div>

      {/* Hero Section */}
      <section className="h-full snap-start flex flex-col items-center justify-center relative overflow-hidden px-4 pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        </div>

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
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <motion.button
          onClick={scrollToFirstMember}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-sm uppercase tracking-widest">{t('scrollDown')}</span>
          <ArrowDown className="animate-bounce w-6 h-6" />
        </motion.button>
      </section>

      {/* Team Members */}
      {teamMembers.map((member, index) => (
        <section
          key={member.id}
          id={member.id}
          className="h-full snap-start flex items-center justify-center relative overflow-hidden"
        >
          {/* Background Gradient */}
          <div className={cn(
            "absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000",
            index % 2 === 0
              ? "bg-gradient-to-br from-primary/20 via-transparent to-transparent"
              : "bg-gradient-to-bl from-primary/20 via-transparent to-transparent"
          )} />

          <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20 md:pt-0">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className={cn(
                "relative w-full max-w-[350px] aspect-square flex-shrink-0",
                index % 2 !== 0 && "md:order-2"
              )}
            >
              {/* Animated Background Gradient */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute -inset-10 bg-gradient-to-tr rounded-full blur-3xl opacity-60",
                  gradients[index % gradients.length]
                )}
              />

              {/* Decorative Ring */}
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-1 rounded-full border border-white/10 border-dashed opacity-50"
              />

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative h-full w-full rounded-full overflow-hidden shadow-2xl group"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />

                {/* Subtle Inner Shadow/Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 50 }}
              className={cn(
                "flex flex-col text-center md:text-left max-w-xl",
                index % 2 !== 0 && "md:items-end md:text-right"
              )}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-2 text-white">
                {member.name}
              </h2>
              <p className="text-xl md:text-2xl text-primary font-medium mb-6">
                {tMembers(`${member.id}.role`)}
              </p>

              <div className="w-20 h-1 bg-primary mb-8 mx-auto md:mx-0" />

              <p className="text-lg text-gray-300 leading-relaxed mb-8 text-justify">
                {tMembers(`${member.id}.bio`)}
              </p>

              {/* Personal Details */}
              <div className={cn(
                "flex flex-col gap-8 w-full mt-4",
                index % 2 !== 0 ? "md:items-end" : "md:items-start"
              )}>
                {/* Motto Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={cn(
                    "relative max-w-lg py-2",
                    index % 2 !== 0
                      ? "border-r-4 border-primary pr-6 text-right"
                      : "border-l-4 border-primary pl-6 text-left"
                  )}
                >
                  <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed whitespace-pre-line">
                    {tMembers(`${member.id}.motto`)}
                  </p>
                </motion.div>

                {/* Social Links Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Footer Section */}
      <section className="snap-start">
        <Footer />
      </section>
    </div>
  );
}
