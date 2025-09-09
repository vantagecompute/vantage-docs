const sidebars = {
  notebooks: [
    {
      type: 'doc',
      id: 'index',
      label: 'Notebooks Overview',
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'tutorials/tutorials',
      },
      items: [
        // Will be populated when tutorials are created
      ],
    },
  ],
};

module.exports = sidebars;
