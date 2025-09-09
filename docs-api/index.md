---
id: index
title: Vantage API
description: REST API for integrating with Vantage HPC platform
slug: /
---

The Vantage REST API provides comprehensive programmatic access to all platform features. Build custom integrations, automate workflows, and develop applications that leverage High Performance Computing resources.

## API Overview

- **REST-based** architecture with JSON request/response
- **OpenAPI 3.0** specification with auto-generated documentation
- **OAuth 2.0** and API key authentication
- **Rate limiting** and request throttling
- **Versioned** endpoints for backward compatibility

## Quick Start

1. **Get API credentials** from your Vantage dashboard
2. **Make your first request** using curl or your preferred HTTP client  
3. **Explore the OpenAPI specification** at `/openapi.yaml`

## Authentication

### API Keys

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/jobs
```

### OAuth 2.0

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.vantage.omnivector.solutions/v1/jobs
```

## Core Resources

### Jobs API

Manage computational workloads programmatically.

- `GET /v1/jobs` - List jobs
- `POST /v1/jobs` - Submit new job
- `GET /v1/jobs/{id}` - Get job details
- `DELETE /v1/jobs/{id}` - Cancel job

### Clusters API

Control compute infrastructure resources.

- `GET /v1/clusters` - List clusters
- `POST /v1/clusters` - Create cluster
- `GET /v1/clusters/{id}` - Get cluster info
- `PUT /v1/clusters/{id}/scale` - Scale cluster

### Storage API

Manage data and file operations.

- `GET /v1/storage/files` - List files
- `POST /v1/storage/upload` - Upload file
- `GET /v1/storage/download/{id}` - Download file
- `DELETE /v1/storage/files/{id}` - Delete file

### Teams API

Handle organization and access control.

- `GET /v1/teams` - List teams
- `POST /v1/teams` - Create team
- `GET /v1/teams/{id}/members` - List members
- `POST /v1/teams/{id}/invite` - Invite member

## Response Format

All API responses follow a consistent structure:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  },
  "links": {
    "self": "...",
    "next": "...",
    "prev": "..."
  }
}
```

## Error Handling

HTTP status codes indicate success or failure:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limits

- **1000 requests per hour** for authenticated requests
- **100 requests per hour** for unauthenticated requests
- Rate limit headers included in all responses

## SDKs & Libraries

Official SDKs available for popular languages:

- **[Python SDK](/sdk)** - Full-featured Python library
- **[JavaScript SDK](https://www.npmjs.com/package/@vantage/sdk)** - Node.js and browser support
- **[Go SDK](https://github.com/omnivector-solutions/vantage-go)** - Native Go client

## Interactive Documentation

Explore the full API specification with our interactive documentation:

- **[OpenAPI Specification](/openapi.yaml)** - Download the spec
- **Interactive Documentation** - Available in the OpenAPI spec
- **Postman Integration** - Import the OpenAPI spec into Postman

## Webhooks

Receive real-time notifications for important events:

- Job status changes
- Cluster scaling events  
- Storage operations
- Team member changes

Configure webhooks in your dashboard or via the API.
