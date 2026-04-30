---
id: postman
title: Postman Collection
description: Download and use our official Postman collection for the Vantage API
---

Use our official Postman collection to quickly test and explore the Vantage API. The collection includes pre-configured requests for all major endpoints with example data.

## Download Collection

### Method 1: Direct Download

Download the collection file and import it into Postman:

[📥 Download Vantage API Collection](https://api.vantage.omnivector.solutions/postman/collection.json)

### Method 2: Import Link

Copy this URL and import it directly in Postman:

```
https://api.vantage.omnivector.solutions/postman/collection.json
```

### Method 3: Postman Button

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/12345678-abcd-efgh-ijkl-123456789012)

## Setup Instructions

### 1. Import the Collection

1. Open Postman
2. Click **Import** in the top left
3. Choose **Link** tab
4. Paste the collection URL: `https://api.vantage.omnivector.solutions/postman/collection.json`
5. Click **Continue** and then **Import**

### 2. Set Environment Variables

The collection uses environment variables for easy configuration:

1. Click the **Environment** dropdown (top right)
2. Create a new environment called "Vantage API"
3. Add these variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `https://api.vantage.omnivector.solutions/v1` |
| `api_key` | Your API key | `vantage_sk_abc123...` |
| `cluster_id` | Default cluster ID | `cluster_abc123` |
| `job_id` | Sample job ID | `job_xyz789` |
| `file_id` | Sample file ID | `file_def456` |

### 3. Configure Authentication

The collection automatically includes your API key in requests:

1. Select a request from the collection
2. Go to the **Authorization** tab
3. Verify **Type** is set to **Bearer Token**
4. Verify **Token** field shows `{{api_key}}`

## Collection Structure

The collection is organized into the following folders:

### 🔐 Authentication
- Test authentication
- Get current user info
- Validate API key

### 💼 Jobs
- List jobs (with filters)
- Create new job
- Get job details
- Update job
- Delete job
- Get job output
- Get job logs
- Cancel job

### 🖥️ Clusters
- List clusters
- Get cluster details
- Get cluster usage
- List cluster nodes
- Get cluster metrics

### 📁 Storage
- List files
- Upload file
- Download file
- Get file metadata
- Delete file
- Create folder
- List folder contents

### 👥 Teams
- List teams
- Get team details
- List team members
- Add team member
- Remove team member
- Update team member role

### 👤 Users
- Get user profile
- Update user profile
- List user jobs
- Get user usage statistics

### 💰 Billing
- Get usage summary
- List invoices
- Get invoice details
- Download invoice PDF

### 📊 Monitoring
- Get job metrics
- Get cluster metrics
- Get system status

### 🔗 Webhooks
- List webhooks
- Create webhook
- Update webhook
- Delete webhook
- Test webhook

## Example Requests

### Create a Job

```json
POST {{base_url}}/jobs
{
  "name": "hello-world",
  "cluster_id": "{{cluster_id}}",
  "command": "echo 'Hello from Vantage!'",
  "resources": {
    "cpus": 1,
    "memory": "1GB"
  }
}
```

### Upload a File

```http
POST {{base_url}}/storage/files
Content-Type: multipart/form-data

file: [binary file data]
path: /scripts/my-script.py
overwrite: false
```

### List Jobs with Filters

```http
GET {{base_url}}/jobs?status=running&limit=10&cluster_id={{cluster_id}}
```

## Pre-request Scripts

The collection includes helpful pre-request scripts:

### Auto-generate Request IDs
```javascript
pm.environment.set("request_id", pm.variables.replaceIn("{{$randomUUID}}"));
```

### Set Timestamps
```javascript
pm.environment.set("timestamp", new Date().toISOString());
```

### Generate Test Data
```javascript
pm.environment.set("test_job_name", "test-job-" + Math.floor(Math.random() * 1000));
```

## Test Scripts

Example test scripts included in requests:

### Verify Response Status
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

### Validate Response Schema
```javascript
pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData).to.have.property("status");
});
```

### Save Response Data
```javascript
pm.test("Save job ID for later use", function () {
    var jsonData = pm.response.json();
    pm.environment.set("job_id", jsonData.id);
});
```

## Environment Templates

### Development Environment
```json
{
  "name": "Vantage API - Development",
  "values": [
    {
      "key": "base_url",
      "value": "https://api-dev.vantage.omnivector.solutions/v1"
    },
    {
      "key": "api_key",
      "value": "your_dev_api_key_here"
    }
  ]
}
```

### Production Environment
```json
{
  "name": "Vantage API - Production",
  "values": [
    {
      "key": "base_url",
      "value": "https://api.vantage.omnivector.solutions/v1"
    },
    {
      "key": "api_key",
      "value": "your_prod_api_key_here"
    }
  ]
}
```

## Running Collections

### Manual Testing
1. Select any request
2. Ensure environment is set
3. Click **Send**
4. Review response

### Automated Testing
1. Right-click collection name
2. Select **Run collection**
3. Configure test settings
4. Click **Run Vantage API**

### Newman (CLI)
Run collections from command line:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run vantage-api-collection.json \
  --environment vantage-environment.json \
  --reporters cli,json \
  --export-globals globals.json
```

## Troubleshooting

### Authentication Issues
- Verify API key is correctly set in environment
- Check that Bearer token format is correct
- Ensure API key has required scopes

### Environment Variables
- Make sure environment is selected (top right)
- Verify all required variables are set
- Check for typos in variable names

### SSL/TLS Issues
- Disable SSL verification in Postman settings (development only)
- Check certificate validity
- Verify network connectivity

## Updates and Versioning

The Postman collection is updated regularly:
- **Auto-sync**: Enable auto-sync in Postman for latest updates
- **Version tags**: Each release is tagged with API version
- **Changelog**: Check collection description for recent changes

## Additional Resources

- [Postman Learning Center](https://learning.postman.com/)
- [Vantage API Documentation](/api/docs)
- [Support Forum](https://community.vantage.omnivector.solutions)
- [Bug Reports](mailto:api-support@omnivector.solutions)
