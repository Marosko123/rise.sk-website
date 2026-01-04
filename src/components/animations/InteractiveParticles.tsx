'use client';

import { useParticles } from '@/hooks/useParticles';
import { useEffect } from 'react';

interface InteractiveParticlesProps {
  mounted: boolean;
  isMobile: boolean;
}

export default function InteractiveParticles({ mounted, isMobile }: InteractiveParticlesProps) {
  const { particles, createExplosion } = useParticles();

  useEffect(() => {
    if (isMobile) return;

    const handleClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [createExplosion, isMobile]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='absolute w-1 h-1 rounded-full pointer-events-none select-none will-change-transform'
          style={{
            transform: `translate3d(${particle.x}px, ${particle.y}px, 0) scale(${particle.life / particle.maxLife})`,
            backgroundColor: '#DAB549',
            opacity: (particle.life / particle.maxLife) * 0.4, // Reduced opacity for "dust" look
            boxShadow: '0 0 2px rgba(218, 181, 73, 0.4)',
          }}
        />
      ))}
    </div>
  );
}
