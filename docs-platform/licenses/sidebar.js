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
            id: 'how-to-guides/flexlm/flexlm-introduction',
          },
          items: [
            'how-to-guides/flexlm/flexlm-server-setup',
            'how-to-guides/flexlm/flexlm-vantage-managed-server-setup',
            'how-to-guides/flexlm/flexlm-monitoring',
            'how-to-guides/flexlm/flexlm-high-availability',
            'how-to-guides/flexlm/flexlm-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'RLM',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/rlm/rlm-introduction',
          },
          items: [
            'how-to-guides/rlm/rlm-server-setup',
            'how-to-guides/rlm/rlm-vantage-managed-server-setup',
            'how-to-guides/rlm/rlm-monitoring',
            'how-to-guides/rlm/rlm-high-availability',
            'how-to-guides/rlm/rlm-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'LMX',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/lmx/lmx-introduction',
          },
          items: [
            'how-to-guides/lmx/lmx-server-setup',
            'how-to-guides/lmx/lmx-vantage-managed-server-setup',
            'how-to-guides/lmx/lmx-monitoring',
            'how-to-guides/lmx/lmx-high-availability',
            'how-to-guides/lmx/lmx-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'LS-DYNA',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/ls-dyna/ls-dyna-introduction',
          },
          items: [
            'how-to-guides/ls-dyna/ls-dyna-user-managed-server-setup',
            'how-to-guides/ls-dyna/ls-dyna-vantage-managed-server-setup',
            'how-to-guides/ls-dyna/ls-dyna-monitoring',
            'how-to-guides/ls-dyna/ls-dyna-high-availability',
            'how-to-guides/ls-dyna/ls-dyna-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'DSLS',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/dsls/dsls-introduction',
          },
          items: [
            'how-to-guides/dsls/dsls-server-setup',
            'how-to-guides/dsls/dsls-vantage-managed-server-setup',
            'how-to-guides/dsls/dsls-monitoring',
            'how-to-guides/dsls/dsls-high-availability',
            'how-to-guides/dsls/dsls-troubleshooting',
          ],
        },
        {
          type: 'category',
          label: 'OLicense',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'how-to-guides/olicense/olicense-introduction',
          },
          items: [
            'how-to-guides/olicense/olicense-server-setup',
            'how-to-guides/olicense/olicense-vantage-managed-server-setup',
            'how-to-guides/olicense/olicense-monitoring',
            'how-to-guides/olicense/olicense-high-availability',
            'how-to-guides/olicense/olicense-troubleshooting',
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
