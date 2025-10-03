/**
 * Jobs documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  jobsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Jobs Overview',
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'tutorials/index',
      },
      items: [
        {
          type: 'category',
          label: 'Templates',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/templates/introduction',
          },
          items: [
            'tutorials/templates/create-template',
            'tutorials/templates/share-template',
            'tutorials/templates/delete-template',
          ],
        },
        {
          type: 'category',
          label: 'Scripts',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/scripts/introduction',
          },
          items: [
            'tutorials/scripts/create-script',
            'tutorials/scripts/share-script',
            'tutorials/scripts/delete-script',
          ],
        },
        {
          type: 'category',
          label: 'Submissions',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/submissions/introduction',
          },
          items: [
            'tutorials/submissions/create-submission',
            'tutorials/submissions/share-submission',
            'tutorials/submissions/delete-submission',
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
