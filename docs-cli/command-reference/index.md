---
id: command-reference
title: Command Reference
description: Complete reference for all Vantage CLI commands
---

Complete reference documentation for all Vantage CLI commands and options.

## Global Options

Available for all commands:

```text
--profile string      Configuration profile to use
--output string       Output format: table, json, yaml, csv (default "table")
--color string        Enable colored output: auto, always, never (default "auto")
--debug               Enable debug logging
--quiet               Suppress non-essential output
--help                Show help for command
--version             Show version information
```

## Authentication Commands

### `vantage login`

Authenticate with Vantage platform.

```bash
vantage login [flags]
```

**Flags:**
- `--no-browser` - Don't open browser for authentication
- `--service-account string` - Service account key file path
- `--service-account-env` - Use service account from environment variable

**Examples:**
```bash
vantage login
vantage login --no-browser
vantage login --service-account /path/to/key.json
```

### `vantage logout`

Remove stored authentication credentials.

```bash
vantage logout
```

### `vantage auth`

Manage authentication and view auth status.

**Subcommands:**
- `status` - Show authentication status
- `whoami` - Show current user information
- `refresh` - Refresh authentication token
- `permissions` - Show user permissions

```bash
vantage auth status
vantage auth whoami
vantage auth refresh
```

## Configuration Commands

### `vantage config`

Manage CLI configuration and profiles.

**Subcommands:**

#### `vantage config get <key>`

Get configuration value.

```bash
vantage config get organization
vantage config get --profile prod api-url
```

#### `vantage config set <key> <value>`

Set configuration value.

```bash
vantage config set organization "my-org"
vantage config set --profile staging api-url "https://staging.api.example.com"
```

#### `vantage config show`

Show all configuration values.

```bash
vantage config show
vantage config show --profile production
```

#### `vantage config create-profile <name>`

Create new configuration profile.

```bash
vantage config create-profile staging
```

#### `vantage config use-profile <name>`

Switch to configuration profile.

```bash
vantage config use-profile production
```

#### `vantage config list-profiles`

List all configuration profiles.

```bash
vantage config list-profiles
```

## Job Commands

### `vantage jobs`

Manage computational jobs.

**Subcommands:**

#### `vantage jobs list`

List jobs with optional filtering.

```bash
vantage jobs list [flags]
```

**Flags:**
- `--status string` - Filter by job status (pending, running, completed, failed)
- `--cluster string` - Filter by cluster name
- `--user string` - Filter by user
- `--limit int` - Limit number of results (default 20)
- `--all` - Show all jobs (no pagination)

**Examples:**
```bash
vantage jobs list
vantage jobs list --status running
vantage jobs list --cluster gpu-cluster --limit 50
```

#### `vantage jobs submit <template>`

Submit a new job from template.

```bash
vantage jobs submit <template> [flags]
```

**Flags:**
- `--cluster string` - Target cluster
- `--cpu string` - CPU resources (e.g., "2", "500m")
- `--memory string` - Memory resources (e.g., "4Gi", "1024Mi")
- `--gpu int` - Number of GPUs
- `--priority int` - Job priority (1-100)
- `--timeout duration` - Job timeout (e.g., "1h30m", "3600s")
- `--env stringArray` - Environment variables (KEY=VALUE)
- `--mount stringArray` - Volume mounts (src:dest)
- `--name string` - Override job name
- `--wait` - Wait for job completion
- `--no-validate` - Skip template validation

**Examples:**
```bash
vantage jobs submit ml-training.yaml
vantage jobs submit job.yaml --cluster gpu-cluster --cpu 4 --memory 8Gi
vantage jobs submit job.yaml --env MODEL_TYPE=bert --env EPOCHS=10
vantage jobs submit job.yaml --wait
```

#### `vantage jobs get <job-id>`

Get detailed job information.

```bash
vantage jobs get <job-id>
```

#### `vantage jobs status <job-id>`

Get job status and basic information.

```bash
vantage jobs status <job-id>
```

#### `vantage jobs logs <job-id>`

Get job logs.

```bash
vantage jobs logs <job-id> [flags]
```

**Flags:**
- `--follow, -f` - Follow log output
- `--tail int` - Number of lines from end (default 100)
- `--since duration` - Show logs since time (e.g., "1h", "30m")
- `--timestamps` - Include timestamps

**Examples:**
```bash
vantage jobs logs job-12345
vantage jobs logs job-12345 --follow
vantage jobs logs job-12345 --tail 500 --timestamps
```

#### `vantage jobs cancel <job-id>`

Cancel a running job.

```bash
vantage jobs cancel <job-id>
```

#### `vantage jobs outputs <job-id>`

Manage job output files.

```bash
vantage jobs outputs <job-id> [flags]
```

**Flags:**
- `--download string` - Download outputs to directory
- `--list` - List available outputs

**Examples:**
```bash
vantage jobs outputs job-12345 --list
vantage jobs outputs job-12345 --download ./results/
```

#### `vantage jobs wait <job-id>`

Wait for job completion.

```bash
vantage jobs wait <job-id> [flags]
```

**Flags:**
- `--timeout duration` - Maximum wait time
- `--interval duration` - Status check interval (default 5s)

## Cluster Commands

### `vantage clusters`

Manage compute clusters.

**Subcommands:**

#### `vantage clusters list`

List available clusters.

```bash
vantage clusters list [flags]
```

**Flags:**
- `--status string` - Filter by cluster status
- `--provider string` - Filter by cloud provider
- `--region string` - Filter by region

#### `vantage clusters get <cluster-name>`

Get detailed cluster information.

```bash
vantage clusters get <cluster-name>
```

#### `vantage clusters status <cluster-name>`

Get cluster status and metrics.

```bash
vantage clusters status <cluster-name> [flags]
```

**Flags:**
- `--watch, -w` - Watch for status changes

#### `vantage clusters scale <cluster-name>`

Scale cluster resources.

```bash
vantage clusters scale <cluster-name> [flags]
```

**Flags:**
- `--nodes int` - Set number of nodes
- `--min-nodes int` - Set minimum nodes for autoscaling
- `--max-nodes int` - Set maximum nodes for autoscaling

**Examples:**
```bash
vantage clusters scale my-cluster --nodes 10
vantage clusters scale my-cluster --min-nodes 2 --max-nodes 20
```

#### `vantage clusters events <cluster-name>`

Show cluster events and history.

```bash
vantage clusters events <cluster-name> [flags]
```

**Flags:**
- `--since duration` - Show events since time
- `--follow, -f` - Follow new events

## Storage Commands

### `vantage storage`

Manage data and file operations.

**Subcommands:**

#### `vantage storage list <path>`

List files and directories.

```bash
vantage storage list <path> [flags]
```

**Flags:**
- `--recursive, -r` - List recursively
- `--long, -l` - Show detailed information
- `--human-readable, -h` - Human-readable file sizes

**Examples:**
```bash
vantage storage list /datasets/
vantage storage list /datasets/ --recursive --long
```

#### `vantage storage upload <local-path> <remote-path>`

Upload files or directories.

```bash
vantage storage upload <local-path> <remote-path> [flags]
```

**Flags:**
- `--recursive, -r` - Upload directories recursively
- `--progress` - Show upload progress
- `--resume` - Resume interrupted uploads
- `--exclude string` - Exclude pattern
- `--parallel int` - Number of parallel transfers (default 4)

**Examples:**
```bash
vantage storage upload file.txt /datasets/
vantage storage upload ./data/ /datasets/project/ --recursive --progress
vantage storage upload large-file.tar.gz /datasets/ --resume
```

#### `vantage storage download <remote-path> <local-path>`

Download files or directories.

```bash
vantage storage download <remote-path> <local-path> [flags]
```

**Flags:**
- `--recursive, -r` - Download directories recursively
- `--progress` - Show download progress
- `--resume` - Resume interrupted downloads
- `--parallel int` - Number of parallel transfers

**Examples:**
```bash
vantage storage download /datasets/results.csv ./
vantage storage download /datasets/outputs/ ./results/ --recursive
```

#### `vantage storage sync <source> <destination>`

Synchronize directories.

```bash
vantage storage sync <source> <destination> [flags]
```

**Flags:**
- `--delete` - Delete files in destination not in source
- `--dry-run` - Show what would be transferred
- `--exclude string` - Exclude pattern

**Examples:**
```bash
vantage storage sync ./local-data/ /datasets/project/
vantage storage sync /datasets/backup/ ./backup/ --delete
```

#### `vantage storage delete <path>`

Delete files or directories.

```bash
vantage storage delete <path> [flags]
```

**Flags:**
- `--recursive, -r` - Delete directories recursively
- `--force, -f` - Don't prompt for confirmation

#### `vantage storage info <path>`

Get file or directory information.

```bash
vantage storage info <path>
```

## Organization Commands

### `vantage orgs`

Manage organizations.

**Subcommands:**

#### `vantage orgs list`

List accessible organizations.

```bash
vantage orgs list
```

#### `vantage orgs current`

Show current organization.

```bash
vantage orgs current
```

#### `vantage orgs switch <org-id>`

Switch to different organization.

```bash
vantage orgs switch my-other-org
```

## Team Commands

### `vantage teams`

Manage team collaboration.

**Subcommands:**

#### `vantage teams members list`

List team members.

```bash
vantage teams members list
```

#### `vantage teams members invite <email>`

Invite team member.

```bash
vantage teams members invite user@example.com [flags]
```

**Flags:**
- `--role string` - Member role (viewer, developer, admin)
- `--team string` - Specific team to invite to

#### `vantage teams members update <email>`

Update team member.

```bash
vantage teams members update user@example.com [flags]
```

**Flags:**
- `--role string` - New member role

## Resource Commands

### `vantage resources`

View and manage resources.

**Subcommands:**

#### `vantage resources list`

List available resources.

```bash
vantage resources list [flags]
```

**Flags:**
- `--type string` - Resource type filter
- `--cluster string` - Cluster filter

#### `vantage resources usage`

Show resource usage statistics.

```bash
vantage resources usage [flags]
```

**Flags:**
- `--cluster string` - Specific cluster
- `--since duration` - Usage since time period

## Template Commands

### `vantage templates`

Manage job templates.

**Subcommands:**

#### `vantage templates list`

List available job templates.

```bash
vantage templates list
```

#### `vantage templates get <template-name>`

Get template definition.

```bash
vantage templates get <template-name>
```

#### `vantage templates validate <template-file>`

Validate template syntax.

```bash
vantage templates validate job-template.yaml
```

## Examples and Common Patterns

### Job Workflow

```bash
# Submit and monitor a job
JOB_ID=$(vantage jobs submit ml-training.yaml --output json | jq -r '.id')
vantage jobs wait $JOB_ID
vantage jobs outputs $JOB_ID --download ./results/
```

### Batch Operations

```bash
# Submit multiple jobs
for template in templates/*.yaml; do
    vantage jobs submit "$template"
done

# Cancel all running jobs
vantage jobs list --status running --output json | \
    jq -r '.[] | .id' | \
    xargs -I {} vantage jobs cancel {}
```

### Data Management

```bash
# Upload data with progress
vantage storage upload ./dataset/ /datasets/project/ --recursive --progress

# Download results from completed jobs
vantage jobs list --status completed --output json | \
    jq -r '.[] | .id' | \
    xargs -I {} vantage jobs outputs {} --download ./all-results/{}
```

### Configuration Management

```bash
# Set up development environment
vantage config create-profile dev
vantage config set --profile dev api-url "https://dev-api.example.com"
vantage config set --profile dev output-format json

# Switch between environments
vantage config use-profile dev    # Development
vantage config use-profile prod   # Production
```
