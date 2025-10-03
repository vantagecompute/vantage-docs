/**
 * SDK documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  sdk: [
    {
      type: 'doc',
      id: 'index',
      label: 'SDK Overview',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'installation/installation',
          label: 'Installation',
        },
        {
          type: 'doc',
          id: 'configuration/configuration',
          label: 'Configuration',
        },
        {
          type: 'doc',
          id: 'quickstart/quickstart',
          label: 'Quickstart',
        },
      ],
    },
    {
      type: 'category',
      label: 'Development',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'api/api',
          label: 'API Reference',
        },
      ],
    },
  ],
};

module.exports = sidebars;
