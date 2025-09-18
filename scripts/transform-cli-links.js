#!/usr/bin/env node

/**
 * Transform CLI docs links based on deployment context
 * Usage: node scripts/transform-cli-links.js [base-path]
 * 
 * This script transforms internal links in CLI docs to work with different base paths:
 * - For standalone CLI docs: /vantage-cli/
 * - For integrated docs: /cli/
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const basePath = process.argv[2] || '/cli/';
const docsPath = 'external/vantage-cli/docusaurus/docs';

console.log(`🔗 Transforming CLI docs links for base path: ${basePath}`);

function transformLinks(content, targetBasePath) {
  // Transform various link patterns
  let transformed = content;
  
  // Pattern 1: Relative links like ./installation or ./commands
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\.\/([^)]+)\)/g, 
    `[$1](${targetBasePath}$2)`
  );
  
  // Pattern 2: Root-relative links like /installation or /commands (but not external URLs)
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\/(?!http|https|mailto)([^)]+)\)/g, 
    (match, linkText, linkPath) => {
      // Skip if already has the correct base path
      if (linkPath.startsWith(targetBasePath.slice(1))) {
        return match;
      }
      return `[${linkText}](${targetBasePath}${linkPath})`;
    }
  );
  
  // Pattern 3: Bare filenames like (installation) or (commands)
  transformed = transformed.replace(
    /\[([^\]]+)\]\(([a-z-]+)\)/g,
    (match, linkText, linkPath) => {
      // Only transform if it looks like a documentation page
      if (/^[a-z-]+$/.test(linkPath)) {
        return `[${linkText}](${targetBasePath}${linkPath})`;
      }
      return match;
    }
  );
  
  return transformed;
}

function transformFile(filePath, targetBasePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const transformed = transformLinks(content, targetBasePath);
    
    if (content !== transformed) {
      fs.writeFileSync(filePath, transformed, 'utf8');
      console.log(`✅ Transformed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error transforming ${filePath}:`, error.message);
    return false;
  }
}

// Find all markdown files in the CLI docs
const markdownFiles = glob.sync(`${docsPath}/**/*.md`);

console.log(`📁 Found ${markdownFiles.length} markdown files`);

let transformedCount = 0;
markdownFiles.forEach(file => {
  if (transformFile(file, basePath)) {
    transformedCount++;
  }
});

console.log(`🎉 Transformation complete! ${transformedCount} files updated.`);

// Also create a restore script
const restoreScript = `#!/usr/bin/env node
// Restore original CLI docs links
const { execSync } = require('child_process');

console.log('🔄 Restoring original CLI docs links...');
try {
  execSync('cd external/vantage-cli && git checkout -- docusaurus/docs/', { stdio: 'inherit' });
  console.log('✅ CLI docs restored to original state');
} catch (error) {
  console.error('❌ Error restoring CLI docs:', error.message);
}
`;

fs.writeFileSync('scripts/restore-cli-links.js', restoreScript);
fs.chmodSync('scripts/restore-cli-links.js', '755');

console.log('📝 Created restore script: scripts/restore-cli-links.js');