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
        id: 'getting-started/getting-started-index',
      },
      items: [
        'getting-started/getting-started-sign-up',
        'getting-started/getting-started-manage-users',
      ],
    },
  ],
};

module.exports = sidebars;
