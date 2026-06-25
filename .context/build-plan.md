# Build Plan — Phased Development

Each phase is self-contained and ship-worthy. Complete verification checklist before moving to the next phase. Never start a new phase with broken TypeScript, failing builds, or unresolved lint errors.

---

## Phase 0 — Project Bootstrap (Day 1)

**Goal**: Working Astro dev environment with all tooling configured. Nothing visible yet, but the foundation is solid.

### Tasks

- [ ] `npm create astro@latest` — choose "empty" template, TypeScript strict
- [ ] Install and configure Tailwind CSS (`@astrojs/tailwind`)
- [ ] Configure `astro.config.mjs`:
  - Output: `hybrid` (enables SSR + SSG mix)
  - Adapters: `@astrojs/vercel` (edge functions)
  - Integrations: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/tailwind`
  - Markdown: Shiki syntax highlighting, custom theme
  - Image: enable `sharp`
- [ ] Set up `tsconfig.json` with path aliases (`@/*` → `src/*`)
- [ ] Install core dependencies:
  ```
  astro @astrojs/mdx @astrojs/tailwind @astrojs/sitemap @astrojs/vercel
  tailwindcss @tailwindcss/typography
  motion
  pagefind
  shiki
  clsx tailwind-merge
  zod
  ```
- [ ] Configure ESLint + Prettier with Astro plugin
- [ ] Set up Git with `.gitignore`
- [ ] Create `src/styles/global.css` with CSS custom properties (tokens)
- [ ] Create `tailwind.config.cjs` with design tokens mapped to Tailwind theme
- [ ] Configure self-hosted fonts (download WOFF2, add `@font-face` in global.css)
- [ ] Verify: `npm run dev` starts, `npm run build` completes, TypeScript has zero errors

### Verification Checklist
- [ ] Dev server runs on localhost:4321
- [ ] Build completes without errors
- [ ] `tsc --noEmit` passes
- [ ] Tailwind IntelliSense works in editor

---

## Phase 1 — Layouts & Design System (Day 2–3)

**Goal**: Every layout component, the design token system, and reusable UI primitives. No page content yet.

### Tasks

- [ ] `src/styles/global.css` — define all CSS custom properties:
  - Color tokens (light + dark mode via `[data-theme]` attribute)
  - Typography scale
  - Spacing scale
  - Radius, shadow, transition tokens
- [ ] `src/styles/typography.css` — `.prose` styles for MDX content
- [ ] `src/styles/animations.css` — keyframe definitions
- [ ] `tailwind.config.cjs` — map all tokens into Tailwind
- [ ] `src/layouts/Base.astro` — HTML shell:
  - `<BaseHead>` component (meta, OG, canonical, fonts)
  - Theme initialization script (inline, before body — prevents FOUC)
  - Skip-to-content link
  - Slot for page content
- [ ] `src/layouts/Page.astro` — single-column content layout
- [ ] `src/layouts/BlogPost.astro` — two-column: article + TOC sidebar
- [ ] `src/components/layout/Header.astro` — nav, theme toggle
- [ ] `src/components/layout/Footer.astro` — links, copyright
- [ ] `src/components/ui/Button.astro` — variants: primary, secondary, ghost
- [ ] `src/components/ui/Badge.astro` — for tags/tech stack
- [ ] `src/components/ui/Card.astro` — generic card shell
- [ ] `src/components/ui/Prose.astro` — wraps MDX with typography class
- [ ] `src/lib/utils.ts` — `cn()`, `formatDate()`, `slugify()`
- [ ] Theme toggle implementation (`client:load` island)
- [ ] Create a `src/pages/index.astro` placeholder that uses `Base.astro`
- [ ] Verify responsive behavior at 320px, 768px, 1280px

### Verification Checklist
- [ ] Light/dark mode toggle works, persists across refresh
- [ ] No layout shift on theme change (no FOUC)
- [ ] Header is accessible (keyboard navigation, focus rings visible)
- [ ] All UI components render correctly in isolation
- [ ] Mobile hamburger menu works (if nav is collapsible)

---

## Phase 2 — Content Collections & Blog Engine (Day 4–5)

**Goal**: Full blog infrastructure — schema, sample posts, list page, individual post pages, tags, RSS.

### Tasks

- [ ] `src/content/config.ts` — define `blog` and `projects` collections with Zod schemas
- [ ] Create 3 sample blog posts in `src/content/blog/` (varied: short, long, with code)
- [ ] Create 2 sample projects in `src/content/projects/`
- [ ] `src/lib/posts.ts`:
  - `getSortedPosts()` — sorted by date, filters drafts in production
  - `getRelatedPosts(post, n)` — by shared tags
  - `getAllTags()` — with counts
  - `getReadingTime(content)` — words / 200 wpm
- [ ] `src/pages/blog/index.astro` — paginated post list
- [ ] `src/pages/blog/[page].astro` — pagination (Astro `paginate()`)
- [ ] `src/pages/blog/[slug].astro` — individual post with `getStaticPaths`
- [ ] `src/pages/blog/tags/[tag].astro` — posts filtered by tag
- [ ] `src/components/blog/PostCard.astro` — card for list views
- [ ] `src/components/blog/PostList.astro` — renders list of PostCards
- [ ] `src/components/blog/TagFilter.astro` — interactive tag filter (client island)
- [ ] `src/components/blog/TableOfContents.astro` — auto-generated from headings
- [ ] `src/pages/rss.xml.ts` — RSS 2.0 feed
- [ ] Configure MDX: reading time remark plugin, heading anchors (rehype-slug + rehype-autolink-headings)
- [ ] Configure Shiki with custom theme (matches site's color tokens)
- [ ] `src/components/blog/CopyCode.astro` — copy-to-clipboard for code blocks (client:visible)

### Verification Checklist
- [ ] All blog posts render without errors
- [ ] `/blog` shows correct pagination
- [ ] `/blog/tags/[tag]` works for all tags
- [ ] RSS feed validates at https://validator.w3.org/feed/
- [ ] Code blocks have syntax highlighting and copy button
- [ ] Table of contents links scroll to correct heading
- [ ] Reading time appears on post pages

---

## Phase 3 — Projects Section (Day 6)

**Goal**: Projects index with filtering, individual project case study pages.

### Tasks

- [ ] `src/lib/projects.ts`:
  - `getFeaturedProjects()` — `featured: true`, sorted by `order`
  - `getAllProjects()` — all non-draft
  - `getProjectsByTag(tag)` — filtered
- [ ] `src/pages/projects/index.astro` — grid with tag filter
- [ ] `src/pages/projects/[slug].astro` — case study layout
- [ ] `src/components/projects/ProjectCard.astro` — card with thumbnail, tech badges, links
- [ ] `src/components/projects/ProjectGrid.astro` — responsive grid
- [ ] `src/components/projects/TechBadge.astro` — stack badge with icon
- [ ] Create 4+ real project entries in content collection
- [ ] Project case study template: problem, solution, outcomes, screenshots, tech used

### Verification Checklist
- [ ] Project grid filters by tag correctly (no JS errors)
- [ ] All project slugs resolve correctly
- [ ] Images are optimized (Astro `<Image />` component)
- [ ] Case study pages read well on mobile

---

## Phase 4 — Home Page & Remaining Pages (Day 7–8)

**Goal**: Complete the home page, about, uses, and contact pages.

### Tasks

**Home Page (`/`)**
- [ ] `src/components/home/Hero.astro` — name, role, CTA links, animated entrance
- [ ] `src/components/home/FeaturedWork.astro` — 2–3 featured projects
- [ ] `src/components/home/RecentPosts.astro` — 3 latest blog posts
- [ ] Subtle scroll-triggered reveal animations (Motion One, respects `prefers-reduced-motion`)

**About Page (`/about`)**
- [ ] Professional bio section
- [ ] Skills section (tag cloud or categorized list)
- [ ] Career timeline component
- [ ] "Currently" section (reading / learning / building)
- [ ] Profile photo (optimized with `<Image />`)

**Uses Page (`/uses`)**
- [ ] Categorized list: Hardware, Software, Editor, CLI Tools
- [ ] Dotfiles repo link

**Contact Page (`/contact`)**
- [ ] Contact form (name, email, message)
- [ ] `/api/contact.ts` — POST endpoint using Resend or Nodemailer
- [ ] Success / error states
- [ ] Social media links

### Verification Checklist
- [ ] Hero animation is smooth, reduced-motion variant is static
- [ ] Contact form submits successfully (test with real POST)
- [ ] About page looks good at all breakpoints
- [ ] All internal links resolve

---

## Phase 5 — Dynamic Features (Day 9–10)

**Goal**: View counters, search, comments — the hybrid "dynamic" part of the stack.

### Tasks

**View Counter**
- [ ] Set up Vercel KV (or Upstash Redis) in Vercel project settings
- [ ] `src/lib/views.ts` — abstraction over KV client
- [ ] `src/pages/api/views/[slug].ts` — GET (fetch count) + POST (increment)
- [ ] `src/components/blog/ViewCounter.astro` — server island with `server:defer`
- [ ] Wire into `BlogPost.astro` layout

**Search**
- [ ] Configure Pagefind in `astro.config.mjs` post-build hook
- [ ] `src/components/blog/Search.astro` — search UI (client:idle)
- [ ] Wire into blog index and header (optional)

### Verification Checklist
- [ ] View counter increments on page load (check KV dashboard)
- [ ] Search returns relevant results

---

## Phase 6 — SEO, Accessibility & Performance (Day 11–12)

**Goal**: Production-ready quality. No compromises.

### Tasks

**SEO**
- [ ] Unique `<title>` and `<meta description>` on every page
- [ ] Canonical URLs
- [ ] `sitemap.xml` generated by `@astrojs/sitemap`
- [ ] `robots.txt`
- [ ] Structured data (JSON-LD) for blog posts (Article schema)
- [ ] Structured data for projects (SoftwareApplication schema)

**Accessibility**
- [ ] Skip-to-content link (first focusable element)
- [ ] All images have `alt` text
- [ ] Color contrast passes WCAG AA (both themes)
- [ ] Focus indicators visible in both themes
- [ ] All interactive elements keyboard navigable
- [ ] ARIA labels on icon-only buttons
- [ ] Run axe DevTools audit — zero violations

**Performance**
- [ ] All images use `<Image />` from `astro:assets`
- [ ] Fonts preloaded in `<head>`
- [ ] Critical CSS inlined (Astro does this automatically)
- [ ] Unused CSS purged (Tailwind does this automatically)
- [ ] Verify: `npm run build && npm run preview` — no console errors

### Verification Checklist
- [ ] Lighthouse score: 100 / 100 / 100 / 100 (run 3x, take average)
- [ ] axe DevTools: zero violations
- [ ] WebPageTest: LCP < 1.5s on 4G
- [ ] RSS feed valid
- [ ] sitemap.xml has all expected URLs
- [ ] No broken links (run `broken-link-checker` or similar)

---

## Phase 7 — Deployment & Polish (Day 13–14)

**Goal**: Live site, custom domain, monitoring, final content.

### Tasks

- [ ] Deploy to Vercel: connect GitHub repo, configure project settings
- [ ] Set environment variables in Vercel dashboard (`KV_URL`, `CONTACT_EMAIL`, etc.)
- [ ] Configure custom domain + HTTPS
- [ ] Set up Vercel Analytics (or Plausible for privacy-respecting analytics)
- [ ] Write 5+ real blog posts (at least one long-form technical post)
- [ ] Add real project case studies (minimum 3)
- [ ] Fill out About page with real content
- [ ] Final design pass: spacing, typography, micro-interactions
- [ ] Cross-browser test: Chrome, Firefox, Safari, Mobile Safari
- [ ] Submit to Google Search Console
- [ ] Set up uptime monitoring (Better Uptime or UptimeRobot)

### Verification Checklist
- [ ] Site loads on custom domain with HTTPS
- [ ] All environment variables working in production
- [ ] Analytics tracking firing correctly
- [ ] No 404s in Vercel function logs
- [ ] Social share preview looks correct (Twitter Card Validator, LinkedIn Post Inspector)

---

## Ongoing Maintenance (Post-Launch)

- Publish new blog posts — no deploy needed, git push triggers rebuild
- Review Core Web Vitals monthly in Vercel Analytics
- Update dependencies quarterly (`npx npm-check-updates`)
- Respond to Dependabot PRs within a week
