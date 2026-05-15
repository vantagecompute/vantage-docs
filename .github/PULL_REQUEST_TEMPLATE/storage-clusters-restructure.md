## Description

Restructure the Clusters and Storage documentation sections, replacing outdated tutorials with a modular "get-started → concepts → how-to guides" structure. Removes deprecated references to BuzzHPC, CUDO Compute, and Responsible Compute. Adds practical how-to guides for AWS, Azure, GCP, on-premises, and partner cluster provisioning, as well as PVC, NFS, and CephFS storage configuration.

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [x] 📝 Documentation update (improvements or corrections to documentation content)
- [ ] 🎨 Style/formatting change (non-functional changes)
- [ ] ♻️ Code refactoring (non-functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🔧 Configuration change

## Documentation Section

- [ ] Platform Overview
- [x] Platform Documentation
- [ ] API Documentation
- [ ] CLI Documentation
- [ ] SDK Documentation
- [ ] Getting Started
- [ ] Site Infrastructure/Configuration

## Changes Made

Restructure the Clusters and Storage documentation sections from tutorial-heavy format to a task-oriented structure with get-started, concepts, and how-to guides. Remove outdated tutorials referencing decommissioned partner platforms.

### Added

- **Storage section**: new concepts, get-started, and how-to guides for PVCs (`docs/platform/storage/how-to-guides/pvcs.mdx`), NFS (`docs/platform/storage/how-to-guides/nfs.mdx`), and CephFS (`docs/platform/storage/how-to-guides/cephfs.mdx`)
- **Clusters section**: new concepts (`docs/platform/clusters/concepts.mdx`), get-started (`docs/platform/clusters/get-started.mdx`), and provider-specific how-to guides for AWS, Azure, GCP, on-premises, and partner clusters under `docs/platform/clusters/how-to-guides/`
- **Sidebar**: explicit navigation structure for both storage and clusters sections in `sidebars-main.js`

### Changed

- `docs/platform/storage/index.md` — rewritten from high-level overview to concise landing page with links to get-started, concepts, and how-to guides
- `docs/platform/clusters/index.md` — rewritten to match new task-oriented structure
- `docs/platform/clusters/how-to-guides/index.md` — updated to reference the new provider-specific guides

### Removed

- Outdated tutorials under `docs/platform/clusters/tutorials/` for on-premise, AWS, Azure, GCP, ATNorth, BuzzHPC, CUDO Compute, and Responsible Compute (59 files, ~5041 lines removed)
- Empty stub directories and index pages for deleted tutorial sections
- Empty reference index pages for both storage and clusters sections

### Fixed

- Removed references to decommissioned/outdated partner platforms (BuzzHPC, CUDO Compute, Responsible Compute)

## Testing Checklist

- [x] Local development server runs without errors (`just serve`)
- [x] Production build completes successfully (`just build`)
- [x] All internal links are functional
- [x] New content follows markdown/MDX standards
- [x] Content is responsive on mobile devices
- [x] Search functionality works for new content (if applicable)
- [x] No broken links or missing images
- [ ] Code examples have been tested (if applicable)

## Content Quality Checklist

- [x] Content follows the established writing style and tone
- [x] Technical accuracy has been verified
- [x] Examples are complete and functional
- [x] Appropriate headings and structure used
- [x] Links use relative paths where possible
- [ ] Images have descriptive alt text
- [x] Content is accessible and inclusive

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## Related Issues

<!-- Link to any related issues using "Fixes #issue-number" or "Relates to #issue-number" -->

## Additional Notes

Build and link validation not yet performed — recommended before merge. The `just build` command syncs CLI docs from a private submodule and requires that to be available.

## Reviewer Guidelines

- [ ] Content accuracy and completeness
- [ ] Technical implementation correctness
- [ ] Consistency with existing documentation
- [ ] Proper formatting and structure
- [ ] Mobile responsiveness (if UI changes)
- [ ] Build process verification
