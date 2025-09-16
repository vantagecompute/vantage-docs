// Debug script to find breadcrumbs elements
(function() {
  console.log('=== BREADCRUMBS DEBUG ===');
  
  function debugBreadcrumbs() {
    console.log('Searching for breadcrumbs...');
    
    // Check all possible selectors
    const selectors = [
      'ul.breadcrumbs',
      '.breadcrumbs',
      '[class*="breadcrumb"]',
      '.breadcrumbs__item',
      'nav[aria-label="breadcrumbs"]',
      '.theme-doc-breadcrumbs'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      console.log(`${selector}: found ${elements.length} elements`, elements);
    });
    
    // Check if we're on the right page
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // Look for any navigation elements
    const navs = document.querySelectorAll('nav');
    console.log('All nav elements:', navs);
    
    // Check document structure
    console.log('Document ready state:', document.readyState);
    console.log('Body classes:', document.body.className);
  }
  
  // Try multiple times
  setTimeout(debugBreadcrumbs, 500);
  setTimeout(debugBreadcrumbs, 1000);
  setTimeout(debugBreadcrumbs, 2000);
  
  // Also on load
  window.addEventListener('load', debugBreadcrumbs);
  
  console.log('Debug script loaded');
})();