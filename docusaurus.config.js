// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const {themes: prismThemes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vantage Compute Documentation',
  tagline: 'High Performance Computing, Evolved',
  favicon: 'img/favicon.ico',

  url: 'https://docs.vantagecompute.ai',
  baseUrl: '/',

  organizationName: 'vantagecompute',
  projectName: 'vantage-docs',
  deploymentBranch: 'main',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  scripts: [
    // Error suppression for browser extensions
    '/js/error-suppression.js'
  ],

  headTags: [
    // Preconnect to Algolia for performance optimization
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://MPYYYNENH9-dsn.algolia.net',
        crossorigin: 'anonymous',
      },
    },
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

  themes: ['@docusaurus/theme-mermaid'],

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
      'docusaurus-plugin-llms',
      {
        // Options here
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: '.',
        ignoreFiles: ['node_modules/**', 'build/**', '.git/**', '**/node_modules/**'],
        title: 'Vantage Compute Documentation',
        description: 'Complete reference documentation for Vantage Compute platform, CLI, API, and SDK.',
        includeBlog: false,
        // Content cleaning options
        excludeImports: true,
        removeDuplicateHeadings: true,
        // Disable individual markdown files to avoid filename issues
        generateMarkdownFiles: false,
        // Control documentation order
        includeOrder: [
          'docs/**',
        ],
        includeUnmatchedLast: true,
        // Path transformation options
        pathTransformation: {
          // Paths to ignore when constructing URLs (will be removed if found)
          ignorePaths: ['docs'],
          // Paths to add when constructing URLs (will be prepended if not already present)
          // addPaths: ['api'],
        },
        // Custom LLM files for specific documentation sections
        customLLMFiles: [
          {
            filename: 'llms-vantage-api.txt',
            includePatterns: ['docs-api/*.md', 'docs-api/**/*.md'],
            fullContent: true,
            title: 'Vantage API Documentation',
            description: 'Complete reference for Vantage API'
          },
          {
            filename: 'llms-vantage-cli.txt',
            includePatterns: ['docs-cli/*.md', 'docs-cli/**/*.md'],
            fullContent: false,
            title: 'Vantage CLI Documentation',
            description: 'All Vantage CLI commands in a single file'
          },
          {
            filename: 'llms-vantage-sdk.txt',
            includePatterns: ['docs-sdk/*.md', 'docs-sdk/**/*.md'],
            fullContent: false,
            title: 'Vantage SDK Documentation',
            description: 'All Vantage SDK references in a single file'
          },
          {
            filename: 'llms-vantage-platform.txt',
            includePatterns: ['docs-platform/*.md', 'docs-platform/**/*.md', 'docs-platform-overview/*.md', 'docs-platform-overview/**/*.md'],
            fullContent: false,
            title: 'Vantage Platform Documentation',
            description: 'All Vantage Platform references in a single file'
          },
        ],
      },
    ],
    // Platform overview is now handled by custom page at /src/pages/platform/index.js
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'platform',
    //     path: 'docs-platform-overview',
    //     routeBasePath: 'platform-overview',
    //     sidebarPath: './docs-platform-overview/sidebar.js',
    //   },
    // ],
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

  themeConfig: {
    image: 'img/vantage-docs-social-card.jpg',
    
    // Algolia DocSearch Configuration - Styled like Algolia's own docs
    algolia: {
      // Temporary demo configuration - replace with your actual index
      appId: 'MPYYYNENH9',
      apiKey: '4eea2544feea2cf558be1ce57ff44db4',
      indexName: 'Vantage Compute Documentation Website Crawler',
      
      // Optional: see doc section below
      contextualSearch: true,
      
      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl
      replaceSearchResultPathname: {
        from: '/docs/', // or as RegExp: /\/docs\//
        to: '/',
      },
      
      // Optional: Algolia search parameters
      searchParameters: {},
      
      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',
      
      // Limit search hotkeys to only Cmd+K (Mac) and Ctrl+K (Windows/Linux)
      searchHotkeys: ['cmd+k', 'ctrl+k'],
    },
    
    navbar: {
      title: "Vantage Compute Documentation",
      logo: {
        alt: 'Vantage Compute Logo',
        src: 'https://vantage-compute-public-assets.s3.us-east-1.amazonaws.com/branding/vantage-logo-text-white-horz.png',
        srcDark: 'https://vantage-compute-public-assets.s3.us-east-1.amazonaws.com/branding/vantage-logo-text-white-horz.png',
        href: 'https://docs.vantagecompute.ai',
        target: '_self'
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
      ],
      hideOnScroll: false
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Vantage Compute Logo',
        src: 'https://vantage-compute-public-assets.s3.us-east-1.amazonaws.com/branding/vantage-logo-text-white-horz.png',
        href: 'https://vantagecompute.ai',
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Platform',
              to: '/platform',
            },
            {
              label: 'Vantage CLI',
              to: '/cli',
            },
            {
              label: 'Vantage SDK',
              to: '/sdk',
            },
            { label: 'Vantage API',
              to: '/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Slack Channel',
              href: 'https://vantage.slack.com',
            },
            {
              label: 'Support',
              href: 'https://vantagecompute.ai/support',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vantagecompute',
            },
            {
              label: 'Vantage Compute',
              href: 'https://vantagecompute.ai',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              html: '<a href="https://youtube.com/@vantagecompute" class="footer__link-item footer__link-social" aria-label="YouTube"><img src="https://cdn-icons-png.flaticon.com/32/3670/3670147.png" alt="YouTube" /></a>',
            },
            {
              html: '<a href="https://linkedin.com/company/vantage-compute" class="footer__link-item footer__link-social" aria-label="LinkedIn"><img src="https://cdn-icons-png.flaticon.com/32/3536/3536569.png" alt="LinkedIn" /></a>',
            },
            {
              html: '<a href="https://github.com/vantagecompute" class="footer__link-item footer__link-social" aria-label="GitHub"><img src="https://cdn-icons-png.flaticon.com/32/919/919847.png" alt="GitHub" /></a>',
            },
          ],
        },
      ],
      copyright: `Copyright &copy; ${new Date().getFullYear()} Vantage Compute Corporation.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  },
};

module.exports = config;