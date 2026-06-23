# Code Standards

Strict rules. The agent must follow these without exception. When in doubt, be more explicit, not less.

---

## TypeScript

- **Strict mode always** — `tsconfig.json` must have `"strict": true`
- **No `any`** — use `unknown` and narrow, or define a proper type
- **No `!` non-null assertions** — handle nullability explicitly
- **Explicit return types** on all exported functions
- **Prefer `interface` for object shapes**, `type` for unions and utilities
- **Zod for runtime validation** — never trust external data without parsing

```typescript
// ✅ Good
interface PostMeta {
  title: string;
  pubDate: Date;
  tags: string[];
}

function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

// ❌ Bad
const getPostUrl = (slug: any) => `/blog/${slug}`;
```

---

## Astro Components

### Frontmatter
- Always define `Props` interface for components that accept props
- Use destructuring in frontmatter, not `Astro.props` directly

```astro
---
// ✅ Good
interface Props {
  title: string;
  description?: string;
  class?: string;
}

const { title, description, class: className } = Astro.props;
---

<!-- ❌ Bad: accessing Astro.props inline, no type definition -->
<h1>{Astro.props.title}</h1>
```

### Slots
- Document slots with comments when non-obvious
- Always provide a fallback for optional named slots

### Styles
- **No `<style>` blocks in Astro components** — use Tailwind utilities exclusively
- Exception: complex CSS-only animations that can't be done with Tailwind

---

## Tailwind CSS

### Class Organization Order
Always write Tailwind classes in this order (use Prettier plugin to auto-sort):
1. Layout (display, position, flex, grid)
2. Sizing (width, height, padding, margin)
3. Typography (font-*, text-*, leading-*, tracking-*)
4. Visual (bg-*, border-*, rounded-*, shadow-*)
5. Interactive (hover:, focus:, active:)
6. Responsive (sm:, md:, lg:, xl:)
7. Dark mode (dark:)

```astro
<!-- ✅ Good: ordered, readable -->
<button class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-dark">
  Click me
</button>
```

### No Inline Conditionals for Long Class Lists
Use `cn()` utility from `@/lib/utils` when classes are conditional:

```typescript
import { cn } from '@/lib/utils';

// ✅ Good
const buttonClass = cn(
  'flex items-center gap-2 px-4 py-2 rounded-md font-medium',
  variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
  variant === 'ghost' && 'bg-transparent text-current hover:bg-surface-2',
  disabled && 'opacity-50 cursor-not-allowed',
  className,
);
```

### Design Tokens Over Arbitrary Values
Never use arbitrary Tailwind values if a token exists. Prefer `text-body` over `text-[16px]`.

```astro
<!-- ✅ Good: token-based -->
<p class="text-body text-text-secondary">...</p>

<!-- ❌ Bad: magic numbers -->
<p class="text-[15px] text-[#6b7280]">...</p>
```

---

## File and Component Naming

| Type | Convention | Example |
|---|---|---|
| Astro components | `PascalCase.astro` | `PostCard.astro` |
| TypeScript modules | `camelCase.ts` | `utils.ts`, `posts.ts` |
| Pages | `lowercase-kebab.astro` | `index.astro`, `[slug].astro` |
| API routes | `camelCase.ts` | `contact.ts` |
| CSS files | `kebab-case.css` | `global.css`, `typography.css` |
| Content files | `kebab-case.mdx` | `my-post-title.mdx` |

---

## Content Collections

- Every MDX file **must** have all required frontmatter — never skip Zod-required fields
- `draft: true` posts are excluded in production builds — always set this during WIP
- Images co-located with content must use the `image()` helper in schema for optimization
- Never hardcode post counts or dates — always derive from collection queries

```typescript
// ✅ Good: derive from collection
const posts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

// ❌ Bad: hardcoded
const latestPosts = allPosts.slice(0, 3); // What if there are only 2?
```

---

## API Routes

- All API routes must set appropriate `Content-Type` headers
- All POST endpoints must validate request body with Zod before processing
- Return consistent error shapes: `{ error: string, code?: string }`
- Rate limit sensitive endpoints (contact form, view counter writes)

```typescript
// ✅ Good API route pattern
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  
  const schema = z.object({
    slug: z.string().min(1).max(100),
  });
  
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // ... process
};
```

---

## Performance Rules

- **Never import a whole library** when a subset suffices
  ```typescript
  // ✅ Good
  import { animate } from 'motion';
  // ❌ Bad
  import * as Motion from 'motion';
  ```
- **Astro `<Image />`** must be used for all images — never raw `<img>` tags (except truly decorative SVGs)
- **`client:load`** is the most expensive directive — prefer `client:idle` or `client:visible`
- **No synchronous `localStorage`** access in critical rendering path — always wrap in `try/catch`

---

## Accessibility Rules

- Every `<img>` must have `alt` — empty string `alt=""` is valid only for purely decorative images
- Icon-only buttons must have `aria-label`
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`)
- Heading hierarchy must be correct (no skipping `h2` → `h4`)
- All interactive elements must be reachable and operable via keyboard
- Color cannot be the *only* means of conveying information

```astro
<!-- ✅ Good -->
<button aria-label="Close dialog" class="...">
  <CloseIcon aria-hidden="true" />
</button>

<!-- ❌ Bad -->
<div onclick="close()" class="...">×</div>
```

---

## Git Conventions

### Commit Messages (Conventional Commits)
```
feat: add view counter server island
fix: resolve dark mode flash on initial load
style: adjust heading scale for mobile
refactor: extract post query helpers to lib/posts.ts
docs: add architecture section to README
chore: update astro to 4.x
```

### Branch Naming
```
feature/blog-search
fix/theme-toggle-flash
chore/update-dependencies
```

### Never commit
- `.env` files or secrets
- `node_modules/`
- `.astro/` cache directory
- Build output (`dist/`)

---

## Error Handling

- Never silently swallow errors — always log or surface them
- User-facing error messages must be helpful, not expose internals
- All async operations in API routes must be wrapped in try/catch

```typescript
// ✅ Good
try {
  const count = await kv.incr(`views:${slug}`);
  return new Response(JSON.stringify({ count }), { status: 200 });
} catch (err) {
  console.error('[ViewCounter] KV error:', err);
  return new Response(JSON.stringify({ count: null }), { status: 200 });
  // Graceful degradation: return null count rather than 500
}
```

---

## What NOT to Do

- ❌ Never use `document.write()` or `innerHTML` with user content
- ❌ Never store sensitive data in `localStorage` or cookies without encryption
- ❌ Never make the user wait for a non-critical resource (analytics, comments)
- ❌ Never break the build for a draft post — use `draft: true` frontmatter
- ❌ Never hardcode localhost URLs — use `import.meta.env.SITE`
- ❌ Never add `eslint-disable` comments without an explanatory note
- ❌ Never use CSS `!important` — fix specificity instead
