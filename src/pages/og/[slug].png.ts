// prerender: false to allow server rendering for dynamic OG images
export const prerender = false;

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  // Determine if this is a blog post or project
  let title = 'Log Book';
  let description = 'A personal portfolio and technical blog by a software engineer.';

  if (slug.startsWith('blog-')) {
    const postSlug = slug.replace('blog-', '');
    title = `Blog Post: ${postSlug}`;
  } else if (slug.startsWith('project-')) {
    const projectSlug = slug.replace('project-', '');
    title = `Project: ${projectSlug}`;
  }

  // Generate SVG for OG image
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <!-- Background -->
      <rect width="1200" height="630" fill="#ffffff"/>
      
      <!-- Title text -->
      <text x="600" y="280" font-family="system-ui, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#1a1a1a">${title}</text>
      
      <!-- Description text -->
      <text x="600" y="350" font-family="system-ui, sans-serif" font-size="24" text-anchor="middle" fill="#6b7280">${description}</text>
      
      <!-- Footer -->
      <text x="600" y="550" font-family="system-ui, sans-serif" font-size="18" text-anchor="middle" fill="#9ca3af">Log Book — Personal Portfolio</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, immutable, max-age=31536000',
    },
  });
}