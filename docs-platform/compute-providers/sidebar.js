/**
 * Compute Providers documentation sidebar configuration
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a "Next" and "Previous" navigation
 * - automatically add "Edit this page" links
 */

const sidebars = {
  computeProvidersSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Compute Providers Overview',
    },
    {
      type: 'category',
      label: 'Public Clouds',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'public-clouds/public-clouds',
      },
      items: [
        'public-clouds/compute-providers-public-clouds-aws',
        'public-clouds/compute-providers-public-clouds-azure',
        'public-clouds/compute-providers-public-clouds-gcp',
      ],
    },
    {
      type: 'category',
      label: 'On-Premises',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'on-premises/on-premises',
      },
      items: [
        'on-premises/compute-providers-self-hosted-setup',
        'on-premises/compute-providers-self-hosted-management',
      ],
    },
    {
      type: 'category',
      label: 'Vantage Partners',
      collapsed: false,
      items: [
        'vantage-partners/atnorth/atnorth-introduction',
        'vantage-partners/buzz-hpc/buzz-hpc-introduction',
        'vantage-partners/responsible-compute/responsible-compute-introduction',
      ],
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
