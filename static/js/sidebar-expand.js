// Add click-to-expand functionality for collapsed sidebars
document.addEventListener('DOMContentLoaded', function() {
  // Function to add click handlers to collapsed sidebars
  function addExpandHandler() {
    const collapsedSidebars = document.querySelectorAll('.theme-doc-sidebar-container[data-collapsed="true"]');
    
    collapsedSidebars.forEach(sidebar => {
      // Always remove old handler to prevent duplicates
      if (sidebar.expandHandler) {
        sidebar.removeEventListener('click', sidebar.expandHandler);
        sidebar.removeEventListener('mousemove', sidebar.mouseMoveHandler);
        sidebar.removeEventListener('mouseleave', sidebar.mouseLeaveHandler);
      }
      
      sidebar.style.cursor = 'pointer';
      
      // Create new handlers
      sidebar.expandHandler = function(e) {
        // Only expand if clicking on the sidebar itself, not on any content inside
        if (e.target === sidebar || e.target.closest('.theme-doc-sidebar-container') === sidebar && 
            !e.target.closest('nav, .menu, a, button')) {
          
          // Check if we're on the platform page (custom React component)
          const isPlatformPage = window.location.pathname === '/platform' || window.location.pathname === '/platform/';
          
          if (isPlatformPage) {
            // Platform page: directly toggle the data-collapsed attribute
            sidebar.setAttribute('data-collapsed', 'false');
          } else {
            // Other pages: try to find and click the expand button
            const expandButton = sidebar.querySelector('.collapseSidebarButton_PEFL, button[title*="Expand"], button[aria-label*="Expand"]');
            if (expandButton) {
              expandButton.click();
            } else {
              // Fallback: directly toggle the attribute
              sidebar.setAttribute('data-collapsed', 'false');
            }
          }
          
          // Clean up styles
          sidebar.style.removeProperty('--mouse-x');
          sidebar.style.removeProperty('--mouse-y');
          sidebar.style.cursor = '';
        }
      };

      sidebar.mouseMoveHandler = function(e) {
        const rect = sidebar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update CSS custom properties for the arrow position
        sidebar.style.setProperty('--mouse-x', x + 'px');
        sidebar.style.setProperty('--mouse-y', y + 'px');
      };

      sidebar.mouseLeaveHandler = function() {
        sidebar.style.removeProperty('--mouse-x');
        sidebar.style.removeProperty('--mouse-y');
      };
      
      // Add new handlers
      sidebar.addEventListener('click', sidebar.expandHandler);
      sidebar.addEventListener('mousemove', sidebar.mouseMoveHandler);
      sidebar.addEventListener('mouseleave', sidebar.mouseLeaveHandler);
    });
  }
  
  // Initial check
  addExpandHandler();
  
  // Check periodically for new collapsed sidebars (after navigation)
  setInterval(addExpandHandler, 500);
});
