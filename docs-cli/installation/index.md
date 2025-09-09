---
id: installation
title: Installation
description: Install the Vantage CLI on your system
---

The Vantage CLI is available for Linux, macOS, and Windows. Choose your preferred installation method below.

## Package Managers (Recommended)

### Homebrew (macOS/Linux)

```bash
brew tap omnivector-solutions/vantage
brew install vantage-cli
```

### APT (Ubuntu/Debian)

```bash
curl -fsSL https://pkg.vantage.omnivector.solutions/gpg | sudo apt-key add -
echo "deb https://pkg.vantage.omnivector.solutions/apt stable main" | sudo tee /etc/apt/sources.list.d/vantage.list
sudo apt update
sudo apt install vantage-cli
```

### YUM/DNF (RHEL/CentOS/Fedora)

```bash
sudo rpm --import https://pkg.vantage.omnivector.solutions/gpg
sudo tee /etc/yum.repos.d/vantage.repo <<EOF
[vantage]
name=Vantage CLI Repository
baseurl=https://pkg.vantage.omnivector.solutions/rpm
enabled=1
gpgcheck=1
EOF
sudo yum install vantage-cli  # or sudo dnf install vantage-cli
```

### Chocolatey (Windows)

```powershell
choco install vantage-cli
```

### Scoop (Windows)

```powershell
scoop bucket add omnivector https://github.com/omnivector-solutions/scoop-bucket
scoop install vantage-cli
```

## Binary Downloads

Download the latest release for your platform:

### Linux

```bash
# x86_64
curl -LO https://github.com/omnivector-solutions/vantage-cli/releases/latest/download/vantage-linux-amd64
chmod +x vantage-linux-amd64
sudo mv vantage-linux-amd64 /usr/local/bin/vantage

# ARM64
curl -LO https://github.com/omnivector-solutions/vantage-cli/releases/latest/download/vantage-linux-arm64
chmod +x vantage-linux-arm64
sudo mv vantage-linux-arm64 /usr/local/bin/vantage
```

### macOS

```bash
# Intel
curl -LO https://github.com/omnivector-solutions/vantage-cli/releases/latest/download/vantage-darwin-amd64
chmod +x vantage-darwin-amd64
sudo mv vantage-darwin-amd64 /usr/local/bin/vantage

# Apple Silicon
curl -LO https://github.com/omnivector-solutions/vantage-cli/releases/latest/download/vantage-darwin-arm64
chmod +x vantage-darwin-arm64
sudo mv vantage-darwin-arm64 /usr/local/bin/vantage
```

### Windows

Download the Windows executable from the [releases page](https://github.com/omnivector-solutions/vantage-cli/releases/latest) and add it to your PATH.

## Docker

Run the CLI in a Docker container:

```bash
# Run a single command
docker run --rm omnivector/vantage-cli:latest vantage --version

# Interactive shell with mounted config
docker run -it --rm -v ~/.vantage:/root/.vantage omnivector/vantage-cli:latest sh
```

### Docker Compose

```yaml
version: '3.8'
services:
  vantage-cli:
    image: omnivector/vantage-cli:latest
    volumes:
      - ~/.vantage:/root/.vantage
      - ./scripts:/scripts
    working_dir: /scripts
```

## Build from Source

### Prerequisites

- Go 1.21 or later
- Git

### Build Steps

```bash
git clone https://github.com/omnivector-solutions/vantage-cli.git
cd vantage-cli
make build
sudo mv bin/vantage /usr/local/bin/
```

### Development Build

```bash
go install github.com/omnivector-solutions/vantage-cli/cmd/vantage@latest
```

## Verify Installation

Check that the CLI is installed correctly:

```bash
vantage --version
```

You should see output similar to:

```text
vantage version 1.0.0 (commit: abc123, built: 2024-01-15T10:30:00Z)
```

## Next Steps

1. **[Login](/cli/login)** - Authenticate with your Vantage account
2. **[Configuration](/cli/configuration)** - Set up profiles and preferences
3. **[Quickstart](/cli/quickstart)** - Run your first commands

## Troubleshooting

### Permission Denied

If you get permission errors, ensure the binary is executable:

```bash
chmod +x /usr/local/bin/vantage
```

### Command Not Found

Ensure the installation directory is in your PATH:

```bash
echo $PATH
export PATH=$PATH:/usr/local/bin
```

### SSL Certificate Issues

If you encounter SSL certificate errors:

```bash
vantage config set --insecure-skip-verify true
```

**Note**: Only use this in development environments.

## Updating

### Package Managers

```bash
# Homebrew
brew upgrade vantage-cli

# APT
sudo apt update && sudo apt upgrade vantage-cli

# YUM/DNF
sudo yum update vantage-cli

# Chocolatey
choco upgrade vantage-cli
```

### Manual Updates

Download the latest binary and replace the existing installation following the same steps as initial installation.
