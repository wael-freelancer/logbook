# Progress Tracker

Live status of every task. Update this file as work progresses. The agent reads this file at the start of each session to understand current state and determine the next action.

**Instructions for agent:** 
- At session start: read this file, understand current phase, identify next incomplete task
- After completing a task: update status from `[ ]` to `[x]`
- After encountering a blocker: add a `> BLOCKED:` note below the task
- Never skip ahead — complete each phase's verification checklist before advancing
- If a task is partially done, use `[~]` with a note

---

## Current Status

**Active Phase:** Phase 0 — Project Bootstrap  
**Last Updated:** (agent updates this)  
**Last Completed Task:** (agent updates this)  
**Current Blocker:** None  

---

## Phase 0 — Project Bootstrap

**Status:** 🔲 Not Started

- [ ] `npm create astro@latest` with empty template, TypeScript strict
- [ ] Install and configure `@astrojs/tailwind`
- [ ] Configure `astro.config.mjs` (output: hybrid, vercel adapter, mdx, sitemap, sharp)
- [ ] Configure `tsconfig.json` with path aliases (`@/*` → `src/*`)
- [ ] Install all core dependencies (see build-plan.md Phase 0 list)
- [ ] Configure ESLint + Prettier with Astro plugin
- [ ] Initialize Git repository with `.gitignore`
- [ ] Create `src/styles/global.css` (CSS custom properties — see ui-tokens.md)
- [ ] Create `tailwind.config.cjs` (map design tokens — see ui-tokens.md)
- [ ] Configure self-hosted fonts (download WOFF2, add `@font-face`)
- [ ] Verify `npm run dev` starts clean
- [ ] Verify `npm run build` completes without errors
- [ ] Verify `tsc --noEmit` has zero errors

**Phase 0 Gate:** ✅ All above complete, build passes, TypeScript clean

---

## Phase 1 — Layouts & Design System

**Status:** 🔲 Not Started  
**Depends on:** Phase 0 Gate

- [ ] `src/styles/global.css` — all CSS custom properties (colors, type, spacing, radius, shadow, animation)
- [ ] `src/styles/typography.css` — `.prose` styles for MDX
- [ ] `src/styles/animations.css` — keyframe definitions
- [ ] `tailwind.config.cjs` — complete token mapping
- [ ] `src/layouts/Base.astro` — HTML shell with theme init script
- [ ] `src/components/layout/BaseHead.astro` — full meta/OG component
- [ ] `src/layouts/Page.astro` — single-column layout
- [ ] `src/layouts/BlogPost.astro` — two-column blog layout (skeleton, no sidebar logic yet)
- [ ] `src/components/layout/Header.astro` — nav + theme toggle
- [ ] `src/components/layout/Footer.astro`
- [ ] `src/components/ui/Button.astro` — all 3 variants, 3 sizes
- [ ] `src/components/ui/Badge.astro` — all variants
- [ ] `src/components/ui/Card.astro` — all elevations
- [ ] `src/components/ui/Prose.astro`
- [ ] `src/lib/utils.ts` — `cn()`, `formatDate()`, `slugify()`
- [ ] Theme toggle (ThemeToggle island component, client:load)
- [ ] `src/pages/index.astro` placeholder using Base layout
- [ ] Verify light/dark mode toggle works and persists
- [ ] Verify no FOUC on theme (inline script before body)
- [ ] Verify Header keyboard navigation
- [ ] Verify all UI components render in isolation

**Phase 1 Gate:** ✅ All above complete, both themes look correct, no layout issues

---

## Phase 2 — Content Collections & Blog Engine

**Status:** 🔲 Not Started  
**Depends on:** Phase 1 Gate

- [ ] `src/content/config.ts` — blog + projects schemas with Zod
- [ ] Create 3 sample blog posts (short, long, code-heavy varieties)
- [ ] Create 2 sample projects
- [ ] `src/lib/posts.ts` — getSortedPosts, getRelatedPosts, getAllTags, getReadingTime
- [ ] `src/pages/blog/index.astro` — paginated list
- [ ] `src/pages/blog/[page].astro` — pagination pages
- [ ] `src/pages/blog/[slug].astro` — individual post with getStaticPaths
- [ ] `src/pages/blog/tags/[tag].astro` — tag-filtered list
- [ ] `src/components/blog/PostCard.astro`
- [ ] `src/components/blog/PostList.astro`
- [ ] `src/components/blog/TagFilter.astro` (client island)
- [ ] `src/components/blog/TableOfContents.astro`
- [ ] `src/pages/rss.xml.ts` — RSS 2.0 feed
- [ ] Configure remark-reading-time plugin
- [ ] Configure rehype-slug + rehype-autolink-headings
- [ ] Configure Shiki theme
- [ ] `src/components/blog/CopyCode.astro` (client:visible island)
- [ ] Verify all posts render
- [ ] Verify RSS feed validates
- [ ] Verify code blocks have highlighting + copy button
- [ ] Verify TOC links work
- [ ] Verify pagination works

**Phase 2 Gate:** ✅ Blog fully functional, RSS valid, no broken routes

---

## Phase 3 — Projects Section

**Status:** 🔲 Not Started  
**Depends on:** Phase 2 Gate

- [ ] `src/lib/projects.ts` — getFeaturedProjects, getAllProjects, getProjectsByTag
- [ ] `src/pages/projects/index.astro` — grid with filter
- [ ] `src/pages/projects/[slug].astro` — case study
- [ ] `src/components/projects/ProjectCard.astro`
- [ ] `src/components/projects/ProjectGrid.astro`
- [ ] `src/components/projects/TechBadge.astro`
- [ ] Create 4+ real/sample project entries
- [ ] Verify project grid tag filtering works
- [ ] Verify all project slugs resolve
- [ ] Verify images are optimized (Astro Image)
- [ ] Verify mobile layout reads well

**Phase 3 Gate:** ✅ Projects section complete, all routes resolve

---

## Phase 4 — Home Page & Remaining Pages

**Status:** 🔲 Not Started  
**Depends on:** Phase 3 Gate

**Home (`/`)**
- [ ] `src/components/home/Hero.astro` — name, role, CTAs, animations
- [ ] `src/components/home/FeaturedWork.astro` — 2-3 projects
- [ ] `src/components/home/RecentPosts.astro` — 3 latest posts
- [ ] Scroll-triggered reveal animations (Motion One, reduced-motion safe)
- [ ] `src/pages/index.astro` — compose Hero + FeaturedWork + RecentPosts

**About (`/about`)**
- [ ] Bio section
- [ ] Skills section
- [ ] Career timeline
- [ ] "Currently" section
- [ ] Profile photo
- [ ] `src/pages/about.astro`

**Uses (`/uses`)**
- [ ] `src/pages/uses.astro` — categorized tools list

**Contact (`/contact`)**
- [ ] `src/pages/contact.astro` — form UI
- [ ] `src/pages/api/contact.ts` — POST handler
- [ ] Form success + error states

**Other**
- [ ] `src/pages/404.astro` — custom 404 page
- [ ] `src/pages/og/[slug].png.ts` — dynamic OG images (Satori)
- [ ] Update BaseHead to use dynamic OG for blog/projects

- [ ] Verify hero animation (and reduced-motion fallback)
- [ ] Verify contact form submits (test POST)
- [ ] Verify all internal links resolve
- [ ] Verify 404 page

**Phase 4 Gate:** ✅ All pages complete, no broken routes

---

## Phase 5 — Dynamic Features

**Status:** 🔲 Not Started  
**Depends on:** Phase 4 Gate

**View Counter**
- [ ] Set up Vercel KV (Upstash Redis) — add env vars
- [ ] `src/lib/views.ts` — KV abstraction
- [ ] `src/pages/api/views/[slug].ts` — GET + POST endpoint
- [ ] `src/components/blog/ViewCounter.astro` — server island
- [ ] Wire ViewCounter into BlogPost layout

**Search**
- [ ] Configure Pagefind post-build hook in astro.config.mjs
- [ ] `src/components/blog/Search.astro` — search UI (client:idle)
- [ ] Add Search to blog index page

**Comments**
- [ ] Set up Giscus (create GitHub Discussion category)
- [ ] `src/components/blog/Comments.astro` — lazy iframe (client:visible)
- [ ] Wire into BlogPost layout

- [ ] Verify view counter increments (check KV dashboard)
- [ ] Verify search returns results
- [ ] Verify comments load on scroll
- [ ] Verify OG images render (test with opengraph.xyz)

**Phase 5 Gate:** ✅ All dynamic features working in production-like environment

---

## Phase 6 — SEO, Accessibility & Performance

**Status:** 🔲 Not Started  
**Depends on:** Phase 5 Gate

**SEO**
- [ ] Unique title + description on every page (audit all routes)
- [ ] Canonical URLs in BaseHead
- [ ] sitemap.xml generated (@astrojs/sitemap)
- [ ] robots.txt in public/
- [ ] JSON-LD for blog posts (Article schema)
- [ ] JSON-LD for projects (SoftwareApplication schema)

**Accessibility**
- [ ] Skip-to-content link
- [ ] All images have alt text
- [ ] WCAG AA contrast check (both themes)
- [ ] Focus indicators visible in both themes
- [ ] All interactive elements keyboard-accessible
- [ ] ARIA labels on icon-only buttons
- [ ] axe DevTools audit: zero violations

**Performance**
- [ ] All images use `<Image />` from astro:assets
- [ ] Fonts preloaded in BaseHead
- [ ] No unused CSS (Tailwind purge configured correctly)
- [ ] No console errors in build output
- [ ] Lighthouse: 100/100/100/100 on homepage
- [ ] Lighthouse: 100/100/100/100 on a blog post

**Phase 6 Gate:** ✅ Lighthouse 100 across board, zero axe violations

---

## Phase 7 — Deployment & Polish

**Status:** 🔲 Not Started  
**Depends on:** Phase 6 Gate

- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Configure environment variables in Vercel
- [ ] Custom domain + HTTPS
- [ ] Analytics setup (Vercel Analytics or Plausible)
- [ ] Write 5+ real blog posts
- [ ] Add 3+ real project case studies
- [ ] Real About page content
- [ ] Final design pass
- [ ] Cross-browser test (Chrome, Firefox, Safari, Mobile Safari)
- [ ] Submit to Google Search Console
- [ ] Uptime monitoring

**Phase 7 Gate:** ✅ Site live, content published, monitoring active

---

## Known Issues / Decisions Log

Use this section to track decisions made and issues encountered. The agent should append here when making significant architectural decisions or hitting unexpected problems.

| Date | Type | Description |
|---|---|---|
| (agent fills in) | Decision | (example: chose Pagefind over Fuse.js for zero-JS search) |
| (agent fills in) | Issue | (example: Satori font loading issue with self-hosted WOFF2) |

---

## Dependency Versions (Pinned at Project Start)

| Package | Version | Pinned |
|---|---|---|
| astro | ^4.x | at init |
| @astrojs/mdx | ^3.x | at init |
| @astrojs/tailwind | ^5.x | at init |
| @astrojs/sitemap | ^3.x | at init |
| @astrojs/vercel | ^7.x | at init |
| tailwindcss | ^3.4.x | at init |
| @tailwindcss/typography | ^0.5.x | at init |
| motion | ^10.x | at init |
| shiki | ^1.x | at init |
| zod | ^3.x | at init |
| clsx | ^2.x | at init |
| tailwind-merge | ^2.x | at init |
| pagefind | ^1.x | at init |

*Fill in exact versions after `npm install` by running `npm list --depth=0`*
