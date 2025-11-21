'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
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
    email?: string;
  };
  index: number;
}

export default function TeamCard({ id, name, role, image, socials, index }: TeamMemberProps) {
  const t = useTranslations('team.members');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex gap-4 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {socials?.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Linkedin size={24} />
              </a>
            )}
            {socials?.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Github size={24} />
              </a>
            )}
            {socials?.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                <Twitter size={24} />
              </a>
            )}
            {socials?.email && (
              <a href={`mailto:${socials.email}`} className="hover:text-primary-400 transition-colors">
                <Mail size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 relative z-10 bg-white dark:bg-gray-900">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-primary-600 font-medium mb-3">{t(`${id}.role`) || role}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {t(`${id}.bio`)}
        </p>
      </div>
    </motion.div>
  );
}
