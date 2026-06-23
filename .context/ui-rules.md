# UI Rules — Component Behavior & Visual Decisions

These rules govern how every UI element behaves and looks. When implementing any component, check this file first.

---

## Layout Rules

### Page Container
Every page uses a max-width container centered with horizontal padding. Never let content span full viewport width.

```astro
<!-- Standard page container -->
<div class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
  <slot />
</div>

<!-- Content (prose) container — narrower for readability -->
<div class="mx-auto w-full max-w-2xl px-4 sm:px-6">
  <slot />
</div>
```

### Section Spacing
Between major page sections, use consistent vertical spacing:
- Mobile: `py-12` (48px)
- Desktop: `py-20` (80px) or `py-24` (96px)

Never use `margin-top` on a section and `padding-bottom` on the previous — pick one consistently. Use `py-*` on sections.

### Blog Post Layout
Two-column on desktop (`lg:` breakpoint), single-column on mobile:
```
┌─────────────────────────────────┬──────────────┐
│  Article content (max-w-2xl)    │  TOC Sidebar │
│                                 │  (sticky)    │
│                                 │              │
└─────────────────────────────────┴──────────────┘
```
- Content column: `max-w-2xl`, ~65ch
- TOC sidebar: `w-64`, `sticky top-24`, only visible at `xl:` breakpoint

---

## Typography Rules

### Heading Hierarchy
- `h1`: `font-display text-4xl sm:text-5xl font-semibold tracking-tight` — one per page
- `h2`: `font-display text-2xl sm:text-3xl font-semibold tracking-tight`
- `h3`: `font-display text-xl sm:text-2xl font-medium`
- `h4`: `font-sans text-lg font-medium`
- Body: `font-sans text-base leading-relaxed`

### Prose (Blog Content)
All blog content is wrapped in Tailwind Typography `.prose`. Customizations:
- No backticks around inline code (use `.prose-code:before:content-none prose-code:after:content-none`)
- Links: underline on hover, not always — use `prose-a:no-underline prose-a:hover:underline`
- Images: rounded corners, shadow — `prose-img:rounded-lg prose-img:shadow-md`
- Code blocks: custom background color matching our `--color-code-bg`

### Link Styling
- **Navigation links**: no underline, subtle color change on hover
- **Inline prose links**: colored text, underline on hover, external links get `↗` indicator
- **CTA/Button links**: styled as buttons, never as text links

### Reading Experience
- Optimal reading line length: 60–75 characters. Enforce with `max-w-2xl` or `max-w-prose`
- Body text: `text-base` (16px) minimum. Never smaller for body copy
- Line height for body: `leading-relaxed` (1.625)
- Paragraph spacing: `space-y-4` between `<p>` tags inside prose

---

## Component Rules

### Buttons

**Three variants only**:
1. `primary` — filled, brand color. One per view, used for the most important action
2. `secondary` — outlined, brand border. Supporting actions
3. `ghost` — transparent, hover reveals bg. Navigation, subtle actions

**Two sizes**:
- `sm`: `px-3 py-1.5 text-sm`
- `default`: `px-4 py-2 text-sm`
- `lg`: `px-6 py-3 text-base`

**States**:
- Hover: background lightens/darkens by ~10%
- Focus: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
- Disabled: `opacity-50 cursor-not-allowed pointer-events-none`
- Loading: replace text with spinner, disable pointer events

Never use `outline: none` without replacing with a visible focus indicator.

### Cards

Cards have exactly three elevations:
1. **Flat** (`border border-border bg-surface`) — default, subtle
2. **Raised** (`shadow-md border-0`) — featured content
3. **Interactive** (`hover:shadow-lg hover:-translate-y-0.5 transition-all`) — clickable cards

Clickable cards: make the entire card clickable via `<a>` wrapper, not just the title link. Use a relative container with absolute anchor.

```astro
<!-- Correct: entire card is clickable -->
<article class="relative rounded-lg border border-border bg-surface p-6 hover:shadow-md transition-shadow">
  <a href={url} class="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary" aria-label={title} />
  <h3 class="font-semibold">{title}</h3>
  <!-- Other content — links inside must have relative z-index to be clickable -->
  <a href={repoUrl} class="relative z-10 text-sm text-text-secondary hover:text-primary">
    View Repo
  </a>
</article>
```

### Badges / Tags

Tags for post categories, tech stack, project tags:
- `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
- Background: `bg-primary/10 text-primary` (default)
- Variants for different categories: use different hue rotations, all using same opacity pattern

```astro
<!-- Usage -->
<Badge variant="primary">TypeScript</Badge>
<Badge variant="secondary">Astro</Badge>
```

### Form Inputs

```
Label
┌─────────────────────────────────────┐
│ Placeholder text                    │
└─────────────────────────────────────┘
  Helper text or error message
```

- Input height: `h-10` for `text`, `select`; auto for `textarea`
- Border: `border border-border rounded` default; `border-danger` on error
- Focus: `focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`
- Label: always visible (no placeholder-as-label)
- Error message: `text-sm text-danger mt-1` below the input

---

## Navigation Rules

### Header
- Sticky at top: `sticky top-0 z-sticky`
- Blur backdrop: `backdrop-blur-md bg-bg/80` — translucent when scrolled
- Height: `h-16` (64px)
- Contents: logo/name left, nav links right, theme toggle far right
- Active page indicator: use `aria-current="page"` and style accordingly

### Mobile Navigation
- Hamburger menu at `< md` breakpoint
- Full-screen overlay or slide-out drawer — not a dropdown
- Close on navigation, close on Escape key, close on overlay click
- Trap focus while open

### Breadcrumbs (Blog post pages)
```
Home / Blog / Post Title
```
- Use semantic `<nav aria-label="Breadcrumb"><ol>` markup
- Current page: `aria-current="page"`, not a link

---

## Blog-Specific UI Rules

### Post Cards (List View)
Each card must display:
- Title (linked)
- Date (formatted: "January 15, 2025")
- Reading time ("5 min read")
- Description (1–2 lines, truncated)
- Tags (max 3 visible)
- Cover image (optional, if available)

### Table of Contents
- Auto-generated from h2/h3 headings in the post
- Sticky on desktop: `sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto`
- Active heading highlighted as user scrolls (Intersection Observer)
- Smooth scroll on click
- Hidden on mobile (offer collapsible mobile TOC optionally)

### Code Blocks
Every code block must have:
- Language indicator (top right or top left)
- Copy button (appears on hover or always visible)
- Horizontal scroll for long lines (never wraps code)
- Filename annotation if provided via meta: ` ```typescript title="config.ts" `

```css
/* Code block styles */
pre {
  background: var(--color-code-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  overflow-x: auto;
  tab-size: 2;
}

pre::-webkit-scrollbar { height: 6px; }
pre::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: 3px; }
```

### Reading Progress Bar
- Fixed at top of viewport: `fixed top-0 left-0 z-fixed h-0.5`
- Color: `bg-primary`
- Width driven by scroll percentage (JS)
- Does not render on non-post pages

### View Counter
- Displayed near the post title: "1,234 views"
- Show skeleton/placeholder while loading (server island fallback)
- Never show "0 views" — show "—" or hide until count is > 0

---

## Dark Mode Rules

- Default is **dark mode** — the site opens dark unless user has explicit light preference
- Detect with `prefers-color-scheme` on first load
- Override persisted in `localStorage` key `"theme"` with values `"dark"` or `"light"`
- Applied via `data-theme` attribute on `<html>` element
- Theme initialization script must be inline in `<head>` (before body renders) to prevent FOUC

```javascript
// Inline theme init script (in <head>)
const theme = localStorage.getItem('theme') 
  ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);
```

- Every component must look correct in BOTH themes — test both during development
- Never use `dark:` Tailwind variant alone — always pair with the light mode base style

---

## Animation Rules

### What to animate
- Page entrance: elements animate in on mount (opacity + y translation)
- Scroll reveal: sections fade in as they enter viewport
- Hover micro-interactions: cards, buttons, links
- Theme transition: background and text colors ease smoothly

### What NOT to animate
- Layout shifts (don't animate width/height if it causes reflow)
- Anything the user didn't initiate (no looping animations on idle content)
- Long animations (> 500ms for UI transitions)

### Reduced Motion
Every animation must have a reduced-motion alternative. The CSS `@media (prefers-reduced-motion: reduce)` must suppress all transitions and animations.

For Motion One animations in JS:
```typescript
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4 });
}
```

---

## Responsive Rules

| Breakpoint | Width | Behavior |
|---|---|---|
| Base (xs) | < 640px | Single column, full width. Touch-optimized targets (min 44px) |
| sm | 640px+ | Slightly larger type, 2-col grids |
| md | 768px+ | Desktop header, horizontal nav |
| lg | 1024px+ | Blog sidebar appears, multi-col projects grid |
| xl | 1280px+ | TOC sidebar, max layout width reached |

Never use fixed pixel widths for content areas — always `max-w-*` with `w-full`.

---

## Empty State Rules

When a list or collection is empty:
- Show a friendly empty state — not a blank area
- Include an illustration or icon, brief message, and a relevant CTA
- Example: empty blog with "No posts yet. Check back soon!" or a link to subscribe to RSS

---

## Error State Rules

- **Form errors**: inline, below the relevant field, in `text-danger`
- **Page 404**: custom `src/pages/404.astro` with navigation back home
- **API errors**: never expose raw error messages to the user — show "Something went wrong. Please try again."
- **Component loading errors**: show a fallback state, not a broken layout
