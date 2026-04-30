---
id: installation
title: Installation
description: Install the Vantage SDK for your preferred language
---

The Vantage SDK is available for multiple programming languages. Choose your preferred installation method below.

## Python SDK

### Requirements

- Python 3.8 or later
- pip or conda package manager

### Install from PyPI

```bash
# Install the latest stable version
pip install vantage-sdk

# Install specific version
pip install vantage-sdk==1.0.0

# Install with optional dependencies
pip install vantage-sdk[async,cli]
```

### Install from conda-forge

```bash
# Install from conda-forge
conda install -c conda-forge vantage-sdk

# Create new environment with vantage-sdk
conda create -n vantage python=3.11 vantage-sdk -c conda-forge
conda activate vantage
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/omnivector-solutions/vantage-sdk-python.git
cd vantage-sdk-python

# Install in development mode
pip install -e .

# Install with development dependencies
pip install -e ".[dev,test]"
```

### Verify Installation

```python
import vantage_sdk
print(vantage_sdk.__version__)

# Test connection
from vantage_sdk import VantageClient
client = VantageClient()
print(client.health_check())
```

## JavaScript/TypeScript SDK

### Requirements

- Node.js 16 or later
- npm, yarn, or pnpm package manager

### Install with npm

```bash
# Install the latest version
npm install @vantage/sdk

# Install specific version
npm install @vantage/sdk@1.0.0

# Install globally for CLI usage
npm install -g @vantage/sdk
```

### Install with yarn

```bash
# Install with yarn
yarn add @vantage/sdk

# Install globally
yarn global add @vantage/sdk
```

### TypeScript Support

The SDK includes built-in TypeScript definitions:

```typescript
import { VantageClient } from '@vantage/sdk';

const client = new VantageClient({
  apiKey: process.env.VANTAGE_API_KEY,
  baseURL: 'https://api.vantage.omnivector.solutions'
});
```

### Browser Usage

```html
<!-- Include from CDN -->
<script src="https://unpkg.com/@vantage/sdk@latest/dist/vantage-sdk.min.js"></script>

<script>
const client = new VantageSDK.VantageClient({
  apiKey: 'your-api-key'
});
</script>
```

### Verify Installation

```javascript
const { VantageClient } = require('@vantage/sdk');

const client = new VantageClient();
client.healthCheck()
  .then(() => console.log('SDK installed successfully'))
  .catch(console.error);
```

## Go SDK

### Requirements

- Go 1.19 or later

### Install with go get

```bash
# Install the SDK
go get github.com/omnivector-solutions/vantage-sdk-go

# Install specific version
go get github.com/omnivector-solutions/vantage-sdk-go@v1.0.0
```

### Basic Usage

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/omnivector-solutions/vantage-sdk-go/vantage"
)

func main() {
    client := vantage.NewClient(vantage.Config{
        APIKey: "your-api-key",
        BaseURL: "https://api.vantage.omnivector.solutions",
    })
    
    ctx := context.Background()
    health, err := client.HealthCheck(ctx)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("SDK installed successfully: %+v\n", health)
}
```

## REST API (Any Language)

For languages without official SDK support, use the REST API directly.

### OpenAPI Specification

Download the OpenAPI specification to generate clients:

```bash
# Download the spec
curl -o openapi.yaml https://api.vantage.omnivector.solutions/openapi.yaml

# Generate client using openapi-generator
openapi-generator generate -i openapi.yaml -g python -o ./python-client
openapi-generator generate -i openapi.yaml -g java -o ./java-client
openapi-generator generate -i openapi.yaml -g csharp -o ./csharp-client
```

### Direct HTTP Requests

```bash
# Example API call with curl
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.vantage.omnivector.solutions/v1/jobs
```

## Docker Usage

### Python SDK in Docker

```dockerfile
FROM python:3.11-slim

RUN pip install vantage-sdk

COPY . /app
WORKDIR /app

CMD ["python", "main.py"]
```

### Node.js SDK in Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "index.js"]
```

## Authentication Setup

After installation, configure authentication:

### Environment Variables

```bash
export VANTAGE_API_KEY="your-api-key"
export VANTAGE_BASE_URL="https://api.vantage.omnivector.solutions"
export VANTAGE_ORG="your-organization-id"
```

### Configuration File

Create `~/.vantage/config.json`:

```json
{
  "api_key": "your-api-key",
  "base_url": "https://api.vantage.omnivector.solutions",
  "organization": "your-organization-id",
  "timeout": 30
}
```

## IDE Integration

### VS Code

Install the Vantage extension for enhanced development experience:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Vantage SDK"
4. Install the official extension

Features:
- Syntax highlighting for job templates
- IntelliSense for SDK methods
- Integrated debugging support

### PyCharm/IntelliJ

Configure the SDK for optimal development:

1. Add vantage-sdk to your project interpreter
2. Configure code completion for SDK classes
3. Set up debugging configurations

## Troubleshooting

### Common Issues

#### SSL Certificate Errors

```python
# Python - disable SSL verification (development only)
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

# Or configure custom CA bundle
client = VantageClient(ca_bundle='/path/to/ca-bundle.pem')
```

#### Network/Proxy Issues

```python
# Python - configure proxy
client = VantageClient(
    proxy='http://proxy.company.com:8080',
    proxy_auth=('username', 'password')
)
```

```javascript
// Node.js - configure proxy
const client = new VantageClient({
  proxy: 'http://proxy.company.com:8080',
  proxyAuth: 'username:password'
});
```

#### Import Errors

```bash
# Check installation
pip show vantage-sdk
npm list @vantage/sdk

# Reinstall if needed
pip uninstall vantage-sdk && pip install vantage-sdk
npm uninstall @vantage/sdk && npm install @vantage/sdk
```

### Getting Help

- **[GitHub Issues](https://github.com/omnivector-solutions/vantage-sdk/issues)** - Report bugs
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/vantage-sdk)** - Community support
- **[Documentation](/sdk/api)** - API reference
- **[Examples](https://github.com/omnivector-solutions/vantage-sdk-examples)** - Code samples

## Version Compatibility

| SDK Version | API Version | Python | Node.js | Go |
|-------------|-------------|--------|---------|-----|
| 1.0.x | v1 | 3.8+ | 16+ | 1.19+ |
| 0.9.x | v1-beta | 3.7+ | 14+ | 1.18+ |

## Next Steps

1. **[Configuration](/sdk/configuration)** - Configure the SDK for your environment
2. **[Quickstart](/sdk/quickstart)** - Build your first integration
3. **[API Reference](/sdk/api)** - Explore available methods
