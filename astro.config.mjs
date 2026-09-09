// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { publishedMaterials } from './src/catalog.ts';
import { site as siteConfig } from './src/site.config.ts';

// Deploy target is configurable so the same build works on GitHub Pages
// (served from /<repo>/) and on a VPS (served from /).
//   SITE_URL=https://learn.example.com BASE_PATH=/ npm run build
const site = process.env.SITE_URL ?? siteConfig.url;
const base = process.env.BASE_PATH ?? '/';

/** Build one sidebar group per learning material from the catalog. */
const materialSidebar = publishedMaterials.map((material) => ({
  label: material.title,
  items: [
    ...material.links.map((link) => ({ label: link.label, slug: link.slug })),
    ...material.sections.map((section) => ({
      label: section.label,
      items: [{ autogenerate: { directory: `${material.slug}/${section.directory}` } }],
    })),
  ],
}));

// Material slugs that changed. Links shared before a rename must still land, so
// every page of the renamed material keeps a redirect from its old URL. Static
// output renders each as its own meta-refresh page, and a redirect's destination
// has to be a real route, so the list is enumerated from the content tree rather
// than written as a wildcard.
//
// Add `'old-slug': 'new-slug'` here whenever you rename a material, and the same
// pair to RENAMED_MATERIALS in src/lib/progress.ts so saved progress follows.
/** @type {Record<string, string>} */
const renamedMaterials = {};

/**
 * Page URLs of one material, relative to the material root:
 * '' for its index page, else 'setup/agent-harness'.
 *
 * @param {string} slug
 * @returns {string[]}
 */
function materialPagePaths(slug) {
  const root = fileURLToPath(new URL(`./src/content/docs/${slug}/`, import.meta.url));
  return readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, ''));
}

// Astro applies `base` to a redirect's source but not to its destination, so the
// destination is written out in full.
const basePrefix = base.replace(/\/+$/, '');

const redirects = Object.fromEntries(
  Object.entries(renamedMaterials).flatMap(([from, to]) =>
    materialPagePaths(to).map((page) => {
      const suffix = page ? `${page}/` : '';
      return [`/${from}/${suffix}`, `${basePrefix}/${to}/${suffix}`];
    }),
  ),
);

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  redirects,
  integrations: [
    starlight({
      title: siteConfig.title,
      logo: {
        src: './src/assets/logo.svg',
        alt: siteConfig.title,
      },
      description: siteConfig.description,
      tagline: siteConfig.tagline,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: siteConfig.repoUrl,
        },
      ],
      editLink: {
        baseUrl: `${siteConfig.repoUrl}/edit/${siteConfig.repoBranch}/`,
      },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      // Scopes the sidebar to the material the reader is currently in.
      routeMiddleware: './src/routeData.ts',
      sidebar: [{ label: 'All materials', link: '/' }, ...materialSidebar],
      pagination: true,
      components: {
        PageFrame: './src/components/PageFrame.astro',
        PageTitle: './src/components/PageTitle.astro',
        Header: './src/components/Header.astro',
        Hero: './src/components/Hero.astro',
        Footer: './src/components/Footer.astro',
      },
    }),
    // Must come after starlight() so code blocks in .mdx get Expressive Code.
    mdx(),
  ],
});
