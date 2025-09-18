// Custom rehype plugin to transform lowercase tabs to React components
const { visit } = require('unist-util-visit');

function rehypeTabsTransform() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Transform lowercase tabs elements to proper case
      if (node.tagName === 'tabs') {
        node.tagName = 'Tabs';
      } else if (node.tagName === 'tabitem') {
        node.tagName = 'TabItem';
      }
    });
  };
}

module.exports = rehypeTabsTransform;