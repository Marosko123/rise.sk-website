'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(true); // Set to true to always show for testing

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY || document.documentElement.scrollTop;
  //     // Show button when user has scrolled more than 50px from top
  //     setIsVisible(scrollTop > 50);
  //   };

  //   // Check initial scroll position
  //   const initialScrollTop = window.scrollY || document.documentElement.scrollTop;
  //   setIsVisible(initialScrollTop > 50);

  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className='p-4 bg-[#B09155] hover:bg-[#9A7F4B] text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110'
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(176, 145, 85, 0.3)',
            WebkitBackdropFilter: 'blur(10px)', // Safari support
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp className='w-5 h-5' />
        </button>
      )}
    </>
  );
}
