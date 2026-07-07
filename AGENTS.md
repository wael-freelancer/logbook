## Development

Start dev server in background, manage with stop/status/logs:

```
npm run astro dev --background
npm run astro dev stop
npm run astro dev status
npm run astro dev logs
```

Server: `http://127.0.0.1:4321`

### Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server (foreground) |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier |
| `npm run format:check` | Prettier check |
| `npm run astro` | Astro CLI (add, check, etc.) |

### Verification

Before claiming work complete, run **both**:

```
npm run build
npm run lint
```

Build and lint must pass. Optionally run `npm run astro check` for Astro-specific type checking.

## Project Conventions

- **Framework:** Astro 6, `.astro` components only (no React/Vue/Svelte)
- **Styling:** Tailwind CSS with `@tailwindcss/typography` (Prose class), `clsx` + `tailwind-merge` (`cn()` utility in `src/lib/utils.ts`)
- **Design tokens:** CSS custom properties for colors (`--color-bg`, `--color-surface`, `--color-primary`, `--color-text`, etc.), fonts (Inter Variable / JetBrains Mono / Cal Sans), radius, shadows, z-index, animation durations — all exposed in `tailwind.config.cjs` under `extend`
- **Dark mode:** `class` strategy with `localStorage` persistence and `prefers-color-scheme` fallback; FOUC prevention via inline script in `BaseHead.astro`
- **TypeScript:** Strict mode (`astro/tsconfigs/strict`), `@/` alias → `src/`
- **Content collections:** `src/content.config.ts` with Zod schemas — `blog` (title, description max 160 chars, pubDate, updatedDate?, tags[], draft, featured) and `projects` (title, description, tags[], status[active/archived/wip], featured, order default 99, liveUrl?, repoUrl?, startDate, endDate?)
- **Markdown:** MDX with rehype-slug + rehype-autolink-headings (`wrap` behavior); Shiki themes `github-light` / `github-dark-dimmed` with `defaultColor: false` (colors via CSS, not inline styles)
- **Animations:** `motion` library (`^12.41.0`) available; custom Tailwind keyframes for fade, slide, scale, orb-float, gradient-text
- **SEO:** JSON-LD in `BaseHead.astro`, `@astrojs/sitemap`, OG image generation at `src/pages/og/[slug].png.ts` (SVG-based, `prerender = false`, SSR)
- **API routes:** Contact form at `src/pages/api/contact.ts` (Zod validation), views at `src/pages/api/views/`
- **RSS:** `src/pages/rss.xml.ts` using `@astrojs/rss`
- **Deployment:** Vercel adapter (`@astrojs/vercel`)
- **HMR:** Configured for `logbook.test` domain via WSS (port 443)
- **Formatting:** Prettier with `prettier-plugin-astro`, semi, single quotes, trailing commas, 100 print width
- **Linting:** ESLint flat config with `eslint-plugin-astro` (flat/recommended), `eslint-config-prettier`, and `no-console: warn`
- **Package install:** `legacy-peer-deps=true` in `.npmrc` — use `npm install` (not `npm ci`)

### Component Structure

```
src/
├── components/
│   ├── blog/       # Blog-specific components
│   ├── home/       # Home page sections (Hero, FeaturedWork, RecentPosts)
│   ├── icons/      # Inline SVG icon components
│   ├── layout/     # Header, Footer, BaseHead, TagAside
│   ├── projects/   # Project cards, grids, badges
│   ├── seo/        # JSON-LD structured data
│   └── ui/         # Reusable (Badge, Button, Card, Pagination, Prose)
├── layouts/        # Base, BlogPost, Page
├── lib/            # Utility modules (posts.ts, projects.ts, utils.ts)
└── pages/          # Routes + API endpoints (blog/[page], blog/[slug], projects/[slug], tags/, og/[slug], api/contact, api/views)
```

Design docs in `docs/superpowers/plans/` and `docs/superpowers/specs/`.
