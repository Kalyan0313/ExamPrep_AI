import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#1E1E1E',
          sidebar: '#181818',
          card: '#262626',
          hover: '#2E2E2E',
          border: '#333333',
          purple: '#7F6DF2',
          purpleHover: '#6B57E0',
          text: '#E4E4E7',
          muted: '#A1A1AA',
          success: '#10B981',
          danger: '#E11D48',
        },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
        display: ['var(--font-outfit)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
