// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: { light: 'github-light', dark: 'github-dark-dimmed' },
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