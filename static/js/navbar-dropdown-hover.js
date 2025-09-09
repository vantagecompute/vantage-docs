// Enhanced navbar dropdown hover functionality
console.log('Navbar hover dropdown script loaded!');

function initNavbarDropdownHover() {
  console.log('Initializing navbar dropdown hover behavior');
  
  // Add hover functionality to all dropdown elements
  function setupDropdownHover() {
    // Find all dropdown elements in the navbar
    const dropdowns = document.querySelectorAll('.navbar__item.dropdown, .navbar .dropdown');
    
    console.log('Found dropdowns:', dropdowns.length);
    
    dropdowns.forEach((dropdown, index) => {
      console.log(`Setting up hover for dropdown ${index}:`, dropdown);
      
      // Remove any existing hover event listeners to avoid duplicates
      const existingHoverHandler = dropdown._hoverHandler;
      if (existingHoverHandler) {
        dropdown.removeEventListener('mouseenter', existingHoverHandler.mouseenter);
        dropdown.removeEventListener('mouseleave', existingHoverHandler.mouseleave);
      }
      
      let hoverTimeout;
      
      const mouseenterHandler = function(e) {
        console.log('Mouse entered dropdown:', dropdown);
        
        // Clear any pending hide timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Close other open dropdowns first
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('dropdown--show');
            const trigger = otherDropdown.querySelector('.navbar__link');
            if (trigger) {
              trigger.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Show this dropdown
        dropdown.classList.add('dropdown--show');
        const trigger = dropdown.querySelector('.navbar__link');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'true');
        }
      };
      
      const mouseleaveHandler = function(e) {
        console.log('Mouse left dropdown:', dropdown);
        
        // Use a small delay to allow moving between dropdown trigger and menu
        hoverTimeout = setTimeout(() => {
          dropdown.classList.remove('dropdown--show');
          const trigger = dropdown.querySelector('.navbar__link');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
          }
        }, 150); // 150ms delay to allow mouse movement between elements
      };
      
      // Store handlers for cleanup
      dropdown._hoverHandler = {
        mouseenter: mouseenterHandler,
        mouseleave: mouseleaveHandler
      };
      
      // Add event listeners
      dropdown.addEventListener('mouseenter', mouseenterHandler);
      dropdown.addEventListener('mouseleave', mouseleaveHandler);
      
      // Also handle focus for keyboard accessibility
      const trigger = dropdown.querySelector('.navbar__link');
      if (trigger) {
        trigger.addEventListener('focus', () => {
          if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
          }
          dropdown.classList.add('dropdown--show');
          trigger.setAttribute('aria-expanded', 'true');
        });
        
        // Close dropdown when focus leaves the entire dropdown area
        dropdown.addEventListener('focusout', (e) => {
          // Check if the new focus target is still within this dropdown
          if (!dropdown.contains(e.relatedTarget)) {
            setTimeout(() => {
              dropdown.classList.remove('dropdown--show');
              trigger.setAttribute('aria-expanded', 'false');
            }, 100);
          }
        });
      }
      
      // Prevent default click behavior on dropdown triggers with href="#"
      const triggerLink = dropdown.querySelector('a[href="#"]');
      if (triggerLink) {
        triggerLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    });
  }
  
  // Close all dropdowns when clicking outside
  function setupOutsideClickHandler() {
    document.addEventListener('click', (e) => {
      const dropdowns = document.querySelectorAll('.navbar__item.dropdown, .navbar .dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('dropdown--show');
          const trigger = dropdown.querySelector('.navbar__link');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }
  
  // Close dropdowns on escape key
  function setupEscapeKeyHandler() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dropdowns = document.querySelectorAll('.navbar__item.dropdown, .navbar .dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('dropdown--show');
          const trigger = dropdown.querySelector('.navbar__link');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  }
  
  // Main initialization function
  function initialize() {
    setupDropdownHover();
    setupOutsideClickHandler();
    setupEscapeKeyHandler();
  }
  
  // Run initialization
  initialize();
  
  // Re-run setup when new dropdowns are added (for dynamic content)
  const observer = new MutationObserver((mutations) => {
    let shouldReinitialize = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if a dropdown was added
            if (node.classList && (node.classList.contains('dropdown') || 
                node.querySelector && node.querySelector('.dropdown'))) {
              shouldReinitialize = true;
            }
          }
        });
      }
    });
    
    if (shouldReinitialize) {
      console.log('New dropdown detected, reinitializing hover behavior');
      setTimeout(setupDropdownHover, 100);
    }
  });
  
  // Observe the navbar area for changes
  const navbar = document.querySelector('.navbar, nav');
  if (navbar) {
    observer.observe(navbar, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbarDropdownHover);
} else {
  initNavbarDropdownHover();
}

// Also try after a delay to ensure all dynamic content is loaded
setTimeout(initNavbarDropdownHover, 1000);

// Re-initialize on route changes (for client-side navigation)
let currentPath = window.location.pathname;
setInterval(() => {
  if (window.location.pathname !== currentPath) {
    currentPath = window.location.pathname;
    setTimeout(initNavbarDropdownHover, 500);
  }
}, 1000);
