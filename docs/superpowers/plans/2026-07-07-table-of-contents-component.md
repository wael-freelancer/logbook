# Table of Contents Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the inline TOC heading list from `[slug].astro` into the existing `TableOfContents.astro` component.

**Architecture:** The component accepts `headings: { depth, slug, text }[]` from `render()` output. The slug page imports and uses it, removing the inline duplicate.

**Tech Stack:** Astro, Tailwind CSS

---

### Task 1: Update `TableOfContents.astro`

**Files:**
- Modify: `src/components/blog/TableOfContents.astro`

- [ ] **Step 1: Rewrite component to match production styling**

Replace entire file content with:

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}
const { headings } = Astro.props;
---

{headings.length > 0 && (
  <aside class="hidden lg:block pt-12" aria-label="Table of contents">
    <nav class="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
  </aside>
)}
```

- [ ] **Step 2: Run `npm run build` to verify no errors**

### Task 2: Update `[slug].astro` to use the component

**Files:**
- Modify: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Add import and replace inline TOC**

Add import at top of frontmatter:
```astro
import TableOfContents from '@/components/blog/TableOfContents.astro';
```

Remove the `headingsList` mapping (lines 23-27):
```
const headingsList = headings?.map(...) ?? [];
```

Replace inline TOC aside block (lines 104-124):
```astro
        <TableOfContents headings={headings ?? []} />
```

- [ ] **Step 2: Run `npm run build` to verify the build passes**

### Task 3: Verify

- [ ] **Step 1: Run `npm run lint` to verify no lint issues**

- [ ] **Step 2: Run dev server and visually confirm TOC renders correctly on a blog post**
