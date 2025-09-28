---
title: Submit Job Script
sidebar_label: Submit Script
---

Submitting job scripts to Vantage clusters initiates computational work execution. This guide covers the submission process, optimization strategies, and monitoring techniques for successful job execution on high-performance computing resources.

## Overview

Job script submission is the critical transition from development to execution, involving:

- **Resource Allocation**: Requesting and securing computational resources from the cluster scheduler
- **Queue Management**: Understanding job prioritization and scheduling policies
- **Execution Monitoring**: Tracking job progress and performance during runtime
- **Error Handling**: Managing failures and implementing recovery strategies
- **Result Collection**: Retrieving outputs and analyzing computational results
- **Performance Optimization**: Tuning resource usage and execution efficiency

## Submission Process

### Basic Submission

Submit a job script for execution:

```bash
# Submit script to default queue
vantage job submit my-script.py

# Submit with custom job name
vantage job submit my-script.py --name "Data Analysis Job"

# Submit to specific queue
vantage job submit my-script.py --queue gpu-queue
```

### Resource Specification

Define computational resource requirements:

```bash
# Specify CPU and memory requirements
vantage job submit analysis.py \
  --cpus 8 \
  --memory 32GB \
  --time 4:00:00

# Request GPU resources
vantage job submit ml-training.py \
  --gpus 2 \
  --gpu-type V100 \
  --memory 64GB

# Specify storage requirements
vantage job submit data-processing.py \
  --cpus 16 \
  --memory 128GB \
  --tmp-storage 1TB
```

### Environment Configuration

Configure software environments and dependencies:

```bash
# Use specific software environment
vantage job submit script.py --env pytorch-env

# Load required modules
vantage job submit script.py --modules python/3.9,cuda/11.2

# Use container image
vantage job submit script.py --container tensorflow:latest
```

## Advanced Submission Options

### Array Jobs

Submit multiple related jobs as an array:

```bash
# Submit parameter sweep as job array
vantage job submit-array sweep-script.py \
  --array 1-100 \
  --param-file parameters.txt

# Submit with different input files
vantage job submit-array process-data.py \
  --array 1-50 \
  --input-pattern "data_${ARRAY_ID}.csv"
```

### Dependency Management

Manage job dependencies and workflows:

```bash
# Submit job with dependency
vantage job submit analysis.py --depend-on job-12345

# Chain multiple jobs
vantage job submit preprocess.py --name prep
vantage job submit analysis.py --depend-on-name prep --name analysis
vantage job submit visualize.py --depend-on-name analysis --name viz
```

### Scheduling Options

Control job scheduling and timing:

```bash
# Schedule job for future execution
vantage job submit script.py --start-time "2024-01-15 09:00"

# Set job priority
vantage job submit urgent-analysis.py --priority high

# Specify maximum runtime
vantage job submit long-job.py --max-time 24:00:00
```

## Monitoring and Management

### Job Status Tracking

Monitor job execution status:

```bash
# Check job status
vantage job status job-12345

# List all jobs
vantage job list --user $USER

# Monitor job queue
vantage job queue --status running
```

### Real-time Monitoring

Track job progress during execution:

```bash
# Follow job output
vantage job logs job-12345 --follow

# Monitor resource usage
vantage job monitor job-12345 --metrics cpu,memory,gpu

# Check job performance
vantage job stats job-12345
```

### Job Control Operations

Manage running jobs:

```bash
# Cancel job
vantage job cancel job-12345

# Suspend job
vantage job suspend job-12345

# Resume suspended job
vantage job resume job-12345

# Modify running job
vantage job modify job-12345 --time +2:00:00
```

## Best Practices

### Pre-Submission Checklist

- **Test Locally**: Verify script functionality with small datasets
- **Resource Estimation**: Calculate appropriate CPU, memory, and time requirements
- **Data Preparation**: Ensure all input data is accessible and properly formatted
- **Environment Verification**: Confirm all dependencies are available
- **Output Planning**: Define output locations and expected file sizes

### Resource Optimization

```python
# Example: Optimize resource usage in script
#!/usr/bin/env python3
import os
import multiprocessing

# Get allocated resources from scheduler
cpu_count = int(os.environ.get('SLURM_CPUS_PER_TASK', 1))
memory_limit = os.environ.get('SLURM_MEM_PER_NODE', '8GB')

# Configure parallel processing
pool = multiprocessing.Pool(processes=cpu_count)

# Memory-efficient data processing
for chunk in data_chunks:
    process_chunk(chunk, max_memory=memory_limit)
```

### Error Handling

Implement robust error handling and recovery:

```python
#!/usr/bin/env python3
import sys
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('job.log'),
        logging.StreamHandler()
    ]
)

try:
    # Main computation
    result = run_analysis()
    logging.info(f"Analysis completed successfully: {result}")
    
except Exception as e:
    logging.error(f"Job failed with error: {e}")
    logging.error(traceback.format_exc())
    
    # Save partial results if available
    if 'partial_results' in locals():
        save_checkpoint(partial_results)
        logging.info("Partial results saved for recovery")
    
    sys.exit(1)
```

## Performance Optimization

### Resource Tuning

- **CPU Scaling**: Match CPU count to algorithm parallelization
- **Memory Management**: Optimize memory usage for large datasets
- **I/O Optimization**: Minimize disk I/O and network transfers
- **GPU Utilization**: Ensure efficient GPU memory and compute usage

### Scheduling Optimization

- **Queue Selection**: Choose appropriate queues for job characteristics
- **Time Estimation**: Provide accurate runtime estimates for better scheduling
- **Resource Requests**: Request only necessary resources to improve queue times
- **Job Sizing**: Balance job size with scheduling efficiency

## Troubleshooting Common Issues

### Submission Failures

- **Resource Availability**: Verify requested resources are available
- **Permission Issues**: Check access to required files and directories
- **Environment Problems**: Ensure all software dependencies are accessible
- **Script Errors**: Validate script syntax and logic before submission

### Runtime Issues

- **Out of Memory**: Increase memory allocation or optimize data usage
- **Timeout Errors**: Extend job time limits or optimize performance
- **Network Issues**: Handle network connectivity and data transfer problems
- **Dependency Failures**: Ensure all required software and data are available

### Post-Execution Issues

- **Output Collection**: Verify all expected outputs were generated
- **Result Validation**: Check computational results for correctness
- **Resource Cleanup**: Remove temporary files and release resources
- **Performance Analysis**: Review job performance for future optimization
