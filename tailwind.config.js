/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#010201',
          surface:  '#050805',
          card:     '#090d09',
          elevated: '#0e140e',
          hover:    '#141c14',
        },
        brand: {
          green:       '#22ff44',
          'green-dark': '#00cc2a',
          'green-mid':  '#00e535',
          'green-light':'#66ff88',
          'green-dim':  '#004d14',
        },
      },
      boxShadow: {
        'glow-green':    '0 0 28px rgba(34,255,68,0.55)',
        'glow-green-sm': '0 0 14px rgba(34,255,68,0.40)',
        'glow-green-xs': '0 0  8px rgba(34,255,68,0.25)',
        'number-reserved': '0 0 16px rgba(34,255,68,0.45), inset 0 0 12px rgba(34,255,68,0.10)',
      },
      keyframes: {
        pulseGreen: {
          '0%,100%': { boxShadow: '0 0 12px rgba(34,255,68,0.25)' },
          '50%':     { boxShadow: '0 0 35px rgba(34,255,68,0.65), 0 0 65px rgba(34,255,68,0.25)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGreen 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 3s linear infinite',
        'spin-slow':  'spin 4s linear infinite',
      },
      backgroundImage: {
        'gradient-gaming':   'radial-gradient(ellipse at 50% 0%,#030503 0%,#010201 60%,#000000 100%)',
        'gradient-reserved': 'linear-gradient(135deg,#1a3d1a 0%,#0f2a0f 100%)',
        'shimmer-gradient':  'linear-gradient(90deg,transparent 0%,rgba(34,255,68,0.14) 50%,transparent 100%)',
      },
    },
  },
  plugins: [],
}
