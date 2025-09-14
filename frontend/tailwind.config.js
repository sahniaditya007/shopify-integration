/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f0f23',
          800: '#1a1a2e',
        },
        accent: {
          purple: '#6366f1',
          blue: '#818cf8',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
        glass: {
          light: 'rgba(255,255,255,0.15)',
          dark: 'rgba(24,26,46,0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        modern: '0 4px 32px 0 rgba(15,15,35,0.25)',
        glass: '0 8px 32px 0 rgba(80,80,120,0.18)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
      },
      borderRadius: {
        lg: '1.5rem',
        md: '1rem',
        sm: '0.5rem',
      },
      backdropBlur: {
        glass: '16px',
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
