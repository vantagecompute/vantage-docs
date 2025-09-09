---
id: login
title: Login & Authentication
description: Authenticate with your Vantage account
---

The Vantage CLI supports multiple authentication methods to securely access your account and resources.

## Interactive Login

The easiest way to authenticate is through interactive login:

```bash
vantage login
```

This will:

1. Open your web browser to the Vantage login page
2. Prompt you to sign in with your credentials
3. Automatically configure the CLI with your access token

### Browser-less Login

If you're on a headless system without a browser:

```bash
vantage login --no-browser
```

This will display a URL and code that you can enter on another device.

## API Key Authentication

For automation and CI/CD environments, use API keys:

### Creating an API Key

1. Log in to the [Vantage Dashboard](https://app.vantage.omnivector.solutions)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy the key and store it securely

### Using API Keys

```bash
# Set the API key as an environment variable
export VANTAGE_API_KEY="your-api-key-here"

# Or configure it directly
vantage config set api-key "your-api-key-here"
```

### Environment Variables

The CLI recognizes these environment variables:

```bash
export VANTAGE_API_KEY="your-api-key"           # API key
export VANTAGE_API_URL="https://api.vantage.omnivector.solutions"  # API endpoint
export VANTAGE_ORG="your-org-id"               # Default organization
export VANTAGE_PROFILE="production"            # Configuration profile
```

## Service Account Authentication

For server-to-server authentication:

```bash
# Using a service account key file
vantage login --service-account /path/to/service-account.json

# Using environment variables
export VANTAGE_SERVICE_ACCOUNT_KEY="$(cat service-account.json)"
vantage login --service-account-env
```

## Multiple Organizations

If you belong to multiple organizations:

```bash
# List available organizations
vantage orgs list

# Switch organizations
vantage org switch my-other-org

# Use a specific org for one command
vantage --org my-other-org jobs list
```

## Configuration Profiles

Manage multiple environments with profiles:

```bash
# Create a new profile
vantage config create-profile staging

# Switch profiles
vantage config use-profile staging

# List profiles
vantage config list-profiles

# Set profile-specific configuration
vantage config set --profile staging api-url "https://staging-api.vantage.omnivector.solutions"
```

## Token Management

### Check Authentication Status

```bash
vantage auth status
```

### View Token Information

```bash
vantage auth whoami
```

### Refresh Token

```bash
vantage auth refresh
```

### Logout

```bash
vantage logout
```

This removes stored credentials and tokens.

## Troubleshooting

### Invalid Credentials

If you get authentication errors:

```bash
# Clear stored credentials
vantage logout

# Login again
vantage login
```

### Token Expired

```bash
# Refresh your token
vantage auth refresh

# Or re-authenticate
vantage login
```

### Permission Denied

Ensure your account has the necessary permissions:

```bash
# Check your permissions
vantage auth permissions

# Contact your organization admin if needed
```

### Network Issues

For corporate networks with proxies:

```bash
# Configure proxy
vantage config set proxy "http://proxy.company.com:8080"

# Skip SSL verification (development only)
vantage config set insecure-skip-verify true
```

## Security Best Practices

### API Key Security

- Never commit API keys to version control
- Use environment variables or secure credential stores
- Rotate keys regularly
- Use least-privilege access

### Multi-Factor Authentication

Enable MFA on your Vantage account for additional security.

### Session Management

- Use `vantage logout` on shared systems
- Set appropriate token expiration policies
- Monitor active sessions in the dashboard

## Next Steps

1. **[Configuration](/cli/configuration)** - Customize CLI settings
2. **[Quickstart](/cli/quickstart)** - Run your first commands
3. **[Command Reference](/cli/command-reference)** - Explore all available commands
