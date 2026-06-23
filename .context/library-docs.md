# Library Docs — API Reference & Usage Patterns

Quick reference for every library used in this project. Consult before implementing to avoid deprecated patterns.

---

## Astro 6.x

### Key Concepts

**Hybrid Output Mode** — enables SSG + SSR on a per-route basis:
```javascript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid',          // Default: static. Individual pages opt into SSR
  adapter: vercel({ edgeMiddleware: true }),
});

// In a page — opt into SSR:
export const prerender = false;

// In a page — opt into static (explicit, default in hybrid mode):
export const prerender = true;
```

**Server Islands** (Astro 6.x) — defer server-rendered components without blocking page HTML:
```astro
---
// ParentPage.astro — this page is fully static
---
<!-- Deferred: fetched after static HTML is delivered -->
<ViewCounter slug={slug} server:defer>
  <span slot="fallback" class="text-text-tertiary text-sm">—</span>
</ViewCounter>
```

**Content Collections** — always use `getCollection` and `getEntry` from `astro:content`:
```typescript
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// Get all non-draft posts
const posts = await getCollection('blog', ({ data }) =>
  import.meta.env.PROD ? !data.draft : true
);

// Get single entry
const post = await getEntry('blog', slug); // Returns undefined if not found
if (!post) return Astro.redirect('/404');
```

**Dynamic Routes with getStaticPaths**:
```typescript
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'blog'>;
}
const { post } = Astro.props;
const { Content, headings } = await post.render();
```

**Image Optimization** — always use `astro:assets`:
```astro
---
import { Image, Picture } from 'astro:assets';
import localImage from '../assets/photo.jpg';
---

<!-- Static import (build-time optimization) -->
<Image src={localImage} alt="Description" width={800} height={600} />

<!-- From content collection (already an ImageMetadata) -->
<Image src={post.data.cover} alt={post.data.coverAlt} />

<!-- Remote images need explicit dimensions -->
<Image src="https://example.com/image.jpg" alt="..." width={400} height={300} inferSize />
```

**Pagination**:
```typescript
// src/pages/blog/[page].astro
export async function getStaticPaths({ paginate }) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return paginate(sorted, { pageSize: 10 });
}

const { page } = Astro.props;
// page.data: posts on current page
// page.currentPage: number
// page.lastPage: number
// page.url.prev / page.url.next: string | undefined
```

**Astro.redirect and Astro.rewrite**:
```typescript
// In SSR pages
if (!slug) return Astro.redirect('/404');
return Astro.rewrite('/custom-404');
```

---

## Tailwind CSS v4

### Configuration Pattern
```javascript
// tailwind.config.cjs
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Map CSS custom properties to Tailwind
        background: 'hsl(var(--color-bg) / <alpha-value>)',
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        text: {
          DEFAULT: 'hsl(var(--color-text) / <alpha-value>)',
          secondary: 'hsl(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'hsl(var(--color-text-tertiary) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', ...fontFamily.sans],
        mono: ['JetBrains Mono', ...fontFamily.mono],
        display: ['Cal Sans', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

### Typography Plugin (for MDX prose)
```astro
<!-- Wrap MDX content -->
<article class="prose prose-gray dark:prose-invert max-w-none
                prose-headings:font-display prose-headings:tracking-tight
                prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-code-bg">
  <Content />
</article>
```

### Responsive Design
- Mobile-first: base styles → `sm:` → `md:` → `lg:` → `xl:` → `2xl:`
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

---

## MDX in Astro

### Custom Components in MDX
```typescript
// src/pages/blog/[slug].astro
const { Content } = await post.render();
---
<!-- Pass custom components to replace default HTML elements -->
<Content
  components={{
    pre: CodeBlock,      // Custom code block with copy button
    img: OptimizedImage, // Use Astro's <Image />
    a: SmartLink,        // Handles external vs internal links
  }}
/>
```

### Remark/Rehype Plugins
```javascript
// astro.config.mjs
import remarkReadingTime from './src/plugins/remark-reading-time.mjs';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    shikiConfig: {
      theme: 'one-dark-pro',      // Or custom theme object
      wrap: false,
    },
  },
});
```

### Reading Time Remark Plugin
```javascript
// src/plugins/remark-reading-time.mjs
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.readingTime = readingTime.minutes;
  };
}
```

---

## Motion One (`motion`)

Motion One uses the Web Animations API — no WAAPI polyfill needed in modern browsers.

```typescript
import { animate, stagger, inView, timeline } from 'motion';

// Basic animation
animate('#hero-title',
  { opacity: [0, 1], y: [20, 0] },
  { duration: 0.6, easing: 'ease-out' }
);

// Staggered children
animate('.post-card',
  { opacity: [0, 1], y: [16, 0] },
  { delay: stagger(0.1), duration: 0.4 }
);

// Trigger on scroll entry
inView('.section', ({ target }) => {
  animate(target, { opacity: [0, 1] }, { duration: 0.5 });
});

// Always respect prefers-reduced-motion
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  animate(el, { ... });
}
```

---

## Pagefind (Static Search)

Pagefind runs after `astro build` and indexes the HTML output.

```javascript
// astro.config.mjs — run pagefind after build
import { execSync } from 'child_process';

export default defineConfig({
  // ...
  integrations: [
    {
      name: 'pagefind',
      hooks: {
        'astro:build:done': () => {
          execSync('npx pagefind --site dist');
        },
      },
    },
  ],
});
```

```astro
<!-- Search UI component (client:idle) -->
<script>
  import '/pagefind/pagefind-ui.js';
  new PagefindUI({ element: '#search', showImages: false });
</script>
<div id="search" />
<link rel="stylesheet" href="/pagefind/pagefind-ui.css" />
```

To exclude content from indexing:
```html
<div data-pagefind-ignore>This won't be indexed</div>
```

---

## Shiki (Syntax Highlighting)

Configured via `astro.config.mjs`. Works at build time — zero JS in output.

```javascript
// Using a built-in theme
shikiConfig: { theme: 'github-dark-dimmed' }

// Using custom theme (VSCode theme JSON format)
import customTheme from './src/themes/my-theme.json';
shikiConfig: { theme: customTheme }

// Dual theme (light/dark)
shikiConfig: {
  themes: { light: 'github-light', dark: 'github-dark-dimmed' },
  defaultColor: false,  // Use CSS vars to switch
}
```

---

## Vercel KV (for View Counters)

```typescript
// src/lib/views.ts
import { kv } from '@vercel/kv';

export async function getViewCount(slug: string): Promise<number> {
  const count = await kv.get<number>(`views:${slug}`);
  return count ?? 0;
}

export async function incrementViewCount(slug: string): Promise<number> {
  const count = await kv.incr(`views:${slug}`);
  return count;
}
```

Environment variables required:
```
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

---

## Satori + resvg-js (OG Images)

```typescript
// src/pages/og/[slug].png.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';

const fontData = readFileSync('./public/fonts/Inter-Bold.ttf');

export async function GET({ params }: APIContext) {
  const post = await getEntry('blog', params.slug!);
  if (!post) return new Response('Not found', { status: 404 });

  const svg = await satori(
    // JSX element describing the OG image
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0f172a' }}>
      <h1 style={{ color: 'white', fontSize: 48 }}>{post.data.title}</h1>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700 }],
    }
  );

  const resvg = new Resvg(svg);
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
  });
}
```

---

## Giscus (Comments)

```astro
<!-- src/components/blog/Comments.astro -->
<script>
  // Respect color scheme
  const theme = document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
</script>
<script
  src="https://giscus.app/client.js"
  data-repo="username/repo"
  data-repo-id="R_..."
  data-category="Blog Comments"
  data-category-id="DIC_..."
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="preferred_color_scheme"
  data-lang="en"
  data-loading="lazy"
  crossorigin="anonymous"
  async
></script>
```

---

## RSS Feed

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Your Name — Blog',
    description: 'Technical articles on web development',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map(post => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      })),
  });
}
```

---

## `cn()` Utility

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```
