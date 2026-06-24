import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
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
