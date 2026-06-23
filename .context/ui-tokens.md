# UI Tokens — Design System Foundation

All visual values are defined here as CSS custom properties. Tailwind maps to these tokens — never use raw hex/rgb values in components.

---

## Color System

### Palette (Raw Values)

These are the raw palette values. Never use these directly in components — use semantic tokens below.

```css
/* Neutrals */
--palette-gray-50:  #f8fafc;
--palette-gray-100: #f1f5f9;
--palette-gray-200: #e2e8f0;
--palette-gray-300: #cbd5e1;
--palette-gray-400: #94a3b8;
--palette-gray-500: #64748b;
--palette-gray-600: #475569;
--palette-gray-700: #334155;
--palette-gray-800: #1e293b;
--palette-gray-900: #0f172a;
--palette-gray-950: #020617;

/* Brand — Indigo/Violet */
--palette-indigo-400: #818cf8;
--palette-indigo-500: #6366f1;
--palette-indigo-600: #4f46e5;
--palette-violet-400: #a78bfa;
--palette-violet-500: #8b5cf6;

/* Accent — Amber (for highlights, callouts) */
--palette-amber-400: #fbbf24;
--palette-amber-500: #f59e0b;

/* Semantic — Status */
--palette-green-500: #22c55e;
--palette-red-500:   #ef4444;
--palette-yellow-500: #eab308;
```

### Semantic Tokens

These are what components use. They switch between light and dark mode.

```css
/* src/styles/global.css */

:root,
[data-theme="light"] {
  /* Backgrounds */
  --color-bg:          220 14% 98%;   /* slate-50 equivalent */
  --color-surface:     0 0% 100%;     /* pure white cards */
  --color-surface-2:   220 14% 96%;   /* subtle inner surface */
  --color-surface-3:   220 13% 91%;   /* hover states */

  /* Borders */
  --color-border:      220 13% 91%;   /* default border */
  --color-border-strong: 215 16% 82%; /* emphasis border */

  /* Text */
  --color-text:        222 47% 11%;   /* primary text — near black */
  --color-text-secondary: 215 25% 35%; /* secondary labels */
  --color-text-tertiary:  218 11% 65%; /* muted / disabled */
  --color-text-inverse: 0 0% 100%;    /* text on dark bg */

  /* Brand */
  --color-primary:     239 84% 67%;   /* indigo-500 */
  --color-primary-hover: 238 76% 60%; /* indigo-600 */
  --color-primary-subtle: 238 100% 97%; /* indigo-50 */

  /* Code */
  --color-code-bg:     222 47% 11%;   /* dark bg for code blocks */
  --color-code-text:   210 40% 96%;
  --color-inline-code-bg: 220 13% 94%;
  --color-inline-code-text: 238 76% 60%;

  /* Status */
  --color-success:     142 76% 36%;
  --color-warning:     38 92% 50%;
  --color-danger:      0 72% 51%;
}

[data-theme="dark"] {
  /* Backgrounds */
  --color-bg:          222 47% 7%;    /* near black, slight blue tint */
  --color-surface:     222 47% 10%;
  --color-surface-2:   222 47% 13%;
  --color-surface-3:   222 47% 16%;

  /* Borders */
  --color-border:      215 28% 17%;
  --color-border-strong: 215 20% 25%;

  /* Text */
  --color-text:        213 31% 91%;
  --color-text-secondary: 215 20% 65%;
  --color-text-tertiary:  215 14% 45%;
  --color-text-inverse: 222 47% 7%;

  /* Brand */
  --color-primary:     239 84% 73%;   /* indigo-400 — brighter for dark bg */
  --color-primary-hover: 239 84% 80%;
  --color-primary-subtle: 238 50% 15%;

  /* Code */
  --color-code-bg:     222 47% 5%;
  --color-code-text:   210 40% 92%;
  --color-inline-code-bg: 222 47% 14%;
  --color-inline-code-text: 239 84% 73%;

  /* Status */
  --color-success:     142 69% 58%;
  --color-warning:     48 96% 53%;
  --color-danger:      0 91% 71%;
}
```

---

## Typography

### Typefaces

| Role | Font | Fallback | Notes |
|---|---|---|---|
| Display / Headings | **Cal Sans** | system-ui | Geometric, high x-height. Used for h1–h3 |
| Body | **Inter Variable** | system-ui | Excellent readability at all sizes |
| Monospace | **JetBrains Mono** | monospace | Code blocks and inline code |

### Font Loading

```css
/* src/styles/global.css */

@font-face {
  font-family: 'Cal Sans';
  src: url('/fonts/CalSans-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/InterVariable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 800;
  font-display: swap;
}
```

Preload in `<BaseHead>`:
```astro
<link rel="preload" href="/fonts/CalSans-SemiBold.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin />
```

### Type Scale (CSS Custom Properties)

```css
:root {
  /* Font sizes — fluid where appropriate */
  --text-xs:    0.75rem;   /* 12px */
  --text-sm:    0.875rem;  /* 14px */
  --text-base:  1rem;      /* 16px */
  --text-lg:    1.125rem;  /* 18px */
  --text-xl:    1.25rem;   /* 20px */
  --text-2xl:   1.5rem;    /* 24px */
  --text-3xl:   1.875rem;  /* 30px */
  --text-4xl:   2.25rem;   /* 36px */
  --text-5xl:   3rem;      /* 48px — Hero */
  --text-6xl:   3.75rem;   /* 60px — Large hero */

  /* Line heights */
  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
  --leading-loose:   2;

  /* Letter spacing */
  --tracking-tight:  -0.025em;
  --tracking-normal:  0;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;
  --tracking-widest:  0.1em;

  /* Font weights */
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

---

## Spacing

All spacing is based on a 4px base unit. Use Tailwind's default spacing scale (which maps to these).

```css
:root {
  --space-px:  1px;
  --space-0:   0;
  --space-1:   0.25rem;  /* 4px */
  --space-2:   0.5rem;   /* 8px */
  --space-3:   0.75rem;  /* 12px */
  --space-4:   1rem;     /* 16px */
  --space-5:   1.25rem;  /* 20px */
  --space-6:   1.5rem;   /* 24px */
  --space-8:   2rem;     /* 32px */
  --space-10:  2.5rem;   /* 40px */
  --space-12:  3rem;     /* 48px */
  --space-16:  4rem;     /* 64px */
  --space-20:  5rem;     /* 80px */
  --space-24:  6rem;     /* 96px */
  --space-32:  8rem;     /* 128px */
}

/* Page-level layout spacing */
:root {
  --page-max-width:    1280px;
  --content-max-width: 720px;   /* Optimal reading width */
  --page-padding-x:    1.5rem;  /* Mobile */

  @media (min-width: 768px) {
    --page-padding-x: 2rem;
  }
  @media (min-width: 1024px) {
    --page-padding-x: 3rem;
  }
}
```

---

## Borders, Radius, Shadows

```css
:root {
  /* Border widths */
  --border-thin:   1px;
  --border-base:   1px;
  --border-thick:  2px;

  /* Border radius */
  --radius-sm:   0.25rem;   /* 4px — badges, small elements */
  --radius-base: 0.5rem;    /* 8px — cards, inputs */
  --radius-lg:   0.75rem;   /* 12px — large cards */
  --radius-xl:   1rem;      /* 16px — hero elements */
  --radius-2xl:  1.5rem;    /* 24px — feature cards */
  --radius-full: 9999px;    /* pills */

  /* Shadows */
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 0 3px hsl(var(--color-primary) / 0.2);  /* Focus ring */
}

/* Dark mode — more subtle shadows */
[data-theme="dark"] {
  --shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
  --shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
  --shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
}
```

---

## Animation

```css
:root {
  /* Durations */
  --duration-instant:  50ms;
  --duration-fast:    150ms;
  --duration-base:    250ms;
  --duration-slow:    400ms;
  --duration-slower:  600ms;

  /* Easings */
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);
  --ease-out:    cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Slight overshoot */
  --ease-sharp:  cubic-bezier(0.4, 0, 0.6, 1);
}

/* Standard transition classes */
.transition-base {
  transition: color var(--duration-base) var(--ease-in-out),
              background-color var(--duration-base) var(--ease-in-out),
              border-color var(--duration-base) var(--ease-in-out),
              opacity var(--duration-base) var(--ease-in-out);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Z-Index Scale

```css
:root {
  --z-below:    -1;
  --z-base:      0;
  --z-raised:    1;
  --z-overlay:  10;
  --z-dropdown: 20;
  --z-sticky:   30;
  --z-fixed:    40;
  --z-modal:    50;
  --z-toast:    60;
  --z-tooltip:  70;
}
```

---

## Tailwind Mapping

All tokens above are mapped in `tailwind.config.cjs`:

```javascript
// Examples — complete mapping in tailwind.config.cjs
theme: {
  extend: {
    colors: {
      bg:       'hsl(var(--color-bg) / <alpha-value>)',
      surface:  'hsl(var(--color-surface) / <alpha-value>)',
      primary:  'hsl(var(--color-primary) / <alpha-value>)',
      text: {
        DEFAULT:   'hsl(var(--color-text) / <alpha-value>)',
        secondary: 'hsl(var(--color-text-secondary) / <alpha-value>)',
        tertiary:  'hsl(var(--color-text-tertiary) / <alpha-value>)',
      },
      border: {
        DEFAULT: 'hsl(var(--color-border) / <alpha-value>)',
        strong:  'hsl(var(--color-border-strong) / <alpha-value>)',
      },
    },
    fontFamily: {
      sans:    ['Inter Variable', 'system-ui', 'sans-serif'],
      mono:    ['JetBrains Mono', 'monospace'],
      display: ['Cal Sans', 'system-ui', 'sans-serif'],
    },
    borderRadius: {
      sm:   'var(--radius-sm)',
      DEFAULT: 'var(--radius-base)',
      lg:   'var(--radius-lg)',
      xl:   'var(--radius-xl)',
      '2xl': 'var(--radius-2xl)',
    },
    boxShadow: {
      sm:   'var(--shadow-sm)',
      DEFAULT: 'var(--shadow-base)',
      md:   'var(--shadow-md)',
      lg:   'var(--shadow-lg)',
      glow: 'var(--shadow-glow)',
    },
    transitionDuration: {
      instant: 'var(--duration-instant)',
      fast:    'var(--duration-fast)',
      DEFAULT: 'var(--duration-base)',
      slow:    'var(--duration-slow)',
    },
  },
},
```
