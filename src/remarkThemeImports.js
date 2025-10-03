// Custom remark plugin to handle theme component imports in submodule docs
const { visit } = require('unist-util-visit');

function remarkThemeImports() {
  return (tree, file) => {
    console.log('Processing file:', file.path || 'unknown');
    
    // Check if imports already exist
    let hasTabsImport = false;
    let hasTabItemImport = false;
    
    visit(tree, 'mdxjsEsm', (node) => {
      if (node.value) {
        if (node.value.includes("import Tabs from '@theme/Tabs'") || 
            node.value.includes('import Tabs from "@theme/Tabs"')) {
          hasTabsImport = true;
        }
        if (node.value.includes("import TabItem from '@theme/TabItem'") || 
            node.value.includes('import TabItem from "@theme/TabItem"')) {
          hasTabItemImport = true;
        }
      }
    });
    
    // Add the imports at the beginning of the document
    const importsNode = {
      type: 'mdxjsEsm',
      value: `import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';`,
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: { type: 'Identifier', name: 'Tabs' }
                }
              ],
              source: { type: 'Literal', value: '@theme/Tabs' }
            },
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportDefaultSpecifier',
                  local: { type: 'Identifier', name: 'TabItem' }
                }
              ],
              source: { type: 'Literal', value: '@theme/TabItem' }
            }
          ],
          sourceType: 'module'
        }
      }
    };

    // Check if the file contains Tabs/TabItem components
    let hasTabsComponents = false;
    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'Tabs' || node.name === 'TabItem') {
        hasTabsComponents = true;
      }
    });

    // Also check for HTML-style tags (both proper case and lowercase)
    visit(tree, 'html', (node) => {
      if (node.value && (node.value.includes('<Tabs') || node.value.includes('<TabItem') || 
                        node.value.includes('<tabs') || node.value.includes('<tabitem'))) {
        hasTabsComponents = true;
      }
    });

    // Convert lowercase HTML tags to proper React components
    visit(tree, 'html', (node) => {
      if (node.value) {
        // Replace lowercase tabs with proper case (handle multiline scenarios)
        node.value = node.value
          .replace(/<tabs(\s[^>]*)?>/gi, '<Tabs$1>')
          .replace(/<\/tabs>/gi, '</Tabs>')
          .replace(/<tabitem(\s[^>]*)?>/gi, '<TabItem$1>')
          .replace(/<\/tabitem>/gi, '</TabItem>');
      }
    });

    // Also check text nodes for inline tags
    visit(tree, 'text', (node) => {
      if (node.value) {
        node.value = node.value
          .replace(/<tabs(\s[^>]*)?>/gi, '<Tabs$1>')
          .replace(/<\/tabs>/gi, '</Tabs>')
          .replace(/<tabitem(\s[^>]*)?>/gi, '<TabItem$1>')
          .replace(/<\/tabitem>/gi, '</TabItem>');
      }
    });

    // If file has tabs components and doesn't already have imports, add them at the beginning
    if (hasTabsComponents && !hasTabsImport && !hasTabItemImport) {
      tree.children.unshift(importsNode);
    }
  };
}

module.exports = remarkThemeImports;