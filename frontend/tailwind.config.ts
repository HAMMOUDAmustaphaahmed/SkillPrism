/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'mono': ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        'bg': {
          'base': '#030308',
          'surface': '#0A0A15',
          'card': '#0F0F1E',
          'elevated': '#151528',
          'hover': '#1A1A30',
        },
        'violet': {
          50: '#f5f3ff',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        'cyan': {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981',
        },
        'rose': {
          400: '#fb7185',
          500: '#f43f5e',
        },
        'amber': {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      backgroundImage: {
        'prism-gradient': 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 50%, #10b981 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(6,182,212,0.03) 100%)',
        'glow-violet': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(6,182,212,0.1) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-border': 'pulseBorder 2s ease-in-out infinite',
        'count-up': 'countUp 0.3s ease-out',
        'prism-spin': 'prismSpin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'tag-pop': 'tagPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(124,58,237,0.3)' },
          '50%': { borderColor: 'rgba(124,58,237,0.8)' },
        },
        prismSpin: {
          '0%': { transform: 'rotateY(0deg) rotateX(10deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(10deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        tagPop: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'violet-glow': '0 0 30px rgba(124,58,237,0.3)',
        'cyan-glow': '0 0 20px rgba(6,182,212,0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)',
      },
    },
  },
  plugins: [],
}
