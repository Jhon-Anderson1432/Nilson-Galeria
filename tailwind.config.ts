import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'nilson-gray': {
          DEFAULT: '#2A2A2A',
          dark: '#1A1A1A',
          light: '#4A4A4A',
        },
        'nilson-gold': {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          dark: '#AA882E',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;