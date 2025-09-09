const sidebars = {
  clusters: [
    {
      type: 'doc',
      id: 'index',
      label: 'Clusters Overview',
    },
    {
      type: 'category',
      label: 'How-to Guides',
      collapsed: false,
      items: [
        'how-to-guides/charmed-hpc-integration',
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
        {
          type: 'category',
          label: 'On-Premise',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/on-premise/on-premise',
          },
          items: [
            'tutorials/on-premise/on-premise-create-cluster',
            'tutorials/on-premise/on-premise-manage-cluster',
            'tutorials/on-premise/on-premise-share-cluster',
          ],
        },
        {
          type: 'category',
          label: 'Public Clouds',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/public-clouds/public-clouds',
          },
          items: [
            {
              type: 'category',
              label: 'AWS',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/public-clouds/aws/aws',
              },
              items: [
                'tutorials/public-clouds/aws/public-clouds-aws-create-a-cluster',
                'tutorials/public-clouds/aws/public-clouds-aws-manage-cluster',
                'tutorials/public-clouds/aws/public-clouds-aws-share-cluster',
              ],
            },
            {
              type: 'category',
              label: 'Azure',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/public-clouds/azure/azure',
              },
              items: [
                'tutorials/public-clouds/azure/public-clouds-azure-create-a-cluster',
                'tutorials/public-clouds/azure/public-clouds-azure-manage-cluster',
                'tutorials/public-clouds/azure/public-clouds-azure-share-cluster',
              ],
            },
            {
              type: 'category',
              label: 'GCP',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/public-clouds/gcp/gcp',
              },
              items: [
                'tutorials/public-clouds/gcp/public-clouds-gcp-create-a-cluster',
                'tutorials/public-clouds/gcp/public-clouds-gcp-manage-cluster',
                'tutorials/public-clouds/gcp/public-clouds-gcp-share-cluster',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Vantage Partners',
      collapsed: false,
          link: {
            type: 'doc',
            id: 'tutorials/vantage-partners/vantage-partners',
          },
          items: [
            {
              type: 'category',
              label: 'AtNorth',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/vantage-partners/atnorth/atnorth',
              },
              items: [
                'tutorials/vantage-partners/atnorth/vantage-partners-atnorth-create-a-cluster',
                'tutorials/vantage-partners/atnorth/vantage-partners-atnorth-manage-cluster',
                'tutorials/vantage-partners/atnorth/vantage-partners-atnorth-share-cluster',
              ],
            },
            {
              type: 'category',
              label: 'BuzzHPC',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/vantage-partners/buzzhpc/buzzhpc',
              },
              items: [
                'tutorials/vantage-partners/buzzhpc/vantage-partners-buzzhpc-create-a-cluster',
                'tutorials/vantage-partners/buzzhpc/vantage-partners-buzzhpc-manage-cluster',
                'tutorials/vantage-partners/buzzhpc/vantage-partners-buzzhpc-share-cluster',
              ],
            },
            {
              type: 'category',
              label: 'Cudo Compute',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/vantage-partners/cudo-compute/cudo-compute',
              },
              items: [
                'tutorials/vantage-partners/cudo-compute/vantage-partners-cudo-compute-create-a-cluster',
                'tutorials/vantage-partners/cudo-compute/vantage-partners-cudo-compute-manage-cluster',
                'tutorials/vantage-partners/cudo-compute/vantage-partners-cudo-compute-share-cluster',
              ],
            },
            {
              type: 'category',
              label: 'Responsible Compute',
      collapsed: false,
              link: {
                type: 'doc',
                id: 'tutorials/vantage-partners/responsible-compute/responsible-compute',
              },
              items: [
                'tutorials/vantage-partners/responsible-compute/vantage-partners-responsible-compute-create-a-cluster',
                'tutorials/vantage-partners/responsible-compute/vantage-partners-responsible-compute-manage-cluster',
                'tutorials/vantage-partners/responsible-compute/vantage-partners-responsible-compute-share-cluster',
              ],
            },
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
