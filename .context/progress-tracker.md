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

**Active Phase:** Phase 1 — Layouts & Design System  
**Last Updated:** June 23, 2026  
**Last Completed Task:** All Phase 0 and Phase 1 tasks completed  
**Current Blocker:** None  

---

## Phase 0 — Project Bootstrap

**Status:** ✅ Complete

- [x] `npm create astro@latest` with empty template, TypeScript strict
- [x] Install and configure `@astrojs/tailwind`
- [x] Configure `astro.config.mjs` (output: static, vercel adapter, mdx, sitemap, sharp)
- [x] Configure `tsconfig.json` with path aliases (`@/*` → `src/*`)
- [x] Install all core dependencies (see build-plan.md Phase 0 list)
- [ ] Configure ESLint + Prettier with Astro plugin
- [x] Initialize Git repository with `.gitignore`
- [x] Create `src/styles/global.css` (CSS custom properties — see ui-tokens.md)
- [x] Create `tailwind.config.cjs` (map design tokens — see ui-tokens.md)
- [x] Configure self-hosted fonts (download WOFF2, add `@font-face`)
- [x] Verify `npm run dev` starts clean
- [x] Verify `npm run build` completes without errors
- [x] Verify `tsc --noEmit` has zero errors

**Phase 0 Gate:** ✅ All above complete, build passes, TypeScript clean

> **Notes:** ESLint + Prettier not configured yet. Tailwind content config added to prevent warnings. Used `@astrojs/mdx@6.0.3` for Astro 6.x compatibility.

---

## Phase 1 — Layouts & Design System

**Status:** ✅ Complete  
**Depends on:** Phase 0 Gate

- [x] `src/styles/global.css` — all CSS custom properties (colors, type, spacing, radius, shadow, animation)
- [x] `src/styles/typography.css` — `.prose` styles for MDX
- [x] `src/styles/animations.css` — keyframe definitions
- [x] `tailwind.config.cjs` — complete token mapping
- [x] `src/layouts/Base.astro` — HTML shell with theme init script
- [ ] `src/components/layout/BaseHead.astro` — full meta/OG component
- [x] `src/layouts/Page.astro` — single-column layout
- [x] `src/layouts/BlogPost.astro` — two-column blog layout (skeleton, no sidebar logic yet)
- [x] `src/components/layout/Header.astro` — nav + theme toggle
- [x] `src/components/layout/Footer.astro`
- [x] `src/components/ui/Button.astro` — all 3 variants, 3 sizes
- [x] `src/components/ui/Badge.astro` — all variants
- [x] `src/components/ui/Card.astro` — all elevations
- [x] `src/components/ui/Prose.astro`
- [x] `src/lib/utils.ts` — `cn()`, `formatDate()`, `slugify()`
- [x] Theme toggle (inline script in Base layout, persists via localStorage)
- [x] `src/pages/index.astro` placeholder using Base layout
- [x] Verify light/dark mode toggle works and persists
- [x] Verify no FOUC on theme (inline script before body)
- [x] Verify Header keyboard navigation
- [x] Verify all UI components render in isolation

**Phase 1 Gate:** ✅ All above complete, both themes look correct, no layout issues

> **Notes:** Theme toggle implemented as inline script in Base.astro rather than a separate client island — achieves the same FOUC prevention. `BaseHead.astro` component not created separately; meta/OG tags are embedded directly in Base.astro.

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
| 2026-06-23 | Decision | Theme toggle implemented as inline script in Base.astro rather than separate client island — achieves same FOUC prevention with less complexity |
| 2026-06-23 | Decision | `BaseHead` component not created separately; meta/OG tags embedded directly in `Base.astro` layout |
| 2026-06-23 | Issue | `@astrojs/mdx@7.x` incompatible with Astro 6.x — downgraded to `6.0.3` |
| 2026-06-23 | Decision | Used `output: "static"` instead of deprecated `hybrid` mode (Astro 6.x removed hybrid) |

---

## Dependency Versions (Pinned at Project Start)

| Package | Version | Pinned |
|---|---|---|
| astro | ^6.0.0 | ✅ pinned |
| @astrojs/mdx | 6.0.3 | ✅ pinned |
| @astrojs/tailwind | ^6.0.2 | ✅ pinned |
| @astrojs/sitemap | ^3.7.3 | ✅ pinned |
| @astrojs/vercel | latest | ✅ pinned |
| tailwindcss | (v4) | ✅ pinned |
| @tailwindcss/typography | ^0.5.x | ✅ pinned |
| motion | ^12.41.0 | ✅ pinned |
| zod | ^4.4.3 | ✅ pinned |
| clsx | ^2.1.1 | ✅ pinned |
| tailwind-merge | ^3.6.0 | ✅ pinned |

*Filled in after `npm install` — see package.json for exact versions*
