// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').PluginConfig} */
const searchLocalPlugin = [
  require.resolve('@easyops-cn/docusaurus-search-local'),
  /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
  {
    hashed: true,
  },
]

/** @type {import('@docusaurus/types').Config} */
module.exports = async function createConfigAsync() {
  return {
    title: 'Vantage Compute Documentation',
    tagline: 'High Performance Computing, Evolved',
    favicon: 'img/favicon.ico',
    url: 'https://docs.vantagecompute.ai',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
    },

    scripts: [
      '/js/sidebar-expand.js',
      '/js/platform-sidebar.js',
      '/js/platform-navbar.js',
      '/js/navbar-dropdown-hover.js'
    ],

    markdown: {
      format: 'detect',
      mermaid: true,
      mdx1Compat: {
        comments: true,
        admonitions: true,
        headingIds: true,
      },
    },

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars-main.js'),
            rehypePlugins: [
              [require('rehype-external-links').default, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
            ],
            routeBasePath: '/', // Make docs the root
          },
          blog: false,
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        }),
      ],
    ],
    
    plugins: [
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform',
          path: 'docs-platform-overview',
          routeBasePath: 'platform-overview',
          sidebarPath: './docs-platform-overview/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-jobs',
          path: 'docs-platform/jobs',
          routeBasePath: 'platform/jobs',
          sidebarPath: './docs-platform/jobs/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-clusters',
          path: 'docs-platform/clusters',
          routeBasePath: 'platform/clusters',
          sidebarPath: './docs-platform/clusters/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-storage',
          path: 'docs-platform/storage',
          routeBasePath: 'platform/storage',
          sidebarPath: './docs-platform/storage/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-compute-providers',
          path: 'docs-platform/compute-providers',
          routeBasePath: 'platform/compute-providers',
          sidebarPath: './docs-platform/compute-providers/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-notebooks',
          path: 'docs-platform/notebooks',
          routeBasePath: 'platform/notebooks',
          sidebarPath: './docs-platform/notebooks/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-remote-desktops',
          path: 'docs-platform/remote-desktops',
          routeBasePath: 'platform/remote-desktops',
          sidebarPath: './docs-platform/remote-desktops/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-teams',
          path: 'docs-platform/teams',
          routeBasePath: 'platform/teams',
          sidebarPath: './docs-platform/teams/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'platform-licenses',
          path: 'docs-platform/licenses',
          routeBasePath: 'platform/licenses',
          sidebarPath: './docs-platform/licenses/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'cli',
          path: 'docs-cli',
          routeBasePath: 'cli',
          sidebarPath: './docs-cli/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'api',
          path: 'docs-api',
          routeBasePath: 'api',
          sidebarPath: './docs-api/sidebar.js',
        },
      ],
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'sdk',
          path: 'docs-sdk',
          routeBasePath: 'sdk',
          sidebarPath: './docs-sdk/sidebar.js',
        },
      ],
    ],

    themes: [searchLocalPlugin],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        image: 'img/vantage-docs-social-card.jpg',
        navbar: {
          logo: {
        alt: 'Vantage docs',
        src: 'img/navbar-logo-light.png',
        srcDark: 'img/navbar-logo-dark.png',
          },
          items: [
        {
          to: '/',
          label: 'Home',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Documentation',
          position: 'left',
          items: [
            {
              to: '/platform',
              label: 'Platform',
            },
            {
              to: '/api',
              label: 'API',
            },
            {
              to: '/cli',
              label: 'CLI',
            },
            {
              to: '/sdk',
              label: 'SDK',
            },
          ],
        },
        {
          to: 'https://vantagecompute.ai',
          label: 'Vantage Home',
          position: 'right',
          className: 'header-vantage-link',
          'aria-label': 'Vantage Compute Home',
        },
        {
          type: 'search',
          position: 'right',
        },
          ],
        },
        footer: {
          style: 'light',
          copyright: `© ${new Date().getFullYear()} Vantage Compute Corporation - All Rights Reserved.`,
        },
        metadata: [
          {
        name: 'vantage-docs-version',
        content: process.env.REACT_APP_VERSION,
          },
        ],
        docs: {
          sidebar: {
            hideable: true,
            autoCollapseCategories: false,
          },
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  }
}