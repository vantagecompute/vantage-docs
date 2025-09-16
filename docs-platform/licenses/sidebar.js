const sidebars = {
  licenses: [
    {
      type: 'doc',
      id: 'index',
      label: 'Licenses Overview',
    },
    {
      type: 'category',
      label: 'How-to Guides',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'how-to-guides/how-to-guides',
      },
      items: [
        {
          type: 'category',
          label: 'FlexLM',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/flexlm/introduction',
          },
          items: [
            'how-to-guides/flexlm/server-setup',
            'how-to-guides/flexlm/vantage-managed-server-setup',
            'how-to-guides/flexlm/monitoring',
            'how-to-guides/flexlm/high-availability',
            'how-to-guides/flexlm/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'RLM',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/rlm/introduction',
          },
          items: [
            'how-to-guides/rlm/server-setup',
            'how-to-guides/rlm/vantage-managed-server-setup',
            'how-to-guides/rlm/monitoring',
            'how-to-guides/rlm/high-availability',
            'how-to-guides/rlm/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'LMX',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/lmx/introduction',
          },
          items: [
            'how-to-guides/lmx/server-setup',
            'how-to-guides/lmx/vantage-managed-server-setup',
            'how-to-guides/lmx/monitoring',
            'how-to-guides/lmx/high-availability',
            'how-to-guides/lmx/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'LS-DYNA',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/ls-dyna/introduction',
          },
          items: [
            'how-to-guides/ls-dyna/user-managed-server-setup',
            'how-to-guides/ls-dyna/vantage-managed-server-setup',
            'how-to-guides/ls-dyna/monitoring',
            'how-to-guides/ls-dyna/high-availability',
            'how-to-guides/ls-dyna/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'DSLS',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/dsls/introduction',
          },
          items: [
            'how-to-guides/dsls/server-setup',
            'how-to-guides/dsls/vantage-managed-server-setup',
            'how-to-guides/dsls/monitoring',
            'how-to-guides/dsls/high-availability',
            'how-to-guides/dsls/troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'OLicense',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/olicense/introduction',
          },
          items: [
            'how-to-guides/olicense/server-setup',
            'how-to-guides/olicense/vantage-managed-server-setup',
            'how-to-guides/olicense/monitoring',
            'how-to-guides/olicense/high-availability',
            'how-to-guides/olicense/troubleshooting',
          ],
        },
      ],
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
    'user-hosted',
    'vantage-hosted',
  ],
};

module.exports = sidebars;
