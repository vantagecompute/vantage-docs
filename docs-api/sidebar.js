/**
 * API documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  api: [
    {
      type: 'link',
      label: '← All documentation',
      href: '/',
    },
    {
      type: 'doc',
      id: 'index',
      label: 'API Overview',
    },
  ],
};

module.exports = sidebars;
