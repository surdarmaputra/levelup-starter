/**
 * Site configuration — the one file to edit when you fork this starter.
 *
 * Everything branded lives here: the name in the header and the footer, the
 * text search engines and social cards show, the repository the "GitHub" link
 * and the "Edit page" link point at, and the localStorage namespace reader
 * progress is saved under.
 *
 * Deploy targets are not here: `SITE_URL` and `BASE_PATH` are environment
 * variables, so one build can be published to GitHub Pages and a VPS. `url`
 * below is only the default when `SITE_URL` is unset.
 */
export const site = {
  /** Shown in the header, the footer copyright and the browser tab. */
  title: 'LevelUp Starter',

  /** One line under the title on the landing page hero. */
  tagline: 'Guided paths to production-grade engineering.',

  /** Used for `<meta name="description">`, search results and social cards. */
  description:
    'A catalog of guided, production-minded learning materials for software engineers.',

  /** Your repository. Footer link and Starlight's "Edit page" link are built from it. */
  repoUrl: 'https://github.com/surdarmaputra/levelup-starter',

  /** Branch the "Edit page" link targets. */
  repoBranch: 'main',

  /** Default origin when `SITE_URL` is unset — canonical URLs and the sitemap. */
  url: 'https://surdarmaputra.github.io',

  /**
   * localStorage namespace for saved progress, and the prefix of exported
   * files. Change it on a fork so two sites on the same origin (for example
   * two projects on `<user>.github.io`) do not share a progress store.
   */
  storageNamespace: 'levelup-starter',
} as const;
