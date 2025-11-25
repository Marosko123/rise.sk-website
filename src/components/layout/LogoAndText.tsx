'use client';

import companyConfig from '@/config/company';
import Image from 'next/image';
import React, { useState } from 'react';

import { useAnimation } from '../providers/AnimationProvider';

interface LogoAndTextProps {
  className?: string;
  onClick?: () => void;
}

function LogoAndText({ className = '', onClick }: LogoAndTextProps) {
  const { animationTime, mounted } = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);

  return (
    <div
      className={`flex items-center space-x-3 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className='transition-transform duration-300 ease-out relative'>
        <Image
          src={companyConfig.website.logo.logoGoldTransparent}
          alt={companyConfig.company.name}
          width={50}
          height={50}
          className='transition-all duration-300 select-none'
          style={mounted ? {
            transform: isHovered
              ? `scale(1.2) rotate(15deg)`
              : `rotate(${Math.sin(animationTime * 0.001) * 5}deg) scale(${1 + Math.sin(animationTime * 0.0015) * 0.07})`,
            filter: isHovered
              ? `brightness(1.2) contrast(1.1) saturate(1.1) drop-shadow(0 0 45px rgba(218, 181, 73, 0.8))`
              : `drop-shadow(0 0 10px rgba(218, 181, 73, ${0.5 + Math.sin(animationTime * 0.002) * 0.1}))`,
            transition: 'transform 0.3s ease-out, filter 0.3s ease-out',
          } : {
            transform: 'rotate(0deg) scale(1)',
            filter: 'drop-shadow(0 0 10px rgba(218, 181, 73, 0.5))',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          draggable={false}
        />

        {/* Floating elements around logo */}
        {mounted && (
          <>
            <div
              className='absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 select-none pointer-events-none'
              style={{
                top: '10%',
                right: '10%',
                transform: `translate(${Math.sin(animationTime * 0.002) * 2}px, ${Math.cos(animationTime * 0.002) * 2.2}px)`,
              }}
            />
            <div
              className='absolute w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-40 select-none pointer-events-none'
              style={{
                bottom: '15%',
                left: '15%',
                transform: `translate(${Math.sin(animationTime * 0.0025 + Math.PI) * 1.3}px, ${Math.cos(animationTime * 0.0025 + Math.PI) * 1.5}px)`,
              }}
            />
          </>
        )}
      </div>

      <div className='relative'>
        <span
          className='text-2xl font-bold text-white inline-block transition-all duration-300 hover:scale-105 select-none'
          style={mounted ? {
            textShadow: isTextHovered
              ? '0 0 25px rgba(218, 181, 73, 0.8)'
              : `0 0 15px rgba(218, 181, 73, 0.4)`,
            color: isTextHovered ? '#DAB549' : 'white',
          } : {}}
          onMouseEnter={() => setIsTextHovered(true)}
          onMouseLeave={() => setIsTextHovered(false)}
        >
          {companyConfig.company.domain.split('').map((letter, index) => (
            <span
              key={index}
              className='inline-block transition-all duration-200 select-none'
              style={mounted ? {
                transform: `translateY(${Math.sin(animationTime * 0.004 + index * 0.5) * 1}px)`,
                animationDelay: `${index * 100}ms`,
              } : {}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.2)';
                e.currentTarget.style.color = '#DAB549';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              {letter}
            </span>
          ))}
        </span>

        {/* Animated golden line under text - matching original */}
        {mounted && (
          <div
            className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 select-none pointer-events-none'
            style={{
              width: `${70 + Math.sin(animationTime * 0.002) * 5}%`,
              transform: `translateX(${Math.sin(animationTime * 0.003) * 20}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(LogoAndText);
