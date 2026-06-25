# Phase 4 — Home Page & Remaining Pages Design

## Overview

Complete the home page with Hero, FeaturedWork, and RecentPosts sections. Add About, Uses, Contact pages. Implement custom 404 page and dynamic OG images.

---

## Home Page (`/`)

### Hero Component (`src/components/home/Hero.astro`)
- Props: `name` (string), `role` (string), `tagline` (string)
- Two CTAs: "View Projects" → `/projects`, "Read Blog" → `/blog`
- Fade-in animation via Motion One's `inView`
- Respects `prefers-reduced-motion`

### FeaturedWork Component (`src/components/home/FeaturedWork.astro`)
- Uses `getFeaturedProjects()` from `src/lib/projects.ts` (already exists)
- Renders 3 featured projects as a grid using existing `ProjectCard` component
- Section heading: "Featured Work"

### RecentPosts Component (`src/components/home/RecentPosts.astro`)
- Uses `getSortedPosts()` from `src/lib/posts.ts` (already exists)
- Renders 3 latest posts using existing `PostCard` component
- Section heading: "Latest Posts"

### Scroll Animations
- Motion One's `inView` for scroll-triggered reveals
- Wrap each section with animation wrapper
- Check `prefers-reduced-motion` and skip animations if user prefers reduced motion

---

## About Page (`/about`)

### Layout
- Uses `BaseLayout` with single-column content area
- Sections: Bio, Skills, Career Timeline, Currently

### Components
- **Bio section** — Professional summary paragraph, profile photo placeholder (use a styled div or SVG placeholder)
- **Skills section** — Categorized tag cloud (Frontend, Backend, Tools/DevOps) using existing `Badge` component
- **CareerTimeline.astro** — Vertical timeline with date, title, description
- **Currently section** — Three columns: Reading, Learning, Building

### File: `src/pages/about.astro`

---

## Uses Page (`/uses`)

### Layout
- Single-column layout using existing patterns
- Categorized sections: Hardware, Software, Editor, CLI Tools

### Content (static data in the page)
- Each item has name, description, link (optional)
- Styled as simple cards or list items

### File: `src/pages/uses.astro`

---

## Contact Page (`/contact`)

### Form UI
- Fields: Name, Email, Message (textarea)
- Submit button styled with existing `Button` component
- Client-side validation using HTML5 attributes + JS enhancement

### API Handler (`src/pages/api/contact.ts`)
- POST endpoint that logs to console (no external service yet)
- Returns JSON response with success/error status
- Uses `output: "static"` mode — will be handled by Vercel adapter in production

### States
- Loading state on submit (disabled button + spinner)
- Success message after submission
- Error message if submission fails

### File: `src/pages/contact.astro`

---

## 404 Page (`src/pages/404.astro`)
- Custom design with friendly message
- Link back to home page using existing Button component
- Uses BaseLayout

---

## Dynamic OG Images (`src/pages/og/[slug].png.ts`)
- Uses Satori (already available via npm) or a simple SVG-based approach
- Generates PNG images for blog posts and projects
- Title, description from content collection data
- Styled to match site's design tokens

### File: `src/pages/og/[slug].png.ts`

---

## Dependencies
No new dependencies needed. Uses existing:
- Motion (already installed)
- Existing UI components (Button, Badge, Card)
- Existing blog/project components (PostCard, ProjectCard)
- Content Collections data layer (already configured)
