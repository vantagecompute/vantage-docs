---
id: authentication
title: API Authentication
description: Learn how to authenticate with the Vantage API using API keys and OAuth 2.0
---

The Vantage API supports two authentication methods: API keys for simple access and OAuth 2.0 for more complex integrations.

## API Keys

API keys provide a simple way to authenticate with the Vantage API. They're ideal for server-to-server integrations and scripts.

### Getting Your API Key

1. Log in to your Vantage dashboard
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy your key (it will only be shown once)
5. Store it securely

### Using API Keys

Include your API key in the `Authorization` header with the `Bearer` scheme:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/jobs
```

### API Key Scopes

API keys can be created with specific scopes to limit access:

- `jobs:read` - Read job information
- `jobs:write` - Create and manage jobs
- `clusters:read` - Read cluster information
- `clusters:write` - Create and manage clusters
- `storage:read` - Access file information
- `storage:write` - Upload and manage files
- `teams:read` - Read team information
- `teams:write` - Manage team membership

## OAuth 2.0

OAuth 2.0 provides secure access for applications that need to act on behalf of users.

### Authorization Code Flow

The standard OAuth 2.0 authorization code flow:

```http
https://auth.vantage.omnivector.solutions/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  response_type=code&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=jobs:read,clusters:read&
  state=RANDOM_STATE_STRING
```

Exchange code for token:

```bash
curl -X POST https://auth.vantage.omnivector.solutions/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

Use access token:

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
  https://api.vantage.omnivector.solutions/v1/jobs
```

### Client Credentials Flow

For server-to-server authentication:

```bash
curl -X POST https://auth.vantage.omnivector.solutions/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "scope=jobs:read,clusters:read"
```

## Security Best Practices

- Never expose API keys in client-side code
- Use environment variables to store credentials
- Rotate keys regularly (at least annually)
- Use specific scopes - don't request more access than needed
- Monitor API usage in your dashboard
- Revoke unused keys immediately

## Error Responses

Authentication errors return standard HTTP status codes:

### 401 Unauthorized

```json
{
  "error": "invalid_token",
  "error_description": "The access token provided is invalid"
}
```

### 403 Forbidden

```json
{
  "error": "insufficient_scope",
  "error_description": "The request requires higher privileges than provided"
}
```

## Testing Authentication

Verify your authentication setup:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.vantage.omnivector.solutions/v1/auth/test
```

Successful response:

```json
{
  "authenticated": true,
  "user_id": "user_123",
  "scopes": ["jobs:read", "clusters:read"],
  "expires_at": "2024-12-31T23:59:59Z"
}
```
