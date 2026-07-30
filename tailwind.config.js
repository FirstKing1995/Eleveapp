/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        elev: {
          bg: '#0B0714',
          bg2: '#120B24',
          surface: '#191233',
          surface2: '#211843',
          border: '#2C2150',
          primary: '#8B5CF6',
          purple: '#A855F7',
          blue: '#5B93FF',
          sky: '#6BA5FF',
          pink: '#E24BF0',
          magenta: '#D946EF',
          text: '#F3F1FB',
          muted: '#A79FC6',
          faint: '#6E6690',
          success: '#34D399',
          warning: '#FBBF24',
          danger: '#FB7185',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'elev-gradient': 'linear-gradient(135deg, #6BA5FF 0%, #A855F7 52%, #E24BF0 100%)',
        'elev-gradient-soft': 'linear-gradient(135deg, rgba(107,165,255,0.16) 0%, rgba(168,85,247,0.16) 52%, rgba(226,75,240,0.16) 100%)',
        'elev-radial': 'radial-gradient(1200px 600px at 80% -10%, rgba(107,165,255,0.14), transparent 60%), radial-gradient(900px 500px at 0% 20%, rgba(226,75,240,0.10), transparent 55%)',
      },
      boxShadow: {
        'elev-card': '0 18px 50px -20px rgba(0,0,0,0.65)',
        'elev-glow': '0 10px 40px -10px rgba(139,92,246,0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
        '2xl2': '1.75rem',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
