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
  onBrokenAnchors: 'warn',
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
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
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
            require('./src/rehypeTabsTransform.js'),
            // [require('rehype-external-links').default, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
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
      '@docusaurus/plugin-ideal-image',
      {
        quality: 100,
        sizes: [200, 500],
        disableInDev: false,
      },
    ],
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
            includePatterns: ['docs/reference/api/*.md', 'docs/reference/api/**/*.md'],
            fullContent: true,
            title: 'Vantage API Documentation',
            description: 'Complete reference for Vantage API'
          },
          {
            filename: 'llms-vantage-cli.txt',
            includePatterns: ['docs/reference/cli/*.md', 'docs/reference/cli/**/*.md'],
            fullContent: false,
            title: 'Vantage CLI Documentation',
            description: 'All Vantage CLI commands in a single file'
          },
          {
            filename: 'llms-vantage-sdk.txt',
            includePatterns: ['docs/reference/sdk/*.md', 'docs/reference/sdk/**/*.md'],
            fullContent: false,
            title: 'Vantage SDK Documentation',
            description: 'All Vantage SDK references in a single file'
          },
          {
            filename: 'llms-vantage-platform.txt',
            includePatterns: ['docs/platform/*.md', 'docs/platform/**/*.md'],
            fullContent: false,
            title: 'Vantage Platform Documentation',
            description: 'All Vantage Platform references in a single file'
          },
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'img/preview.png',
    
    algolia: {
      appId: 'MPYYYNENH9',
      apiKey: 'b3cadb2f7da0194ead335c3488237443',
      indexName: 'Vantage Compute Documentation Website Crawler',
      insights: true,

      // Disabled: we have one locale/version, so contextual facet filters
      // would silently return 0 results if the crawler didn't set them.
      contextualSearch: false,

      // Not needed: docs are served from root (routeBasePath: '/'),
      // so crawler URLs already match the live site paths.
      // replaceSearchResultPathname: { from: '/docs/', to: '/' },

      searchParameters: {},
      searchPagePath: 'search',
      searchHotkeys: ['ctrl+k', 'cmd+k'],
    },
    
    navbar: {
      title: "",
      logo: {
        alt: 'Vantage Compute Logo',
        src: 'https://vantage-compute-public-assets.s3.us-east-1.amazonaws.com/branding/vantage-logo-text-white-horz.png',
        srcDark: 'https://vantage-compute-public-assets.s3.us-east-1.amazonaws.com/branding/vantage-logo-text-white-horz.png',
        href: 'https://docs.vantagecompute.ai',
        target: '_self'
      },
      items: [
        {type: 'search', position: 'right'},
        {
          type: 'custom-askAI',
          position: 'right',
        },
      ],
      hideOnScroll: false
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