/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arc: {
          bg:        '#02050a',
          bg2:       '#050a14',
          card:      'rgba(6,10,20,0.45)',
          blue:      '#00d4ff',
          purple:    '#d400ff',
          pink:      '#ff0055',
          green:     '#00ff88',
          gold:      '#ffd700',
          dim:       '#8ab4f8',
          muted:     '#4a6a90',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],
        body:    ['Rajdhani', 'sans-serif'],
        text:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#00d4ff 0%,#d400ff 50%,#ff0055 100%)',
        'card-gradient': 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(212,0,255,0.08))',
        'btn-gradient':  'linear-gradient(135deg,rgba(0,212,255,0.9),rgba(0,85,255,0.9))',
      },
      boxShadow: {
        'neon-blue':   '0 0 15px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3)',
        'neon-purple': '0 0 15px rgba(212,0,255,0.6), 0 0 40px rgba(212,0,255,0.3)',
        'neon-green':  '0 0 15px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.3)',
        'card':        '0 16px 40px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.08)',
        'card-hover':  '0 20px 50px rgba(0,0,0,0.9), 0 0 20px rgba(0,212,255,0.25)',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '24px',
        'xl4': '32px',
      },
      backdropBlur: {
        'glass': '40px',
      },
      animation: {
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'grid-scroll':  'gridScroll 20s linear infinite',
        'spin-slow':    'spin 3s linear infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'orb-float':    'orbFloat 10s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
          '50%':     { boxShadow: '0 0 30px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.3)' },
        },
        gridScroll: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '50px 50px' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbFloat: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%':     { transform: 'translate(30px,-40px) scale(1.05)' },
          '66%':     { transform: 'translate(-20px,20px) scale(0.95)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16,1,0.3,1)',
        'cinematic': 'cubic-bezier(0.25,0.46,0.45,0.94)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
};
