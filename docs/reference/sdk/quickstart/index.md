---
id: quickstart
title: Quickstart
description: Build your first integration with the Vantage SDK
---

This quickstart guide will help you build your first integration with the Vantage SDK. We'll walk through authentication, job submission, and monitoring.

## Prerequisites

- [Installed](/sdk/installation) Vantage SDK for your preferred language
- Vantage account with API access
- At least one connected cluster

## Get Your API Key

1. Log in to the [Vantage Dashboard](https://app.vantage.omnivector.solutions)
2. Navigate to **Settings** → **API Keys**
3. Click **Generate New Key**
4. Copy the key and store it securely

## Basic Setup

### Python

```python
import os
from vantage_sdk import VantageClient

# Initialize the client
client = VantageClient(
    api_key=os.getenv("VANTAGE_API_KEY"),
    organization="your-org-id"
)

# Test the connection
try:
    health = client.health_check()
    print(f"Connected to Vantage: {health}")
except Exception as e:
    print(f"Connection failed: {e}")
```

### JavaScript/TypeScript

```typescript
import { VantageClient } from '@vantage/sdk';

// Initialize the client
const client = new VantageClient({
  apiKey: process.env.VANTAGE_API_KEY,
  organization: 'your-org-id'
});

// Test the connection
try {
  const health = await client.healthCheck();
  console.log(`Connected to Vantage: ${JSON.stringify(health)}`);
} catch (error) {
  console.error(`Connection failed: ${error}`);
}
```

### Go

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    
    "github.com/omnivector-solutions/vantage-sdk-go/vantage"
)

func main() {
    // Initialize the client
    client := vantage.NewClient(vantage.Config{
        APIKey:       os.Getenv("VANTAGE_API_KEY"),
        Organization: "your-org-id",
    })
    
    // Test the connection
    ctx := context.Background()
    health, err := client.HealthCheck(ctx)
    if err != nil {
        log.Fatalf("Connection failed: %v", err)
    }
    
    fmt.Printf("Connected to Vantage: %+v\n", health)
}
```

## Your First Job Submission

Let's submit a simple "Hello World" job to demonstrate the basic workflow.

### 1. Create a Job Template

First, let's explore available clusters and create a simple job template.

#### Python

```python
# List available clusters
clusters = client.clusters.list()
print("Available clusters:")
for cluster in clusters:
    print(f"  - {cluster.name} ({cluster.status})")

# Create a simple job template
job_template = {
    "name": "hello-world-python",
    "description": "Simple hello world job",
    "spec": {
        "image": "ubuntu:22.04",
        "command": ["echo", "Hello from Vantage Python SDK!"],
        "resources": {
            "cpu": "1",
            "memory": "1Gi"
        },
        "timeout": "300s"
    }
}

# Submit the job
job = client.jobs.submit(job_template)
print(f"Job submitted: {job.id}")
```

#### JavaScript/TypeScript

```typescript
// List available clusters
const clusters = await client.clusters.list();
console.log('Available clusters:');
clusters.forEach(cluster => {
  console.log(`  - ${cluster.name} (${cluster.status})`);
});

// Create a simple job template
const jobTemplate = {
  name: 'hello-world-js',
  description: 'Simple hello world job',
  spec: {
    image: 'ubuntu:22.04',
    command: ['echo', 'Hello from Vantage JavaScript SDK!'],
    resources: {
      cpu: '1',
      memory: '1Gi'
    },
    timeout: '300s'
  }
};

// Submit the job
const job = await client.jobs.submit(jobTemplate);
console.log(`Job submitted: ${job.id}`);
```

#### Go

```go
// List available clusters
clusters, err := client.Clusters.List(ctx, nil)
if err != nil {
    log.Fatalf("Failed to list clusters: %v", err)
}

fmt.Println("Available clusters:")
for _, cluster := range clusters {
    fmt.Printf("  - %s (%s)\n", cluster.Name, cluster.Status)
}

// Create a simple job template
jobTemplate := &vantage.JobTemplate{
    Name:        "hello-world-go",
    Description: "Simple hello world job",
    Spec: vantage.JobSpec{
        Image:   "ubuntu:22.04",
        Command: []string{"echo", "Hello from Vantage Go SDK!"},
        Resources: vantage.Resources{
            CPU:    "1",
            Memory: "1Gi",
        },
        Timeout: "300s",
    },
}

// Submit the job
job, err := client.Jobs.Submit(ctx, jobTemplate)
if err != nil {
    log.Fatalf("Failed to submit job: %v", err)
}

fmt.Printf("Job submitted: %s\n", job.ID)
```

### 2. Monitor Job Status

Now let's monitor the job until it completes.

#### Python

```python
import time

def wait_for_job_completion(client, job_id, timeout=300):
    """Wait for job to complete with timeout"""
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        job = client.jobs.get(job_id)
        print(f"Job {job_id} status: {job.status}")
        
        if job.status in ['completed', 'failed', 'cancelled']:
            return job
            
        time.sleep(5)  # Check every 5 seconds
    
    raise TimeoutError(f"Job {job_id} did not complete within {timeout} seconds")

# Wait for completion
try:
    completed_job = wait_for_job_completion(client, job.id)
    print(f"Job completed with status: {completed_job.status}")
    
    # Get job logs
    logs = client.jobs.logs(job.id)
    print(f"Job output:\n{logs}")
    
except TimeoutError as e:
    print(f"Timeout: {e}")
```

#### JavaScript/TypeScript

```typescript
async function waitForJobCompletion(
  client: VantageClient, 
  jobId: string, 
  timeout: number = 300000
): Promise<Job> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const job = await client.jobs.get(jobId);
    console.log(`Job ${jobId} status: ${job.status}`);
    
    if (['completed', 'failed', 'cancelled'].includes(job.status)) {
      return job;
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
  }
  
  throw new Error(`Job ${jobId} did not complete within ${timeout}ms`);
}

// Wait for completion
try {
  const completedJob = await waitForJobCompletion(client, job.id);
  console.log(`Job completed with status: ${completedJob.status}`);
  
  // Get job logs
  const logs = await client.jobs.logs(job.id);
  console.log(`Job output:\n${logs}`);
  
} catch (error) {
  console.error(`Error: ${error}`);
}
```

#### Go

```go
func waitForJobCompletion(client *vantage.Client, jobID string, timeout time.Duration) (*vantage.Job, error) {
    ctx, cancel := context.WithTimeout(context.Background(), timeout)
    defer cancel()
    
    ticker := time.NewTicker(5 * time.Second)
    defer ticker.Stop()
    
    for {
        select {
        case <-ctx.Done():
            return nil, fmt.Errorf("job %s did not complete within %v", jobID, timeout)
        case <-ticker.C:
            job, err := client.Jobs.Get(ctx, jobID)
            if err != nil {
                return nil, fmt.Errorf("failed to get job status: %v", err)
            }
            
            fmt.Printf("Job %s status: %s\n", jobID, job.Status)
            
            switch job.Status {
            case "completed", "failed", "cancelled":
                return job, nil
            }
        }
    }
}

// Wait for completion
completedJob, err := waitForJobCompletion(client, job.ID, 5*time.Minute)
if err != nil {
    log.Fatalf("Job monitoring failed: %v", err)
}

fmt.Printf("Job completed with status: %s\n", completedJob.Status)

// Get job logs
logs, err := client.Jobs.Logs(ctx, job.ID)
if err != nil {
    log.Printf("Failed to get logs: %v", err)
} else {
    fmt.Printf("Job output:\n%s\n", logs)
}
```

## Working with Data

Let's enhance our example to work with input and output data.

### Upload Input Data

#### Python

```python
# Upload input data
input_data = "Hello from uploaded file!"
input_file = client.storage.upload_string(
    content=input_data,
    path="/datasets/input.txt"
)

print(f"Uploaded input file: {input_file.path}")
```

#### JavaScript/TypeScript

```typescript
// Upload input data
const inputData = 'Hello from uploaded file!';
const inputFile = await client.storage.uploadString(
  inputData,
  '/datasets/input.txt'
);

console.log(`Uploaded input file: ${inputFile.path}`);
```

### Enhanced Job with Data Processing

#### Python

```python
# Job that processes input data
data_processing_job = {
    "name": "data-processing-python",
    "description": "Job that processes input data",
    "spec": {
        "image": "ubuntu:22.04",
        "command": [
            "bash", "-c",
            "cat /input/input.txt && echo ' - Processed by Vantage!' > /output/result.txt"
        ],
        "resources": {
            "cpu": "1",
            "memory": "1Gi"
        },
        "volumes": [
            {
                "name": "input-data",
                "source": "/datasets/input.txt",
                "mount_path": "/input/input.txt"
            },
            {
                "name": "output-data",
                "mount_path": "/output",
                "type": "output"
            }
        ],
        "timeout": "300s"
    }
}

# Submit and monitor the job
data_job = client.jobs.submit(data_processing_job)
completed_data_job = wait_for_job_completion(client, data_job.id)

# Download output
if completed_data_job.status == 'completed':
    output_files = client.jobs.outputs(data_job.id)
    for output_file in output_files:
        local_path = f"./downloads/{output_file.name}"
        client.storage.download(output_file.path, local_path)
        print(f"Downloaded: {local_path}")
```

## Error Handling

Implement proper error handling for production use.

#### Python

```python
from vantage_sdk.exceptions import (
    VantageAPIError, 
    AuthenticationError, 
    ResourceNotFoundError,
    RateLimitError
)

def robust_job_submission(client, job_template):
    """Submit job with comprehensive error handling"""
    try:
        job = client.jobs.submit(job_template)
        print(f"Job submitted successfully: {job.id}")
        return job
        
    except AuthenticationError:
        print("Authentication failed. Check your API key.")
        return None
        
    except RateLimitError as e:
        print(f"Rate limit exceeded. Retry after {e.retry_after} seconds.")
        return None
        
    except ResourceNotFoundError as e:
        print(f"Resource not found: {e.message}")
        return None
        
    except VantageAPIError as e:
        print(f"API error {e.status_code}: {e.message}")
        return None
        
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

# Use the robust function
job = robust_job_submission(client, job_template)
if job:
    print("Proceeding with job monitoring...")
```

#### JavaScript/TypeScript

```typescript
import { 
  VantageAPIError, 
  AuthenticationError, 
  ResourceNotFoundError, 
  RateLimitError 
} from '@vantage/sdk';

async function robustJobSubmission(
  client: VantageClient, 
  jobTemplate: JobTemplate
): Promise<Job | null> {
  try {
    const job = await client.jobs.submit(jobTemplate);
    console.log(`Job submitted successfully: ${job.id}`);
    return job;
    
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed. Check your API key.');
    } else if (error instanceof RateLimitError) {
      console.error(`Rate limit exceeded. Retry after ${error.retryAfter} seconds.`);
    } else if (error instanceof ResourceNotFoundError) {
      console.error(`Resource not found: ${error.message}`);
    } else if (error instanceof VantageAPIError) {
      console.error(`API error ${error.statusCode}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    return null;
  }
}

// Use the robust function
const job = await robustJobSubmission(client, jobTemplate);
if (job) {
  console.log('Proceeding with job monitoring...');
}
```

## Batch Operations

Process multiple jobs efficiently.

#### Python

```python
def submit_batch_jobs(client, job_templates):
    """Submit multiple jobs and track their progress"""
    jobs = []
    
    # Submit all jobs
    for template in job_templates:
        try:
            job = client.jobs.submit(template)
            jobs.append(job)
            print(f"Submitted job: {job.id}")
        except Exception as e:
            print(f"Failed to submit job {template['name']}: {e}")
    
    # Monitor all jobs
    completed_jobs = []
    pending_jobs = jobs[:]
    
    while pending_jobs:
        for job in pending_jobs[:]:  # Copy list to safely modify during iteration
            current_job = client.jobs.get(job.id)
            
            if current_job.status in ['completed', 'failed', 'cancelled']:
                completed_jobs.append(current_job)
                pending_jobs.remove(job)
                print(f"Job {job.id} finished with status: {current_job.status}")
        
        if pending_jobs:
            time.sleep(10)  # Check every 10 seconds
    
    return completed_jobs

# Create multiple job templates
job_templates = [
    {
        "name": f"batch-job-{i}",
        "spec": {
            "image": "ubuntu:22.04",
            "command": ["echo", f"Batch job {i}"],
            "resources": {"cpu": "1", "memory": "1Gi"}
        }
    }
    for i in range(3)
]

# Submit and monitor batch jobs
completed_jobs = submit_batch_jobs(client, job_templates)
print(f"All {len(completed_jobs)} jobs completed!")
```

## Next Steps

Now that you've completed the quickstart:

1. **[API Reference](/sdk/api)** - Explore all available methods and options
2. **[Configuration](/sdk/configuration)** - Learn advanced configuration options
3. **[Examples](https://github.com/omnivector-solutions/vantage-sdk-examples)** - See more complex real-world examples

## Common Patterns

### Asynchronous Processing (Python)

```python
import asyncio
from vantage_sdk import AsyncVantageClient

async def async_job_workflow():
    async_client = AsyncVantageClient(api_key="your-key")
    
    # Submit multiple jobs concurrently
    job_templates = [create_job_template(i) for i in range(5)]
    jobs = await asyncio.gather(*[
        async_client.jobs.submit(template) 
        for template in job_templates
    ])
    
    # Wait for all jobs to complete
    completed_jobs = await asyncio.gather(*[
        wait_for_job_completion_async(async_client, job.id)
        for job in jobs
    ])
    
    return completed_jobs

# Run async workflow
completed_jobs = asyncio.run(async_job_workflow())
```

### Job Templates with Variables

```python
# Template with variables
template_with_vars = {
    "name": "parameterized-job",
    "spec": {
        "image": "python:3.11",
        "command": ["python", "-c"],
        "args": ["print(f'Processing {dataset} with {algorithm}')"],
        "env": {
            "DATASET": "{{dataset}}",
            "ALGORITHM": "{{algorithm}}"
        },
        "resources": {
            "cpu": "{{cpu_cores}}",
            "memory": "{{memory_size}}"
        }
    }
}

# Submit with different parameters
for dataset in ['dataset1', 'dataset2']:
    for algorithm in ['linear', 'neural']:
        job_spec = substitute_variables(template_with_vars, {
            'dataset': dataset,
            'algorithm': algorithm,
            'cpu_cores': '2',
            'memory_size': '4Gi'
        })
        job = client.jobs.submit(job_spec)
        print(f"Submitted {dataset}/{algorithm} job: {job.id}")
```

You're now ready to build powerful integrations with the Vantage platform!
