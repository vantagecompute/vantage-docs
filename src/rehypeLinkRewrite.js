const { visit } = require('unist-util-visit');

/**
 * Rehype plugin to rewrite /vantage-cli/ links to /cli/
 * This transforms internal links in markdown content during the build process
 */
function rehypeLinkRewrite() {
  return (tree, file) => {
    let transformed = false;
    
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties && node.properties.href) {
        const originalHref = node.properties.href;
        let newHref = originalHref;
        
        // Handle various patterns that need transformation
        if (typeof originalHref === 'string') {
          // Pattern 1: /vantage-cli/ -> /cli/
          if (originalHref.includes('/vantage-cli/')) {
            newHref = originalHref.replace(/\/vantage-cli\//g, '/cli/');
            transformed = true;
          }
          // Pattern 2: vantage-cli/ -> cli/
          else if (originalHref.startsWith('vantage-cli/')) {
            newHref = originalHref.replace(/^vantage-cli\//, 'cli/');
            transformed = true;
          }
          // Pattern 3: /cli/file.md -> /cli/deployment-applications/localhost/file (for specific files)
          else if (originalHref.match(/^\/cli\/(microk8s|charmed-hpc)\.md$/)) {
            const fileName = originalHref.match(/\/cli\/([^.]+)\.md$/)[1];
            newHref = `/cli/deployment-applications/localhost/${fileName}`;
            transformed = true;
          }
          // Pattern 4: Broken anchor links that should point to deployment app pages
          else if (originalHref === '/cli/index.md#microk8s') {
            newHref = '/cli/deployment-applications/localhost/microk8s';
            transformed = true;
          }
          else if (originalHref === '/cli/index.md#charmed-hpc') {
            newHref = '/cli/deployment-applications/localhost/charmed-hpc';
            transformed = true;
          }
          else if (originalHref === '/cli#multipass') {
            newHref = '/cli/deployment-applications/localhost#multipass';
            transformed = true;
          }
          
          // Apply the transformation if changed
          if (newHref !== originalHref) {
            node.properties.href = newHref;
            if (file && file.path) {
              console.log(`Link rewrite in ${file.path}: "${originalHref}" -> "${newHref}"`);
            }
          }
        }
      }
    });
    
    return tree;
  };
}

module.exports = rehypeLinkRewrite;