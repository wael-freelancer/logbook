# Architecture — Astro Portfolio + Hybrid Blog

## Directory Structure

```
portfolio/
├── public/
│   ├── fonts/                    # Self-hosted WOFF2 files
│   ├── images/                   # Static assets (og images, icons)
│   ├── resume.pdf
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Primitive, unstyled building blocks
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Card.astro
│   │   │   └── Prose.astro       # Wraps MDX content with typography styles
│   │   ├── layout/               # Structural layout components
│   │   │   ├── BaseHead.astro    # <head> meta, OG, canonical
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Sidebar.astro     # Blog TOC sidebar
│   │   │   └── PageWrapper.astro
│   │   ├── blog/                 # Blog-specific components
│   │   │   ├── PostCard.astro
│   │   │   ├── PostList.astro
│   │   │   ├── TagFilter.astro
│   │   │   ├── ReadingProgress.astro
│   │   │   ├── TableOfContents.astro
│   │   │   ├── ViewCounter.astro  # Server island
│   │   │   ├── CopyCode.astro     # Client island
│   │   │   └── Comments.astro     # Client island (lazy)
│   │   ├── projects/
│   │   │   ├── ProjectCard.astro
│   │   │   ├── ProjectGrid.astro
│   │   │   └── TechBadge.astro
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── FeaturedWork.astro
│   │   │   └── RecentPosts.astro
│   │   └── icons/                # SVG icon components
│   │       └── [IconName].astro
│   │
│   ├── content/
│   │   ├── config.ts             # Content collection schemas (Zod)
│   │   ├── blog/
│   │   │   ├── my-first-post/
│   │   │   │   ├── index.mdx
│   │   │   │   └── cover.png     # Co-located images
│   │   │   └── another-post.mdx
│   │   └── projects/
│   │       ├── project-alpha/
│   │       │   ├── index.mdx
│   │       │   └── screenshot.png
│   │       └── project-beta.mdx
│   │
│   ├── layouts/
│   │   ├── Base.astro            # HTML shell, head, theme script
│   │   ├── BlogPost.astro        # Two-column: content + TOC sidebar
│   │   └── Page.astro            # Single-column page layout
│   │
│   ├── pages/
│   │   ├── index.astro           # / Home
│   │   ├── about.astro           # /about
│   │   ├── uses.astro            # /uses
│   │   ├── contact.astro         # /contact
│   │   ├── projects/
│   │   │   ├── index.astro       # /projects
│   │   │   └── [slug].astro      # /projects/[slug] — getStaticPaths
│   │   ├── blog/
│   │   │   ├── index.astro       # /blog (paginated)
│   │   │   ├── [page].astro      # /blog/2, /blog/3, ...
│   │   │   ├── [slug].astro      # /blog/[slug] — individual post
│   │   │   └── tags/
│   │   │       └── [tag].astro   # /blog/tags/[tag]
│   │   └── api/
│   │       ├── views/
│   │       │   └── [slug].ts     # GET/POST view count (edge function)
│   │       ├── search.ts         # Search index endpoint
│   │       └── contact.ts        # Contact form submission
│   │
│   ├── styles/
│   │   ├── global.css            # @layer base — resets, custom properties
│   │   ├── typography.css        # Prose styles for MDX content
│   │   └── animations.css        # Keyframe definitions
│   │
│   ├── lib/
│   │   ├── utils.ts              # cn(), formatDate(), readingTime()
│   │   ├── posts.ts              # Helpers: getSortedPosts(), getRelated()
│   │   ├── projects.ts           # Helpers: getFeaturedProjects()
│   │   ├── views.ts              # View counter KV store abstraction
│   │   └── og.ts                 # OG image generation (Satori)
│   │
│   └── types/
│       └── index.ts              # Shared TypeScript types
│
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

---

## Rendering Strategy per Route

| Route | Strategy | Reason |
|---|---|---|
| `/` | Static (SSG) | Changes infrequently, full cache benefit |
| `/about` | Static (SSG) | Pure content |
| `/projects` | Static (SSG) | Rebuilt on content change |
| `/projects/[slug]` | Static (SSG) | `getStaticPaths` from content collection |
| `/blog` | Static (SSG) | Paginated, rebuilt on new post |
| `/blog/[slug]` | Static (SSG) + Server Islands | Page shell is static; view counter is a server island |
| `/blog/tags/[tag]` | Static (SSG) | All tags known at build |
| `/api/views/[slug]` | Edge Function (SSR) | Dynamic read/write to KV store |
| `/api/search` | Static JSON at build time | Pagefind index built as part of `astro build` |
| `/api/contact` | Edge Function (SSR) | POST handler, no secrets in client |

---

## Content Collections Schema (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(), // auto-computed in remark plugin
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    thumbnail: image(),
    thumbnailAlt: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['active', 'archived', 'wip']),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
```

---

## Island Architecture

### Server Islands (Astro 6.x `server:defer`)
Used for components that need server-side data but should not block page render:

```astro
<!-- In /blog/[slug].astro -->
<ViewCounter slug={post.slug} server:defer>
  <span slot="fallback">...</span>
</ViewCounter>
```

### Client Islands
Used only when browser APIs or interactivity is essential:

| Component | Directive | Why |
|---|---|---|
| `<ThemeToggle>` | `client:load` | Must run immediately to prevent flash |
| `<CopyCode>` | `client:visible` | Only when code block enters viewport |
| `<Search>` | `client:idle` | Low priority, load when browser is idle |
| `<Comments>` | `client:visible` | Defer iframe load until user scrolls |
| `<ReadingProgress>` | `client:load` | Needs scroll events from page load |

---

## View Counter Architecture

```
Browser (page load)
  └─► Astro Server Island: GET /api/views/[slug]
        └─► Vercel KV (Redis) — atomic INCR
              └─► Returns { count: number }

# KV key pattern:
views:{slug}  →  integer
```

Fallback: if KV is unavailable, component shows nothing (graceful degradation).

---

## OG Image Generation

Dynamic OG images generated at build time using `@vercel/og` / Satori:

```typescript
// src/pages/og/[slug].png.ts
export async function GET({ params }) {
  const post = await getEntry('blog', params.slug);
  // Render SVG → PNG via Satori + resvg-js
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' }
  });
}
```

---

## Data Flow Diagram

```
MDX Files (src/content/)
    │
    ▼
Astro Content Collections (build-time type checking)
    │
    ├──► getStaticPaths() → generates all static routes
    │
    └──► Components query via getCollection() / getEntry()
              │
              ├──► Static HTML output (SSG)
              │
              └──► Server Islands (SSR, deferred)
                        │
                        └──► Edge Functions (/api/*)
                                  │
                                  └──► Vercel KV / Email service
```

---

## Performance Budget

| Metric | Target | Method |
|---|---|---|
| LCP | < 1.5s | Self-hosted fonts, optimized images via `<Image />` |
| CLS | < 0.05 | Explicit image dimensions, font-display: swap |
| INP | < 100ms | Minimal JS, deferred islands |
| Total JS (home) | < 20 KB | Only ThemeToggle + ReadingProgress |
| Total JS (blog post) | < 35 KB | Above + CopyCode + lazy Comments |
| Lighthouse Score | 100/100/100/100 | Target for all static pages |
