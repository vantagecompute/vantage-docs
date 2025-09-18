# Coding Standards for Vantage Documentation

This document outlines the coding and content standards for the Vantage documentation site. Following these guidelines ensures consistency, maintainability, and quality across all documentation.

## 📁 File Organization

### Directory Structure
```text
vantage-docs/
├── docs/                    # Main documentation
├── docs-api/               # API documentation  
├── docs-cli/               # CLI documentation
├── docs-sdk/               # SDK documentation
├── docs-platform/          # Platform documentation
├── src/
│   ├── components/         # Custom React components
│   ├── css/               # Global styles
│   ├── pages/             # Custom pages
│   └── theme/             # Theme overrides
├── static/
│   ├── img/               # Images and assets
│   ├── fonts/             # Custom fonts
│   └── js/                # Static JavaScript
└── .github/               # Templates and instructions
```

### File Naming Conventions
- **Markdown files**: Use kebab-case (`user-management.md`)
- **Directories**: Use kebab-case (`compute-providers/`)
- **React components**: Use PascalCase (`CustomComponent.jsx`)
- **Images**: Use kebab-case with descriptive names (`dashboard-overview.png`)
- **Static assets**: Use kebab-case (`api-reference.pdf`)

## 📝 Markdown Standards

### Frontmatter Requirements
Every documentation page must include proper frontmatter:

```yaml
---
title: Page Title
description: Brief description for SEO and search indexing
sidebar_position: 1
keywords: [keyword1, keyword2, keyword3]
---
```

### Heading Structure
```markdown
# Page Title (H1 - only one per page)

## Main Section (H2)

### Subsection (H3)

#### Detail Section (H4)

##### Minor Section (H5)

###### Smallest Section (H6)
```

**Rules:**
- Only one H1 per page (matches the title)
- Don't skip heading levels
- Use sentence case, not title case
- Keep headings concise and descriptive

### Content Formatting

#### Code Blocks
Always specify the language for syntax highlighting:

```markdown
```javascript title="example.js"
const client = new VantageClient({
  apiKey: 'your-api-key'
});
```

```bash title="Terminal"
yarn install
yarn build
```

```yaml title="config.yaml"
cluster:
  name: my-cluster
  region: us-east-1
```
```

#### Lists
Use consistent formatting for lists:

```markdown
<!-- Unordered lists -->
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

<!-- Ordered lists -->
1. First step
2. Second step
3. Third step

<!-- Task lists -->
- [ ] Incomplete task
- [x] Completed task
```

#### Links
```markdown
<!-- Internal links (preferred) -->
[Link text](./other-page.md)
[Section link](../section/page.md)

<!-- External links -->
[External resource](https://example.com)

<!-- Reference links for repeated URLs -->
[Vantage API][api-ref]

[api-ref]: https://api.vantagecompute.ai
```

#### Images
```markdown
![Descriptive alt text](./images/screenshot.png)

<!-- With title and sizing -->
![Dashboard overview](./images/dashboard.png "Vantage Dashboard")

<!-- Centered images -->
<div style={{textAlign: 'center'}}>
  ![Centered image](./images/diagram.png)
</div>
```

#### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

#### Admonitions
```markdown
:::note
This is a note with additional information.
:::

:::tip
Pro tip for better performance!
:::

:::warning
Be careful with this configuration.
:::

:::danger
This action cannot be undone.
:::

:::info
Additional context or background.
:::
```

## ⚛️ React Component Standards

### Component Structure
```jsx
import React from 'react';
import clsx from 'clsx';
import styles from './ComponentName.module.css';

interface ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export default function ComponentName({
  title,
  description,
  className
}: ComponentProps): JSX.Element {
  return (
    <div className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}
```

### Component Guidelines
- Use functional components with hooks
- Include TypeScript interfaces for props
- Use CSS modules for styling
- Handle optional props gracefully
- Include proper accessibility attributes
- Use semantic HTML elements

## 🎨 CSS Standards

### CSS Module Structure
```css
/* ComponentName.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--ifm-spacing-vertical);
  padding: var(--ifm-spacing-horizontal);
}

.title {
  color: var(--ifm-color-primary);
  font-size: var(--ifm-h2-font-size);
  margin: 0;
}

.description {
  color: var(--ifm-color-secondary-dark);
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: var(--ifm-spacing-horizontal-sm);
  }
}
```

### Global CSS Guidelines
```css
/* src/css/custom.css */
:root {
  /* Use CSS custom properties */
  --custom-primary: #007acc;
  --custom-spacing: 1rem;
}

/* BEM-like naming for global styles */
.hero-banner {
  background: var(--custom-primary);
}

.hero-banner__title {
  font-size: 2rem;
}

.hero-banner__subtitle {
  opacity: 0.8;
}
```

## 📦 Configuration Standards

### Docusaurus Config
```javascript
// docusaurus.config.js
const config = {
  title: 'Vantage Documentation',
  tagline: 'Comprehensive guides and API reference',
  
  // Use environment variables for sensitive data
  url: process.env.DEPLOY_URL || 'https://docs.vantagecompute.ai',
  baseUrl: process.env.BASE_URL || '/',
  
  // Organize plugins logically
  plugins: [
    // Main documentation
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'default',
        path: 'docs',
        routeBasePath: '/',
        // ... other config
      },
    ],
    // Additional plugins...
  ],
  
  // Group related configurations
  themeConfig: {
    navbar: {
      // Navbar configuration
    },
    footer: {
      // Footer configuration
    },
    // Other theme config...
  },
};
```

### Sidebar Configuration
```javascript
// sidebars-platform.js
module.exports = {
  platformSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/overview',
        'getting-started/installation',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: true,
      items: [
        'features/clusters',
        'features/jobs',
      ],
    },
  ],
};
```

## 🔍 Quality Assurance

### Build Validation
All code must pass these checks:

```bash
# Development server runs without errors
just serve

# Production build completes successfully  
just build

# No linting errors
yarn lint

# No broken links
yarn build --config-validation
```

### Content Quality Checklist
- [ ] All headings follow hierarchy rules
- [ ] All links are functional and use relative paths
- [ ] All images have descriptive alt text
- [ ] Code examples are complete and tested
- [ ] Content follows established voice and tone
- [ ] Mobile responsiveness is verified
- [ ] Accessibility standards are met

### Code Quality Checklist
- [ ] TypeScript interfaces defined for components
- [ ] CSS follows BEM or module conventions
- [ ] Components are reusable and composable
- [ ] Error boundaries implemented where needed
- [ ] Performance optimizations applied
- [ ] Accessibility attributes included

## 🚀 Performance Standards

### Image Optimization
- Use WebP format when possible
- Optimize file sizes (target < 100KB for most images)
- Include multiple sizes for responsive images
- Use lazy loading for non-critical images

### Code Splitting
- Split large components into smaller modules
- Use dynamic imports for heavy dependencies
- Implement route-based code splitting
- Optimize bundle sizes with webpack analysis

### Loading Performance
- Minimize critical CSS
- Use font-display: swap for custom fonts
- Implement proper caching strategies
- Optimize JavaScript bundle sizes

## 🔐 Security Standards

### Content Security
- Sanitize any user-generated content
- Use HTTPS for all external links
- Validate all external integrations
- Regular dependency updates

### Configuration Security
- Use environment variables for sensitive data
- Implement proper CORS policies
- Regular security audits
- Secure deployment practices

## 📊 Analytics and Monitoring

### User Experience Tracking
- Monitor page load times
- Track user engagement metrics
- Analyze search query patterns
- Monitor mobile usage patterns

### Error Monitoring
- Track build failures
- Monitor broken links
- Log client-side errors
- Performance regression detection

## 🔄 Maintenance Standards

### Regular Reviews
- Monthly content accuracy reviews
- Quarterly dependency updates
- Annual architecture assessments
- Continuous accessibility audits

### Documentation Lifecycle
- Regular content updates
- Deprecated feature removal
- New feature documentation
- User feedback integration

These standards ensure our documentation remains high-quality, maintainable, and user-friendly. All contributors should familiarize themselves with these guidelines before making changes.