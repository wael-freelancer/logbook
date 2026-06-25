import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts;
}

export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getRelatedPosts(post: BlogPost, n = 3): Promise<BlogPost[]> {
  const allPosts = await getSortedPosts();
  const related = allPosts
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      shared: p.data.tags.filter((tag) => post.data.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared);
  return related.slice(0, n).map((r) => r.post);
}

export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getPostTags(): Promise<Array<{ name: string; count: number }>> {
  const posts = await getSortedPosts();
  const tagCount = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getPostTagPaths(): Promise<{ tag: string; label: string }[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tags.add(tag.toLowerCase().replace(/\s+/g, '-'));
    }
  }
  return Array.from(tags).map((tag) => ({ tag, label: tag }));
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.data.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tag)
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
