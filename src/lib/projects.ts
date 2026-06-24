import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>;

export async function getAllProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(n = 3): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.data.featured).slice(0, n);
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) =>
    p.data.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tag)
  );
}

export async function getAllProjectTags(): Promise<Array<{ name: string; count: number }>> {
  const projects = await getAllProjects();
  const tagCount = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.data.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getRelatedProjects(project: Project, n = 3): Promise<Project[]> {
  const all = await getAllProjects();
  const related = all
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      project: p,
      shared: p.data.tags.filter((tag: string) => project.data.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared);
  return related.slice(0, n).map((r) => r.project);
}
