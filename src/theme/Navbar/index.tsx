import React from 'react';
import {useLocation} from '@docusaurus/router';
import Navbar from '@theme-original/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import type NavbarType from '@theme/Navbar';

// This will be injected dynamically
const navbarScript = `
(function() {
  function updateNavbarVisibility() {
    const path = window.location.pathname;
    
    // Get all navbar items
    const navItems = document.querySelectorAll('.navbar__item');
    
    // Define visibility rules
    const rules = {
      platform: ['/', '/platform/clusters', '/platform/jobs', '/platform/storage', '/platform/compute-providers', '/platform/notebooks', '/platform/remote-desktops', '/platform/teams', '/platform/licenses'],
      cli: ['/', '/cli/installation', '/cli/login', '/cli/configuration', '/cli/quickstart', '/cli/command-reference'],
      api: ['/', '/api/authentication', '/api/quickstart', '/api/reference'],
      sdk: ['/', '/sdk/installation', '/sdk/configuration', '/sdk/quickstart', '/sdk/api'],
      default: ['/', '/platform', '/cli', '/api', '/sdk']
    };
    
    let currentSection = 'default';
    if (path.startsWith('/platform/') || path === '/platform') currentSection = 'platform';
    else if (path.startsWith('/cli/') || path === '/cli') currentSection = 'cli';
    else if (path.startsWith('/api/') || path === '/api') currentSection = 'api';
    else if (path.startsWith('/sdk/') || path === '/sdk') currentSection = 'sdk';
    
    const visibleItems = rules[currentSection];
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && (href === '/' || href.startsWith('https://') || visibleItems.includes(href))) {
        item.style.display = '';
      } else if (href && href.startsWith('/')) {
        item.style.display = 'none';
      }
    });
    
    // Update dropdown label based on current section and sidebar state
    updateDropdownLabel(currentSection, false);
  }
  
  // Listen for sidebar state changes
  window.addEventListener('sidebarStateChange', (event) => {
    const path = window.location.pathname;
    let currentSection = 'default';
    if (path.startsWith('/platform/') || path === '/platform') currentSection = 'platform';
    else if (path.startsWith('/cli/') || path === '/cli') currentSection = 'cli';
    else if (path.startsWith('/api/') || path === '/api') currentSection = 'api';
    else if (path.startsWith('/sdk/') || path === '/sdk') currentSection = 'sdk';
    
    updateDropdownLabel(currentSection, event.detail.collapsed);
  });
  
  function updateDropdownLabel(currentSection, sidebarCollapsed = false) {
    // Find the dropdown that contains Platform, API, CLI, SDK items
    const dropdowns = document.querySelectorAll('.navbar__item.dropdown');
    let targetDropdown = null;
    
    dropdowns.forEach(dropdown => {
      const menu = dropdown.querySelector('.dropdown__menu');
      if (menu && (menu.textContent.includes('Platform') && menu.textContent.includes('API'))) {
        targetDropdown = dropdown.querySelector('.navbar__link');
      }
    });

    if (targetDropdown) {
      let label = 'Documentation';
      switch (currentSection) {
        case 'platform':
          label = sidebarCollapsed ? 'Platform (Collapsed)' : 'Platform';
          break;
        case 'api':
          label = 'API';
          break;
        case 'cli':
          label = 'CLI';
          break;
        case 'sdk':
          label = 'SDK';
          break;
      }
      targetDropdown.textContent = label;
    }
  }  // Update immediately and on navigation
  setTimeout(updateNavbarVisibility, 100);
  
  // Listen for navigation changes
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(updateNavbarVisibility, 100);
  };
  
  window.addEventListener('popstate', () => {
    setTimeout(updateNavbarVisibility, 100);
  });
})();
`;

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props) {
  const location = useLocation();

  React.useEffect(() => {
    // Inject the script to handle navbar visibility
    const script = document.createElement('script');
    script.textContent = navbarScript;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  React.useEffect(() => {
    // Trigger update when location changes
    const event = new CustomEvent('navbarUpdate');
    window.dispatchEvent(event);
  }, [location.pathname]);

  return <Navbar {...props} />;
}
