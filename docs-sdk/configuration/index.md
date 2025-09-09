---
id: configuration
title: Configuration
description: Configure the Vantage SDK for your environment
---

Learn how to configure the Vantage SDK for different environments, authentication methods, and use cases.

## Basic Configuration

### Python SDK

```python
from vantage_sdk import VantageClient

# Basic configuration
client = VantageClient(
    api_key="your-api-key",
    base_url="https://api.vantage.omnivector.solutions",
    organization="your-org-id"
)

# From environment variables
import os
client = VantageClient(
    api_key=os.getenv("VANTAGE_API_KEY"),
    base_url=os.getenv("VANTAGE_BASE_URL"),
    organization=os.getenv("VANTAGE_ORG")
)
```

### JavaScript/TypeScript SDK

```typescript
import { VantageClient } from '@vantage/sdk';

// Basic configuration
const client = new VantageClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.vantage.omnivector.solutions',
  organization: 'your-org-id'
});

// From environment variables
const client = new VantageClient({
  apiKey: process.env.VANTAGE_API_KEY,
  baseURL: process.env.VANTAGE_BASE_URL,
  organization: process.env.VANTAGE_ORG
});
```

### Go SDK

```go
package main

import (
    "os"
    "github.com/omnivector-solutions/vantage-sdk-go/vantage"
)

func main() {
    // Basic configuration
    client := vantage.NewClient(vantage.Config{
        APIKey:       "your-api-key",
        BaseURL:      "https://api.vantage.omnivector.solutions",
        Organization: "your-org-id",
    })
    
    // From environment variables
    client := vantage.NewClient(vantage.Config{
        APIKey:       os.Getenv("VANTAGE_API_KEY"),
        BaseURL:      os.Getenv("VANTAGE_BASE_URL"),
        Organization: os.Getenv("VANTAGE_ORG"),
    })
}
```

## Authentication Methods

### API Key Authentication

The most common authentication method for automated scripts and applications.

#### Creating API Keys

1. Log in to the [Vantage Dashboard](https://app.vantage.omnivector.solutions)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Set appropriate permissions and expiration
5. Copy and securely store the key

#### Using API Keys

```python
# Python
client = VantageClient(api_key="vantage_key_abc123...")

# JavaScript
const client = new VantageClient({
  apiKey: 'vantage_key_abc123...'
});

# Go
client := vantage.NewClient(vantage.Config{
    APIKey: "vantage_key_abc123...",
})
```

### OAuth 2.0 Authentication

For interactive applications that need to act on behalf of users.

#### Python OAuth Flow

```python
from vantage_sdk import VantageClient
from vantage_sdk.auth import OAuth2Flow

# Initialize OAuth flow
oauth = OAuth2Flow(
    client_id="your-client-id",
    client_secret="your-client-secret",
    redirect_uri="http://localhost:8080/callback"
)

# Get authorization URL
auth_url = oauth.get_authorization_url(
    scopes=["jobs:read", "jobs:write", "clusters:read"]
)

print(f"Visit: {auth_url}")

# Exchange code for token (after user authorization)
token = oauth.exchange_code(authorization_code)

# Create client with token
client = VantageClient(access_token=token.access_token)
```

#### JavaScript OAuth Flow

```typescript
import { VantageClient, OAuth2Flow } from '@vantage/sdk';

const oauth = new OAuth2Flow({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/callback'
});

// Get authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scopes: ['jobs:read', 'jobs:write', 'clusters:read']
});

// Exchange code for token
const token = await oauth.exchangeCode(authorizationCode);

// Create authenticated client
const client = new VantageClient({
  accessToken: token.accessToken
});
```

### Service Account Authentication

For server-to-server authentication without user interaction.

```python
# Python
from vantage_sdk import VantageClient
from vantage_sdk.auth import ServiceAccount

service_account = ServiceAccount.from_file(
    "/path/to/service-account.json"
)

client = VantageClient(auth=service_account)
```

```javascript
// JavaScript
import { VantageClient, ServiceAccount } from '@vantage/sdk';

const serviceAccount = ServiceAccount.fromFile(
  '/path/to/service-account.json'
);

const client = new VantageClient({
  auth: serviceAccount
});
```

## Configuration Files

### Python Configuration

Create `~/.vantage/config.yaml`:

```yaml
default_profile: production

profiles:
  development:
    api_key: "dev_key_123"
    base_url: "https://dev-api.vantage.example.com"
    organization: "dev-org"
    timeout: 30
    
  production:
    api_key: "prod_key_456"
    base_url: "https://api.vantage.omnivector.solutions"
    organization: "prod-org"
    timeout: 60
    
  staging:
    api_key: "staging_key_789"
    base_url: "https://staging-api.vantage.example.com"
    organization: "staging-org"
```

Load configuration:

```python
from vantage_sdk import VantageClient
from vantage_sdk.config import load_config

# Load from config file
config = load_config()
client = VantageClient.from_config(config)

# Use specific profile
client = VantageClient.from_config(config, profile="development")
```

### JavaScript Configuration

Create `~/.vantage/config.json`:

```json
{
  "defaultProfile": "production",
  "profiles": {
    "development": {
      "apiKey": "dev_key_123",
      "baseURL": "https://dev-api.vantage.example.com",
      "organization": "dev-org",
      "timeout": 30000
    },
    "production": {
      "apiKey": "prod_key_456",
      "baseURL": "https://api.vantage.omnivector.solutions",
      "organization": "prod-org",
      "timeout": 60000
    }
  }
}
```

Load configuration:

```typescript
import { VantageClient, loadConfig } from '@vantage/sdk';

// Load from config file
const config = loadConfig();
const client = VantageClient.fromConfig(config);

// Use specific profile
const client = VantageClient.fromConfig(config, 'development');
```

## Environment Variables

The SDK recognizes these environment variables:

### Core Configuration

```bash
# Authentication
export VANTAGE_API_KEY="your-api-key"
export VANTAGE_ACCESS_TOKEN="your-access-token"

# Endpoints
export VANTAGE_BASE_URL="https://api.vantage.omnivector.solutions"
export VANTAGE_ORG="your-organization-id"

# Behavior
export VANTAGE_TIMEOUT="60"
export VANTAGE_RETRY_COUNT="3"
export VANTAGE_PROFILE="production"
```

### Network Configuration

```bash
# Proxy settings
export VANTAGE_PROXY="http://proxy.company.com:8080"
export VANTAGE_PROXY_AUTH="username:password"

# SSL settings
export VANTAGE_CA_BUNDLE="/path/to/ca-bundle.pem"
export VANTAGE_VERIFY_SSL="true"
```

### Debugging

```bash
# Logging
export VANTAGE_LOG_LEVEL="DEBUG"
export VANTAGE_LOG_FILE="/var/log/vantage-sdk.log"

# Request tracing
export VANTAGE_TRACE_REQUESTS="true"
export VANTAGE_DEBUG_HTTP="true"
```

## Advanced Configuration

### Custom HTTP Client

#### Python

```python
import requests
from vantage_sdk import VantageClient

# Custom session with retries
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(
    max_retries=requests.packages.urllib3.util.retry.Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[500, 502, 503, 504]
    )
)
session.mount('https://', adapter)

client = VantageClient(
    api_key="your-key",
    session=session
)
```

#### JavaScript

```typescript
import axios from 'axios';
import { VantageClient } from '@vantage/sdk';

// Custom axios instance
const httpClient = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'MyApp/1.0'
  }
});

const client = new VantageClient({
  apiKey: 'your-key',
  httpClient: httpClient
});
```

### Connection Pooling

#### Python

```python
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import requests

# Configure connection pooling
session = requests.Session()
session.mount('https://', HTTPAdapter(
    pool_connections=20,
    pool_maxsize=20,
    max_retries=Retry(total=3)
))

client = VantageClient(
    api_key="your-key",
    session=session
)
```

### Rate Limiting

#### Python

```python
from vantage_sdk import VantageClient
from vantage_sdk.middleware import RateLimitMiddleware

client = VantageClient(
    api_key="your-key",
    middleware=[
        RateLimitMiddleware(
            requests_per_second=10,
            burst_size=50
        )
    ]
)
```

### Caching

#### Python

```python
from vantage_sdk import VantageClient
from vantage_sdk.cache import RedisCache

cache = RedisCache(
    host='localhost',
    port=6379,
    db=0,
    ttl=300  # 5 minutes
)

client = VantageClient(
    api_key="your-key",
    cache=cache
)
```

#### JavaScript

```typescript
import { VantageClient, MemoryCache } from '@vantage/sdk';

const cache = new MemoryCache({
  maxSize: 1000,
  ttl: 300000  // 5 minutes
});

const client = new VantageClient({
  apiKey: 'your-key',
  cache: cache
});
```

## Error Handling Configuration

### Python

```python
from vantage_sdk import VantageClient
from vantage_sdk.exceptions import VantageAPIError

client = VantageClient(
    api_key="your-key",
    raise_on_error=True,  # Raise exceptions for API errors
    max_retries=3,
    retry_delay=1.0,
    backoff_factor=2.0
)

try:
    jobs = client.jobs.list()
except VantageAPIError as e:
    print(f"API Error: {e.status_code} - {e.message}")
```

### JavaScript

```typescript
import { VantageClient, VantageAPIError } from '@vantage/sdk';

const client = new VantageClient({
  apiKey: 'your-key',
  raiseOnError: true,
  maxRetries: 3,
  retryDelay: 1000,
  backoffFactor: 2.0
});

try {
  const jobs = await client.jobs.list();
} catch (error) {
  if (error instanceof VantageAPIError) {
    console.log(`API Error: ${error.statusCode} - ${error.message}`);
  }
}
```

## Configuration Validation

### Python

```python
from vantage_sdk import VantageClient
from vantage_sdk.config import validate_config

config = {
    'api_key': 'your-key',
    'base_url': 'https://api.vantage.omnivector.solutions',
    'timeout': 30
}

# Validate configuration
is_valid, errors = validate_config(config)
if not is_valid:
    print(f"Configuration errors: {errors}")
    
client = VantageClient(**config)
```

## Testing Configuration

### Development Mode

```python
# Python - development mode
client = VantageClient(
    api_key="dev-key",
    base_url="http://localhost:8080",
    debug=True,
    verify_ssl=False
)
```

```typescript
// JavaScript - development mode
const client = new VantageClient({
  apiKey: 'dev-key',
  baseURL: 'http://localhost:8080',
  debug: true,
  rejectUnauthorized: false
});
```

### Mock Configuration

```python
# Python - mock mode for testing
from vantage_sdk import VantageClient
from vantage_sdk.testing import MockAdapter

client = VantageClient(
    api_key="mock-key",
    adapter=MockAdapter()
)
```

## Next Steps

1. **[Quickstart](/sdk/quickstart)** - Build your first integration
2. **[API Reference](/sdk/api)** - Explore available methods
3. **[Examples](https://github.com/omnivector-solutions/vantage-sdk-examples)** - See real-world usage patterns
