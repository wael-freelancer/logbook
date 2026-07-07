## Development

When starting the dev server, use background mode:

```
npm run astro dev --background
```

Manage the background server with `npm run astro dev stop`, `npm run astro dev status`, and `npm run astro dev logs`.

Server runs on `http://127.0.0.1:4321`.

### Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run astro` | Astro CLI (add, check, etc.) |

## Verification

Before claiming work is complete, run `npm run build` and `npm run lint`. The project must build cleanly and pass linting.

## Project Conventions

- **Framework:** Astro 6 with `.astro` components (no React/Vue/Svelte)
- **Styling:** Tailwind CSS with `@tailwindcss/typography` (Prose) and `tailwind-merge` + `clsx` for class merging
- **TypeScript:** Strict mode with `@` path alias pointing to `src/`
- **Content:** Content collections defined in `src/content.config.ts` using Zod schemas
- **Blog posts:** `src/content/blog/` — frontmatter: title, description (max 160 chars), pubDate, updatedDate?, tags[], draft, featured
- **Projects:** `src/content/projects/` — frontmatter: title, description, tags[], status (active/archived/wip), featured, order (default 99), liveUrl?, repoUrl?, startDate, endDate?
- **Markdown:** MDX with rehype-slug and rehype-autolink-headings (wrap behavior); Shiki code highlighting (github-light / github-dark-dimmed)
- **SEO:** JSON-LD component, sitemap, open graph image generation at `src/pages/og/[slug].png.ts`
- **Deployment:** Vercel adapter (`@astrojs/vercel`)
- **HMR:** Configured for `logbook.test` domain via WSS
- **Formatting:** Prettier with `prettier-plugin-astro`
- **Linting:** ESLint with `eslint-plugin-astro` and `eslint-config-prettier`

### Component Structure

```
src/
├── components/
│   ├── blog/       # Blog-specific components
│   ├── home/       # Home page sections
│   ├── icons/      # Inline SVG icon components
│   ├── layout/     # Header, Footer, BaseHead, TagAside
│   ├── projects/   # Project cards, grids, badges
│   ├── seo/        # JSON-LD structured data
│   └── ui/         # Reusable UI (Card, Prose, Badge, Button, Pagination)
├── layouts/        # Astro layout components
├── lib/            # Utility modules (posts.ts, projects.ts, utils.ts)
└── pages/          # Routes and API endpoints
```

## Plans & Specs

Design documents and implementation plans are in `docs/superpowers/`:
- `plans/` — implementation plans
- `specs/` — component and page design specs
