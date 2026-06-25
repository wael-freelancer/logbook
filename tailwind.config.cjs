const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--color-bg) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--color-surface-2) / <alpha-value>)',
        'surface-3': 'hsl(var(--color-surface-3) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'hsl(var(--color-primary-hover) / <alpha-value>)',
        'primary-subtle': 'hsl(var(--color-primary-subtle) / <alpha-value>)',
        text: {
          DEFAULT: 'hsl(var(--color-text) / <alpha-value>)',
          secondary: 'hsl(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'hsl(var(--color-text-tertiary) / <alpha-value>)',
          inverse: 'hsl(var(--color-text-inverse) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'hsl(var(--color-border) / <alpha-value>)',
          strong: 'hsl(var(--color-border-strong) / <alpha-value>)',
        },
        code: {
          bg: 'hsl(var(--color-code-bg) / <alpha-value>)',
          text: 'hsl(var(--color-code-text) / <alpha-value>)',
        },
        'inline-code': {
          bg: 'hsl(var(--color-inline-code-bg) / <alpha-value>)',
          text: 'hsl(var(--color-inline-code-text) / <alpha-value>)',
        },
        success: 'hsl(var(--color-success) / <alpha-value>)',
        warning: 'hsl(var(--color-warning) / <alpha-value>)',
        danger: 'hsl(var(--color-danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter Variable', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
        display: ['Cal Sans', ...fontFamily.sans],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-base)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        DEFAULT: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        orbFloat: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(15px, -10px) scale(1.05)' },
          '66%': { transform: 'translate(-10px, 8px) scale(0.95)' },
          '100%': { transform: 'translate(5px, -5px) scale(1.02)' },
        },
        gradientText: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 0%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms cubic-bezier(0, 0, 0.2, 1)',
        'fade-out': 'fade-out 250ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-up': 'slide-up 250ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-down': 'slide-down 250ms cubic-bezier(0, 0, 0.2, 1)',
        'scale-in': 'scale-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-right': 'slide-in-right 250ms cubic-bezier(0, 0, 0.2, 1)',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'orb-float': 'orbFloat 20s ease-in-out infinite alternate',
        'gradient-text': 'gradientText 8s ease-in-out infinite',
      },
      zIndex: {
        below: 'var(--z-below)',
        base: 'var(--z-base)',
        raised: 'var(--z-raised)',
        overlay: 'var(--z-overlay)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
