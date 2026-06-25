import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>;

export async function getAllProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects;
}

export async function getSortedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(n = 3): Promise<Project[]> {
  const all = await getSortedProjects();
  return all.filter((p) => p.data.featured).slice(0, n);
}

export async function getRelatedProjects(project: Project, n = 3): Promise<Project[]> {
  const all = await getSortedProjects();
  const related = all
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      project: p,
      shared: p.data.tags.filter((tag: string) => project.data.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared);
  return related.slice(0, n).map((r) => r.project);
}

export async function getProjectTags(): Promise<Array<{ name: string; count: number }>> {
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

export async function getProjectTagPaths(): Promise<{ tag: string; label: string }[]> {
  const projects = await getAllProjects();
  const tags = new Set<string>();
  for (const project of projects) {
    for (const tag of project.data.tags) {
      tags.add(tag.toLowerCase().replace(/\s+/g, '-'));
    }
  }
  return Array.from(tags).map((tag) => ({ tag, label: tag }));
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) =>
    project.data.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '-') === tag)
  ).sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedAndOtherProjects(): Promise<{ featured: Project[]; other: Project[] }> {
  const projects = await getSortedProjects();
  const featured = projects.filter((p) => p.data.featured);
  const other = projects.filter((p) => !p.data.featured);
  return { featured, other };
}
