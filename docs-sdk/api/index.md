---
id: api
title: API Reference
description: Complete SDK API reference documentation
---

Complete reference documentation for the Vantage SDK APIs across all supported languages.

## Client Initialization

### Python

```python
from vantage_sdk import VantageClient

# Basic initialization
client = VantageClient(
    api_key="your-api-key",
    base_url="https://api.vantage.omnivector.solutions",
    organization="your-org-id"
)

# With custom configuration
client = VantageClient(
    api_key="your-api-key",
    timeout=60,
    max_retries=3,
    debug=True
)
```

### JavaScript/TypeScript

```typescript
import { VantageClient } from '@vantage/sdk';

// Basic initialization
const client = new VantageClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.vantage.omnivector.solutions',
  organization: 'your-org-id'
});

// With custom configuration
const client = new VantageClient({
  apiKey: 'your-api-key',
  timeout: 60000,
  maxRetries: 3,
  debug: true
});
```

### Go

```go
import "github.com/omnivector-solutions/vantage-sdk-go/vantage"

// Basic initialization
client := vantage.NewClient(vantage.Config{
    APIKey:       "your-api-key",
    BaseURL:      "https://api.vantage.omnivector.solutions",
    Organization: "your-org-id",
})

// With custom configuration
client := vantage.NewClient(vantage.Config{
    APIKey:     "your-api-key",
    Timeout:    time.Minute,
    MaxRetries: 3,
    Debug:      true,
})
```

## Jobs API

### List Jobs

#### Python

```python
# List all jobs
jobs = client.jobs.list()

# List with filters
jobs = client.jobs.list(
    status="running",
    cluster="gpu-cluster",
    limit=50,
    offset=0
)

# List with pagination
for page in client.jobs.list_paginated(page_size=20):
    for job in page.items:
        print(f"Job: {job.id} - {job.status}")
```

#### JavaScript/TypeScript

```typescript
// List all jobs
const jobs = await client.jobs.list();

// List with filters
const jobs = await client.jobs.list({
  status: 'running',
  cluster: 'gpu-cluster',
  limit: 50,
  offset: 0
});

// List with pagination
for await (const page of client.jobs.listPaginated({ pageSize: 20 })) {
  for (const job of page.items) {
    console.log(`Job: ${job.id} - ${job.status}`);
  }
}
```

#### Go

```go
// List all jobs
jobs, err := client.Jobs.List(ctx, nil)

// List with filters
jobs, err := client.Jobs.List(ctx, &vantage.JobListOptions{
    Status:  "running",
    Cluster: "gpu-cluster",
    Limit:   50,
    Offset:  0,
})

// List with pagination
err = client.Jobs.ListPaginated(ctx, &vantage.JobListOptions{
    PageSize: 20,
}, func(page *vantage.JobPage) error {
    for _, job := range page.Items {
        fmt.Printf("Job: %s - %s\n", job.ID, job.Status)
    }
    return nil
})
```

### Submit Job

#### Python

```python
# Submit from template dict
job_template = {
    "name": "my-job",
    "spec": {
        "image": "ubuntu:22.04",
        "command": ["echo", "hello"],
        "resources": {
            "cpu": "2",
            "memory": "4Gi"
        }
    }
}

job = client.jobs.submit(job_template)

# Submit from YAML file
job = client.jobs.submit_from_file("job-template.yaml")

# Submit with overrides
job = client.jobs.submit(
    job_template,
    cluster="specific-cluster",
    priority=10,
    env={"MY_VAR": "value"}
)
```

#### JavaScript/TypeScript

```typescript
// Submit from template object
const jobTemplate = {
  name: 'my-job',
  spec: {
    image: 'ubuntu:22.04',
    command: ['echo', 'hello'],
    resources: {
      cpu: '2',
      memory: '4Gi'
    }
  }
};

const job = await client.jobs.submit(jobTemplate);

// Submit from YAML file
const job = await client.jobs.submitFromFile('job-template.yaml');

// Submit with overrides
const job = await client.jobs.submit(jobTemplate, {
  cluster: 'specific-cluster',
  priority: 10,
  env: { MY_VAR: 'value' }
});
```

#### Go

```go
// Submit from template struct
jobTemplate := &vantage.JobTemplate{
    Name: "my-job",
    Spec: vantage.JobSpec{
        Image:   "ubuntu:22.04",
        Command: []string{"echo", "hello"},
        Resources: vantage.Resources{
            CPU:    "2",
            Memory: "4Gi",
        },
    },
}

job, err := client.Jobs.Submit(ctx, jobTemplate)

// Submit with overrides
job, err := client.Jobs.Submit(ctx, jobTemplate, &vantage.JobSubmitOptions{
    Cluster:  "specific-cluster",
    Priority: 10,
    Env:      map[string]string{"MY_VAR": "value"},
})
```

### Get Job Details

#### Python

```python
# Get job by ID
job = client.jobs.get("job-12345")

# Get with related data
job = client.jobs.get("job-12345", include=["logs", "outputs", "metrics"])

print(f"Job {job.id}: {job.status}")
print(f"Created: {job.created_at}")
print(f"Resources: {job.spec.resources}")
```

#### JavaScript/TypeScript

```typescript
// Get job by ID
const job = await client.jobs.get('job-12345');

// Get with related data
const job = await client.jobs.get('job-12345', {
  include: ['logs', 'outputs', 'metrics']
});

console.log(`Job ${job.id}: ${job.status}`);
console.log(`Created: ${job.createdAt}`);
console.log(`Resources:`, job.spec.resources);
```

#### Go

```go
// Get job by ID
job, err := client.Jobs.Get(ctx, "job-12345")

// Get with related data
job, err := client.Jobs.Get(ctx, "job-12345", &vantage.JobGetOptions{
    Include: []string{"logs", "outputs", "metrics"},
})

fmt.Printf("Job %s: %s\n", job.ID, job.Status)
fmt.Printf("Created: %s\n", job.CreatedAt)
fmt.Printf("Resources: %+v\n", job.Spec.Resources)
```

### Job Logs

#### Python

```python
# Get logs
logs = client.jobs.logs("job-12345")

# Stream logs
for log_line in client.jobs.logs_stream("job-12345"):
    print(log_line)

# Get logs with options
logs = client.jobs.logs(
    "job-12345",
    tail=100,
    since="2024-01-01T00:00:00Z",
    timestamps=True
)
```

#### JavaScript/TypeScript

```typescript
// Get logs
const logs = await client.jobs.logs('job-12345');

// Stream logs
const logStream = client.jobs.logsStream('job-12345');
for await (const logLine of logStream) {
  console.log(logLine);
}

// Get logs with options
const logs = await client.jobs.logs('job-12345', {
  tail: 100,
  since: '2024-01-01T00:00:00Z',
  timestamps: true
});
```

#### Go

```go
// Get logs
logs, err := client.Jobs.Logs(ctx, "job-12345", nil)

// Stream logs
logStream, err := client.Jobs.LogsStream(ctx, "job-12345", nil)
if err != nil {
    return err
}
defer logStream.Close()

for logLine := range logStream.Lines() {
    fmt.Println(logLine)
}

// Get logs with options
logs, err := client.Jobs.Logs(ctx, "job-12345", &vantage.LogsOptions{
    Tail:       100,
    Since:      "2024-01-01T00:00:00Z",
    Timestamps: true,
})
```

### Cancel Job

#### Python

```python
# Cancel a single job
client.jobs.cancel("job-12345")

# Cancel multiple jobs
client.jobs.cancel_batch(["job-12345", "job-67890"])

# Cancel with reason
client.jobs.cancel("job-12345", reason="User requested cancellation")
```

#### JavaScript/TypeScript

```typescript
// Cancel a single job
await client.jobs.cancel('job-12345');

// Cancel multiple jobs
await client.jobs.cancelBatch(['job-12345', 'job-67890']);

// Cancel with reason
await client.jobs.cancel('job-12345', {
  reason: 'User requested cancellation'
});
```

#### Go

```go
// Cancel a single job
err := client.Jobs.Cancel(ctx, "job-12345", nil)

// Cancel multiple jobs
err := client.Jobs.CancelBatch(ctx, []string{"job-12345", "job-67890"})

// Cancel with reason
err := client.Jobs.Cancel(ctx, "job-12345", &vantage.CancelOptions{
    Reason: "User requested cancellation",
})
```

## Clusters API

### List Clusters

#### Python

```python
# List all clusters
clusters = client.clusters.list()

# List with filters
clusters = client.clusters.list(
    status="running",
    provider="aws",
    region="us-west-2"
)

for cluster in clusters:
    print(f"Cluster: {cluster.name} ({cluster.status})")
```

#### JavaScript/TypeScript

```typescript
// List all clusters
const clusters = await client.clusters.list();

// List with filters
const clusters = await client.clusters.list({
  status: 'running',
  provider: 'aws',
  region: 'us-west-2'
});

clusters.forEach(cluster => {
  console.log(`Cluster: ${cluster.name} (${cluster.status})`);
});
```

#### Go

```go
// List all clusters
clusters, err := client.Clusters.List(ctx, nil)

// List with filters
clusters, err := client.Clusters.List(ctx, &vantage.ClusterListOptions{
    Status:   "running",
    Provider: "aws",
    Region:   "us-west-2",
})

for _, cluster := range clusters {
    fmt.Printf("Cluster: %s (%s)\n", cluster.Name, cluster.Status)
}
```

### Get Cluster Details

#### Python

```python
# Get cluster by name
cluster = client.clusters.get("my-cluster")

# Get with metrics
cluster = client.clusters.get("my-cluster", include=["metrics", "nodes"])

print(f"Cluster: {cluster.name}")
print(f"Nodes: {cluster.node_count}")
print(f"Resources: {cluster.total_resources}")
```

#### JavaScript/TypeScript

```typescript
// Get cluster by name
const cluster = await client.clusters.get('my-cluster');

// Get with metrics
const cluster = await client.clusters.get('my-cluster', {
  include: ['metrics', 'nodes']
});

console.log(`Cluster: ${cluster.name}`);
console.log(`Nodes: ${cluster.nodeCount}`);
console.log(`Resources:`, cluster.totalResources);
```

#### Go

```go
// Get cluster by name
cluster, err := client.Clusters.Get(ctx, "my-cluster")

// Get with metrics
cluster, err := client.Clusters.Get(ctx, "my-cluster", &vantage.ClusterGetOptions{
    Include: []string{"metrics", "nodes"},
})

fmt.Printf("Cluster: %s\n", cluster.Name)
fmt.Printf("Nodes: %d\n", cluster.NodeCount)
fmt.Printf("Resources: %+v\n", cluster.TotalResources)
```

### Scale Cluster

#### Python

```python
# Scale to specific node count
client.clusters.scale("my-cluster", nodes=10)

# Scale with auto-scaling
client.clusters.scale(
    "my-cluster",
    min_nodes=2,
    max_nodes=20,
    target_utilization=0.8
)
```

#### JavaScript/TypeScript

```typescript
// Scale to specific node count
await client.clusters.scale('my-cluster', { nodes: 10 });

// Scale with auto-scaling
await client.clusters.scale('my-cluster', {
  minNodes: 2,
  maxNodes: 20,
  targetUtilization: 0.8
});
```

#### Go

```go
// Scale to specific node count
err := client.Clusters.Scale(ctx, "my-cluster", &vantage.ScaleOptions{
    Nodes: 10,
})

// Scale with auto-scaling
err := client.Clusters.Scale(ctx, "my-cluster", &vantage.ScaleOptions{
    MinNodes:          2,
    MaxNodes:          20,
    TargetUtilization: 0.8,
})
```

## Storage API

### List Files

#### Python

```python
# List files in directory
files = client.storage.list("/datasets/")

# List recursively
files = client.storage.list("/datasets/", recursive=True)

# List with details
files = client.storage.list("/datasets/", include_size=True, include_metadata=True)

for file in files:
    print(f"{file.path} ({file.size} bytes)")
```

#### JavaScript/TypeScript

```typescript
// List files in directory
const files = await client.storage.list('/datasets/');

// List recursively
const files = await client.storage.list('/datasets/', { recursive: true });

// List with details
const files = await client.storage.list('/datasets/', {
  includeSize: true,
  includeMetadata: true
});

files.forEach(file => {
  console.log(`${file.path} (${file.size} bytes)`);
});
```

#### Go

```go
// List files in directory
files, err := client.Storage.List(ctx, "/datasets/", nil)

// List recursively
files, err := client.Storage.List(ctx, "/datasets/", &vantage.ListOptions{
    Recursive: true,
})

// List with details
files, err := client.Storage.List(ctx, "/datasets/", &vantage.ListOptions{
    IncludeSize:     true,
    IncludeMetadata: true,
})

for _, file := range files {
    fmt.Printf("%s (%d bytes)\n", file.Path, file.Size)
}
```

### Upload Files

#### Python

```python
# Upload single file
client.storage.upload("local-file.txt", "/datasets/remote-file.txt")

# Upload directory
client.storage.upload_directory("./local-dir/", "/datasets/remote-dir/")

# Upload with progress callback
def progress_callback(bytes_transferred, total_bytes):
    percent = (bytes_transferred / total_bytes) * 100
    print(f"Upload progress: {percent:.1f}%")

client.storage.upload(
    "large-file.tar.gz",
    "/datasets/large-file.tar.gz",
    progress_callback=progress_callback
)

# Upload string content
client.storage.upload_string("Hello World!", "/datasets/hello.txt")
```

#### JavaScript/TypeScript

```typescript
// Upload single file
await client.storage.upload('local-file.txt', '/datasets/remote-file.txt');

// Upload directory
await client.storage.uploadDirectory('./local-dir/', '/datasets/remote-dir/');

// Upload with progress callback
await client.storage.upload('large-file.tar.gz', '/datasets/large-file.tar.gz', {
  onProgress: (bytesTransferred, totalBytes) => {
    const percent = (bytesTransferred / totalBytes) * 100;
    console.log(`Upload progress: ${percent.toFixed(1)}%`);
  }
});

// Upload string content
await client.storage.uploadString('Hello World!', '/datasets/hello.txt');
```

#### Go

```go
// Upload single file
err := client.Storage.Upload(ctx, "local-file.txt", "/datasets/remote-file.txt", nil)

// Upload directory
err := client.Storage.UploadDirectory(ctx, "./local-dir/", "/datasets/remote-dir/", nil)

// Upload with progress callback
err := client.Storage.Upload(ctx, "large-file.tar.gz", "/datasets/large-file.tar.gz", &vantage.UploadOptions{
    ProgressCallback: func(bytesTransferred, totalBytes int64) {
        percent := float64(bytesTransferred) / float64(totalBytes) * 100
        fmt.Printf("Upload progress: %.1f%%\n", percent)
    },
})

// Upload string content
err := client.Storage.UploadString(ctx, "Hello World!", "/datasets/hello.txt")
```

### Download Files

#### Python

```python
# Download single file
client.storage.download("/datasets/remote-file.txt", "local-file.txt")

# Download directory
client.storage.download_directory("/datasets/remote-dir/", "./local-dir/")

# Download to memory
content = client.storage.download_to_string("/datasets/small-file.txt")

# Download with progress
client.storage.download(
    "/datasets/large-file.tar.gz",
    "large-file.tar.gz",
    progress_callback=progress_callback
)
```

#### JavaScript/TypeScript

```typescript
// Download single file
await client.storage.download('/datasets/remote-file.txt', 'local-file.txt');

// Download directory
await client.storage.downloadDirectory('/datasets/remote-dir/', './local-dir/');

// Download to memory
const content = await client.storage.downloadToString('/datasets/small-file.txt');

// Download with progress
await client.storage.download('/datasets/large-file.tar.gz', 'large-file.tar.gz', {
  onProgress: (bytesTransferred, totalBytes) => {
    const percent = (bytesTransferred / totalBytes) * 100;
    console.log(`Download progress: ${percent.toFixed(1)}%`);
  }
});
```

#### Go

```go
// Download single file
err := client.Storage.Download(ctx, "/datasets/remote-file.txt", "local-file.txt", nil)

// Download directory
err := client.Storage.DownloadDirectory(ctx, "/datasets/remote-dir/", "./local-dir/", nil)

// Download to memory
content, err := client.Storage.DownloadToString(ctx, "/datasets/small-file.txt")

// Download with progress
err := client.Storage.Download(ctx, "/datasets/large-file.tar.gz", "large-file.tar.gz", &vantage.DownloadOptions{
    ProgressCallback: func(bytesTransferred, totalBytes int64) {
        percent := float64(bytesTransferred) / float64(totalBytes) * 100
        fmt.Printf("Download progress: %.1f%%\n", percent)
    },
})
```

## Error Handling

### Exception Types

#### Python

```python
from vantage_sdk.exceptions import (
    VantageAPIError,      # Base API error
    AuthenticationError,  # 401 errors
    AuthorizationError,   # 403 errors
    ResourceNotFoundError,# 404 errors
    ValidationError,      # 400 errors
    RateLimitError,       # 429 errors
    ServerError          # 5xx errors
)

try:
    job = client.jobs.submit(job_template)
except AuthenticationError:
    print("Invalid API key")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after} seconds")
except ValidationError as e:
    print(f"Invalid request: {e.details}")
except VantageAPIError as e:
    print(f"API error {e.status_code}: {e.message}")
```

#### JavaScript/TypeScript

```typescript
import {
  VantageAPIError,
  AuthenticationError,
  AuthorizationError,
  ResourceNotFoundError,
  ValidationError,
  RateLimitError,
  ServerError
} from '@vantage/sdk';

try {
  const job = await client.jobs.submit(jobTemplate);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof ValidationError) {
    console.error(`Invalid request: ${error.details}`);
  } else if (error instanceof VantageAPIError) {
    console.error(`API error ${error.statusCode}: ${error.message}`);
  }
}
```

#### Go

```go
import "github.com/omnivector-solutions/vantage-sdk-go/vantage/errors"

job, err := client.Jobs.Submit(ctx, jobTemplate)
if err != nil {
    switch e := err.(type) {
    case *errors.AuthenticationError:
        fmt.Println("Invalid API key")
    case *errors.RateLimitError:
        fmt.Printf("Rate limited. Retry after %d seconds\n", e.RetryAfter)
    case *errors.ValidationError:
        fmt.Printf("Invalid request: %s\n", e.Details)
    case *errors.VantageAPIError:
        fmt.Printf("API error %d: %s\n", e.StatusCode, e.Message)
    default:
        fmt.Printf("Unexpected error: %v\n", err)
    }
}
```

## Pagination

### Automatic Pagination

#### Python

```python
# Iterate through all jobs automatically
for job in client.jobs.list_all():
    print(f"Job: {job.id}")

# Manual pagination
page_token = None
while True:
    page = client.jobs.list(limit=100, page_token=page_token)
    for job in page.items:
        print(f"Job: {job.id}")
    
    if not page.has_next:
        break
    page_token = page.next_page_token
```

#### JavaScript/TypeScript

```typescript
// Iterate through all jobs automatically
for await (const job of client.jobs.listAll()) {
  console.log(`Job: ${job.id}`);
}

// Manual pagination
let pageToken: string | undefined;
while (true) {
  const page = await client.jobs.list({ limit: 100, pageToken });
  for (const job of page.items) {
    console.log(`Job: ${job.id}`);
  }
  
  if (!page.hasNext) break;
  pageToken = page.nextPageToken;
}
```

#### Go

```go
// Iterate through all jobs automatically
err := client.Jobs.ListAll(ctx, func(job *vantage.Job) error {
    fmt.Printf("Job: %s\n", job.ID)
    return nil
})

// Manual pagination
pageToken := ""
for {
    page, err := client.Jobs.List(ctx, &vantage.JobListOptions{
        Limit:     100,
        PageToken: pageToken,
    })
    if err != nil {
        return err
    }
    
    for _, job := range page.Items {
        fmt.Printf("Job: %s\n", job.ID)
    }
    
    if !page.HasNext {
        break
    }
    pageToken = page.NextPageToken
}
```

## Async Operations (Python)

```python
import asyncio
from vantage_sdk import AsyncVantageClient

async def async_operations():
    async_client = AsyncVantageClient(api_key="your-key")
    
    # Submit multiple jobs concurrently
    jobs = await asyncio.gather(*[
        async_client.jobs.submit(template)
        for template in job_templates
    ])
    
    # Wait for all jobs to complete
    completed_jobs = await asyncio.gather(*[
        wait_for_completion(async_client, job.id)
        for job in jobs
    ])
    
    return completed_jobs

# Run async operations
results = asyncio.run(async_operations())
```

This comprehensive API reference covers all major SDK functionality. For complete method signatures and additional options, refer to the auto-generated API documentation for your specific language.
