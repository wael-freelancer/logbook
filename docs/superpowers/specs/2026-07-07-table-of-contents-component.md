# Table of Contents Component

## Problem

The blog post slug page (`src/pages/blog/[slug].astro`) has an inline table-of-contents sidebar that duplicates styling and logic already present in `src/components/blog/TableOfContents.astro`. The latter component is unused; the slug page's inline version is the one that renders in production. This creates a maintenance burden — any styling or behavior change must be applied in multiple places.

## Solution

Update `TableOfContents.astro` to match the production styling (wrapper `<aside>`, visibility classes, conditional render) and use it from `[slug].astro`, removing the inline duplicate.

## Changes

### `src/components/blog/TableOfContents.astro`
- Accept `headings: { depth: number; slug: string; text: string }[]`
- Wrap in `<aside>` with `hidden lg:block pt-12`, `aria-label="Table of contents"`
- Conditionally render only when headings exist
- Keep existing styling: sticky nav, h3 indentation (`pl-3`), depth <= 3 filtering

### `src/pages/blog/[slug].astro`
- Import `TableOfContents` from `@/components/blog/TableOfContents.astro`
- Remove `headingsList` mapping (no longer needed; `slug` is used directly)
- Replace inline TOC markup with `<TableOfContents headings={headings ?? []} />`
- Remove unused imports/variables if any

## No CSS / design changes

The rendered output will be identical. No visual changes.

## Files affected

- `src/components/blog/TableOfContents.astro` (updated)
- `src/pages/blog/[slug].astro` (refactored)
