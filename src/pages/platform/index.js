import React, { useState } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
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
              <a 
                className={clsx('dropdown__link', {
                  'dropdown__link--active': currentSection === section.label
                })}
                href={section.path}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

// Simple sidebar component
function PlatformSidebar({ collapsed, onToggle }) {
  return (
    <aside 
      className="theme-doc-sidebar-container docSidebarContainer_YfHR"
      data-collapsed={collapsed.toString()}
      onClick={collapsed ? onToggle : undefined}
    >
      <div className="sidebarViewport_aRkj">
        <div className="sidebar_njMd">
          <nav aria-label="Docs sidebar" className="menu thin-scrollbar menu_SIkG">
            <ul className="theme-doc-sidebar-menu menu__list">
              <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
                <a className="menu__link menu__link--active" href="/platform/">
                  Vantage Compute Overview
                </a>
              </li>
              
              <li className="theme-doc-sidebar-item-category theme-doc-sidebar-item-category-level-1 menu__list-item">
                <ul className="menu__list">
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/jobs/">Jobs</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/clusters/">Clusters</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/storage/">Storage</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/remote-desktops/">Remote Desktops</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/notebooks/">Notebooks</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/compute-providers/">Compute Providers</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/teams/">Teams</a>
                  </li>
                  <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
                    <a className="menu__link" href="/platform/licenses/">Licenses</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <button 
            type="button" 
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="button button--secondary button--outline collapseSidebarButton_PEFL"
            onClick={onToggle}
          >
            <svg width="20" height="20" aria-hidden="true" className="collapseSidebarButtonIcon_kv0_">
              <g fill="#7a7a7a">
                <path d="M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"></path>
                <path d="M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

function PlatformHome() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      title="Vantage Platform"
      description="High Performance Computing platform for modern workloads"
    >
      <div className="docsWrapper_bSxm">
        <button aria-label="Scroll back to top" className="clean-btn theme-back-to-top-button backToTopButton_sjWU" type="button"></button>
        <div className="docRoot_cWv0">
          <PlatformSidebar collapsed={collapsed} onToggle={toggleSidebar} />
          <main className={`docMainContainer_TBSr ${collapsed ? 'docMainContainer_TBSr--sidebar-hidden' : ''}`}>
              <div className="container padding-top--md padding-bottom--lg">
                <div className="row">
                  <div className="col docItemCol_VOVn">
                    <div className="docItemContainer_Djhp">
                      <article>
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
                        
                        <div className="tocCollapsible_ETCw theme-doc-toc-mobile tocMobile_ITEo">
                          <button type="button" className="clean-btn tocCollapsibleButton_TO0P">On this page</button>
                        </div>
                        
                        <div className="theme-doc-markdown markdown">
                          <header>
                            <h1>Vantage Platform</h1>
                          </header>
                          
                          <p>
                            Vantage Platform provides a comprehensive suite of tools for High Performance Computing, 
                            enabling you to deploy, manage, and scale computational workloads across diverse infrastructure environments.
                          </p>

                          <h2 id="platform-components">Platform Components</h2>

                          <div className="row margin-vert--lg">
                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/jobs">Jobs</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Manage computational workloads with templates, scripts, and submissions.</p>
                                </div>
                              </div>
                            </div>

                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/clusters">Clusters</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Deploy and manage HPC clusters across diverse environments.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row margin-vert--lg">
                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/storage">Storage</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Integrate with various storage solutions for computational data.</p>
                                </div>
                              </div>
                            </div>

                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/remote-desktops">Remote Desktops</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Secure remote desktop connections with full GUI support.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row margin-vert--lg">
                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/notebooks">Notebooks</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Interactive development environments for data science workflows.</p>
                                </div>
                              </div>
                            </div>

                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/compute-providers">Compute Providers</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Connect to diverse compute resources including clouds and HPC partners.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row margin-vert--lg">
                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/teams">Teams</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Collaborate with role-based access control and resource sharing.</p>
                                </div>
                              </div>
                            </div>

                            <div className="col col--6">
                              <div className="card">
                                <div className="card__header">
                                  <h3><a href="/platform/licenses">Licenses</a></h3>
                                </div>
                                <div className="card__body">
                                  <p>Manage commercial software licenses across your infrastructure.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <h2 id="getting-started">Getting Started</h2>
                          <ol>
                            <li><a href="/platform/clusters/tutorials/"><strong>Connect a Cluster</strong></a> - Add your first compute resources</li>
                            <li><a href="/platform/storage/tutorials/"><strong>Configure Storage</strong></a> - Set up data storage integration</li>
                            <li><a href="/platform/jobs/tutorials/"><strong>Submit a Job</strong></a> - Run your first computational workload</li>
                          </ol>
                        </div>
                      </article>
                    </div>
                  </div>
                  
                  <div className="col col--3">
                    <div className="tableOfContents_bqdL thin-scrollbar theme-doc-toc-desktop">
                      <ul className="table-of-contents table-of-contents__left-border">
                        <li><a href="#platform-components" className="table-of-contents__link toc-highlight">Platform Components</a></li>
                        <li><a href="#getting-started" className="table-of-contents__link toc-highlight">Getting Started</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
    </Layout>
  );
}

export default PlatformHome;