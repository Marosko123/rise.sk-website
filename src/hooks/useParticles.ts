import { useAnimation } from '@/components/AnimationProvider';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const { animationTime } = useAnimation();

  // Animate particles using shared animation context
  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.98,
          }))
          .filter(particle => particle.life > 0)
      );
    };

    // Use shared animation context instead of separate requestAnimationFrame
    animate();
  }, [animationTime]);

  const createExplosion = useCallback((x: number, y: number, count: number = 3) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        maxLife: 30,
      });
    }
    setParticles(prev => [...prev.slice(-10), ...newParticles]); // Limit total particles
  }, []);

  return {
    particles,
    createExplosion
  };
}
