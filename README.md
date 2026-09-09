# LevelUp Starter

A starter template for publishing **guided learning materials** — sequenced roadmaps with
per-step progress tracking — as a static site built on [Astro Starlight](https://starlight.astro.build).

Fork it, change one config file, delete the example materials, write your own.

## What you get

| | |
|---|---|
| **Progress tracking** | Readers tick off each step. Progress is saved per material in their browser, survives reloads, and can be exported as JSON or as a shareable PNG. No accounts, no backend. |
| **A catalog** | One TypeScript file, `src/catalog.ts`, drives the landing page cards, the sidebar groups and the per-material navigation. Add a material by adding an entry. |
| **Scoped sidebar** | A reader inside a material sees only that material's sections, not every material at once. |
| **A verify loop** | `npm run verify` type-checks, builds, and resolves every internal link. Wired to a `pre-push` hook and to CI. |
| **Deploy paths** | GitHub Pages via Actions out of the box; a VPS with two environment variables. |
| **Agent skills** | `.claude/skills/` teaches a coding agent this repo's conventions, so scaffolding a material is one prompt. |
| **Four example materials** | Kept so every convention has something to point at. Delete them when yours are in. |

---

## Bootstrap a new project

### Option 1 — `create astro` with this repo as the template (recommended)

`create-astro` accepts any public GitHub repository as a template, so you can start a Starlight
project from this one directly:

```bash
npm create astro@latest -- --template surdarmaputra/levelup-starter my-learning-site
cd my-learning-site
npm install
npm run dev          # http://localhost:4321/
```

That gives you Astro, Starlight, the MDX integration, the catalog, the progress tracker and the
four example materials, already wired together — nothing to configure before the first page
renders.

> `create-astro` copies the repository without its git history and initialises a fresh one. If
> it asks about a template, you have dropped the `--` before `--template`; npm needs it to pass
> the flag through.

### Option 2 — GitHub's "Use this template"

If you are reading this on GitHub: **Use this template → Create a new repository**. You get the
same files with your own repository name and a clean history, and the Pages workflow already
derives its URL from that name.

### Option 3 — copy without git history

```bash
npx degit surdarmaputra/levelup-starter my-learning-site
cd my-learning-site
git init && npm install
```

### Then, in any case

```bash
bash scripts/bootstrap.sh   # installs deps and the pre-push verify hook
npm run dev
```

---

## Make it yours

Four steps, in this order.

### 1. Edit `src/site.config.ts`

Everything branded lives in that one file:

```ts
export const site = {
  title: 'My Learning Site',
  tagline: 'Guided paths to production-grade engineering.',
  description: 'Sequenced roadmaps for ...',
  repoUrl: 'https://github.com/you/my-learning-site',
  repoBranch: 'main',
  url: 'https://you.github.io',
  storageNamespace: 'my-learning-site',
} as const;
```

| Field | Where it shows up |
|---|---|
| `title` | Header, browser tab, footer copyright |
| `tagline` | Landing-page hero |
| `description` | `<meta name="description">`, search results, social cards |
| `repoUrl` | Footer GitHub link, Starlight's "Edit page" link |
| `repoBranch` | Branch the "Edit page" link targets |
| `url` | Default origin for canonical URLs and the sitemap when `SITE_URL` is unset |
| `storageNamespace` | The `localStorage` key progress is saved under, and the prefix of exported files |

**Change `storageNamespace` on a fork.** Two sites served from the same origin — say two of your
projects on `you.github.io` — otherwise share one progress store and overwrite each other.

Two things are deliberately *not* in that file: `SITE_URL` and `BASE_PATH`, which are environment
variables so one build can be published to more than one place. See *Deployment* below.

### 2. Replace the logo and favicon

`src/assets/logo.svg` and `public/favicon.svg`. Both are plain SVG.

### 3. Write your first material

Two ways.

**With an agent:** run the `add-material` skill in `.claude/skills/` — it creates the directories,
the Getting Started page, the catalog entry and the sidebar wiring, and it follows the step and
rubric structure the examples use.

**By hand:**

1. Create `src/content/docs/<slug>/` with an `index.md` and one directory per sidebar section
   (`setup/`, `roadmap/`, `reference/` is the split the examples use).
2. Append an entry to `materials` in `src/catalog.ts`.
3. `npm run verify`.

The sidebar, the landing-page card, search and the per-material navigation all follow from those
two edits. Nothing else needs touching — never hardcode a material into `astro.config.mjs`.

For progress tracking to pick up your steps, each step needs its own `## Step N — Title` heading
inside a page under `roadmap/`. `N` has to parse as a number (`5b` is fine for a sub-step). The
tracker builds its list from those headings; see `src/lib/roadmapSteps.ts`.

### 4. Delete the examples

Remove the four directories under `src/content/docs/` and their entries in `src/catalog.ts`, then
`npm run verify`. The examples cross-reference nothing outside themselves, so they come out
cleanly.

Conventions for both humans and agents — content structure, step anatomy, link rules — are in
[`AGENTS.md`](AGENTS.md). Read it before writing a material; it is what the example materials
follow.

---

## Starting from Starlight instead

If you would rather understand the Starlight layer before adopting this one, the reverse path
works too.

A bare Starlight project is:

```bash
npm create astro@latest -- --template starlight my-docs
```

That gives you Astro + Starlight + a docs collection. It does **not** give you a catalog, a
scoped sidebar, progress tracking, or a link checker — those are what this starter adds on top.
To move a bare Starlight project onto this starter, copy over:

| Copy | Why |
|---|---|
| `src/site.config.ts` | The branding knobs the rest reads from |
| `src/catalog.ts`, `src/routeData.ts` | Catalog data and the sidebar scoping middleware |
| `src/lib/`, `src/components/` | Progress store, step parsing, and the `.astro` components that render them |
| `src/styles/custom.css` | Theme overrides |
| `astro.config.mjs` | Sidebar generation from the catalog, base-path handling, component overrides |
| `scripts/`, `lefthook.yml` | Bootstrap, verify, link check |

It is usually less work to start from this repo and delete what you don't want.

### Where Starlight's own configuration lives

This starter configures Starlight in `astro.config.mjs`, inside the `starlight({ ... })` call.
Most of it is fed from `src/site.config.ts` and `src/catalog.ts` rather than written inline:

| Starlight option | Set from |
|---|---|
| `title`, `description`, `tagline`, `logo.alt` | `src/site.config.ts` |
| `social`, `editLink.baseUrl` | `src/site.config.ts` (`repoUrl`, `repoBranch`) |
| `sidebar` | Generated from `publishedMaterials` in `src/catalog.ts` — don't write groups by hand |
| `routeMiddleware` | `src/routeData.ts`, which narrows the sidebar to the current material |
| `components` | The overrides in `src/components/` — `PageFrame`, `PageTitle`, `Header`, `Hero`, `Footer` |
| `customCss` | `src/styles/custom.css` |

Everything else Starlight supports — i18n, versioning, sidebar badges, table-of-contents depth —
is available and documented at [starlight.astro.build](https://starlight.astro.build/). Add it in
the same call.

Two constraints worth knowing before you extend it:

- `mdx()` must come **after** `starlight()` in `integrations`, or code blocks in `.mdx` lose
  syntax highlighting.
- Starlight's config surface changes between minor versions. Check
  `node_modules/@astrojs/starlight/` before assuming an option exists.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run check` | Types + content-schema check |
| `npm run verify` | check → build → internal link check. **The one that gates a push.** |
| `bash scripts/bootstrap.sh` | Install dependencies and the pre-push hook. Idempotent. |

`npm run verify` must be green before pushing — Lefthook runs it as a `pre-push` hook, installed
by `scripts/bootstrap.sh`. CI runs the same script, so a green local run means a green pipeline.

---

## Structure

```
src/
├── site.config.ts              branding — the one file to edit on a fork
├── catalog.ts                  material metadata — drives the landing page and the sidebar
├── routeData.ts                scopes the sidebar to the material being read
├── content.config.ts           Starlight docs collection
├── lib/
│   ├── progress.ts             the progress store: localStorage, export, import
│   └── roadmapSteps.ts         parses `## Step N` headings into trackable units
├── components/                 .astro components used by content pages
├── styles/custom.css           theme overrides
└── content/docs/
    ├── index.mdx               landing page — the catalog
    ├── 404.mdx
    └── <framework>-<use-case>/ one directory per learning material
        ├── index.md            the Getting Started page
        ├── setup/              agent harness, reviewer prompt
        ├── roadmap/            the sequenced steps, split into sections
        └── reference/          rubrics, AGENTS.md template, omissions

scripts/                        bootstrap, verify, link check
.claude/skills/                 agent skills — brainstorm, add-material, verify-site
.github/workflows/              CI and the GitHub Pages deploy
```

---

## How progress tracking works

There is no backend. `src/lib/progress.ts` keeps one object in `localStorage` under
`<storageNamespace>:progress:v1`, keyed by material slug and then by step id. A reader can export
it as JSON and import it on another device, or export a PNG of their progress to share.

Two consequences to design around:

- **Progress is per browser.** Say so on your landing page if readers might expect otherwise.
- **Renaming a material slug orphans saved progress.** When you rename one, add the old→new pair
  to *both* `renamedMaterials` in `astro.config.mjs` (which redirects the old URLs) and
  `RENAMED_MATERIALS` in `src/lib/progress.ts` (which moves the saved progress). Both start empty
  in this starter. Entries stay forever — the reader who last visited before the rename is
  exactly who they exist for.

---

## Deployment

The site builds to plain static files, so any host that serves a directory works. Two knobs, both
environment variables:

| Variable | Default | Meaning |
|---|---|---|
| `SITE_URL` | `site.url` from `src/site.config.ts` | Origin, used for canonical URLs and the sitemap |
| `BASE_PATH` | `/` | Subdirectory the site is served from |

Never hardcode a domain or a subdirectory anywhere else, and make sure both base paths build —
internal links that only work at one of them are the usual breakage.

### GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. Enable it once under
**Settings → Pages → Source → GitHub Actions**. The workflow derives `SITE_URL` and `BASE_PATH`
from the repository itself, so a rename needs no config change:

```yaml
SITE_URL: https://${{ github.repository_owner }}.github.io
BASE_PATH: /${{ github.event.repository.name }}
```

### VPS or custom domain

Build at the root base path and copy `dist/` to the web root:

```bash
SITE_URL=https://learn.example.com BASE_PATH=/ npm run build
rsync -av --delete dist/ user@host:/var/www/my-learning-site/
```

Any static server works. With nginx, point `root` at that directory and add
`try_files $uri $uri/ /404.html;`.

---

## License

Site code: MIT — use it for anything, no attribution required.

The four example learning materials under `src/content/docs/` are © their authors. They are
included to demonstrate the format; delete them before publishing your own site, or get
permission to keep them.
