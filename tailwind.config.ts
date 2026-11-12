import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffdf0',
          100: '#fffbe0',
          200: '#fff5b3',
          300: '#ffec7a',
          400: '#ffe040',
          500: '#FFD700',
          600: '#e6b800',
          700: '#cc9900',
          800: '#a37a00',
          900: '#7a5c00',
        },
        dark: {
          100: '#2a2a2a',
          200: '#222222',
          300: '#1c1c1c',
          400: '#181818',
          500: '#141414',
          600: '#111111',
          700: '#0d0d0d',
          800: '#0a0a0a',
          900: '#050505',
        },
        'blue-accent': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-gold': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 0 15px rgba(255, 215, 0, 0)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
