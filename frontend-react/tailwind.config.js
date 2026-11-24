/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'ink-sm': '3px 3px 0px #111827',
        'ink': '5px 5px 0px #111827',
        'ink-lg': '8px 8px 0px #111827',
        'ink-red': '5px 5px 0px #D9383A',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        scanLaser: {
          '0%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(110%)' },
          '100%': { transform: 'translateY(-10%)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '70%': { transform: 'scale(1.03)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        floatSlow: 'floatSlow 3.4s ease-in-out infinite',
        scanLaser: 'scanLaser 2s ease-in-out infinite',
        popIn: 'popIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shake: 'shake 0.4s ease-in-out',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
