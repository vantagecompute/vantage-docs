import React from 'react';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';

// Documentation section dropdown component (same as in DocBreadcrumbs)
function DocumentationDropdown() {
  const location = useLocation();
  
  const sections = [
    { label: 'Platform', path: '/platform' },
    { label: 'CLI', path: '/cli' },
    { label: 'SDK', path: '/sdk' },
    { label: 'API', path: '/api' }
  ];
  
  const getCurrentSection = () => {
    const path = location.pathname;
    
    if (path.startsWith('/platform') || path.includes('/platform')) {
      return 'Platform';
    } else if (path.startsWith('/cli') || path.includes('/cli')) {
      return 'CLI';
    } else if (path.startsWith('/sdk') || path.includes('/sdk')) {
      return 'SDK';
    } else if (path.startsWith('/api') || path.includes('/api')) {
      return 'API';
    }
    
    return 'Documentation';
  };
  
  const currentSection = getCurrentSection();
  
  return (
    <li className="breadcrumbs__item breadcrumb-dropdown">
      <div className="dropdown dropdown--hoverable breadcrumb-nav-dropdown">
        <button 
          className="dropdown__toggle breadcrumb-dropdown-toggle" 
          aria-haspopup="true" 
          aria-expanded="false"
        >
          {currentSection}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{marginLeft: '4px'}}>
            <path d="M6 8L3 5h6z"/>
          </svg>
        </button>
        <ul className="dropdown__menu">
          {sections.map(section => (
            <li key={section.label}>
              <a className="dropdown__link" href={section.path}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function PlatformHome() {
  return (
    <Layout
      title="Vantage Platform"
      description="High Performance Computing platform for modern workloads"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <nav className="theme-doc-breadcrumbs breadcrumbsContainer_Alpn" aria-label="Breadcrumbs">
              <ul className="breadcrumbs">
                <li className="breadcrumbs__item">
                  <a aria-label="Home page" className="breadcrumbs__link" href="/">
                    <svg viewBox="0 0 24 24" className="breadcrumbHomeIcon_YNFT">
                      <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" fill="currentColor"></path>
                    </svg>
                  </a>
                </li>
                <li className="breadcrumbs__item breadcrumbs__item--active">
                  <span className="breadcrumbs__link">Platform</span>
                </li>
                <DocumentationDropdown />
              </ul>
            </nav>
            
            <header>
              <h1 className="hero__title">Vantage Platform</h1>
              <p className="hero__subtitle">
                High Performance Computing platform for modern workloads
              </p>
            </header>

            <main>
              <section className="margin-vert--lg">
                <h2>Platform Components</h2>
                
                <div className="row">
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Jobs</h3>
                      </div>
                      <div className="card__body">
                        <p>Manage and monitor computational jobs across your clusters.</p>
                        <a href="/platform/jobs/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Clusters</h3>
                      </div>
                      <div className="card__body">
                        <p>Deploy and manage HPC clusters with ease.</p>
                        <a href="/platform/clusters/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Storage</h3>
                      </div>
                      <div className="card__body">
                        <p>Scalable storage solutions for your data.</p>
                        <a href="/platform/storage/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Remote Desktops</h3>
                      </div>
                      <div className="card__body">
                        <p>Access remote desktop environments for your workflows.</p>
                        <a href="/platform/remote-desktops/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Notebooks</h3>
                      </div>
                      <div className="card__body">
                        <p>Interactive Jupyter notebooks for data science and research.</p>
                        <a href="/platform/notebooks/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Compute Providers</h3>
                      </div>
                      <div className="card__body">
                        <p>Integrate with various compute providers and resources.</p>
                        <a href="/platform/compute-providers/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Licenses</h3>
                      </div>
                      <div className="card__body">
                        <p>Manage software licenses and compliance.</p>
                        <a href="/platform/licenses/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col col--6 margin-bottom--lg">
                    <div className="card">
                      <div className="card__header">
                        <h3>Teams</h3>
                      </div>
                      <div className="card__body">
                        <p>Collaborate with team members and manage permissions.</p>
                        <a href="/platform/teams/" className="button button--primary">Learn More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}