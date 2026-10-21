import type { Config } from 'tailwindcss';

/**
 * Escala tonal de NICO AUTOMOTORES: azul eléctrico sobre casi negro,
 * tomado del logo (letras "NA" azules sobre fondo oscuro).
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bed5ff',
          300: '#90b8ff',
          400: '#5a91ff',
          500: '#326bff',
          600: '#1a49f0',
          700: '#1636cc',
          800: '#182fa3',
          900: '#1a2d80',
          950: '#0b1240',
        },
        ink: '#0e1116',
        cement: '#3a4150',
        paper: '#f6f8fc',
        line: '#dbe2ee',
        sand: '#eaf0f9',
        whatsapp: { DEFAULT: '#1FA855', bright: '#25D366' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.78rem, 0.76rem + 0.1vw, 0.85rem)',
        'fluid-sm': 'clamp(0.88rem, 0.85rem + 0.15vw, 0.95rem)',
        'fluid-base': 'clamp(1rem, 0.97rem + 0.18vw, 1.08rem)',
        'fluid-lg': 'clamp(1.15rem, 1.05rem + 0.4vw, 1.35rem)',
        'fluid-xl': 'clamp(1.4rem, 1.2rem + 0.9vw, 2rem)',
        'fluid-2xl': 'clamp(1.75rem, 1.35rem + 1.8vw, 2.75rem)',
        'fluid-3xl': 'clamp(2.4rem, 1.5rem + 4.2vw, 5rem)',
        'fluid-hero': 'clamp(2.9rem, 1.4rem + 7vw, 6.5rem)',
      },
      borderRadius: { card: '14px', pill: '999px' },
      boxShadow: {
        card: '0 1px 2px rgba(22,22,22,.04), 0 8px 24px -18px rgba(70,18,20,.45)',
        lift: '0 18px 40px -24px rgba(70,18,20,.5)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.3,1)' },
      aspectRatio: { card: '4 / 5' },
    },
  },
  plugins: [],
};

export default config;
