/**
 * Storage documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  storageSidebar: [
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
