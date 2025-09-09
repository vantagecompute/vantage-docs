
---
title: Vantage Docs
description: Official documentation site for Vantage HPC
---

# Vantage Docs

Vantage Docs is the official documentation site for Vantage HPC, built with [Docusaurus 2](https://docusaurus.io/), a modern static website generator. This project provides comprehensive guides, references, and resources for users and developers of Vantage HPC.

## Table of Contents

- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Building the Site](#building-the-site)
- [Versioning](#versioning)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 16.14
- [Yarn](https://yarnpkg.com/) (recommended) or npm

### Installation

```bash
yarn install
```

This command installs all dependencies required to build and run the documentation site.

## Local Development

To start a local development server and open the site in your browser:

```bash
yarn start
```

Most changes are reflected live without needing to restart the server.

## Building the Site

To generate static content for production:

```bash
yarn build
```

The static files will be output to the `build` directory. You can serve these files using any static content hosting service.


## Versioning

**Versioning has been disabled.**

This documentation site now maintains a single, always up-to-date version. All content updates are immediately reflected in the live docs. Historical versions are no longer maintained or accessible from the site.

## Deployment

Deployment is managed via a GitHub dispatch action that deploys the CloudFormation stack. To synthesize the stack locally:

### Deploy to Staging

```bash
yarn global add aws-cdk@^2.79.1 # Only if you don't have CDK installed
cdk synth VantageStagingDocsWebsite
```

### Deploy to Production

```bash
yarn global add aws-cdk@^2.79.1 # Only if you don't have CDK installed
cdk synth VantageDocsWebsite
```

> **Warning**
> Do not deploy the stack locally without general agreement between the PFT members.

## Project Structure

```text
├── blog/                # Blog posts and related assets
├── build/               # Generated static site (after build)
├── docs/                # Main documentation content (Markdown/MDX)
├── src/                 # Custom React components, CSS, and pages
├── static/              # Static assets (images, fonts, etc.)
├── docusaurus.config.js # Docusaurus site configuration
├── package.json         # Project metadata and scripts
└── README.md            # This file
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository and create a new branch for your feature or fix.
2. Make your changes, following the existing code style and structure.
3. Update or add documentation as needed.
4. Submit a pull request with a clear description of your changes.

For spelling and terminology, see `.cspell.yaml` and `.cspell/omnivector-dictionary.txt`.

## License

© Omnivector, LLC - All Rights Reserved.
