---
id: quickstart
title: Quickstart
description: Get started with the Vantage CLI
---

This quickstart guide will help you run your first commands with the Vantage CLI and demonstrate key workflows.

## Prerequisites

- [Installed](/cli/installation) Vantage CLI
- [Authenticated](/cli/login) with your Vantage account
- Access to at least one organization

## First Steps

### Check Your Setup

```bash
# Verify CLI installation
vantage --version

# Check authentication status
vantage auth status

# View your user information
vantage auth whoami
```

### Explore Your Environment

```bash
# List available organizations
vantage orgs list

# View your current organization
vantage orgs current

# List clusters in your organization
vantage clusters list

# Check available resources
vantage resources list
```

## Basic Job Workflow

### 1. Create a Simple Job Template

Create a file named `hello-world-job.yaml`:

```yaml
apiVersion: v1
kind: JobTemplate
metadata:
  name: hello-world
  description: Simple hello world job
spec:
  image: ubuntu:22.04
  command: ["echo", "Hello from Vantage!"]
  resources:
    cpu: 1
    memory: 1Gi
  timeout: 300s
```

### 2. Submit the Job

```bash
# Submit job from template file
vantage jobs submit hello-world-job.yaml

# Submit with custom parameters
vantage jobs submit hello-world-job.yaml --cpu 2 --memory 2Gi

# Submit to specific cluster
vantage jobs submit hello-world-job.yaml --cluster my-cluster
```

### 3. Monitor Job Status

```bash
# List all jobs
vantage jobs list

# Get specific job details
vantage jobs get job-12345

# Watch job status in real-time
vantage jobs watch job-12345

# Get job logs
vantage jobs logs job-12345
```

### 4. Manage Job Results

```bash
# Download job outputs
vantage jobs outputs job-12345 --download ./outputs/

# List job artifacts
vantage jobs artifacts job-12345

# Cancel a running job
vantage jobs cancel job-12345
```

## Working with Data

### Upload Data

```bash
# Upload a single file
vantage storage upload local-file.txt /datasets/

# Upload directory
vantage storage upload ./data/ /datasets/my-project/

# Upload with progress and resumable transfers
vantage storage upload large-dataset.tar.gz /datasets/ --resume --progress
```

### Download Data

```bash
# Download a file
vantage storage download /datasets/results.csv ./

# Download directory
vantage storage download /datasets/outputs/ ./results/

# Sync directories
vantage storage sync /datasets/project/ ./local-project/
```

### Manage Storage

```bash
# List files and directories
vantage storage list /datasets/

# Get file information
vantage storage info /datasets/large-file.dat

# Delete files
vantage storage delete /datasets/old-data.csv
```

## Cluster Management

### List and Monitor Clusters

```bash
# List all clusters
vantage clusters list

# Get cluster details
vantage clusters get my-cluster

# Monitor cluster resources
vantage clusters status my-cluster --watch

# View cluster events
vantage clusters events my-cluster
```

### Scale Clusters

```bash
# Scale cluster up
vantage clusters scale my-cluster --nodes 10

# Scale cluster down
vantage clusters scale my-cluster --nodes 2

# Auto-scale based on workload
vantage clusters autoscale my-cluster --min-nodes 1 --max-nodes 20
```

## Team Collaboration

### Manage Team Members

```bash
# List team members
vantage teams members list

# Invite a team member
vantage teams members invite user@example.com --role developer

# Update member role
vantage teams members update user@example.com --role admin
```

### Share Resources

```bash
# Share a job template
vantage jobs templates share hello-world --team development

# Share storage location
vantage storage share /datasets/shared/ --team research --permission read

# List shared resources
vantage resources shared list
```

## Advanced Workflows

### Batch Operations

```bash
# Submit multiple jobs
vantage jobs submit-batch job-templates/*.yaml

# Cancel multiple jobs
vantage jobs cancel --batch --status running

# Download all job outputs
vantage jobs outputs --all --download ./all-outputs/
```

### Pipeline Management

```bash
# Create a job pipeline
vantage pipelines create ml-pipeline.yaml

# Start pipeline execution
vantage pipelines run ml-pipeline

# Monitor pipeline progress
vantage pipelines status pipeline-456 --watch
```

### Resource Monitoring

```bash
# Monitor resource usage
vantage resources usage --cluster my-cluster

# Get cost analysis
vantage billing usage --last-month

# Set resource alerts
vantage alerts create --resource-threshold 80% --cluster my-cluster
```

## Automation Examples

### Simple Job Submission Script

```bash
#!/bin/bash
set -e

# Submit job and get job ID
JOB_ID=$(vantage jobs submit ml-training.yaml --output json | jq -r '.id')

echo "Submitted job: $JOB_ID"

# Wait for completion
vantage jobs wait $JOB_ID

# Download results
vantage jobs outputs $JOB_ID --download ./results/

echo "Job completed and results downloaded"
```

### Daily Data Sync

```bash
#!/bin/bash
# Sync daily data to Vantage storage

DATE=$(date +%Y-%m-%d)
LOCAL_DIR="./daily-data/$DATE"
REMOTE_DIR="/datasets/daily/$DATE"

# Upload today's data
vantage storage upload "$LOCAL_DIR" "$REMOTE_DIR" --recursive

# Clean up old data (keep last 30 days)
vantage storage cleanup /datasets/daily/ --older-than 30d

echo "Data sync completed for $DATE"
```

## Output Formatting

### Table Output (Default)

```bash
vantage jobs list
```

### JSON Output

```bash
vantage jobs list --output json
vantage jobs get job-12345 --output json | jq '.status'
```

### Custom Formatting

```bash
# Custom table columns
vantage jobs list --columns id,name,status,created

# Filter and format
vantage jobs list --status running --output json | jq '.[] | {id, name}'
```

## Getting Help

### Command Help

```bash
# General help
vantage --help

# Command-specific help
vantage jobs --help
vantage jobs submit --help

# Show available subcommands
vantage jobs
```

### Debugging

```bash
# Enable debug output
vantage --debug jobs list

# Verbose HTTP logging
vantage --log-level debug jobs submit template.yaml

# Check configuration
vantage config show
```

## Next Steps

Now that you've completed the quickstart:

1. **[Command Reference](/cli/command-reference)** - Explore all available commands
2. **[Configuration](/cli/configuration)** - Customize your CLI experience
3. **[Advanced Examples](https://github.com/omnivector-solutions/vantage-cli-examples)** - See more complex workflows

## Common Patterns

### Error Handling in Scripts

```bash
#!/bin/bash
set -e

if ! vantage auth status > /dev/null 2>&1; then
    echo "Not authenticated. Please run: vantage login"
    exit 1
fi

# Your commands here
vantage jobs submit template.yaml || {
    echo "Failed to submit job"
    exit 1
}
```

### Configuration for Different Environments

```bash
# Development
vantage config create-profile dev
vantage config set --profile dev api-url "https://dev-api.vantage.example.com"

# Production  
vantage config create-profile prod
vantage config set --profile prod api-url "https://api.vantage.omnivector.solutions"

# Switch between environments
vantage config use-profile dev
vantage config use-profile prod
```
