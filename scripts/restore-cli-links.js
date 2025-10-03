#!/usr/bin/env node
// Restore original CLI docs links
const { execSync } = require('child_process');

console.log('�� Restoring original CLI docs links...');
try {
  execSync('cd external/vantage-cli && git checkout -- docusaurus/docs/', { stdio: 'inherit' });
  console.log('✅ CLI docs restored to original state');
} catch (error) {
  console.error('❌ Error restoring CLI docs:', error.message);
}
