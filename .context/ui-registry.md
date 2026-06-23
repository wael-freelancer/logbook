# UI Registry — Component Reference

Every component in the project. Use this as the source of truth for what exists, what props it accepts, and where it lives. Do not create duplicate components — check here first.

---

## Layout Components (`src/components/layout/`)

### `BaseHead.astro`
Injected in `<head>`. Handles all metadata.

**Props:**
```typescript
interface Props {
  title: string;           // Page title (appended with site name)
  description: string;     // Meta description (max 160 chars)
  image?: string;          // OG image URL (default: /og/default.png)
  type?: 'website' | 'article'; // OG type (default: 'website')
  pubDate?: Date;          // For article type
  updatedDate?: Date;      // For article type
  noindex?: boolean;       // Prevent indexing (default: false)
}
```

**Outputs:** `<title>`, `<meta description>`, Open Graph tags, Twitter Card tags, canonical URL, favicon links, font preloads, JSON-LD structured data.

---

### `Header.astro`
Site-wide navigation header.

**Props:** None (reads active path from `Astro.url.pathname`)

**Features:**
- Logo/name link to `/`
- Nav links: Home, Blog, Projects, About, Uses
- Active state on current page
- Theme toggle button
- Hamburger menu on mobile

---

### `Footer.astro`
Site-wide footer.

**Props:** None

**Features:**
- Copyright year (auto-updated)
- Social links (GitHub, LinkedIn, Twitter/X, RSS)
- Secondary nav (Blog, Projects, About)
- Built with Astro badge

---

### `Sidebar.astro`
Table of contents sidebar for blog posts.

**Props:**
```typescript
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
```

---

## Layout Files (`src/layouts/`)

### `Base.astro`
Root HTML shell.

**Props:**
```typescript
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  pubDate?: Date;
  class?: string;  // Additional body classes
}
```

---

### `BlogPost.astro`
Two-column layout for blog posts.

**Props:**
```typescript
interface Props {
  post: CollectionEntry<'blog'>;
  readingTime: number;
  headings: MarkdownHeading[];
}
```

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Header                                          │
├─────────────────────────────────┬────────────────┤
│  Post header (title, meta)      │                │
│  Cover image                    │  TOC Sidebar   │
│  Article content (prose)        │  (xl:block)    │
│  Related posts                  │                │
│  Comments                       │                │
├─────────────────────────────────┴────────────────┤
│  Footer                                          │
└──────────────────────────────────────────────────┘
```

---

### `Page.astro`
Single-column page layout.

**Props:**
```typescript
interface Props {
  title: string;
  description: string;
  heading?: string;     // Optional h1 override (default: title)
  subheading?: string;  // Optional subtitle below heading
}
```

---

## UI Primitives (`src/components/ui/`)

### `Button.astro`

**Props:**
```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  href?: string;       // If provided, renders as <a>, else <button>
  external?: boolean;  // Adds target="_blank" rel="noopener"
  disabled?: boolean;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  // All other HTML button attributes via ...attrs
}
```

**Example:**
```astro
<Button href="/blog" variant="primary">Read the Blog</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button type="submit" variant="primary">Send Message</Button>
```

---

### `Badge.astro`

**Props:**
```typescript
interface Props {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'default';
  href?: string;   // Makes badge a link
  class?: string;
}
```

**Example:**
```astro
<Badge>TypeScript</Badge>
<Badge variant="secondary">Astro</Badge>
<Badge href="/blog/tags/react">React</Badge>
```

---

### `Card.astro`

**Props:**
```typescript
interface Props {
  elevation?: 'flat' | 'raised' | 'interactive';
  padding?: 'none' | 'sm' | 'default' | 'lg';
  as?: 'div' | 'article' | 'section' | 'li';
  class?: string;
}
```

---

### `Prose.astro`
Wraps MDX content with typography styles.

**Props:**
```typescript
interface Props {
  class?: string;
}
```

**Usage:**
```astro
<Prose>
  <Content />
</Prose>
```

---

## Blog Components (`src/components/blog/`)

### `PostCard.astro`

**Props:**
```typescript
interface Props {
  post: CollectionEntry<'blog'>;
  featured?: boolean;  // Larger featured layout
  showCover?: boolean; // Show cover image (default: true)
}
```

**Displays:** Title, date, reading time, description, tags (max 3), cover image (if available)

---

### `PostList.astro`

**Props:**
```typescript
interface Props {
  posts: CollectionEntry<'blog'>[];
  layout?: 'grid' | 'list';  // default: 'list'
}
```

---

### `TagFilter.astro`
Interactive tag filter. **Client island** (`client:load`).

**Props:**
```typescript
interface Props {
  tags: { name: string; count: number }[];
  activeTag?: string;
}
```

**Behavior:** Clicking a tag filters the visible post list. Uses URL param `?tag=` for shareable state.

---

### `TableOfContents.astro`

**Props:**
```typescript
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
```

**Behavior:** Highlights the currently visible heading as user scrolls (uses Intersection Observer). Only renders h2 and h3.

---

### `ReadingProgress.astro`
Fixed progress bar at top of page. **Client island** (`client:load`).

**Props:** None

**Behavior:** Thin bar (2px) across the top of the viewport, width = scroll percentage.

---

### `ViewCounter.astro`
Displays post view count. **Server island** (`server:defer`).

**Props:**
```typescript
interface Props {
  slug: string;
}
```

**Behavior:**
- On mount: increments view count via `/api/views/[slug]` POST
- Displays formatted count (e.g. "1,234 views")
- Fallback slot shown while loading: `<span slot="fallback">`

---

### `CopyCode.astro`
Adds copy buttons to all code blocks. **Client island** (`client:visible`).

**Props:** None

**Behavior:** Queries all `<pre>` elements in `.prose`, adds copy button to each. Shows "Copied!" feedback for 2s.

---

### `Comments.astro`
Giscus comments widget. **Client island** (`client:visible`).

**Props:**
```typescript
interface Props {
  slug: string;
  title: string;
}
```

---

### `Search.astro`
Pagefind-powered search UI. **Client island** (`client:idle`).

**Props:**
```typescript
interface Props {
  placeholder?: string;
}
```

---

## Project Components (`src/components/projects/`)

### `ProjectCard.astro`

**Props:**
```typescript
interface Props {
  project: CollectionEntry<'projects'>;
  featured?: boolean;
}
```

**Displays:** Thumbnail, title, description, tech badges, status badge, live link, repo link

---

### `ProjectGrid.astro`

**Props:**
```typescript
interface Props {
  projects: CollectionEntry<'projects'>[];
  filterable?: boolean;  // Add tag filter (client:load)
}
```

---

### `TechBadge.astro`
Technology/stack badge with optional icon.

**Props:**
```typescript
interface Props {
  tech: string;          // Technology name (used for icon lookup)
  size?: 'sm' | 'default';
}
```

**Supported icons** (auto-matched by name): TypeScript, JavaScript, React, Astro, Vue, Svelte, Next.js, Node.js, Python, Rust, Go, PostgreSQL, MongoDB, Redis, Docker, Vercel, AWS, Tailwind, GraphQL, tRPC

---

## Home Components (`src/components/home/`)

### `Hero.astro`
Home page hero section.

**Props:** None (all content hardcoded or from site config)

**Contains:**
- Animated greeting
- Name (h1)
- Role/tagline
- CTA buttons (Blog, Projects, Resume)
- Social links row

---

### `FeaturedWork.astro`

**Props:**
```typescript
interface Props {
  projects?: CollectionEntry<'projects'>[];  // Default: auto-fetches featured
  limit?: number;  // Default: 3
}
```

---

### `RecentPosts.astro`

**Props:**
```typescript
interface Props {
  posts?: CollectionEntry<'blog'>[];  // Default: auto-fetches latest
  limit?: number;  // Default: 3
}
```

---

## Icon Components (`src/components/icons/`)

SVG icon components. All icons:
- Accept `class` prop for sizing/color
- Default size: `1em × 1em`
- `aria-hidden="true"` by default
- Accept `aria-label` prop for non-decorative use

Available icons:
- `IconGitHub.astro`
- `IconLinkedIn.astro`
- `IconTwitter.astro`
- `IconRSS.astro`
- `IconMoon.astro`
- `IconSun.astro`
- `IconMenu.astro`
- `IconClose.astro`
- `IconExternalLink.astro`
- `IconCopy.astro`
- `IconCheck.astro`
- `IconSearch.astro`
- `IconChevronLeft.astro`
- `IconChevronRight.astro`
- `IconArrowRight.astro`

---

## Component Creation Rules

When creating a new component:

1. **Check this registry first** — maybe it already exists or an existing component can be extended
2. **Place in the correct directory** — layout, ui, blog, projects, home, or icons
3. **Always define a `Props` interface** with JSDoc comments on non-obvious props
4. **Add to this registry** after creation — keep this file current
5. **Test in both themes** (light and dark) before marking complete
6. **Test at all breakpoints** (320px, 768px, 1280px)

---

## Component Composition Example

```astro
<!-- Typical blog page assembly -->
<BlogPost {post} {readingTime} {headings}>
  <Fragment slot="header">
    <PostHeader {post} {readingTime} />
  </Fragment>
  
  <Prose>
    <Content components={{ pre: CopyCode }} />
  </Prose>
  
  <Fragment slot="sidebar">
    <TableOfContents {headings} />
  </Fragment>
  
  <Fragment slot="after-content">
    <RelatedPosts posts={related} />
    <ViewCounter slug={post.slug} server:defer>
      <span slot="fallback" />
    </ViewCounter>
    <Comments slug={post.slug} title={post.data.title} client:visible />
  </Fragment>
</BlogPost>
```
