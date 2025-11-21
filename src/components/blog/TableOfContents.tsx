'use client';

import { useEffect, useState } from 'react';
import { slugify } from '@/utils/slugify';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const t = useTranslations('blog');
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Parse headings from raw MDX
    const lines = content.split('\n');
    const extractedHeadings: Heading[] = [];
    
    // Regex to match ## and ### headings, ignoring code blocks
    let inCodeBlock = false;
    
    lines.forEach(line => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return;
      }
      
      if (inCodeBlock) return;

      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugify(text);
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto p-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
        {t('onThisPage')}
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            style={{ paddingLeft: (heading.level - 2) * 16 }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block transition-colors duration-200 hover:text-primary",
                activeId === heading.id 
                  ? "text-primary font-medium border-l-2 border-primary pl-3 -ml-3" 
                  : "text-gray-500"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
