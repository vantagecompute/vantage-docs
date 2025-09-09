---
id: configuration
title: Configuration
description: Configure the Vantage CLI for your environment
---

The Vantage CLI uses a configuration system that supports multiple profiles, environments, and customization options.

## Configuration File

The CLI stores configuration in `~/.vantage/config.yaml`:

```yaml
current_profile: default
profiles:
  default:
    api_url: https://api.vantage.omnivector.solutions
    organization: my-org
    output_format: table
    timeout: 30s
  staging:
    api_url: https://staging-api.vantage.omnivector.solutions
    organization: staging-org
    output_format: json
```

## Basic Configuration

### Set Configuration Values

```bash
# Set the default organization
vantage config set organization "my-org"

# Set output format
vantage config set output-format json

# Set API timeout
vantage config set timeout 60s

# Set custom API endpoint
vantage config set api-url "https://custom.vantage.omnivector.solutions"
```

### View Configuration

```bash
# Show all configuration
vantage config show

# Show specific value
vantage config get organization

# List all available settings
vantage config list
```

## Profiles

Profiles allow you to manage multiple environments and organizations.

### Create and Manage Profiles

```bash
# Create a new profile
vantage config create-profile production

# Switch to a profile
vantage config use-profile production

# List all profiles
vantage config list-profiles

# Delete a profile
vantage config delete-profile old-profile
```

### Profile-Specific Configuration

```bash
# Set configuration for specific profile
vantage config set --profile production organization "prod-org"
vantage config set --profile staging organization "staging-org"

# Use a profile for a single command
vantage --profile production jobs list
```

## Output Formats

Configure how command output is displayed:

```bash
# Table format (default)
vantage config set output-format table

# JSON format
vantage config set output-format json

# YAML format
vantage config set output-format yaml

# CSV format (for list commands)
vantage config set output-format csv
```

### Per-Command Output

Override output format for individual commands:

```bash
vantage jobs list --output json
vantage clusters status --output yaml
```

## Environment Variables

Override configuration with environment variables:

```bash
export VANTAGE_API_URL="https://api.vantage.omnivector.solutions"
export VANTAGE_ORG="my-organization"
export VANTAGE_OUTPUT_FORMAT="json"
export VANTAGE_TIMEOUT="60s"
export VANTAGE_PROFILE="production"
```

## Advanced Configuration

### Custom Headers

Add custom HTTP headers for all requests:

```bash
vantage config set headers.X-Custom-Header "my-value"
vantage config set headers.X-Request-ID "auto"  # Auto-generate request IDs
```

### Proxy Configuration

```bash
# HTTP proxy
vantage config set proxy "http://proxy.company.com:8080"

# HTTPS proxy
vantage config set https-proxy "https://proxy.company.com:8443"

# No proxy for specific hosts
vantage config set no-proxy "localhost,127.0.0.1,.company.com"
```

### SSL/TLS Settings

```bash
# Skip SSL verification (development only)
vantage config set insecure-skip-verify true

# Custom CA certificate bundle
vantage config set ca-bundle "/path/to/ca-bundle.pem"

# Client certificate authentication
vantage config set client-cert "/path/to/client.pem"
vantage config set client-key "/path/to/client-key.pem"
```

### Logging

```bash
# Set log level
vantage config set log-level debug  # debug, info, warn, error

# Log to file
vantage config set log-file "/var/log/vantage-cli.log"

# Enable request/response logging
vantage config set log-requests true
```

## Configuration Reference

### Core Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `api-url` | Vantage API endpoint | `https://api.vantage.omnivector.solutions` |
| `organization` | Default organization ID | None |
| `output-format` | Output format (table, json, yaml, csv) | `table` |
| `timeout` | Request timeout | `30s` |

### Authentication

| Setting | Description | Default |
|---------|-------------|---------|
| `api-key` | API key for authentication | None |
| `token-file` | Path to token file | `~/.vantage/token` |

### Display Options

| Setting | Description | Default |
|---------|-------------|---------|
| `color` | Enable colored output | `auto` |
| `pager` | Use pager for long output | `auto` |
| `table-format` | Table format (simple, grid, fancy) | `simple` |

### Network Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `proxy` | HTTP proxy URL | None |
| `https-proxy` | HTTPS proxy URL | None |
| `no-proxy` | Hosts to bypass proxy | None |
| `insecure-skip-verify` | Skip SSL verification | `false` |

## Configuration Templates

### Development Environment

```bash
vantage config create-profile dev
vantage config set --profile dev api-url "http://localhost:8080"
vantage config set --profile dev insecure-skip-verify true
vantage config set --profile dev output-format json
vantage config set --profile dev log-level debug
```

### Production Environment

```bash
vantage config create-profile prod
vantage config set --profile prod organization "production-org"
vantage config set --profile prod output-format table
vantage config set --profile prod timeout 60s
vantage config set --profile prod log-level warn
```

### CI/CD Environment

```bash
vantage config create-profile ci
vantage config set --profile ci output-format json
vantage config set --profile ci color false
vantage config set --profile ci pager false
vantage config set --profile ci timeout 120s
```

## Import/Export Configuration

### Export Configuration

```bash
# Export current profile
vantage config export > my-config.yaml

# Export specific profile
vantage config export --profile production > prod-config.yaml
```

### Import Configuration

```bash
# Import configuration
vantage config import my-config.yaml

# Import to specific profile
vantage config import --profile imported prod-config.yaml
```

## Reset Configuration

```bash
# Reset current profile to defaults
vantage config reset

# Reset specific setting
vantage config unset organization

# Delete configuration file
rm ~/.vantage/config.yaml
```

## Next Steps

1. **[Quickstart](/cli/quickstart)** - Run your first commands
2. **[Command Reference](/cli/command-reference)** - Explore all available commands
