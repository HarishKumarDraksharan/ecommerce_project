/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand Colors ───────────────────────────────────────
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',   // Main brand royal blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0b132b',
        },
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',   // Accent purple
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        dark: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#3b82f6',
      },

      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // ── Animations ─────────────────────────────────────────
      animation: {
        'fade-in':      'fadeIn 0.3s ease-out',
        'fade-up':      'fadeUp 0.4s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'slide-right':  'slideRight 0.3s ease-out',
        'bounce-soft':  'bounceSoft 0.6s ease',
        'spin-slow':    'spin 3s linear infinite',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s infinite',
        'scale-in':     'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn:     { from: { opacity: 0 }, to: { opacity: 1 } },
        fadeUp:     { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn:    { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        slideRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        pulseSoft:  { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
        shimmer:    { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        scaleIn:    { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      },

      // ── Box Shadows ────────────────────────────────────────
      boxShadow: {
        'card':      '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 8px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
        'dropdown':  '0 10px 40px rgba(0,0,0,0.15)',
        'modal':     '0 25px 50px rgba(0,0,0,0.25)',
        'glow':      '0 0 20px rgba(249,115,22,0.4)',
        'glow-purple':'0 0 20px rgba(217,70,239,0.4)',
      },

      // ── Border Radius ──────────────────────────────────────
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
        'xl4': '2rem',
      },

      // ── Backdrop Blur ─────────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Gradients ─────────────────────────────────────────
      backgroundImage: {
        'gradient-primary':  'linear-gradient(135deg, #f97316 0%, #d946ef 100%)',
        'gradient-dark':     'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(217,70,239,0.05) 100%)',
        'shimmer-gradient':  'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        'shimmer-dark':      'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
      },
    },
  },
  plugins: [],
}
