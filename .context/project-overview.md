# Project Overview — Content-Rich Personal Portfolio with Hybrid Dynamic Blog

## Vision

Build a high-performance personal portfolio website for a software engineer / technical creator. The site serves two audiences simultaneously: **hiring managers & clients** who need to quickly assess skills and experience, and **readers & the developer community** who follow the blog for technical depth. The site must feel crafted, not templated — every design decision is intentional.

## Core Goals

1. **Establish credibility fast** — above-the-fold impression must communicate expertise within 3 seconds
2. **Showcase projects with depth** — not just screenshots, but architecture decisions, outcomes, and lessons learned
3. **Run a serious blog** — long-form technical posts, code walkthroughs, and opinion pieces with excellent reading UX
4. **Hybrid rendering** — static where possible, dynamic where it adds value (view counts, search, comments)
5. **Zero-compromise performance** — Lighthouse 100 across the board is the baseline, not the stretch goal

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro 6.x** | Island architecture — ship zero JS by default, hydrate only what needs it |
| Styling | **Tailwind CSS v4** + CSS custom properties | Utility-first with a custom design token layer |
| Blog Content | **Astro Content Collections** (MDX) | Type-safe frontmatter, co-located assets, MDX for rich components |
| Dynamic Features | **Astro Server Islands** + lightweight API routes | View counts, search index, contact form — server-rendered on demand |
| Search | **Pagefind** (static) or **Fuse.js** (client island) | Zero-backend full-text search |
| Syntax Highlighting | **Shiki** with custom theme | Ships as HTML — zero JS, perfect colors |
| Animations | **Motion One** (Web Animations API) | ~3 KB, respects `prefers-reduced-motion` |
| Deployment | **Vercel** (or Netlify) with edge functions | SSR adapter for dynamic routes |
| CMS (optional) | **Keystatic** (git-based) or flat MDX files | Author from browser or editor — same git workflow |

## Site Sections

### 1. `/` — Hero + Summary
- Animated name/headline (reduced-motion safe)
- One-line current role / status
- Quick-links: Resume PDF, GitHub, LinkedIn, Blog
- Featured project card (rotating or static)

### 2. `/about` — Human story
- Professional bio (2–3 paragraphs, first-person)
- Skills constellation / tag cloud (not a boring list)
- Career timeline
- Currently reading / learning / building

### 3. `/projects` — Work showcase
- Grid of project cards with filter by tag/stack
- Each card: name, description, stack badges, live link, repo link
- `/projects/[slug]` — deep-dive case study page

### 4. `/blog` — Hybrid blog index
- Paginated post list with search
- Tag/category filtering
- Featured post hero
- RSS feed auto-generated

### 5. `/blog/[slug]` — Post page
- Estimated read time
- Table of contents (sticky sidebar on desktop)
- Dynamic view counter (server island)
- Code blocks with copy button (JS island)
- Related posts (content collection query)
- Giscus or Utterances comments (lazy-loaded island)

### 6. `/uses` — Tools & setup
- Hardware, software, editor config
- Dotfiles link

### 7. `/contact` — Get in touch
- Simple form with server-side handling
- Social links

## Key Design Principles

- **Content-first layout**: typography and spacing optimized for long reads
- **Dark mode by default**, light mode toggle persisted in localStorage
- **Responsive from 320px** — mobile reading is the primary use case for blog
- **Accessible**: WCAG 2.1 AA minimum, keyboard navigable, screen-reader tested
- **Fast cold loads**: aim for < 50 KB total JS on any given page

## Non-Goals (Explicit Descoping)

- No React/Vue/Svelte app shell — use Astro components and minimal islands only
- No headless CMS API dependency at build time (git-based only)
- No authentication or user accounts (comments via third-party widget)
- No e-commerce or paid content
