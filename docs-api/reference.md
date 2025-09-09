---
id: reference
title: API Reference
description: Complete reference documentation for all Vantage API endpoints
---

Complete reference documentation for the Vantage REST API. All endpoints require authentication via API key or OAuth token.

## Base URL

```
https://api.vantage.omnivector.solutions/v1
```

## Authentication

Include your API key in the Authorization header:

```http
Authorization: Bearer YOUR_API_KEY
```

## Jobs API

Manage computational jobs on your clusters.

### List Jobs

```http
GET /jobs
```

Query parameters:
- `limit` (integer) - Number of jobs to return (default: 50, max: 100)
- `offset` (integer) - Number of jobs to skip (default: 0)
- `status` (string) - Filter by job status
- `cluster_id` (string) - Filter by cluster ID
- `user_id` (string) - Filter by user ID

Example request:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.vantage.omnivector.solutions/v1/jobs?limit=10&status=running"
```

Example response:

```json
{
  "jobs": [
    {
      "id": "job_123",
      "name": "simulation-run-1",
      "status": "running",
      "cluster_id": "cluster_abc",
      "user_id": "user_456",
      "command": "python simulate.py",
      "resources": {
        "cpus": 4,
        "memory": "8GB",
        "gpus": 1
      },
      "created_at": "2024-01-15T10:30:00Z",
      "started_at": "2024-01-15T10:31:00Z",
      "completed_at": null
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10
}
```

### Create Job

```http
POST /jobs
```

Request body:

```json
{
  "name": "job-name",
  "cluster_id": "cluster_123",
  "command": "python script.py",
  "resources": {
    "cpus": 2,
    "memory": "4GB",
    "gpus": 0
  },
  "environment": {
    "ENV_VAR": "value"
  },
  "working_directory": "/home/user",
  "output_path": "/outputs/"
}
```

### Get Job

```http
GET /jobs/{job_id}
```

### Update Job

```http
PATCH /jobs/{job_id}
```

### Delete Job

```http
DELETE /jobs/{job_id}
```

### Get Job Output

```http
GET /jobs/{job_id}/output
```

### Get Job Logs

```http
GET /jobs/{job_id}/logs
```

## Clusters API

Manage compute clusters.

### List Clusters

```http
GET /clusters
```

### Get Cluster

```http
GET /clusters/{cluster_id}
```

### Get Cluster Usage

```http
GET /clusters/{cluster_id}/usage
```

### Get Cluster Nodes

```http
GET /clusters/{cluster_id}/nodes
```

## Storage API

Manage files and data.

### List Files

```http
GET /storage/files
```

### Upload File

```http
POST /storage/files
```

Content-Type: `multipart/form-data`

Form fields:
- `file` - The file to upload
- `path` - Destination path
- `overwrite` - Whether to overwrite existing files (default: false)

### Download File

```http
GET /storage/files/{file_id}/download
```

### Delete File

```http
DELETE /storage/files/{file_id}
```

### Get File Metadata

```http
GET /storage/files/{file_id}
```

## Teams API

Manage team membership and permissions.

### List Teams

```http
GET /teams
```

### Get Team

```http
GET /teams/{team_id}
```

### List Team Members

```http
GET /teams/{team_id}/members
```

### Add Team Member

```http
POST /teams/{team_id}/members
```

### Remove Team Member

```http
DELETE /teams/{team_id}/members/{user_id}
```

## Users API

Manage user accounts and profiles.

### Get Current User

```http
GET /users/me
```

### Update User Profile

```http
PATCH /users/me
```

### List User Jobs

```http
GET /users/{user_id}/jobs
```

## Billing API

Access billing and usage information.

### Get Usage Summary

```http
GET /billing/usage
```

### Get Invoices

```http
GET /billing/invoices
```

### Get Invoice

```http
GET /billing/invoices/{invoice_id}
```

## Monitoring API

Retrieve metrics and monitoring data.

### Get Job Metrics

```http
GET /monitoring/jobs/{job_id}/metrics
```

### Get Cluster Metrics

```http
GET /monitoring/clusters/{cluster_id}/metrics
```

## Webhooks API

Manage webhook subscriptions for events.

### List Webhooks

```http
GET /webhooks
```

### Create Webhook

```http
POST /webhooks
```

### Update Webhook

```http
PATCH /webhooks/{webhook_id}
```

### Delete Webhook

```http
DELETE /webhooks/{webhook_id}
```

## Common Parameters

### Pagination

Most list endpoints support pagination:

- `limit` - Number of items per page (default: 50, max: 100)
- `offset` - Number of items to skip
- `page` - Page number (alternative to offset)

### Filtering

Many endpoints support filtering:

- `created_after` - ISO 8601 timestamp
- `created_before` - ISO 8601 timestamp
- `updated_after` - ISO 8601 timestamp
- `updated_before` - ISO 8601 timestamp

### Sorting

Use the `sort` parameter:

- `created_at` - Sort by creation date
- `updated_at` - Sort by update date
- `name` - Sort alphabetically
- Add `-` prefix for descending order (e.g., `-created_at`)

## Error Responses

All error responses follow this format:

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {
    "field": "field_name",
    "code": "validation_error"
  },
  "request_id": "req_123456789"
}
```

### Common Error Codes

- `validation_error` - Request validation failed
- `authentication_failed` - Invalid or missing credentials
- `permission_denied` - Insufficient permissions
- `resource_not_found` - Requested resource doesn't exist
- `rate_limit_exceeded` - Too many requests
- `internal_error` - Server error

## Response Headers

All responses include these headers:

```http
X-Request-ID: req_123456789
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
Content-Type: application/json
```

## SDKs and Libraries

Official SDKs are available for:

- [Python SDK](https://pypi.org/project/vantage-sdk/)
- [JavaScript/Node.js SDK](https://www.npmjs.com/package/vantage-sdk)
- [Go SDK](https://github.com/omnivector/vantage-go-sdk)

## OpenAPI Specification

Download the complete OpenAPI 3.0 specification:

- [OpenAPI Specification](/api/openapi)
- [Swagger UI](https://api.vantage.omnivector.solutions/docs)

## Postman Collection

Import our Postman collection for easy API testing:

- [Download Collection](/api/postman)
