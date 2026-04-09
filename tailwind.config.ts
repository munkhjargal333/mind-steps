// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.ts — Cleaned-up Tailwind v4 configuration
//
// ⚠️  ARCHITECTURE NOTE:
//   Color tokens are NOT defined here.  They live in two places:
//     1. globals.css  :root / .dark  → raw OKLCH values  (--primary, --surface, …)
//     2. globals.css  @theme inline  → Tailwind bridge     (--color-primary, …)
//
//   The old config used rgb(var(--token) / <alpha-value>) which is INCOMPATIBLE
//   with OKLCH colour values.  Tailwind v4 reads --color-* directly from CSS,
//   so all colour definitions have been removed from this file.
// ─────────────────────────────────────────────────────────────────────────────

import type { Config } from 'tailwindcss';

const config: Config = {
  // ── Dark mode: class strategy (controlled by next-themes) ──────────────────
  darkMode: 'class',

  // ── Content paths ──────────────────────────────────────────────────────────
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './contexts/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ── Font family ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },

      // ── Keyframes ────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to:   { opacity: '0', transform: 'translateY(4px)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in':       'fade-in 200ms ease forwards',
        'fade-out':      'fade-out 200ms ease forwards',
        'slide-in':      'slide-in-right 300ms ease forwards',
        'spin-slow':     'spin-slow 2s linear infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
