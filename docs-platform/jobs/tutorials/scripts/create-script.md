---
id: create-script
title: Create Job Script
sidebar_label: Create Script
---

Creating effective job scripts is essential for successful job execution on Vantage clusters. This guide walks through the process of developing, testing, and optimizing job scripts for various computational workloads.

## Planning Your Script

### Define Requirements

Before writing code, clearly define your script requirements:

#### Computational Goals

- **Primary Objective**: What computation or analysis will the script perform?
- **Input Data**: What data sources and formats will be processed?
- **Expected Output**: What results, files, or data products should be generated?
- **Success Criteria**: How will you measure successful completion?

#### Resource Requirements

- **CPU Needs**: Number of cores and processing requirements
- **Memory Requirements**: RAM needed for data processing and intermediate results
- **Storage Needs**: Disk space for input, output, and temporary files
- **Runtime Estimates**: Expected execution time and scheduling constraints

#### Dependencies and Environment

- **Software Requirements**: Programming languages, libraries, and tools
- **Environment Modules**: Required software modules and versions
- **Container Images**: Docker or Singularity containers if needed
- **License Requirements**: Software licensing and availability constraints

## Script Development Process

### Step 1: Choose Script Framework

Select the appropriate scripting approach:

#### Bash Shell Scripts

Best for system operations and workflow orchestration:

```bash
#!/bin/bash
#SBATCH --job-name=my_workflow
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=02:00:00

set -e  # Exit on any error
set -u  # Exit on undefined variables

# Script implementation goes here
```

#### Python Scripts

Ideal for data processing and scientific computing:

```python
#!/usr/bin/env python3
"""
Job script for data analysis workflow
"""

import argparse
import logging
import sys
from pathlib import Path

def setup_logging():
    """Configure logging for the job script"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def main():
    parser = argparse.ArgumentParser(description='Data analysis job')
    parser.add_argument('--input', required=True, help='Input data file')
    parser.add_argument('--output', required=True, help='Output directory')
    
    args = parser.parse_args()
    setup_logging()
    
    # Implementation goes here
    
if __name__ == "__main__":
    main()
```

#### R Scripts

Perfect for statistical analysis and modeling:

```r
#!/usr/bin/env Rscript

# Parse command line arguments
args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("Usage: script.R <input_file> <output_dir>")
}

input_file <- args[1]
output_dir <- args[2]

# Ensure output directory exists
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

# Script implementation goes here
```

### Step 2: Implement Core Logic

Develop the main computational components:

#### Data Input and Validation

```bash
# Validate input files exist and are readable
validate_inputs() {
    local input_file="$1"
    
    if [[ ! -f "$input_file" ]]; then
        echo "Error: Input file '$input_file' not found" >&2
        exit 1
    fi
    
    if [[ ! -r "$input_file" ]]; then
        echo "Error: Input file '$input_file' not readable" >&2
        exit 1
    fi
    
    echo "Input validation successful"
}
```

#### Environment Setup

```bash
# Setup computational environment
setup_environment() {
    echo "Setting up environment..."
    
    # Load required modules
    module purge
    module load python/3.9
    module load gcc/9.3.0
    
    # Activate virtual environment
    if [[ -n "${VIRTUAL_ENV_PATH:-}" ]]; then
        source "$VIRTUAL_ENV_PATH/bin/activate"
    fi
    
    # Set environment variables
    export OMP_NUM_THREADS="${SLURM_CPUS_PER_TASK:-1}"
    export PYTHONPATH="${PYTHONPATH:-}:$(pwd)/src"
    
    echo "Environment setup complete"
}
```

#### Main Processing Logic

```python
def process_data(input_file, output_dir):
    """Main data processing function"""
    import pandas as pd
    import numpy as np
    
    # Load and validate data
    try:
        data = pd.read_csv(input_file)
        logging.info(f"Loaded data with {len(data)} rows")
    except Exception as e:
        logging.error(f"Failed to load data: {e}")
        raise
    
    # Perform analysis
    results = {}
    
    # Statistical summary
    results['summary'] = data.describe()
    
    # Custom analysis
    results['processed'] = data.groupby('category').agg({
        'value': ['mean', 'std', 'count']
    })
    
    # Save results
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    results['summary'].to_csv(output_path / 'summary.csv')
    results['processed'].to_csv(output_path / 'processed.csv')
    
    logging.info(f"Results saved to {output_dir}")
    return results
```

### Step 3: Add Error Handling

Implement comprehensive error management:

#### Error Detection and Reporting

```bash
# Error handling function
handle_error() {
    local exit_code=$?
    local line_number=$1
    
    echo "Error occurred in script at line $line_number (exit code: $exit_code)" >&2
    echo "Cleaning up temporary files..." >&2
    cleanup_temp_files
    
    # Send notification if configured
    if [[ -n "${ERROR_NOTIFICATION_EMAIL:-}" ]]; then
        echo "Job script failed at line $line_number" | \
            mail -s "Job Failure: $SLURM_JOB_NAME" "$ERROR_NOTIFICATION_EMAIL"
    fi
    
    exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO' ERR
```

#### Resource Cleanup

```bash
# Cleanup function
cleanup_temp_files() {
    echo "Performing cleanup..."
    
    # Remove temporary directories
    if [[ -n "${TEMP_DIR:-}" && -d "$TEMP_DIR" ]]; then
        rm -rf "$TEMP_DIR"
        echo "Removed temporary directory: $TEMP_DIR"
    fi
    
    # Cleanup any running background processes
    jobs -p | xargs -r kill
    
    echo "Cleanup complete"
}

# Ensure cleanup on exit
trap cleanup_temp_files EXIT
```

#### Retry Logic

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1, backoff=2):
    """Decorator for retrying failed operations"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 1
            while attempt <= max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        logging.error(f"Function {func.__name__} failed after {max_attempts} attempts")
                        raise
                    
                    logging.warning(f"Attempt {attempt} failed: {e}. Retrying in {delay} seconds...")
                    time.sleep(delay)
                    delay *= backoff
                    attempt += 1
            
        return wrapper
    return decorator

@retry(max_attempts=3, delay=2)
def download_data(url, output_file):
    """Download data with retry logic"""
    # Implementation with potential network failures
    pass
```

### Step 4: Add Monitoring and Logging

Implement comprehensive monitoring:

#### Performance Monitoring

```bash
# Performance monitoring function
monitor_resources() {
    local pid=$1
    local log_file="$2"
    
    while kill -0 "$pid" 2>/dev/null; do
        # Log CPU and memory usage
        ps -o pid,pcpu,pmem,rss,vsz,comm -p "$pid" >> "$log_file"
        sleep 30
    done
}

# Start main process and monitor it
python analysis.py &
MAIN_PID=$!

# Start resource monitoring in background
monitor_resources "$MAIN_PID" "resource_usage.log" &
MONITOR_PID=$!

# Wait for main process to complete
wait "$MAIN_PID"
MAIN_EXIT_CODE=$?

# Stop monitoring
kill "$MONITOR_PID" 2>/dev/null || true

exit $MAIN_EXIT_CODE
```

#### Progress Tracking

```python
import logging
from tqdm import tqdm

def process_large_dataset(data_chunks):
    """Process data with progress tracking"""
    total_chunks = len(data_chunks)
    results = []
    
    with tqdm(total=total_chunks, desc="Processing chunks") as pbar:
        for i, chunk in enumerate(data_chunks):
            try:
                result = process_chunk(chunk)
                results.append(result)
                
                # Log progress periodically
                if (i + 1) % 10 == 0:
                    logging.info(f"Processed {i + 1}/{total_chunks} chunks")
                
                pbar.update(1)
                
            except Exception as e:
                logging.error(f"Failed to process chunk {i}: {e}")
                # Continue with next chunk or exit based on requirements
                
    return results
```

## Advanced Script Features

### Parameterization

Make scripts flexible with parameters:

```bash
# Default parameter values
INPUT_FILE=""
OUTPUT_DIR="./results"
NUM_THREADS="${SLURM_CPUS_PER_TASK:-4}"
MEMORY_LIMIT="16G"
DEBUG_MODE=false

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -i|--input)
                INPUT_FILE="$2"
                shift 2
                ;;
            -o|--output)
                OUTPUT_DIR="$2"
                shift 2
                ;;
            -t|--threads)
                NUM_THREADS="$2"
                shift 2
                ;;
            -m|--memory)
                MEMORY_LIMIT="$2"
                shift 2
                ;;
            -d|--debug)
                DEBUG_MODE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo "Unknown parameter: $1" >&2
                show_help
                exit 1
                ;;
        esac
    done
}
```

### Configuration Files

Support external configuration:

```python
import yaml
import json
from pathlib import Path

def load_config(config_file):
    """Load configuration from file"""
    config_path = Path(config_file)
    
    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_file}")
    
    if config_path.suffix.lower() == '.yaml' or config_path.suffix.lower() == '.yml':
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    elif config_path.suffix.lower() == '.json':
        with open(config_path, 'r') as f:
            return json.load(f)
    else:
        raise ValueError(f"Unsupported configuration format: {config_path.suffix}")

# Example configuration usage
def main():
    config = load_config('job_config.yaml')
    
    # Use configuration values
    input_file = config['data']['input_file']
    output_dir = config['data']['output_dir']
    processing_params = config['processing']
    
    # Process with configuration
    process_data(input_file, output_dir, **processing_params)
```

### Checkpoint and Resume

Implement checkpoint functionality:

```python
import pickle
from pathlib import Path

class JobCheckpoint:
    def __init__(self, checkpoint_dir="./checkpoints"):
        self.checkpoint_dir = Path(checkpoint_dir)
        self.checkpoint_dir.mkdir(exist_ok=True)
    
    def save_checkpoint(self, step, state, checkpoint_name="main"):
        """Save current processing state"""
        checkpoint_file = self.checkpoint_dir / f"{checkpoint_name}_step_{step}.pkl"
        
        checkpoint_data = {
            'step': step,
            'state': state,
            'timestamp': time.time()
        }
        
        with open(checkpoint_file, 'wb') as f:
            pickle.dump(checkpoint_data, f)
        
        logging.info(f"Checkpoint saved: {checkpoint_file}")
    
    def load_checkpoint(self, checkpoint_name="main"):
        """Load the latest checkpoint"""
        pattern = f"{checkpoint_name}_step_*.pkl"
        checkpoint_files = list(self.checkpoint_dir.glob(pattern))
        
        if not checkpoint_files:
            return None
        
        # Find latest checkpoint
        latest_file = max(checkpoint_files, key=lambda x: x.stat().st_mtime)
        
        with open(latest_file, 'rb') as f:
            checkpoint_data = pickle.load(f)
        
        logging.info(f"Checkpoint loaded: {latest_file}")
        return checkpoint_data

# Usage example
def main():
    checkpoint = JobCheckpoint()
    
    # Try to resume from checkpoint
    saved_state = checkpoint.load_checkpoint()
    if saved_state:
        start_step = saved_state['step'] + 1
        current_state = saved_state['state']
        logging.info(f"Resuming from step {start_step}")
    else:
        start_step = 0
        current_state = initialize_state()
        logging.info("Starting from beginning")
    
    # Process with checkpointing
    for step in range(start_step, total_steps):
        current_state = process_step(step, current_state)
        
        # Save checkpoint every 10 steps
        if step % 10 == 0:
            checkpoint.save_checkpoint(step, current_state)
```

## Testing and Validation

### Local Testing

Test scripts on local systems:

```bash
# Create test environment
setup_test_environment() {
    echo "Setting up test environment..."
    
    # Create test data
    mkdir -p test_data
    echo "sample,data,for,testing" > test_data/input.csv
    
    # Set test parameters
    export SLURM_CPUS_PER_TASK=2
    export SLURM_JOB_ID=test_job
    export SLURM_JOB_NAME=test_script
    
    echo "Test environment ready"
}

# Run tests
run_tests() {
    echo "Running script tests..."
    
    setup_test_environment
    
    # Test with minimal data
    bash my_script.sh -i test_data/input.csv -o test_results/
    
    # Validate results
    if [[ -f "test_results/summary.csv" ]]; then
        echo "Test PASSED: Output file created"
    else
        echo "Test FAILED: No output file found"
        exit 1
    fi
    
    echo "All tests passed"
}
```

### Performance Testing

Validate resource usage and performance:

```python
import time
import psutil
import logging

class PerformanceProfiler:
    def __init__(self):
        self.start_time = None
        self.peak_memory = 0
        self.cpu_samples = []
    
    def start_profiling(self):
        """Start performance monitoring"""
        self.start_time = time.time()
        self.peak_memory = 0
        self.cpu_samples = []
        logging.info("Performance profiling started")
    
    def sample_resources(self):
        """Sample current resource usage"""
        memory_mb = psutil.virtual_memory().used / 1024 / 1024
        cpu_percent = psutil.cpu_percent()
        
        self.peak_memory = max(self.peak_memory, memory_mb)
        self.cpu_samples.append(cpu_percent)
    
    def report_performance(self):
        """Generate performance report"""
        if self.start_time is None:
            return
        
        duration = time.time() - self.start_time
        avg_cpu = sum(self.cpu_samples) / len(self.cpu_samples) if self.cpu_samples else 0
        
        report = f"""
Performance Report:
- Duration: {duration:.2f} seconds
- Peak Memory: {self.peak_memory:.2f} MB
- Average CPU: {avg_cpu:.2f}%
- CPU Samples: {len(self.cpu_samples)}
        """
        
        logging.info(report)
        return {
            'duration': duration,
            'peak_memory_mb': self.peak_memory,
            'avg_cpu_percent': avg_cpu
        }

# Usage in main script
def main():
    profiler = PerformanceProfiler()
    profiler.start_profiling()
    
    try:
        # Your main processing logic here
        for i in range(processing_steps):
            process_step(i)
            profiler.sample_resources()
    
    finally:
        profiler.report_performance()
```

## Deployment and Optimization

### Script Optimization

Optimize for cluster execution:

#### I/O Optimization

```bash
# Use local scratch space for intensive I/O
setup_scratch_space() {
    # Use node-local storage if available
    if [[ -n "${SLURM_JOB_ID:-}" ]]; then
        SCRATCH_DIR="/tmp/job_${SLURM_JOB_ID}"
    else
        SCRATCH_DIR="/tmp/script_$$"
    fi
    
    mkdir -p "$SCRATCH_DIR"
    
    # Copy input data to scratch
    echo "Copying input data to scratch space..."
    cp -r "$INPUT_DIR"/* "$SCRATCH_DIR/"
    
    # Set working directory to scratch
    cd "$SCRATCH_DIR"
    
    echo "Working directory: $(pwd)"
}

# Copy results back on completion
copy_results_back() {
    echo "Copying results back to shared storage..."
    cp -r results/ "$OUTPUT_DIR/"
    echo "Results copied successfully"
}
```

#### Parallel Processing

```python
import multiprocessing as mp
from concurrent.futures import ProcessPoolExecutor, as_completed

def parallel_processing(data_chunks, num_workers=None):
    """Process data chunks in parallel"""
    if num_workers is None:
        num_workers = mp.cpu_count()
    
    logging.info(f"Starting parallel processing with {num_workers} workers")
    
    results = []
    with ProcessPoolExecutor(max_workers=num_workers) as executor:
        # Submit all tasks
        future_to_chunk = {
            executor.submit(process_chunk, chunk): i 
            for i, chunk in enumerate(data_chunks)
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_chunk):
            chunk_id = future_to_chunk[future]
            try:
                result = future.result()
                results.append((chunk_id, result))
                logging.info(f"Completed chunk {chunk_id}")
            except Exception as e:
                logging.error(f"Chunk {chunk_id} failed: {e}")
    
    # Sort results by chunk ID
    results.sort(key=lambda x: x[0])
    return [result for _, result in results]
```

### Resource Management

Optimize resource utilization:

```bash
# Dynamic resource allocation
allocate_resources() {
    # Get allocated resources from scheduler
    NUM_CPUS="${SLURM_CPUS_PER_TASK:-1}"
    MEMORY_MB="${SLURM_MEM_PER_NODE:-8192}"
    
    # Calculate optimal thread counts
    if [[ $NUM_CPUS -ge 16 ]]; then
        PYTHON_THREADS=$((NUM_CPUS - 2))  # Leave 2 cores for system
        OMP_THREADS=$NUM_CPUS
    else
        PYTHON_THREADS=$NUM_CPUS
        OMP_THREADS=$NUM_CPUS
    fi
    
    # Set environment variables
    export OMP_NUM_THREADS=$OMP_THREADS
    export MKL_NUM_THREADS=$OMP_THREADS
    export OPENBLAS_NUM_THREADS=$OMP_THREADS
    
    echo "Resource allocation:"
    echo "  CPUs: $NUM_CPUS"
    echo "  Memory: ${MEMORY_MB}MB"
    echo "  Python threads: $PYTHON_THREADS"
    echo "  OpenMP threads: $OMP_THREADS"
}
```

## Best Practices Summary

### Code Quality

- Use version control for script management
- Write clear, well-commented code
- Follow language-specific style guidelines
- Implement comprehensive error handling
- Add thorough input validation

### Performance

- Profile scripts to identify bottlenecks
- Optimize I/O operations and data movement
- Use appropriate parallelization strategies
- Monitor and tune resource usage
- Implement efficient algorithms and data structures

### Reliability

- Test scripts thoroughly before deployment
- Implement checkpoint and resume functionality
- Add comprehensive logging and monitoring
- Design for graceful failure and recovery
- Validate outputs and intermediate results

### Maintainability

- Use configuration files for parameters
- Document script purpose and usage
- Follow consistent naming conventions
- Implement modular, reusable components
- Plan for script evolution and updates

## Next Steps

After creating your script:

- [Share Job Scripts](./share-script) - Collaborate with team members
- [Delete Job Scripts](./delete-script) - Manage script lifecycle
- Test in staging environment before production deployment
- Monitor performance and optimize based on usage patterns
