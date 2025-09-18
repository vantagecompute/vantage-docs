# Contributing to Vantage Documentation

Thank you for your interest in contributing to the Vantage documentation! This guide will help you get started with contributing effectively to our documentation site.

## 🚀 Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/vantage-docs.git
   cd vantage-docs
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Start Development Server**
   ```bash
   just serve
   ```

## 📁 Project Structure

```
vantage-docs/
├── docs/                    # Main documentation
├── docs-api/               # API documentation
├── docs-cli/               # CLI documentation
├── docs-sdk/               # SDK documentation
├── docs-platform/          # Platform documentation
├── src/                    # Custom React components
├── static/                 # Static assets
└── .github/                # GitHub templates and Copilot instructions
```

## 📝 Documentation Guidelines

### Content Standards

- **Write for your audience**: Consider the user's experience level and use case
- **Be concise and clear**: Use simple language and short sentences
- **Use active voice**: "Click the button" instead of "The button should be clicked"
- **Include examples**: Provide code samples and real-world scenarios
- **Test everything**: Ensure all instructions and code examples work

### Markdown Best Practices

```markdown
---
title: Page Title
description: Brief description for SEO and search
sidebar_position: 1
---

# Page Title

Brief introduction explaining what this page covers.

## Main Section

Content with proper formatting:

- Use bullet points for lists
- Include code blocks with language specification
- Add descriptive alt text for images

```javascript title="example.js"
// Always include working code examples
function example() {
  return "Hello, World!";
}
```

## Subsection

More detailed content with [proper linking](./other-page.md).
```

### File Naming

- Use kebab-case: `user-management.md`
- Be descriptive: `installation-guide.md` not `install.md`
- Use `index.md` for section landing pages

### Linking Standards

- **Internal links**: Use relative paths `./other-page.md` or `../section/page.md`
- **Cross-section links**: Use the full relative path from docs root
- **External links**: Use full URLs and consider opening in new tabs for references

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit documentation files
   - Add new pages or sections
   - Update navigation if needed

3. **Test locally**
   ```bash
   just serve    # Development server
   just build    # Production build test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "docs: add user management guide"
   git push origin feature/your-feature-name
   ```

### Build Commands

| Command | Purpose |
|---------|---------|
| `just serve` | Start development server |
| `just build` | Build for production |
| `just clean` | Clear build cache |
| `yarn build` | Alternative build command |

### Quality Checks

Before submitting a PR, ensure:

- [ ] Local development server runs without errors
- [ ] Production build completes successfully
- [ ] All links work correctly
- [ ] Content follows style guidelines
- [ ] Code examples are tested
- [ ] Mobile responsiveness is verified

## 📋 Pull Request Process

1. **Use the PR template**: Fill out all relevant sections
2. **Provide context**: Explain what changed and why
3. **Include screenshots**: For UI changes or new pages
4. **Request review**: Tag relevant team members
5. **Address feedback**: Make requested changes promptly

### PR Checklist

- [ ] Descriptive title and detailed description
- [ ] All tests pass (build succeeds)
- [ ] Documentation follows style guidelines
- [ ] Breaking changes are documented
- [ ] Related issues are linked

## 🐛 Reporting Issues

Use our issue templates for:

- **Bug reports**: Site functionality problems
- **Documentation issues**: Content errors or improvements
- **Feature requests**: New functionality suggestions

Provide:
- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if relevant
- Browser and device information

## 📖 Documentation Types

### Platform Documentation (`docs-platform/`)
- Feature guides and tutorials
- Configuration instructions
- Best practices and workflows

### API Documentation (`docs-api/`)
- Endpoint references
- Authentication guides
- Code examples in multiple languages

### CLI Documentation (`docs-cli/`)
- Command references
- Installation guides
- Configuration examples

### SDK Documentation (`docs-sdk/`)
- Library references
- Integration guides
- Sample projects

## ✨ Writing Style Guide

### Voice and Tone
- **Professional but approachable**: Avoid jargon, explain technical terms
- **Helpful and encouraging**: Guide users to success
- **Consistent**: Use the same terms throughout

### Formatting Standards
- **Headings**: Use sentence case, not title case
- **Code**: Always specify language for syntax highlighting
- **Lists**: Use parallel structure and consistent formatting
- **Links**: Use descriptive text, not "click here"

### Code Examples
```javascript
// ✅ Good: Complete, working example
import { VantageClient } from '@vantage/sdk';

const client = new VantageClient({
  apiKey: 'your-api-key'
});

const clusters = await client.clusters.list();
console.log('Available clusters:', clusters);
```

```javascript
// ❌ Avoid: Incomplete or unclear examples
const result = api.get('/clusters');
```

## 🎯 Content Priorities

### High Priority
- Accuracy and completeness
- Clear navigation and discoverability
- Working code examples
- Mobile-friendly formatting

### Medium Priority
- Advanced use cases and examples
- Integration guides
- Performance optimizations
- Accessibility improvements

## 🔍 Review Guidelines

When reviewing PRs:

1. **Content accuracy**: Verify technical correctness
2. **Clarity**: Ensure content is easy to understand
3. **Completeness**: Check for missing information
4. **Consistency**: Maintain style and formatting standards
5. **Testing**: Verify examples and instructions work

## 📞 Getting Help

- **Documentation questions**: Open an issue with the documentation template
- **Technical problems**: Check existing issues or open a bug report
- **General discussion**: Use GitHub Discussions for broader topics

## 🎉 Recognition

Contributors are recognized through:
- GitHub contributor graphs
- Release notes acknowledgments
- Community highlights

Thank you for helping make Vantage documentation better for everyone!