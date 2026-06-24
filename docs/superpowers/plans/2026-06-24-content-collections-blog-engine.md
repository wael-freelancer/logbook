# Phase 2 — Content Collections & Blog Engine Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full blog infrastructure — content collections (Zod schemas), sample posts, list page, individual post pages, tags, RSS feed, and blog components.

**Architecture:** Uses Astro Content Collections for type-safe MDX content. Blog posts live in `src/content/blog/` as MDX files with frontmatter validated by Zod. Pages use `getStaticPaths()` for dynamic routes. Blog components compose over these collections. RSS generated at build time.

**Tech Stack:** Astro 6.x Content Collections, Zod v4, MDX, rehype-slug, rehype-autolink-headings, @tailwindcss/typography

---

### Task 1: Content Collection Schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Create `src/content/config.ts`**

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

- [ ] **Run build to verify schemas compile**

Run: `npm run build`
Expected: Build completes without content collection errors.

---

### Task 2: Sample Blog Posts (3 entries)

**Files:**
- Create: `src/content/blog/getting-started-with-astro.mdx`
- Create: `src/content/blog/building-performant-sites.mdx`
- Create: `src/content/blog/typescript-patterns.mdx`

- [ ] **Create short sample post**

```mdx
---
title: Getting Started with Astro
description: A quick introduction to building content-driven websites with Astro.
pubDate: 2025-12-15
tags: ["astro", "web", "tutorial"]
draft: false
featured: true
---

## Why Astro?

Astro is a web framework designed for content-rich websites. It ships zero JavaScript by default, only sending client-side JS for components that explicitly request it.

### Key Concepts

- **Islands Architecture**: Interactive components are isolated "islands" in a sea of static HTML
- **Content Collections**: Type-safe Markdown/MDX with Zod schema validation
- **View Transitions**: Smooth page transitions with the native View Transitions API

```typescript
// Example: Querying content collections
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sorted = posts.sort((a, b) => 
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
```

Astro's approach means your site is fast by default. No runtime overhead for pages that don't need it.
```

- [ ] **Create long sample post**

```mdx
---
title: Building Performant Websites
description: A deep dive into web performance optimization techniques for modern static sites.
pubDate: 2026-01-20
tags: ["performance", "web", "optimization"]
draft: false
featured: true
---

## The Performance Budget

Modern websites are bloated. The median page weight has grown from ~1MB in 2015 to over 2.5MB today. Setting a performance budget forces intentional decisions about what ships to the client.

### Core Web Vitals

Google's Core Web Vitals measure three aspects of user experience:

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP | < 2.5s | < 4.0s | > 4.0s |
| FID/INP | < 100ms | < 300ms | > 300ms |
| CLS | < 0.1 | < 0.25 | > 0.25 |

### Image Optimization

Images account for roughly 50% of page weight. Key strategies:

1. **Responsive images**: Use `<picture>` with multiple `srcset` options
2. **Modern formats**: WebP and AVX offer 25-35% better compression than JPEG
3. **Lazy loading**: Native `loading="lazy"` for below-the-fold images

```html
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero image" loading="lazy" />
</picture>
```

### Font Loading Strategies

Self-hosted fonts with `font-display: swap` prevent invisible text during load. Preload critical fonts:

```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
```

### Code Splitting

Astro automatically code-splits by page. Framework components (React, Vue, Svelte) are only loaded when their island hydrates. This means:

- A page without interactive components ships **zero JavaScript**
- Each island is a separate bundle with its own hydration strategy
- Third-party libraries are tree-shaken when unused

## Measuring Performance

Use these tools to measure real-world performance:

- **Lighthouse**: Lab-based audit with actionable recommendations
- **Web Vitals library**: JavaScript library for measuring real user metrics
- **Vercel Analytics**: Real-user monitoring with Core Web Vitals tracking

Performance is not a one-time optimization. It requires continuous monitoring and intentional decisions with every new feature.
```

- [ ] **Create code-heavy sample post**

```mdx
---
title: Advanced TypeScript Patterns
description: Exploring utility types, discriminated unions, and template literal types in TypeScript.
pubDate: 2026-03-10
tags: ["typescript", "patterns", "advanced"]
draft: false
featured: false
---

## Utility Types

TypeScript ships with several built-in utility types that model common transformations.

### Partial

Makes all properties optional:

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

// All properties are now optional
type PartialUser = Partial<User>;
// Equivalent to:
// { name?: string; email?: string; age?: number; }
```

### Pick and Omit

Select or exclude specific keys:

```typescript
type UserContact = Pick<User, 'name' | 'email'>;
type UserWithoutAge = Omit<User, 'age'>;
```

## Discriminated Unions

A common pattern for modeling state machines:

```typescript
type ApiState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleState<T>(state: ApiState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Waiting...';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Got ${state.data}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

## Template Literal Types

TypeScript 5.x introduced powerful string manipulation types:

```typescript
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type CssValue = 
  | `${number}px` 
  | `${number}rem` 
  | `${number}%` 
  | 'auto';
```

These patterns lead to more expressive and type-safe code with fewer runtime errors.
```

- [ ] **Create sample projects (2 entries)**

Create `src/content/projects/portfolio-website.mdx`:

```mdx
---
title: Portfolio Website
description: A performant personal portfolio built with Astro, featuring a blog, project showcase, and dynamic view counting.
thumbnail: "../../assets/images/portfolio-thumb.jpg"
thumbnailAlt: "Screenshot of the portfolio website"
tags: ["astro", "typescript", "tailwind"]
status: active
featured: true
order: 1
liveUrl: "https://logbook.vercel.app"
repoUrl: "https://github.com/user/logbook"
startDate: 2025-11-01
---

## Overview

A personal portfolio and technical blog designed for performance and maintainability. Built with Astro 6.x, Tailwind CSS, and deployed on Vercel.

### Key Features

- **Static-first architecture**: Zero JavaScript on most pages
- **Content Collections**: Type-safe MDX blog posts
- **Dynamic features**: View counters, search, and comments via server islands
- **Full-text search**: Powered by Pagefind with zero external dependencies
```

Create `src/content/projects/cli-tool.mdx`:

```mdx
---
title: CLI Task Manager
description: A feature-rich command-line task manager built with Node.js, featuring natural language parsing and markdown export.
thumbnail: "../../assets/images/cli-thumb.jpg"
thumbnailAlt: "Terminal showing the CLI tool in action"
tags: ["nodejs", "typescript", "cli"]
status: wip
featured: false
order: 2
repoUrl: "https://github.com/user/task-cli"
startDate: 2026-02-01
---

## Overview

A command-line task manager that combines the simplicity of plain-text todo files with the power of natural language date parsing.

### Features

- Natural language dates ("next Friday", "in 2 weeks")
- Markdown export for sharing
- Recurring tasks
- Tags and priorities
```

- [ ] **Create placeholder assets directory and images**

```bash
mkdir -p /Users/wael/Herd/Astro/logbook/src/assets/images
```

Note: The sample project entries reference cover images. Create a minimal placeholder image or generate a simple SVG placeholder.

---

### Task 3: Blog Helper Library

**Files:**
- Create: `src/lib/posts.ts`

- [ ] **Create `src/lib/posts.ts`**

```typescript
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getRelatedPosts(post: BlogPost, n = 3): Promise<BlogPost[]> {
  const allPosts = await getSortedPosts();
  const related = allPosts
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((tag) => post.data.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared);
  return related.slice(0, n).map((r) => r.post);
}

export async function getAllTags(): Promise<Array<{ name: string; count: number }>> {
  const posts = await getSortedPosts();
  const tagCount = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

- [ ] **Add `getReadingTime` to `src/lib/utils.ts`**

Edit `src/lib/utils.ts` to export `getReadingTime` from a unified location or keep it in `posts.ts`. Keep it in `posts.ts` since it's content-specific.

---

### Task 4: Blog Post Page (`/blog/[slug]`)

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Create individual blog post page**

```astro
---
import { getEntry, getCollection } from 'astro:content';
import BaseLayout from '@/layouts/Base.astro';
import BlogPostLayout from '@/layouts/BlogPost.astro';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import Prose from '@/components/ui/Prose.astro';
import { getReadingTime, getRelatedPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
const readingTime = getReadingTime(post.body ?? '');
const related = await getRelatedPosts(post);
const headingsList = headings?.map((h: { depth: number; text: string; slug: string }) => ({
  depth: h.depth,
  text: h.text,
  id: h.slug,
})) ?? [];
---

<BaseLayout title={`${post.data.title} — Log Book`} description={post.data.description}>
  <Header />
  <main id="main-content">
    <article class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-x-8 lg:grid-cols-[1fr_256px]">
        <!-- Article column -->
        <div class="min-w-0 py-12">
          <!-- Post header -->
          <header class="mb-10">
            <h1 class="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              {post.data.title}
            </h1>
            <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <time datetime={post.data.pubDate.toISOString()}>
                {formatDate(post.data.pubDate)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{readingTime} min read</span>
              {post.data.tags.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <div class="flex flex-wrap gap-2">
                    {post.data.tags.map((tag: string) => (
                      <a
                        href={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>

          <!-- Content -->
          <Prose>
            <Content />
          </Prose>

          <!-- Related posts -->
          {related.length > 0 && (
            <section class="mt-16 border-t border-border pt-10">
              <h2 class="mb-6 font-display text-2xl font-semibold tracking-tight text-text">
                Related Posts
              </h2>
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((relatedPost) => (
                  <a
                    href={`/blog/${relatedPost.id}`}
                    class="group rounded-lg border border-border bg-surface p-5 transition-all hover:shadow-md"
                  >
                    <h3 class="font-semibold text-text group-hover:text-primary transition-colors">
                      {relatedPost.data.title}
                    </h3>
                    <p class="mt-2 text-sm text-text-secondary line-clamp-2">
                      {relatedPost.data.description}
                    </p>
                    <time class="mt-3 block text-xs text-text-tertiary">
                      {formatDate(relatedPost.data.pubDate)}
                    </time>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <!-- TOC sidebar -->
        {headingsList.length > 0 && (
          <aside class="hidden lg:block pt-12" aria-label="Table of contents">
            <nav class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 class="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                Contents
              </h3>
              <ul class="space-y-1 border-l border-border pl-4">
                {headingsList.map((heading: { depth: number; text: string; id: string }) => (
                  <li>
                    <a
                      href={`#${heading.id}`}
                      class={`block py-1 text-sm leading-relaxed text-text-secondary transition-colors hover:text-text ${heading.depth === 3 ? 'pl-3' : ''}`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </article>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Run build to verify slug page works**

Run: `npm run build`
Expected: Build generates `/blog/getting-started-with-astro`, `/blog/building-performant-sites`, `/blog/typescript-patterns`

---

### Task 5: Blog Index Page (paginated)

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[page].astro`

- [ ] **Create blog index page**

```astro
---
import { getCollection, paginate } from 'astro:content';
import BaseLayout from '@/layouts/Base.astro';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import { formatDate } from '@/lib/utils';
import { getReadingTime, getAllTags } from '@/lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return paginate(sorted, { pageSize: 10 });
}

const { page } = Astro.props;
const tags = await getAllTags();
---

<BaseLayout title="Blog — Log Book" description="Technical articles about web development, TypeScript, Astro, and software engineering.">
  <Header />
  <main id="main-content">
    <div class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 class="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl mb-2">
        Blog
      </h1>
      <p class="text-text-secondary mb-10">
        Thoughts on web development, TypeScript, and building for performance.
      </p>

      <!-- Tags -->
      {tags.length > 0 && (
        <div class="mb-10 flex flex-wrap gap-2">
          {tags.map(({ name, count }) => (
            <a
              href={`/blog/tags/${name.toLowerCase().replace(/\s+/g, '-')}`}
              class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {name}
              <span class="ml-1.5 text-xs text-primary/70">({count})</span>
            </a>
          ))}
        </div>
      )}

      <!-- Post list -->
      <div class="space-y-8">
        {page.data.map((post) => (
          <article class="group border-b border-border pb-8 last:border-b-0">
            <a href={`/blog/${post.id}`} class="block">
              <h2 class="font-display text-2xl font-semibold tracking-tight text-text group-hover:text-primary transition-colors">
                {post.data.title}
              </h2>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                <time datetime={post.data.pubDate.toISOString()}>
                  {formatDate(post.data.pubDate)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{getReadingTime(post.body ?? '')} min read</span>
              </div>
              <p class="mt-3 text-text-secondary leading-relaxed line-clamp-2">
                {post.data.description}
              </p>
              {post.data.tags.length > 0 && (
                <div class="mt-3 flex flex-wrap gap-2">
                  {post.data.tags.slice(0, 3).map((tag: string) => (
                    <span class="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </article>
        ))}
      </div>

      <!-- Pagination -->
      {page.lastPage > 1 && (
        <nav class="mt-12 flex items-center justify-center gap-4" aria-label="Blog pagination">
          {page.currentPage > 1 && (
            <a
              href={page.url.prev ?? '#'}
              class="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
            >
              ← Previous
            </a>
          )}
          <span class="text-sm text-text-tertiary">
            Page {page.currentPage} of {page.lastPage}
          </span>
          {page.currentPage < page.lastPage && (
            <a
              href={page.url.next ?? '#'}
              class="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
            >
              Next →
            </a>
          )}
        </nav>
      )}
    </div>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Create pagination handler**

```astro
---
// src/pages/blog/[page].astro
import { getCollection, paginate } from 'astro:content';
import BaseLayout from '@/layouts/Base.astro';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import { formatDate } from '@/lib/utils';
import { getReadingTime, getAllTags } from '@/lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return paginate(sorted, { pageSize: 10 }).map((page) => ({
    params: { page: String(page.currentPage) },
    props: { page },
  }));
}

const { page } = Astro.props;
const tags = await getAllTags();
---

<BaseLayout title={`Blog — Page ${page.currentPage} — Log Book`} description="Technical articles about web development.">
  <Header />
  <main id="main-content">
    <div class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 class="font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl mb-2">
        Blog
      </h1>
      <p class="text-text-secondary mb-10">
        Thoughts on web development, TypeScript, and building for performance.
      </p>

      {tags.length > 0 && (
        <div class="mb-10 flex flex-wrap gap-2">
          {tags.map(({ name, count }) => (
            <a
              href={`/blog/tags/${name.toLowerCase().replace(/\s+/g, '-')}`}
              class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {name}
              <span class="ml-1.5 text-xs text-primary/70">({count})</span>
            </a>
          ))}
        </div>
      )}

      <div class="space-y-8">
        {page.data.map((post) => (
          <article class="group border-b border-border pb-8 last:border-b-0">
            <a href={`/blog/${post.id}`} class="block">
              <h2 class="font-display text-2xl font-semibold tracking-tight text-text group-hover:text-primary transition-colors">
                {post.data.title}
              </h2>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                <time datetime={post.data.pubDate.toISOString()}>
                  {formatDate(post.data.pubDate)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{getReadingTime(post.body ?? '')} min read</span>
              </div>
              <p class="mt-3 text-text-secondary leading-relaxed line-clamp-2">
                {post.data.description}
              </p>
              {post.data.tags.length > 0 && (
                <div class="mt-3 flex flex-wrap gap-2">
                  {post.data.tags.slice(0, 3).map((tag: string) => (
                    <span class="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </article>
        ))}
      </div>

      <nav class="mt-12 flex items-center justify-center gap-4">
        {page.currentPage > 1 && (
          <a
            href={page.url.prev ?? '#'}
            class="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            ← Previous
          </a>
        )}
        <span class="text-sm text-text-tertiary">
          Page {page.currentPage} of {page.lastPage}
        </span>
        {page.currentPage < page.lastPage && (
          <a
            href={page.url.next ?? '#'}
            class="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text"
          >
            Next →
          </a>
        )}
      </nav>
    </div>
  </main>
  <Footer />
</BaseLayout>
```

---

### Task 6: Tag-Filtered Blog Pages

**Files:**
- Create: `src/pages/blog/tags/[tag].astro`

- [ ] **Create tag page**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/Base.astro';
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import { formatDate } from '@/lib/utils';
import { getReadingTime } from '@/lib/posts';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.add(tag.toLowerCase().replace(/\s+/g, '-'));
    }
  }
  return Array.from(tags).map((tag) => ({
    params: { tag },
    props: { tag },
  }));
}

const { tag } = Astro.props;
const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const filtered = allPosts
  .filter((post) =>
    post.data.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tag)
  )
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const displayTag = filtered[0]?.data.tags.find(
  (t: string) => t.toLowerCase().replace(/\s+/g, '-') === tag
) ?? tag;
---

<BaseLayout title={`${displayTag} posts — Blog — Log Book`} description={`Posts tagged with "${displayTag}".`}>
  <Header />
  <main id="main-content">
    <div class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div class="mb-10">
        <a href="/blog" class="text-sm text-text-secondary hover:text-text transition-colors">
          ← Back to all posts
        </a>
        <h1 class="mt-4 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Posts tagged: <span class="text-primary">{displayTag}</span>
        </h1>
        <p class="mt-2 text-text-secondary">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length > 0 ? (
        <div class="space-y-8">
          {filtered.map((post) => (
            <article class="group border-b border-border pb-8 last:border-b-0">
              <a href={`/blog/${post.id}`} class="block">
                <h2 class="font-display text-2xl font-semibold tracking-tight text-text group-hover:text-primary transition-colors">
                  {post.data.title}
                </h2>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                  <time datetime={post.data.pubDate.toISOString()}>
                    {formatDate(post.data.pubDate)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{getReadingTime(post.body ?? '')} min read</span>
                </div>
                <p class="mt-3 text-text-secondary leading-relaxed line-clamp-2">
                  {post.data.description}
                </p>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div class="rounded-lg border border-border bg-surface p-10 text-center">
          <p class="text-text-secondary">No posts found with this tag.</p>
        </div>
      )}
    </div>
  </main>
  <Footer />
</BaseLayout>
```

---

### Task 7: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Create RSS feed endpoint**

```typescript
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: { site: string }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: 'Log Book',
    description: 'Technical articles about web development, TypeScript, and software engineering.',
    site: context.site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
```

---

### Task 8: Blog Components (PostCard, PostList, TagFilter, TableOfContents, CopyCode)

**Files:**
- Create: `src/components/blog/PostCard.astro`
- Create: `src/components/blog/PostList.astro`
- Create: `src/components/blog/TagFilter.astro`
- Create: `src/components/blog/TableOfContents.astro`
- Create: `src/components/blog/CopyCode.astro`
- Create: `src/components/icons/IconCopy.astro`
- Create: `src/components/icons/IconCheck.astro`

- [ ] **Create PostCard component**

```astro
---
import { formatDate } from '@/lib/utils';
import { getReadingTime } from '@/lib/posts';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
  featured?: boolean;
  showCover?: boolean;
}

const { post, featured = false, showCover = true } = Astro.props;
const readingTime = getReadingTime(post.body ?? '');
---

<article class={`group rounded-lg border border-border bg-surface transition-all hover:shadow-md ${featured ? 'sm:col-span-2' : ''}`}>
  <a href={`/blog/${post.id}`} class="block p-6">
    <div class="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
      <time datetime={post.data.pubDate.toISOString()}>
        {formatDate(post.data.pubDate)}
      </time>
      <span aria-hidden="true">·</span>
      <span>{readingTime} min read</span>
    </div>

    <h3 class={`mt-3 font-display font-semibold tracking-tight text-text group-hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
      {post.data.title}
    </h3>

    <p class="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
      {post.data.description}
    </p>

    {post.data.tags.length > 0 && (
      <div class="mt-4 flex flex-wrap gap-1.5">
        {post.data.tags.slice(0, 3).map((tag: string) => (
          <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {tag}
          </span>
        ))}
      </div>
    )}
  </a>
</article>
```

- [ ] **Create PostList component**

```astro
---
import PostCard from './PostCard.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  posts: CollectionEntry<'blog'>[];
  layout?: 'grid' | 'list';
}

const { posts, layout = 'list' } = Astro.props;
---

{layout === 'grid' ? (
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {posts.map((post) => (
      <PostCard post={post} />
    ))}
  </div>
) : (
  <div class="space-y-6">
    {posts.map((post) => (
      <PostCard post={post} />
    ))}
  </div>
)}

{posts.length === 0 && (
  <div class="rounded-lg border border-border bg-surface p-10 text-center">
    <p class="text-text-secondary">No posts yet. Check back soon!</p>
  </div>
)}
```

- [ ] **Create TagFilter component**

```astro
---
interface Props {
  tags: { name: string; count: number }[];
  activeTag?: string;
}

const { tags, activeTag } = Astro.props;
---

<div class="flex flex-wrap gap-2">
  <a
    href="/blog"
    class={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${!activeTag ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'}`}
  >
    All
  </a>
  {tags.map(({ name, count }) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const isActive = activeTag === slug;
    return (
      <a
        href={`/blog/tags/${slug}`}
        class={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'bg-surface-2 text-text-secondary hover:bg-surface-3'}`}
      >
        {name}
        <span class="ml-1.5 text-xs opacity-70">({count})</span>
      </a>
    );
  })}
</div>
```

- [ ] **Create TableOfContents component**

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;
---

<nav aria-label="Table of contents" class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
  <h3 class="mb-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">
    Contents
  </h3>
  <ul class="space-y-1 border-l border-border pl-4">
    {headings.filter((h) => h.depth <= 3).map((heading) => (
      <li>
        <a
          href={`#${heading.slug}`}
          class={`block py-1 text-sm leading-relaxed text-text-secondary transition-colors hover:text-text ${heading.depth === 3 ? 'pl-3' : ''}`}
        >
          {heading.text}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

- [ ] **Create IconCopy component**

```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<svg class={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
</svg>
```

- [ ] **Create IconCheck component**

```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<svg class={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>
```

- [ ] **Create CopyCode component**

```astro
---
// src/components/blog/CopyCode.astro
---

<!-- Adds copy buttons to all code blocks on the page -->
<div id="copy-code-root">
  <slot />
</div>

<script>
  const root = document.getElementById('copy-code-root');
  if (!root) throw new Error('CopyCode root not found');

  const preBlocks = root.querySelectorAll('pre');
  preBlocks.forEach((pre) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative group';
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const button = document.createElement('button');
    button.className =
      'absolute top-2 right-2 rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    // Copy icon
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;

    button.innerHTML = copyIcon;
    wrapper.appendChild(button);

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        button.innerHTML = checkIcon;
        button.classList.add('text-success');
        setTimeout(() => {
          button.innerHTML = copyIcon;
          button.classList.remove('text-success');
        }, 2000);
      } catch {
        button.innerHTML = '!';
        setTimeout(() => {
          button.innerHTML = copyIcon;
        }, 2000);
      }
    });
  });
</script>
```

---

### Task 9: MDX Configuration (remark/rehype plugins)

- [ ] **Update `astro.config.mjs` to add remark/rehype plugins**

Edit `astro.config.mjs` to add rehype-slug and rehype-autolink-headings:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: { light: 'github-light', dark: 'github-dark-dimmed' },
    },
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
  image: {
    sharp: true,
  },
  server: {
    host: '127.0.0.1',
    port: 4321,
    hmr: {
      protocol: 'wss',
      host: 'logbook.test',
      clientPort: 443,
    },
    allowedHosts: ['logbook.test'],
  },
});
```

- [ ] **Install rehype plugins**

Run: `npm install rehype-slug rehype-autolink-headings`

---

### Task 10: Update Base.astro for Heading IDs in Prose

No changes needed — `rehype-slug` auto-adds `id` attributes to all headings. The `rehype-autolink-headings` adds anchor links.

---

### Task 11: Build & Verify

- [ ] **Run build to check for errors**

Run: `npm run build`
Expected: Build succeeds. All blog routes are generated.

- [ ] **Verify generated routes**

Run: `npm run build 2>&1 | grep -E 'blog|rss'` or check `dist/` for generated files.
Expected: Files exist for:
- `/blog/index.html`
- `/blog/getting-started-with-astro/index.html`
- `/blog/building-performant-sites/index.html`
- `/blog/typescript-patterns/index.html`
- `/blog/tags/astro/index.html`
- `/blog/tags/typescript/index.html`
- (and other tag pages)
- `/rss.xml`

---

### Task 12: Update Progress Tracker

- [ ] **Update `.context/progress-tracker.md`**

Mark all Phase 2 tasks as completed. Update `Active Phase` to `Phase 3 — Projects Section`.
