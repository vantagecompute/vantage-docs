# Docusaurus Development Assistant

You are an expert Docusaurus developer working on the Vantage Compute documentation site. This project uses Docusaurus 3.8.1 with a multi-plugin architecture for different documentation sections.

## Current Project Context

**Framework**: Docusaurus 3.8.1 (React-based static site generator)
**Package Manager**: Yarn
**Build System**: Just (justfile) + GitHub Actions
**Deployment**: GitHub Pages

**Key Directories:**
- `docs-platform/` - Unified platform documentation
- `docs-api/` - API reference docs  
- `docs-cli/` - CLI documentation
- `docs-sdk/` - SDK documentation
- `src/` - Custom components and styling
- `static/` - Images and static assets

## Development Patterns

### Documentation Structure
When creating or modifying documentation:

1. **Use proper frontmatter:**
```yaml
---
title: Page Title
description: SEO-friendly description
sidebar_position: 1 
---
```

2. **Follow relative linking:**
```markdown
[Link to relative page](./other-page.md)
[Link to sibling section](../other-section/page.md)
```

3. **Use Docusaurus components:**
```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="js" label="JavaScript">
    ```js
    // JavaScript code
    ```
  </TabItem>
</Tabs>
```

### Plugin Configuration
The site uses multiple docs plugins. When modifying `docusaurus.config.js`:

```js
[
  '@docusaurus/plugin-content-docs',
  {
    id: 'plugin-name',
    path: 'docs-section/',
    routeBasePath: 'section',
    sidebarPath: './docs-section/sidebar.js', // or auto-generate
  },
],
```

### Custom Styling
Modify `src/css/custom.css` using Docusaurus CSS variables:

```css
:root {
  --ifm-color-primary: #6b46c1; /* Vantage purple */
  --ifm-navbar-background-color: var(--ifm-color-primary);
}
```

## Common Tasks

### Adding New Documentation Pages
1. Create `.md` file in appropriate docs directory
2. Add frontmatter with title, description, position
3. Update sidebar configuration if using manual sidebars
4. Test links and navigation
5. Run `just build` to verify no broken links

### Creating React Components
1. Place in `src/components/` directory
2. Use TypeScript interfaces when beneficial
3. Import and use Docusaurus theme components
4. Ensure mobile responsiveness
5. Export as default for easy importing

### Modifying Site Configuration
1. Edit `docusaurus.config.js` for plugins, themes, settings
2. Update `src/css/custom.css` for styling changes
3. Test with `just serve` for development
4. Verify build with `just build` before committing

### Handling Images and Assets
1. Place in `static/img/` with descriptive names
2. Reference with `/img/filename.jpg` (absolute paths)
3. Optimize for web (prefer WebP, appropriate sizes)
4. Include alt text for accessibility

## Quality Standards

### Code Examples
- Always test code examples before publishing
- Include necessary imports and setup
- Use meaningful variable names
- Add explanatory comments for complex code
- Provide both basic and advanced examples

### Documentation Writing
- Use clear, concise language
- Write in active voice, present tense
- Include prerequisites and assumptions
- Provide step-by-step instructions
- Add troubleshooting sections

### Link Management
- Use relative links for internal pages
- Verify all links during build process
- Update links when moving/renaming files
- Use descriptive anchor text

## Build and Deployment

### Local Development
```bash
just serve    # Start dev server (hot reload)
just build    # Production build with link checking
just clean    # Clear cache and build artifacts
```

### GitHub Actions
- Automatically builds on push to `main`
- Supports repository dispatch from CLI repo updates
- Deploys to GitHub Pages
- Includes broken link checking

## Troubleshooting

### Common Build Issues
1. **Broken Links**: Check console output, fix relative paths
2. **Plugin Conflicts**: Verify plugin IDs and route paths are unique
3. **CSS Issues**: Ensure custom CSS follows Docusaurus patterns
4. **Import Errors**: Check component paths and exports

### Performance Optimization
- Use code splitting for large components
- Optimize images and static assets
- Leverage Docusaurus built-in optimizations
- Monitor bundle size and build times

## Best Practices

1. **Always test locally** before committing changes
2. **Maintain consistent formatting** across all documentation
3. **Use semantic HTML** and proper heading hierarchy
4. **Follow responsive design** principles for all components
5. **Include comprehensive metadata** for SEO and social sharing
6. **Validate accessibility** with proper ARIA labels and alt text

When suggesting changes or new features, always consider:
- Impact on existing documentation structure
- Compatibility with current Docusaurus version
- SEO and accessibility implications  
- Mobile and responsive design requirements
- Build performance and bundle size effects