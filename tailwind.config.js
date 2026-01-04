/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          darker: 'var(--primary-darker)',
          light: 'var(--primary-light)',
        },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        foreground: 'var(--foreground)',
        'neutral-dark': 'var(--neutral-dark)',
        border: 'var(--border)',
        glow: 'var(--glow)',
      },
      keyframes: {
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'float-particle': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(var(--tx), var(--ty))' },
          '50%': { transform: 'translate(0, 0)' },
          '75%': { transform: 'translate(calc(var(--tx) * -1), calc(var(--ty) * -1))' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'rotate-very-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.6 },
        },
        'pulse-bright': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        'float-vertical': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
        'drift-slow': {
          '0%': { transform: 'translate(0, 0) rotate(var(--tw-rotate))' },
          '50%': { transform: 'translate(10px, -10px) rotate(var(--tw-rotate))' },
          '100%': { transform: 'translate(0, 0) rotate(var(--tw-rotate))' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
      },
      animation: {
        'text-shimmer': 'text-shimmer 2s linear infinite',
        'float-particle': 'float-particle var(--duration) ease-in-out infinite',
        'rotate-slow': 'rotate-slow 12s linear infinite',
        'rotate-very-slow': 'rotate-very-slow 40s linear infinite',
        'pulse-slow': 'pulse-slow 6s ease-in-out infinite',
        'pulse-bright': 'pulse-bright 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-horizontal': 'float-horizontal 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'float-vertical': 'float-vertical 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'drift-slow': 'drift-slow 10s ease-in-out infinite',
        'blob': 'blob 10s infinite',
        'sheen': 'sheen 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
