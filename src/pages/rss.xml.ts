import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context: { site: string }) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const site = context.site ?? import.meta.env.SITE ?? 'https://logbook.vercel.app';
  return rss({
    title: 'Log Book',
    description: 'Technical articles about web development, TypeScript, and software engineering.',
    site,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
