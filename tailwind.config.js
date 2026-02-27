/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wealth-gold': '#D4AF37',
        'love-pink': '#FF69B4',
        'guanyu-red': '#C41E3A',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'blink': 'blink 0.15s ease-in-out',
        'incense-burn': 'incense-burn 3s linear forwards',
        'smoke-rise': 'smoke-rise 3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.1)' },
        },
        'incense-burn': {
          '0%': { height: '150px' },
          '100%': { height: '0px' },
        },
        'smoke-rise': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
          '100%': { transform: 'translateY(-100px) scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
