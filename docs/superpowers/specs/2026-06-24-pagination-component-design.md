# Pagination Component Design

## Overview

Extract inline pagination logic from blog pages into a reusable `Pagination` UI component.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Current page number (1-indexed) |
| `totalPages` | `number` | Total number of pages |
| `baseUrl` | `string` | Base URL pattern with `{page}` placeholder, e.g. `/blog/page/{page}` |

## Behavior

- Renders "← Previous" link when `currentPage > 1`, hidden otherwise
- Shows page count: "Page {currentPage} of {totalPages}"
- Renders "Next →" link when `currentPage < totalPages`, hidden otherwise
- Generates prev/next URLs by replacing `{page}` in `baseUrl`

## Styling

Follows existing blog pagination styles — border buttons with hover states, centered layout.

## Usage

```astro
<Pagination currentPage={1} totalPages={5} baseUrl="/blog/page/{page}" />
```
