---
id: docs
title: API Documentation Hub
description: Access comprehensive API documentation in multiple formats
---

Welcome to the Vantage API documentation hub. Here you'll find all the resources you need to integrate with the Vantage platform.

## Quick Navigation

### Getting Started
- **[Quickstart Guide](/api/quickstart)** - Get up and running in minutes
- **[Authentication](/api/authentication)** - Set up API keys and OAuth
- **[API Reference](/api/reference)** - Complete endpoint documentation

### Interactive Documentation
- **[Swagger UI](https://api.vantage.omnivector.solutions/docs)** - Interactive API explorer
- **[Redoc](https://api.vantage.omnivector.solutions/redoc)** - Clean documentation interface

### Development Resources
- **[OpenAPI Specification](/api/openapi)** - Machine-readable API spec
- **[Postman Collection](/api/postman)** - Ready-to-use API testing collection
- **[SDKs and Libraries](/sdk)** - Official client libraries

## API Overview

The Vantage API is a RESTful API that provides programmatic access to:

- **Jobs** - Submit, monitor, and manage computational jobs
- **Clusters** - Access and control compute clusters
- **Storage** - Upload, download, and organize files
- **Teams** - Manage team membership and permissions
- **Monitoring** - Track usage and performance metrics
- **Billing** - Access usage and billing information

### Base URL

```
https://api.vantage.omnivector.solutions/v1
```

### Authentication

All API requests require authentication using either:
- **API Keys** - For server-to-server integrations
- **OAuth 2.0** - For user-facing applications

### Response Format

All responses are in JSON format with consistent error handling:

```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_123",
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

## Supported Formats

### OpenAPI 3.0
Download our complete OpenAPI specification:
- [OpenAPI Specification](/api/openapi)
- [JSON format](https://api.vantage.omnivector.solutions/openapi.json)

### Postman
Import our Postman collection for easy testing:
- [Download collection](/api/postman)
- [View in Postman web](https://postman.com/vantage-api)

### Insomnia
Import our Insomnia workspace:
- [Download workspace](https://api.vantage.omnivector.solutions/insomnia.json)

## Code Examples

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# List jobs
response = requests.get(
    'https://api.vantage.omnivector.solutions/v1/jobs',
    headers=headers
)
jobs = response.json()
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
};

// List jobs
const response = await axios.get(
    'https://api.vantage.omnivector.solutions/v1/jobs',
    { headers }
);
const jobs = response.data;
```

### cURL
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://api.vantage.omnivector.solutions/v1/jobs
```

### Go
```go
package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", "https://api.vantage.omnivector.solutions/v1/jobs", nil)
    req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
    
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```

## API Versioning

The Vantage API uses semantic versioning:

- **v1.x** - Current stable version
- **v2.x** - Future major version (in development)

Version is specified in the URL path: `/v1/` or `/v2/`

### Deprecation Policy

- Minor versions are backward compatible
- Deprecated features are supported for 12 months
- Breaking changes require a new major version
- 90-day notice for deprecations

## Status Page

Monitor API status and incidents:
- [Status Page](https://status.vantage.omnivector.solutions)
- [RSS Feed](https://status.vantage.omnivector.solutions/rss)

## Community and Support

### Developer Community
- [Discord Server](https://discord.gg/vantage)
- [GitHub Discussions](https://github.com/omnivector/vantage/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vantage-api)

### Support Channels
- **Email**: [api-support@omnivector.solutions](mailto:api-support@omnivector.solutions)
- **Documentation Issues**: [GitHub Issues](https://github.com/vantagecompute/vantage-docs/issues)
- **Feature Requests**: [Feature Portal](https://vantage.canny.io)

### Response Times
- **Critical Issues**: 2 hours
- **High Priority**: 4 hours
- **Normal Priority**: 24 hours
- **Low Priority**: 72 hours

## Changelog

### v1.2.0 (Latest)
- Added webhook support
- Enhanced filtering options
- Improved error messages
- New monitoring endpoints

### v1.1.0
- OAuth 2.0 support
- Team management API
- File upload improvements
- Rate limiting headers

### v1.0.0
- Initial API release
- Core job management
- Cluster operations
- Basic file storage

[View complete changelog](https://github.com/omnivector/vantage-api/releases)
