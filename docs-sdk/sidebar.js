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
