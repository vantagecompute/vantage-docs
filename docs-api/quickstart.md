---
id: quickstart
title: API Quickstart Guide
description: Get started with the Vantage API in minutes with this step-by-step guide
---

Get up and running with the Vantage API in just a few minutes. This guide will walk you through authentication, making your first API call, and common operations.

## Prerequisites

- A Vantage account
- Basic knowledge of REST APIs
- Command line access or API client (like Postman)

## Step 1: Get Your API Key

1. Log in to your [Vantage dashboard](https://vantage.omnivector.solutions)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Give it a descriptive name (e.g., "Development API Key")
5. Select the scopes you need (start with `jobs:read` and `clusters:read`)
6. Copy your key and store it securely

:::warning
Your API key will only be shown once. Make sure to copy it immediately and store it in a secure location.
:::

## Step 2: Test Authentication

Let's verify your API key works by testing authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/auth/test
```

You should see a response like:

```json
{
  "authenticated": true,
  "user_id": "user_123",
  "scopes": ["jobs:read", "clusters:read"],
  "expires_at": null
}
```

## Step 3: List Your Clusters

View all compute clusters in your account:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/clusters
```

Example response:

```json
{
  "clusters": [
    {
      "id": "cluster_abc123",
      "name": "my-hpc-cluster",
      "status": "active",
      "provider": "aws",
      "node_count": 4,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 50
}
```

## Step 4: Submit Your First Job

Create a simple job to run on your cluster:

```bash
curl -X POST https://api.vantage.omnivector.solutions/v1/jobs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "hello-world",
    "cluster_id": "cluster_abc123",
    "command": "echo \"Hello from Vantage!\"",
    "resources": {
      "cpus": 1,
      "memory": "1GB"
    }
  }'
```

Example response:

```json
{
  "id": "job_xyz789",
  "name": "hello-world",
  "status": "pending",
  "cluster_id": "cluster_abc123",
  "command": "echo \"Hello from Vantage!\"",
  "resources": {
    "cpus": 1,
    "memory": "1GB"
  },
  "created_at": "2024-01-15T11:00:00Z",
  "started_at": null,
  "completed_at": null
}
```

## Step 5: Monitor Your Job

Check the status of your job:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/jobs/job_xyz789
```

The job will progress through these states:
- `pending` - Waiting to be scheduled
- `running` - Currently executing
- `completed` - Finished successfully
- `failed` - Encountered an error

## Step 6: Get Job Output

Once your job is complete, retrieve its output:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/jobs/job_xyz789/output
```

Example response:

```json
{
  "stdout": "Hello from Vantage!\n",
  "stderr": "",
  "exit_code": 0
}
```

## Common Use Cases

### List Recent Jobs

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.vantage.omnivector.solutions/v1/jobs?limit=10&status=completed"
```

### Upload a File

```bash
curl -X POST https://api.vantage.omnivector.solutions/v1/storage/files \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@my-script.py" \
  -F "path=/scripts/"
```

### Download a File

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/storage/files/file_123/download \
  -o downloaded-file.py
```

### Get Cluster Usage

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/clusters/cluster_abc123/usage
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (check your request parameters)
- `401` - Unauthorized (check your API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

All error responses include details:

```json
{
  "error": "validation_error",
  "message": "Missing required field: cluster_id",
  "details": {
    "field": "cluster_id",
    "code": "required"
  }
}
```

## Rate Limits

The Vantage API has the following rate limits:

- **API Keys**: 1000 requests per hour
- **OAuth Tokens**: 5000 requests per hour
- **Burst**: Up to 100 requests per minute

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
```

## Next Steps

Now that you've made your first API calls, explore more advanced features:

- [API Reference](/api/reference) - Complete endpoint documentation
- [Authentication](/api/authentication) - Detailed auth setup
- Check out the [OpenAPI specification](/api/openapi)
- Import our [Postman collection](/api/postman)

## Need Help?

- Check our [API Reference](/api/reference) for detailed endpoint documentation
- Join our [community Discord](https://discord.gg/vantage)
- Email support: [api-support@omnivector.solutions](mailto:api-support@omnivector.solutions)
