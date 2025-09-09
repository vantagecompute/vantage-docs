// Context-aware navbar script
(function() {
  function updateNavbarContext() {
    const path = window.location.pathname;
    let section = 'default';
    
    if (path.startsWith('/platform/') || path === '/platform') {
      section = 'platform';
    } else if (path.startsWith('/cli/') || path === '/cli') {
      section = 'cli';
    } else if (path.startsWith('/api/') || path === '/api') {
      section = 'api';
    } else if (path.startsWith('/sdk/') || path === '/sdk') {
      section = 'sdk';
    }
    
    document.body.setAttribute('data-section', section);
  }
  
  // Update on initial load
  updateNavbarContext();
  
  // Update on navigation (for SPA routing)
  window.addEventListener('popstate', updateNavbarContext);
  
  // Create a mutation observer to watch for route changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        updateNavbarContext();
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also listen to hash changes and URL changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      updateNavbarContext();
    }
  }).observe(document, {subtree: true, childList: true});
})();
