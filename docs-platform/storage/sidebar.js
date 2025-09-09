const sidebars = {
  storage: [
    {
      type: 'doc',
      id: 'index',
      label: 'Storage Overview',
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'tutorials/introduction',
      },
      items: [
        // Will be populated when tutorials are created
      ],
    },
  ],
};

module.exports = sidebars;
