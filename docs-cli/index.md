---
id: index
title: Vantage CLI
description: Command-line interface for managing Vantage HPC platform
slug: /
---

The Vantage Command-Line Interface (CLI) provides powerful tools for managing your High Performance Computing workloads directly from the terminal. Automate tasks, integrate with CI/CD pipelines, and manage resources efficiently.

## Getting Started

1. **[Installation](/cli/installation)** - Install the CLI on your system
2. **[Login](/cli/login)** - Authenticate with your Vantage account
3. **[Configuration](/cli/configuration)** - Configure profiles and preferences
4. **[Quickstart](/cli/quickstart)** - Run your first commands

## Key Features

### Job Management

- Submit jobs from the command line
- Monitor job status and logs
- Manage job templates and configurations
- Batch operations for multiple jobs

### Cluster Operations

- Query cluster information and status
- Deploy and configure clusters
- Scale resources up or down
- Monitor resource utilization

### Data Operations

- Upload and download files
- Sync directories with storage
- Manage data transfers
- Integration with cloud storage

### Team & Access Management

- Manage team members and permissions
- Switch between organization contexts
- Share resources across teams
- Audit access and activities

## Quick Commands

```bash
# Submit a job
vantage jobs submit my-job-template.yaml

# Check job status
vantage jobs status job-12345

# List available clusters
vantage clusters list

# Upload data
vantage storage upload /local/path /remote/path
```

## Advanced Usage

### Scripting & Automation

Use the CLI in scripts and automation workflows with JSON output format and exit codes for error handling.

### CI/CD Integration

Integrate with GitHub Actions, GitLab CI, Jenkins, and other CI/CD platforms for automated testing and deployment.

### Configuration Management

Manage multiple environments and organizations with profile-based configuration.

## Reference

- **[Command Reference](/cli/command-reference)** - Complete command documentation
- **[Configuration Guide](/cli/configuration)** - Setup and customization
- **[Examples & Recipes](https://github.com/omnivector-solutions/vantage-cli-examples)** - Common use cases

## Installation

The Vantage CLI is available for Linux, macOS, and Windows. Choose your preferred installation method:

- **Package managers** (recommended)
- **Binary downloads**
- **Docker container**
- **Build from source**

See the [installation guide](/cli/installation) for detailed instructions.
