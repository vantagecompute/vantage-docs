# Development Environment Setup for Vantage Documentation

This file provides GitHub Copilot with specific environment setup instructions and tooling configurations for optimal development experience.

## Prerequisites

**Required Software:**
- Node.js 22.x (latest LTS)
- Yarn package manager
- Just command runner
- Git with SSH/HTTPS access

**Development Tools:**
- VS Code with recommended extensions
- Browser with dev tools (Chrome/Firefox/Safari)
- Terminal with shell completion

## Local Development Setup

### 1. Initial Setup
```bash
# Clone repository
git clone https://github.com/vantagecompute/vantage-docs.git
cd vantage-docs

# Install dependencies
yarn install

# Install Just (if not already installed)
# macOS
brew install just
# Ubuntu/Debian  
sudo snap install just --classic
# Or download from: https://github.com/casey/just
```

### 2. Environment Configuration
```bash
# Verify Node.js version
node --version  # Should be 22.x

# Verify Yarn
yarn --version

# Verify Just
just --version
```

### 3. Development Commands
```bash
# Start development server (hot reload)
just serve
# Alternative: yarn start

# Build for production
just build  
# Alternative: yarn build

# Clear cache and build artifacts
just clean
# Alternative: yarn clear

# Serve production build locally
yarn serve
```

## VS Code Configuration

**Recommended Extensions:**
- MDX (unified.vscode-mdx)
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Live Server (for static preview)

**Workspace Settings (.vscode/settings.json):**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.md": "mdx"
  },
  "emmet.includeLanguages": {
    "mdx": "html"
  }
}
```

## File System Structure

### Working Directories:
- `docs-platform/` - Unified platform documentation
- `docs-api/` - API reference documentation
- `docs-cli/` - CLI tool documentation
- `docs-sdk/` - SDK documentation
- `src/components/` - Custom React components
- `src/css/` - Styling and themes
- `static/img/` - Images and media assets

### Configuration Files:
- `docusaurus.config.js` - Main Docusaurus configuration
- `package.json` - Dependencies and scripts
- `justfile` - Build automation commands
- `babel.config.js` - Babel transpilation settings

## Development Workflow

### 1. Creating New Documentation
```bash
# Create new section
mkdir docs-platform/new-section
echo "---\ntitle: New Section\n---\n\n# Content" > docs-platform/new-section/index.md

# Add to sidebar (if using manual sidebar)
# Edit appropriate sidebar.js file
```

### 2. Adding React Components
```bash
# Create component
mkdir src/components/NewComponent
touch src/components/NewComponent/index.js
touch src/components/NewComponent/styles.module.css
```

### 3. Asset Management
```bash
# Add images
cp image.png static/img/
# Reference in markdown: ![Alt text](/img/image.png)

# Add files
cp document.pdf static/files/
# Reference: [Download](/files/document.pdf)
```

## Testing and Quality Assurance

### Local Testing:
```bash
# Test development build
just serve
# Open: http://localhost:3000

# Test production build
just build
yarn serve
# Open: http://localhost:3000
```

### Link Validation:
```bash
# Build includes broken link checking
just build
# Review console output for broken links

# Manual link testing
# Click through navigation in browser
# Test responsive design on mobile
```

### Performance Testing:
```bash
# Bundle analysis (after build)
npx webpack-bundle-analyzer build/static/js/*.js

# Lighthouse audit
# Use browser dev tools > Lighthouse tab
# Run audit on built site
```

## Common Development Tasks

### Adding New Plugin:
1. Install plugin: `yarn add @docusaurus/plugin-name`
2. Configure in `docusaurus.config.js`
3. Test with `just serve`
4. Build to verify: `just build`

### Modifying Styles:
1. Edit `src/css/custom.css`
2. Use CSS variables for consistency
3. Test responsive behavior
4. Verify theme compatibility

### Creating Custom Pages:
1. Add to `src/pages/`
2. Use Layout component
3. Export as default
4. Test routing and navigation

## Environment Variables

**Development:**
- `NODE_ENV=development` (automatic in dev mode)
- Hot reload enabled
- Source maps available
- Debug mode active

**Production:**
- `NODE_ENV=production` (automatic in build)
- Minification enabled
- Optimizations active
- Bundle splitting

## Troubleshooting

### Common Issues:

**Build Failures:**
```bash
# Clear cache
just clean
yarn clear

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install

# Check Node.js version
node --version
```

**Port Conflicts:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Use different port
yarn start --port 3001
```

**Memory Issues:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

### Performance Issues:
- Use `yarn build` to check bundle size
- Optimize images before adding to `/static/img/`
- Minimize custom CSS and JavaScript
- Use code splitting for large components

## Git Workflow

### Branch Naming:
- `feature/description` - New features
- `fix/description` - Bug fixes  
- `docs/description` - Documentation updates
- `refactor/description` - Code improvements

### Commit Messages:
- Use conventional commits format
- Include scope when relevant: `docs(platform): add new section`
- Reference issues: `fixes #123`

### Pre-commit Checklist:
1. Run `just build` successfully
2. Test local development server
3. Verify no broken links
4. Check responsive design
5. Validate accessibility
6. Update documentation if needed

This environment setup ensures optimal development experience and helps GitHub Copilot understand the complete development context.