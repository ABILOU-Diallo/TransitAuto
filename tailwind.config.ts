import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',   // Sky-500
          light: '#38BDF8',
          dark: '#0284C7',
        },
        accent: {
          DEFAULT: '#F59E0B',   // Amber
          light: '#FCD34D',
          dark: '#D97706',
        },
        brand: {
          dark: '#0A0F1E',
          mid: '#111827',
          surface: '#1E293B',
        },
      },
      fontFamily: {
        title: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A0F1E 0%, #0c1a3a 50%, #0A0F1E 100%)',
        'glow-teal': 'radial-gradient(ellipse at center, rgba(14,165,233,0.25) 0%, transparent 70%)',
        'glow-amber': 'radial-gradient(ellipse at center, rgba(245,158,11,0.20) 0%, transparent 70%)',
      },
      boxShadow: {
        'premium': '0 4px 24px -4px rgba(14,165,233,0.25), 0 1px 2px rgba(0,0,0,0.2)',
        'glow': '0 0 40px 8px rgba(14,165,233,0.20)',
        'accent-glow': '0 0 32px 4px rgba(245,158,11,0.30)',
        'glass': '0 8px 32px rgba(0,0,0,0.25)',
        'card': '0 2px 8px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.06)',
        'nav': '0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
