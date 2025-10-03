// Platform sidebar collapsible functionality
console.log('Platform sidebar script loaded!');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, setting up platform sidebar handlers');
  
  function addPlatformSidebarHandlers() {
    // Add click handlers to collapsible menu items in platform sidebar
    const collapsibleItems = document.querySelectorAll('.menu__list-item-collapsible .menu__link--sublist');
    console.log('Found collapsible items:', collapsibleItems.length);
    
    collapsibleItems.forEach((clickableElement, index) => {
      // Only add handler if not already added
      if (!clickableElement.hasAttribute('data-platform-handler')) {
        console.log(`Setting up handler for item ${index}:`, clickableElement.textContent);
        
        clickableElement.setAttribute('data-platform-handler', 'true');
        clickableElement.style.cursor = 'pointer';
        
        clickableElement.addEventListener('click', function(e) {
          console.log('CLICKED on:', clickableElement.textContent);
          e.preventDefault();
          e.stopPropagation();
          
          // Find the collapsible container and submenu
          const collapsibleItem = clickableElement.closest('.menu__list-item-collapsible');
          const parentLi = collapsibleItem ? collapsibleItem.closest('li') : null;
          const submenu = parentLi ? parentLi.querySelector('ul.menu__list') : null;
          
          if (collapsibleItem && submenu) {
            console.log('Toggling submenu for:', clickableElement.textContent);
            console.log('Current active state:', collapsibleItem.classList.contains('menu__list-item-collapsible--active'));
            
            // Toggle the active state
            if (collapsibleItem.classList.contains('menu__list-item-collapsible--active')) {
              // Collapse
              collapsibleItem.classList.remove('menu__list-item-collapsible--active');
              submenu.style.display = 'none';
              console.log('Collapsed submenu');
            } else {
              // Expand
              collapsibleItem.classList.add('menu__list-item-collapsible--active');
              submenu.style.display = 'block';
              console.log('Expanded submenu');
            }
          } else {
            console.log('Could not find submenu for:', clickableElement.textContent);
            console.log('collapsibleItem:', collapsibleItem);
            console.log('parentLi:', parentLi);
            console.log('submenu:', submenu);
          }
        });
      }
    });
  }
  
  // Initial setup
  addPlatformSidebarHandlers();
  
  // Only check for new items occasionally, not constantly
  let checkCount = 0;
  const maxChecks = 10; // Stop checking after 10 attempts
  
  const intervalId = setInterval(() => {
    checkCount++;
    if (checkCount >= maxChecks) {
      clearInterval(intervalId);
      console.log('Stopped checking for new platform sidebar items');
      return;
    }
    
    const newItems = document.querySelectorAll('.menu__list-item-collapsible .menu__link--sublist:not([data-platform-handler])');
    if (newItems.length > 0) {
      console.log('Found new platform sidebar items, setting up handlers');
      addPlatformSidebarHandlers();
    }
  }, 2000);
});
