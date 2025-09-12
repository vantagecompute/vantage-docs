---
id: command-reference
title: Command Reference
description: Current Vantage CLI command reference (synced 2025-09-11)
---

This page documents the commands currently exposed by the installed Vantage CLI (captured from `vantage --help` on 2025-09-11).

If something seems missing, first check your version:

```bash
vantage --version
```

## Global Options

```text
--verbose, -v          Enable verbose output
--profile, -p TEXT     Specify the profile to use
--json, -j             Output in JSON format
--version              Show version and exit
--install-completion   Install shell completion
--show-completion      Show completion script
--help                 Show this message and exit
```

## Top-Level Commands

| Command | Purpose |
|---------|---------|
| login   | Authenticate and obtain a token |
| logout  | Clear saved user credentials |
| whoami  | Show current authenticated user |
| cloud   | Manage cloud provider configurations |
| cluster | Manage compute clusters & federations |
| config  | Clear cached config & tokens |
| license | Manage licensing resources (server/product/config/deployment) |
| network | Manage virtual networks & interfaces |
| profile | Manage CLI profiles |
| storage | Manage storage volumes |
| app     | List / deploy applications |

## Command Groups

### Authentication

Commands: `login`, `logout`, `whoami`

### Cloud

Subcommands: `add`, `get`, `list`, `update`, `delete`

### Cluster

Subcommands: `create`, `get`, `list`, `delete`, `federation`

Federation subcommands: `create`, `get`, `list`, `update`, `delete`

### Config

Subcommand: `clear`

### Profile

Subcommands: `create`, `get`, `list`, `use`, `delete`

### License

Resource groups (each supports `create`, `get`, `list`, `update`, `delete`): `server`, `product`, `configuration`, `deployment`

### Network

Subcommands: `create`, `get`, `list`, `update`, `delete`, `attach`, `detach`

### Storage

Subcommands: `create`, `get`, `list`, `update`, `delete`, `attach`, `detach`

### Applications

Subcommands: `list`, `deploy`

## Examples

```bash
vantage login
vantage cluster list
vantage license server list
vantage app deploy slurm --cluster hpc-prod
```

## Version & Tooling

```bash
vantage --version
vantage --install-completion
```

List commands programmatically:

```bash
vantage --json --help 2>&1 | grep -i usage || true
```

Last synchronized: 2025-09-11
