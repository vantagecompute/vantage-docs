---
title: "Vantage CLI - Overview"
description: "Authenticate, manage profiles & clusters, deploy apps, and run GraphQL queries against Vantage Compute"
---

## The unified command-line interface for Vantage Compute

Vantage CLI is a modern async Python tool that unifies authentication, profile management, cluster operations and GraphQL querying against the Vantage Compute platform.


### Quick Start

Install from pypi:

```bash
uv venv
source .venv/bin/activate

uv pip install vantage-cli
```

Or from source:

```shell-session
git clone https://github.com/vantagecompute/vantage-cli
cd vantage-cli
uv sync
uv run vantage --help
```

#### Authenticate

Authenticate against the Vantage platform using the `login` command.

```bash
vantage login
```

#### Create a Multipass Singlenode Cluster

```bash
vantage cluster create my-slurm-multipass-cluster \
    --cloud localhost \
    --app slurm-multipass-localhost
```

#### Create a Slurm Cluster in LXD Containers using Juju

```bash
vantage cluster create my-slurm-lxd-cluster \
    --cloud localhost \
    --app slurm-juju-localhost
```

#### Create a Slurm Cluster on MicroK8S

```bash
vantage cluster create my-slurm-microk8s-cluster \
    --cloud localhost \
    --app slurm-microk8s-localhost
```

### Next Steps

- [Installation Guide](/reference/cli/installation) – Install & Configure
- [Commands Reference](/reference/cli/commands) – Complete Command Reference
- [Private Installation Configuration](/reference/cli/private-vantage-installation) – Partner Vantage Deployment CLI Profile Configuration
- [Notebooks](/reference/cli/notebooks) – Jupyterhub Notebook Server Lifecycle
- [Deployment Applications](/reference/cli/deployment-applications) – Slurm Deployment Automation
- [Usage Examples](/reference/cli/usage) – Practical Command Patterns
- [Architecture](/reference/cli/architecture) – Internals & Module Layout
- [Troubleshooting](/reference/cli/troubleshooting) – Common Issues and Solutions
