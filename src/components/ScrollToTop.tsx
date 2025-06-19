'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Observer to detect when About section comes into view
    const aboutSection = document.getElementById('about');
    
    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // About section is visible, show the scroll to top button
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(aboutSection);

    // Check scroll position - only hide when at very top
    const handleScroll = () => {
      // Only hide when we're at the very top (before About section)
      if (window.scrollY < 100) {
        const aboutRect = aboutSection.getBoundingClientRect();
        // Hide only if About section is not yet visible
        if (aboutRect.top > window.innerHeight) {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className='fixed bottom-8 right-8 z-50 p-3 bg-[#B09155] hover:bg-[#9A7F4B] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110'
          style={{
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(176, 145, 85, 0.3)',
          }}
          whileHover={{ 
            boxShadow: '0 0 20px rgba(176, 145, 85, 0.5)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className='w-5 h-5' />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
