/**
 * Custom DocBreadcrumbs component that ensures full path representation
 * e.g., Home -> Platform -> <platform page>
 */
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import {useHomePageRoute} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';
import styles from './styles.module.css';

// Documentation section dropdown component
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

// TODO move to design system folder
function BreadcrumbsItemLink({children, href, isLast}: {children: React.ReactNode, href?: string, isLast: boolean}) {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return <span className={className}>{children}</span>;
  }
  return href ? (
    <Link className={className} href={href}>
      <span>{children}</span>
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}

// TODO move to design system folder
function BreadcrumbsItem({children, active}: {children: React.ReactNode, active: boolean}) {
  return (
    <li
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
    </li>
  );
}

export default function DocBreadcrumbs() {
  const originalBreadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const location = useLocation();
  
  // Function to enhance breadcrumbs with proper path context
  const getEnhancedBreadcrumbs = () => {
    const path = location.pathname;
    
    // If no original breadcrumbs, return null (this will happen on some pages)
    if (!originalBreadcrumbs) {
      return null;
    }
    
    const enhanced = [...originalBreadcrumbs];
    
    // Platform section enhancement
    if (path.startsWith('/platform/')) {
      const sectionName = path.split('/')[2]; // e.g., 'clusters', 'jobs', etc.
      
      // Check if we need to add Platform as an intermediate breadcrumb
      const hasPlatformBreadcrumb = enhanced.some(breadcrumb => 
        breadcrumb.label === 'Platform' || breadcrumb.href === '/platform'
      );
      
      if (!hasPlatformBreadcrumb) {
        // Add Platform breadcrumb before the current page
        enhanced.unshift({
          type: 'link',
          label: 'Platform',
          href: '/platform',
        });
      }
    }
    
    // CLI section enhancement
    else if (path.startsWith('/cli/')) {
      const hasCLIBreadcrumb = enhanced.some(breadcrumb => 
        breadcrumb.label === 'CLI' || breadcrumb.href === '/cli'
      );
      
      if (!hasCLIBreadcrumb) {
        enhanced.unshift({
          type: 'link',
          label: 'CLI',
          href: '/cli',
        });
      }
    }
    
    // API section enhancement
    else if (path.startsWith('/api/')) {
      const hasAPIBreadcrumb = enhanced.some(breadcrumb => 
        breadcrumb.label === 'API' || breadcrumb.href === '/api'
      );
      
      if (!hasAPIBreadcrumb) {
        enhanced.unshift({
          type: 'link',
          label: 'API',
          href: '/api',
        });
      }
    }
    
    // SDK section enhancement
    else if (path.startsWith('/sdk/')) {
      const hasSDKBreadcrumb = enhanced.some(breadcrumb => 
        breadcrumb.label === 'SDK' || breadcrumb.href === '/sdk'
      );
      
      if (!hasSDKBreadcrumb) {
        enhanced.unshift({
          type: 'link',
          label: 'SDK',
          href: '/sdk',
        });
      }
    }
    
    return enhanced;
  };
  
  const breadcrumbs = getEnhancedBreadcrumbs();
  
  if (!breadcrumbs) {
    return null;
  }
  
  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer,
        )}
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.navAriaLabel',
          message: 'Breadcrumbs',
          description: 'The ARIA label for the breadcrumbs',
        })}>
        <ul className="breadcrumbs">
          {homePageRoute && <HomeBreadcrumbItem />}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const href =
              item.type === 'category' && item.linkUnlisted
                ? undefined
                : item.href;
            return (
              <BreadcrumbsItem key={idx} active={isLast}>
                <BreadcrumbsItemLink href={href} isLast={isLast}>
                  {item.label}
                </BreadcrumbsItemLink>
              </BreadcrumbsItem>
            );
          })}
          <DocumentationDropdown />
        </ul>
      </nav>
    </>
  );
}
