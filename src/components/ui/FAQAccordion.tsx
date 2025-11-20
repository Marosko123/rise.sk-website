'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/cn';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  allowMultiple?: boolean;
}

export default function FAQAccordion({ items, className, allowMultiple = false }: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes(prev =>
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "group rounded-xl border overflow-hidden transition-all duration-500",
              isOpen
                ? "bg-gradient-to-br from-white/[0.08] to-transparent border-[var(--primary)]/50 shadow-[0_0_40px_rgba(176,145,85,0.15)]"
                : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
            )}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left"
            >
              <span className={cn(
                "text-lg md:text-xl font-medium transition-colors duration-300 pr-8",
                isOpen ? "text-[var(--primary)]" : "text-white/90 group-hover:text-white"
              )}>
                {item.question}
              </span>
              <div className={cn(
                "relative flex-shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-500",
                isOpen
                  ? "bg-[var(--primary)] text-black rotate-180 shadow-[0_0_15px_rgba(176,145,85,0.4)]"
                  : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
              )}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                    <p className="text-gray-400 leading-relaxed text-base md:text-lg font-light">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
