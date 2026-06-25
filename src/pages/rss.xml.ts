import rss from '@astrojs/rss';
import { getSortedPosts } from '@/lib/posts';

export async function GET(context: { site: string }) {
  const posts = await getSortedPosts();
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
