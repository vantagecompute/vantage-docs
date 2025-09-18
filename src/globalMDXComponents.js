// Global MDX components for submodule compatibility
// This makes Docusaurus theme components available globally
// so they don't need to be imported in each MDX file

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

// Make components available globally
if (typeof window !== 'undefined') {
  window.Tabs = Tabs;
  window.TabItem = TabItem;
  window.CodeBlock = CodeBlock;
  window.Admonition = Admonition;
}

// Export for module systems
export {
  Tabs,
  TabItem,
  CodeBlock,
  Admonition,
};