import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://logbook.vercel.app',
  adapter: vercel(),
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
    },
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