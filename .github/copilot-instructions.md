# GitHub Copilot Instructions for Vantage Documentation

This repository contains the comprehensive documentation site for Vantage Compute, built with Docusaurus 3.8.1. Follow these guidelines when contributing to ensure consistency and quality.

## Project Overview

**Technology Stack:**
- **Framework**: Docusaurus 3.8.1 (React-based static site generator)
- **Language**: JavaScript/TypeScript, MDX (Markdown + JSX)
- **Styling**: Custom CSS with Docusaurus theming
- **Package Manager**: Yarn
- **Build Tool**: Just (justfile for task automation)
- **Deployment**: GitHub Pages via GitHub Actions

**Documentation Structure:**
- `/docs/` - Main documentation
- `/docs-api/` - API documentation  
- `/docs-cli/` - CLI documentation
- `/docs-sdk/` - SDK documentation
- `/docs-platform/` - Platform documentation (unified structure)
- `/src/` - Custom React components and styling
- `/static/` - Static assets (images, files)

## Development Guidelines

### File Naming Conventions
- Use kebab-case for file and directory names: `user-management.md`
- Use descriptive names that reflect content: `installation-guide.md`
- Index files should be named `index.md` or `index.js`

### Documentation Standards
- Use MDX format for documentation files (`.md` extension)
- Include frontmatter with `title`, `description`, and other metadata
- Use relative links for internal navigation
- Follow proper heading hierarchy (H1 → H2 → H3)
- Include code examples with proper syntax highlighting

### Component Development
- Place custom React components in `/src/components/`
- Use Docusaurus theme components when possible
- Follow React best practices and hooks
- Implement responsive design patterns

### Styling Guidelines
- Modify `/src/css/custom.css` for global styles
- Use Docusaurus CSS variables for theming
- Implement mobile-first responsive design
- Maintain consistent spacing and typography

## Code Quality Standards

### Markdown/MDX Best Practices
```markdown
---
title: Page Title
description: Brief description for SEO
sidebar_position: 1
---

# Page Title

Brief introduction paragraph.

## Section Heading

Content with proper formatting:

- Use bullet points for lists
- Include code blocks with language specification
- Add alt text for images
- Use proper link formatting

```jsx title="Example Component"
import React from 'react';

export default function ExampleComponent() {
  return <div>Hello World</div>;
}
```

### JavaScript/React Patterns
- Use functional components with hooks
- Implement proper error boundaries
- Add TypeScript annotations where beneficial
- Follow Docusaurus plugin patterns

### Documentation Links
- Use relative paths: `./installation.md` or `../other-section/`
- Avoid absolute URLs for internal content
- Verify all links during build process
- Update links when moving/renaming files

## Terminal Session Management

**🚨 CRITICAL: TERMINAL SESSION ISOLATION 🚨**

When a dev server is running (`just serve` or `docusaurus serve`):

**FORBIDDEN ACTIONS:**
- ❌ Running ANY command in the same terminal session where dev server started
- ❌ Using terminals that show `just serve` in recent command history  
- ❌ Executing curl, wget, grep, or any command without checking server status first
- ❌ Interrupting, backgrounding, or killing dev server processes

**REQUIRED ACTIONS:**
- ✅ ALWAYS check terminal output/history to see if dev server is running - NEVER run pgrep or process commands
- ✅ Look for "Serving" or "Local:" messages in terminal output to detect running servers
- ✅ Use completely separate terminal sessions for all testing/commands
- ✅ Preserve running dev servers as if they were production systems
- ✅ When testing localhost URLs, ensure server is running in DIFFERENT terminal

**TERMINAL SESSION RULES:**
1. **Dev Server Terminal**: ONLY for `just serve` - never use for other commands
2. **Testing Terminal**: Separate session for curl, testing, file operations
3. **Build Terminal**: Separate session for `just build` (only when dev server not running)

**VIOLATION CONSEQUENCES:**
- Kills running dev server
- Disrupts user workflow
- Requires complete restart
- Causes significant frustration

**REMEMBER: The dev server terminal is SACRED - never touch it once started!**

## Build and Development Commands

**CRITICAL: Always use the `just` command runner for all build operations!**

**🚨🚨🚨 ABSOLUTE CRITICAL DEV SERVER PROTECTION 🚨🚨🚨**
**THIS IS THE #1 RULE - VIOLATION CAUSES SEVERE WORKFLOW DISRUPTION!**

**MANDATORY PROCESS FOR EVERY SINGLE TERMINAL COMMAND:**
1. **FIRST**: Check terminal output/history to see if dev server is running - NEVER run pgrep or process commands
2. **IF SERVER IS RUNNING** (look for "Serving", "Local:", "docusaurus serve" in terminal output): 
   - ❌ **NEVER EVER run ANY command in the same terminal session**
   - ❌ **NEVER use ctrl+c or interrupt the dev server**
   - ❌ **NEVER run curl, grep, or ANY command that could kill the server**
   - ✅ **ONLY use a completely separate, new terminal session**
3. **IF NO SERVER DETECTED**: Safe to use any terminal
4. **ALWAYS preserve running dev servers - they are SACRED**

**⚠️ SPECIAL WARNING FOR NETWORK COMMANDS:**
- **curl, wget, nc, telnet**: These can ONLY be run in separate terminals when dev server is running
- **NEVER test localhost URLs if you might kill the server providing them**
- **ALWAYS check terminal output FIRST, then use separate terminal**

**💀 NEVER DO THESE WHEN DEV SERVER IS RUNNING:**
- Run commands in the same terminal where `just serve` was executed
- Use any terminal that shows docusaurus/serve in its history
- Execute curl/wget commands without checking server status first
- Interrupt, kill, or terminate dev server processes

**🛡️ SAFE PRACTICE:**
- Always start new terminal sessions for testing when dev server is running
- Treat running dev servers like critical production systems
- When in doubt, check terminal output and use new terminal

**THIS RULE OVERRIDES ALL OTHER CONSIDERATIONS - FOLLOW IT WITHOUT EXCEPTION!**

**Development:**
```bash
just serve    # Start development server
just build    # Build for production - ALWAYS USE THIS
just clean    # Clear build cache
```

**Quality Checks:**
```bash
just build    # Check for broken links and build errors - ONLY BUILD COMMAND TO USE
just serve    # Serve production build locally (after just build)
```

**NEVER use `yarn build` or `npm run build` directly - always use `just build`**

## Plugin Configuration

The site uses multiple Docusaurus plugins for different documentation sections:
- Main docs plugin for general documentation
- Separate plugins for API, CLI, SDK, and Platform docs
- Search integration with Algolia
- Mermaid diagrams support

When modifying `docusaurus.config.js`:
- Maintain consistent plugin configuration patterns
- Test routing and sidebar generation
- Verify search indexing configuration
- Check theme and preset compatibility

## Content Guidelines

### Technical Writing
- Write clear, concise instructions
- Use active voice and present tense
- Include prerequisites and assumptions
- Provide complete, testable examples
- Add troubleshooting sections where relevant

### Code Examples
- Test all code examples before publishing
- Include imports and dependencies
- Use realistic, meaningful variable names
- Add comments for complex logic
- Provide both basic and advanced examples

### Images and Media
- Optimize images for web (WebP preferred)
- Use descriptive filenames and alt text
- Place in appropriate `/static/img/` subdirectories
- Include captions when helpful
- Maintain consistent image styling

## Deployment Considerations

### GitHub Actions Workflow
- Builds trigger on push to `main` branch
- Supports repository dispatch from CLI repo
- Uses Node.js 22 and Yarn for consistency
- Deploys to GitHub Pages automatically

### Performance Optimization
- Minimize bundle size with code splitting
- Optimize images and static assets
- Use Docusaurus built-in optimizations
- Monitor build times and bundle analysis

## Testing and Validation

### Pre-commit Checks
- Verify all links are functional
- Test responsive design on multiple devices
- Check SEO metadata and OpenGraph tags
- Validate HTML and accessibility standards

### Content Review
- Ensure technical accuracy
- Verify code examples execute correctly
- Check for consistency with existing documentation
- Review for clarity and completeness

## Troubleshooting Common Issues

### Build Failures
- Check for broken internal links
- Verify proper frontmatter format
- Ensure all required dependencies are installed
- Review Docusaurus configuration syntax

### Styling Issues
- Check CSS class name conflicts
- Verify custom CSS follows Docusaurus patterns
- Test across different browsers and devices
- Validate CSS custom properties usage

### Plugin Conflicts
- Review plugin dependency versions
- Check for conflicting route definitions
- Verify sidebar and navigation configuration
- Test plugin interactions in development mode

Remember: Always test changes locally before submitting pull requests, and ensure the build passes without warnings or errors.