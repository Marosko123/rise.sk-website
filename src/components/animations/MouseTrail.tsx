'use client';

import { useEffect, useState } from 'react';

export default function MouseTrail() {
  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;

      // Update mouse trail (limit to 5 points for better performance)
      setMouseTrail(prev => {
        const newTrail = [{ x: e.clientX, y: e.clientY, opacity: 1 }, ...prev.slice(0, 4)];
        return newTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, 1 - index * 0.3)
        }));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {mouseTrail.map((point, index) => (
        <div
          key={index}
          className='absolute w-2 h-2 rounded-full pointer-events-none select-none will-change-transform'
          style={{
            transform: `translate3d(${point.x - 4}px, ${point.y - 4}px, 0) scale(${point.opacity})`,
            backgroundColor: '#DAB549',
            opacity: point.opacity * 0.5,
            zIndex: 5, // Ensure it's above background but below content
          }}
        />
      ))}
    </>
  );
}
