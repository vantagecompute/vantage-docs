/**
 * Teams documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  teamsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Teams Overview',
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
    {
      type: 'category',
      label: 'How-To Guides',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'how-to-guides/how-to-guides',
      },
      items: [
        // Will be populated when guides are created
      ],
    },
  ],
};

module.exports = sidebars;
