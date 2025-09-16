---
id: openapi
title: OpenAPI Specification
description: Download the complete OpenAPI 3.0 specification for the Vantage API
---

# OpenAPI Specification

Download the complete OpenAPI 3.0 specification for the Vantage API in YAML format.

## Download Links

- **[Download openapi.yaml](https://raw.githubusercontent.com/vantagecompute/vantage-docs/main/static/api/openapi.yaml)** - Direct download
- **[View on GitHub](https://github.com/vantagecompute/vantage-docs/blob/main/static/api/openapi.yaml)** - Browse the file
- **[Swagger UI](https://api.vantage.omnivector.solutions/docs)** - Interactive documentation

## What is OpenAPI?

The OpenAPI Specification (formerly known as Swagger) is a specification for describing REST APIs. It provides a standard way to document:

- Available endpoints and operations
- Request/response schemas
- Authentication methods
- Parameters and headers
- Error responses

## Using the Specification

### Import into API Tools

You can import our OpenAPI specification into various API development tools:

**Postman**
1. Open Postman
2. Click **Import**
3. Select **Link** and paste: `https://raw.githubusercontent.com/vantagecompute/vantage-docs/main/static/api/openapi.yaml`

**Insomnia**
1. Open Insomnia
2. Click **Import/Export** → **Import Data**
3. Select **From URL** and paste the link above

**Swagger Editor**
1. Go to [editor.swagger.io](https://editor.swagger.io)
2. Click **File** → **Import URL**
3. Paste the specification URL

### Generate Client Libraries

Use the OpenAPI Generator to create client libraries:

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate Python client
openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/vantagecompute/vantage-docs/main/static/api/openapi.yaml \
  -g python \
  -o ./vantage-python-client

# Generate JavaScript client
openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/vantagecompute/vantage-docs/main/static/api/openapi.yaml \
  -g javascript \
  -o ./vantage-js-client
```

### Validate API Responses

Use the specification to validate your API responses:

```python
import openapi_spec_validator
import yaml
import requests

# Load the specification
spec_url = "https://raw.githubusercontent.com/vantagecompute/vantage-docs/main/static/api/openapi.yaml"
spec_content = requests.get(spec_url).text
spec = yaml.safe_load(spec_content)

# Validate the specification
openapi_spec_validator.validate_spec(spec)
```

## Specification Details

Our OpenAPI specification includes:

### API Information
- **Version**: 1.0.0
- **Base URL**: `https://api.vantage.omnivector.solutions/v1`
- **Authentication**: Bearer token (API key or OAuth)

### Covered Endpoints
- **Jobs API** - Submit and manage computational jobs
- **Clusters API** - Access compute cluster information
- **Storage API** - File upload, download, and management
- **Teams API** - Team and user management
- **Authentication API** - Token validation and user info

### Schemas
- Complete request/response models
- Validation rules and constraints
- Example values for all fields
- Error response formats

## Updates and Versioning

The OpenAPI specification is updated with each API release:

- **Patch updates** (1.0.x) - Bug fixes, clarifications
- **Minor updates** (1.x.0) - New endpoints, optional parameters
- **Major updates** (x.0.0) - Breaking changes, new versions

Subscribe to our [GitHub releases](https://github.com/vantagecompute/vantage-docs/releases) to be notified of specification updates.

## Related Resources

- [API Reference](/api/reference) - Human-readable endpoint documentation
- [Quickstart Guide](/api/quickstart) - Get started with the API
- [Authentication](/api/authentication) - API key and OAuth setup
- [Postman Collection](/api/postman) - Ready-to-use API testing collection
