'use client';

import { motion } from 'framer-motion';
import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface TeamMemberProps {
  id: string;
  name: string;
  role: string;
  image: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  index: number;
}

export const TeamMemberCard = ({ id, name, role, image, socials, index }: TeamMemberProps) => {
  const t = useTranslations('team.members');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 select-none"
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        {image.includes('rise-team.png') ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden transition-transform duration-500 group-hover:scale-110">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.2),transparent_70%)]" />
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />
            <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-light to-primary-dark font-serif z-10 select-none">
              {name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
        ) : (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <p className="text-white text-sm mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 select-text">
            {t(`${id}.bio`)}
          </p>
          <div className="flex gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">
            {socials?.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                <Linkedin size={24} />
              </a>
            )}
            {socials?.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                <Github size={24} />
              </a>
            )}
            {socials?.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                <Twitter size={24} />
              </a>
            )}
            {socials?.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                <Instagram size={24} />
              </a>
            )}
            {socials?.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                <Facebook size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 relative z-10 bg-white dark:bg-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 select-text">{name}</h3>
        <p className="text-primary-600 dark:text-primary-400 font-medium select-text">{role}</p>
      </div>
    </motion.div>
  );
};
