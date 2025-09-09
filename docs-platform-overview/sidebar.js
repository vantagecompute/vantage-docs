const sidebars = {
  platform: [
    {
      type: 'doc',
      id: 'index',
      label: 'Platform Overview',
    },
    {
      type: 'category',
      label: 'Core Components',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: '🚀 Jobs Management',
          href: '/platform/jobs',
          description: 'Submit, monitor, and manage computational jobs',
        },
        {
          type: 'link',
          label: '🖥️ Clusters',
          href: '/platform/clusters', 
          description: 'Deploy and manage compute clusters',
        },
        {
          type: 'link',
          label: '📊 Compute Providers',
          href: '/platform/compute-providers',
          description: 'Connect and manage infrastructure providers',
        },
        {
          type: 'link',
          label: '💾 Storage',
          href: '/platform/storage',
          description: 'Unified storage management',
        },
        {
          type: 'link',
          label: '📓 Notebooks',
          href: '/platform/notebooks',
          description: 'Interactive Jupyter notebook environments',
        },
        {
          type: 'link',
          label: '🖥️ Remote Desktops',
          href: '/platform/remote-desktops',
          description: 'Secure remote desktop access',
        },
        {
          type: 'link',
          label: '👥 Teams',
          href: '/platform/teams',
          description: 'User and team management',
        },
        {
          type: 'link',
          label: '📋 Licenses',
          href: '/platform/licenses',
          description: 'Software license management',
        },
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        {
          type: 'link',
          label: 'Quick Start Guide',
          href: '/platform-overview#getting-started',
          description: 'Get up and running with Vantage',
        },
        {
          type: 'link',
          label: 'Common Use Cases',
          href: '/platform-overview#common-use-cases',
          description: 'Explore typical platform scenarios',
        },
        {
          type: 'link',
          label: 'Architecture Overview',
          href: '/platform-overview#architecture-overview',
          description: 'Understand platform architecture',
        },
      ],
    },
    {
      type: 'category',
      label: 'Integration & APIs',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'REST API',
          href: '/api',
          description: 'Complete programmatic access',
        },
        {
          type: 'link',
          label: 'CLI Tools',
          href: '/cli',
          description: 'Command-line interface',
        },
        {
          type: 'link',
          label: 'Python SDK',
          href: '/sdk',
          description: 'Official Python SDK',
        },
      ],
    },
    {
      type: 'category',
      label: 'Support & Resources',
      collapsed: true,
      items: [
        {
          type: 'link',
          label: 'Documentation',
          href: '/platform-overview#support--resources',
          description: 'Guides and references',
        },
        {
          type: 'link',
          label: 'Community Forums',
          href: 'https://community.vantage.omnivector.solutions',
          description: 'Get help from the community',
        },
        {
          type: 'link',
          label: 'Contact Support',
          href: 'mailto:support@omnivector.solutions',
          description: 'Direct support contact',
        },
      ],
    },
  ],
};

module.exports = sidebars;
