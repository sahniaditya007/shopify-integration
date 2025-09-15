/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core dark neutrals inspired by Vercel
        base: {
          1000: '#000000',
          900: '#0a0a0a',
          800: '#111111',
          700: '#121212',
        },
        zinc: {
          50: '#fafafa',
          200: '#e4e4e7', // #D4D4D8-ish
          400: '#a1a1aa',
          500: '#71717a',
          700: '#3f3f46',
          900: '#18181b',
        },
        white: '#ffffff',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        modern: '0 10px 30px rgba(0,0,0,0.35)',
        glass: '0 8px 24px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.06), transparent 40%)',
      },
      borderRadius: {
        xl: '1.25rem',
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      backdropBlur: {
        glass: '14px',
      },
      fontSize: {
        fluid: 'clamp(1rem, 2vw, 1.25rem)',
        'fluid-lg': 'clamp(2rem, 5vw, 3rem)',
        'fluid-sm': 'clamp(0.9rem, 1.5vw, 1.05rem)',
      },
    },
  },
  plugins: [],
};
