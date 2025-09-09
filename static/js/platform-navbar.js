// Platform navbar component dropdown functionality
console.log('Platform navbar script loaded!');

function initPlatformNavbar() {
  console.log('Initializing platform navbar dropdown');
  
  const platformComponents = [
    { label: 'Platform Overview', to: '/platform' },
    { label: 'Jobs', to: '/platform/jobs' },
    { label: 'Clusters', to: '/platform/clusters' },
    { label: 'Storage', to: '/platform/storage' },
    { label: 'Remote Desktops', to: '/platform/remote-desktops' },
    { label: 'Notebooks', to: '/platform/notebooks' },
    { label: 'Compute Providers', to: '/platform/compute-providers' },
    { label: 'Teams', to: '/platform/teams' },
    { label: 'Licenses', to: '/platform/licenses' },
  ];

  function getCurrentComponent() {
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname);
    
    if (pathname === '/platform' || pathname === '/platform/') {
      return platformComponents[0]; // Platform Overview
    }
    
    return platformComponents.find(component => 
      pathname.startsWith(component.to) && component.to !== '/platform'
    ) || platformComponents[0];
  }

  function addPlatformDropdown() {
    console.log('Checking if should add platform dropdown...');
    
    // Only add on platform pages
    if (!window.location.pathname.startsWith('/platform')) {
      console.log('Not on platform page, skipping');
      return;
    }

    // Try multiple possible navbar selectors for right side
    const possibleSelectors = [
      '.navbar__items--right',
      '.navbar__items.navbar__items--right',
      '.navbar .navbar__items--right',
      '.navbar__inner .navbar__items--right',
      '.navbar__items:last-child',
      '.navbar .navbar__items:last-child',
      'nav .navbar__items:last-child'
    ];
    
    let navbar = null;
    for (const selector of possibleSelectors) {
      navbar = document.querySelector(selector);
      if (navbar) {
        console.log('Found navbar with selector:', selector);
        break;
      }
    }
    
    if (!navbar) {
      console.log('Trying to find any navbar or nav elements...');
      const allElements = document.querySelectorAll('nav, [class*="navbar"], [class*="nav"]');
      console.log('All nav-related elements found:', allElements.length);
      allElements.forEach((el, index) => {
        console.log(`Nav element ${index}:`, el.tagName, el.className, el);
      });
      
      // Try to find the first navbar items container
      navbar = document.querySelector('nav ul, .navbar ul, [class*="navbar"] ul');
      if (navbar) {
        console.log('Using fallback navbar ul container');
      }
    }
    
    const existingDropdown = document.querySelector('.platform-component-dropdown');
    
    console.log('Navbar found:', !!navbar);
    console.log('Existing dropdown found:', !!existingDropdown);
    
    if (navbar && !existingDropdown) {
      console.log('Adding platform dropdown...');
      const currentComponent = getCurrentComponent();
      console.log('Current component:', currentComponent);
      
      const platformDropdown = document.createElement('li');
      platformDropdown.className = 'navbar__item dropdown dropdown--hoverable platform-component-dropdown';
      
      platformDropdown.innerHTML = `
        <a href="#" class="navbar__link" aria-haspopup="true" aria-expanded="false" role="button">
          ${currentComponent.label}
        </a>
        <ul class="dropdown__menu">
          ${platformComponents.map(component => `
            <li>
              <a class="dropdown__link ${window.location.pathname === component.to || 
                (window.location.pathname.startsWith(component.to) && component.to !== '/platform') ? 
                'dropdown__link--active' : ''}" href="${component.to}">
                ${component.label}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
      
      // Prevent default click behavior on the dropdown trigger
      const dropdownLink = platformDropdown.querySelector('a[href="#"]');
      dropdownLink.addEventListener('click', (e) => e.preventDefault());
      
      // Insert at the beginning of the right navbar items
      navbar.insertBefore(platformDropdown, navbar.firstChild);
      console.log('Platform dropdown added successfully!');
    }
  }

  function removePlatformDropdown() {
    const existingDropdown = document.querySelector('.platform-component-dropdown');
    if (existingDropdown) {
      console.log('Removing platform dropdown');
      existingDropdown.remove();
    }
  }

  function updatePlatformDropdown() {
    console.log('Updating platform dropdown...');
    if (window.location.pathname.startsWith('/platform')) {
      addPlatformDropdown();
    } else {
      removePlatformDropdown();
    }
  }

  // Initial setup
  updatePlatformDropdown();

  // Update on navigation (for client-side routing)
  let currentPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      console.log('Path changed to:', currentPath);
      setTimeout(updatePlatformDropdown, 100); // Small delay to ensure DOM is updated
    }
  }, 500);
}

// Try multiple ways to ensure the script runs after the navbar is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up platform navbar dropdown');
  
  // Try immediately
  initPlatformNavbar();
  
  // Try after a short delay
  setTimeout(initPlatformNavbar, 500);
  
  // Try after a longer delay
  setTimeout(initPlatformNavbar, 1500);
});

// Also try on window load as a fallback
window.addEventListener('load', function() {
  console.log('Window loaded, trying platform navbar setup again');
  setTimeout(initPlatformNavbar, 100);
});
