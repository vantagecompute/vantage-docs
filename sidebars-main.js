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
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
      collapsed: false,
      items: [
        'getting-started/sign-up',
        'getting-started/invite-intro',
        'getting-started/create-cluster-intro',
        'getting-started/notebook-intro',
        'getting-started/create-job-script-intro',
        'getting-started/create-job-submission-intro',
      ],
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
