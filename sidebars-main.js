/**
 * Main documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Welcome to Vantage Compute Documentation',
    },
    {
      type: 'doc',
      id: 'getting-started/index',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Vantage Documentation',
      collapsed: false,
      items: [
      {
          type: 'link',
          label: 'Platform',
          href: '/platform',
      },
      {
          type: 'link',
          label: 'API',
          href: '/api',
      },
      {
          type: 'link',
          label: 'SDK',
          href: '/sdk',
      },
      {
          type: 'link',
          label: 'CLI',
          href: '/cli',
      },
      ],
    },
  ],
};

module.exports = sidebars;
