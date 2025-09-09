---
id: create-submission
title: Create Job Submission
sidebar_label: Create Submission
---

Creating effective job submissions is fundamental to successfully running computational workloads on Vantage clusters. This guide covers the complete process from planning to execution.

## Planning Your Job Submission

### Requirements Analysis

Before creating a submission, analyze your computational needs:

#### Workload Characteristics

- **Computation Type**: CPU-intensive, memory-intensive, GPU-accelerated, or I/O-heavy
- **Parallelization**: Single-threaded, multi-threaded, or distributed processing
- **Runtime Estimate**: Expected execution time based on data size and complexity
- **Resource Scaling**: How resource requirements scale with input size

#### Data Requirements

- **Input Data Size**: Volume of data to be processed
- **Data Location**: Where input data is stored and accessibility
- **Output Size**: Expected volume of results and intermediate files
- **Data Transfer**: Network bandwidth requirements for data movement

#### Software Dependencies

- **Programming Environment**: Python, R, MATLAB, or other languages
- **Libraries and Modules**: Required software packages and versions
- **Licensing**: Software licensing requirements and availability
- **Containers**: Need for containerized environments

## Job Submission Methods

### Command Line Submission

Direct submission using cluster scheduler commands:

```bash
#!/bin/bash
# Basic SLURM job submission

sbatch --job-name=data_analysis \
       --account=research_project \
       --partition=compute \
       --nodes=1 \
       --cpus-per-task=16 \
       --mem=64G \
       --time=08:00:00 \
       --output=logs/analysis_%j.out \
       --error=logs/analysis_%j.err \
       analysis_script.sh
```

### Advanced Submission Scripts

Creating comprehensive submission scripts:

```bash
#!/bin/bash
#SBATCH --job-name=ml_training
#SBATCH --account=ml_research
#SBATCH --partition=gpu
#SBATCH --nodes=1
#SBATCH --cpus-per-task=32
#SBATCH --mem=256G
#SBATCH --gres=gpu:a100:4
#SBATCH --time=24:00:00
#SBATCH --output=logs/training_%j.out
#SBATCH --error=logs/training_%j.err
#SBATCH --mail-type=BEGIN,END,FAIL
#SBATCH --mail-user=researcher@university.edu

# Set strict error handling
set -euo pipefail

# Load required modules
module purge
module load python/3.9
module load cuda/11.8
module load cudnn/8.6

# Set environment variables
export OMP_NUM_THREADS=32
export CUDA_VISIBLE_DEVICES=0,1,2,3
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"

# Create output directories
mkdir -p logs models checkpoints

# Activate virtual environment
source venv/bin/activate

# Validate input data
if [[ ! -f "data/training_data.h5" ]]; then
    echo "Error: Training data not found" >&2
    exit 1
fi

# Start training with logging
echo "Starting training at $(date)"
echo "Job ID: $SLURM_JOB_ID"
echo "Node: $SLURMD_NODENAME"
echo "GPUs: $CUDA_VISIBLE_DEVICES"

python train_model.py \
    --data data/training_data.h5 \
    --output models/experiment_$(date +%Y%m%d_%H%M%S) \
    --batch-size 128 \
    --epochs 100 \
    --learning-rate 0.001 \
    --checkpoint-freq 10 \
    --gpus 4 \
    --verbose

echo "Training completed at $(date)"
```

### Interactive Job Submission

Creating interactive computing sessions:

```bash
# Request interactive session
srun --job-name=interactive_analysis \
     --partition=interactive \
     --cpus-per-task=8 \
     --mem=32G \
     --time=04:00:00 \
     --pty bash

# Alternative: Submit interactive job
sbatch --job-name=jupyter_session \
       --partition=interactive \
       --cpus-per-task=8 \
       --mem=32G \
       --time=08:00:00 \
       jupyter_server.sh
```

## Resource Specification

### CPU and Memory Configuration

Optimize CPU and memory allocation:

```bash
# CPU-intensive job
#SBATCH --cpus-per-task=64
#SBATCH --mem=128G

# Memory-intensive job  
#SBATCH --cpus-per-task=16
#SBATCH --mem=512G

# Balanced compute job
#SBATCH --cpus-per-task=32
#SBATCH --mem=256G
```

### GPU Resource Allocation

Specify GPU requirements effectively:

```bash
# Single GPU job
#SBATCH --gres=gpu:1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G

# Multi-GPU training
#SBATCH --gres=gpu:v100:4
#SBATCH --cpus-per-task=32
#SBATCH --mem=256G

# Specific GPU type
#SBATCH --gres=gpu:a100:2
#SBATCH --constraint=gpu_mem_80gb
```

### Storage and I/O Configuration

Configure storage for optimal performance:

```bash
#!/bin/bash
#SBATCH --job-name=data_processing
#SBATCH --tmp=500G  # Local scratch space

# Use local scratch for intensive I/O
SCRATCH_DIR="/tmp/job_${SLURM_JOB_ID}"
mkdir -p "$SCRATCH_DIR"

# Copy input data to scratch
echo "Copying data to local scratch..."
cp -r /shared/input_data/* "$SCRATCH_DIR/"

# Process data on local storage
cd "$SCRATCH_DIR"
python process_data.py --input . --output results/

# Copy results back to shared storage
echo "Copying results to shared storage..."
cp -r results/ "/shared/output/job_${SLURM_JOB_ID}/"

# Cleanup scratch space
rm -rf "$SCRATCH_DIR"
```

## Job Arrays and Parameter Sweeps

### Simple Job Arrays

Run multiple similar jobs efficiently:

```bash
#!/bin/bash
#SBATCH --job-name=parameter_sweep
#SBATCH --array=1-100
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=02:00:00
#SBATCH --output=logs/sweep_%A_%a.out

# Get array task ID
TASK_ID=$SLURM_ARRAY_TASK_ID

# Define parameter values
LEARNING_RATES=(0.001 0.01 0.1)
BATCH_SIZES=(32 64 128)

# Calculate parameter combination
LR_INDEX=$(( (TASK_ID - 1) % ${#LEARNING_RATES[@]} ))
BS_INDEX=$(( (TASK_ID - 1) / ${#LEARNING_RATES[@]} % ${#BATCH_SIZES[@]} ))

LEARNING_RATE=${LEARNING_RATES[$LR_INDEX]}
BATCH_SIZE=${BATCH_SIZES[$BS_INDEX]}

echo "Task $TASK_ID: LR=$LEARNING_RATE, BS=$BATCH_SIZE"

# Run experiment
python train.py \
    --learning-rate $LEARNING_RATE \
    --batch-size $BATCH_SIZE \
    --output "results/task_${TASK_ID}/"
```

### Advanced Parameter Sweeps

Complex parameter combinations with configuration files:

```python
#!/usr/bin/env python3
"""
Generate parameter sweep configurations
"""

import json
import itertools
from pathlib import Path

def generate_parameter_sweep():
    """Generate parameter combinations for sweep"""
    
    # Define parameter space
    parameters = {
        'learning_rate': [0.001, 0.01, 0.1],
        'batch_size': [32, 64, 128],
        'hidden_layers': [2, 3, 4],
        'dropout_rate': [0.1, 0.2, 0.3]
    }
    
    # Generate all combinations
    param_names = list(parameters.keys())
    param_values = list(parameters.values())
    combinations = list(itertools.product(*param_values))
    
    # Create configuration files
    config_dir = Path("configs")
    config_dir.mkdir(exist_ok=True)
    
    for i, combo in enumerate(combinations, 1):
        config = dict(zip(param_names, combo))
        config_file = config_dir / f"config_{i:03d}.json"
        
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
    
    print(f"Generated {len(combinations)} parameter combinations")
    return len(combinations)

if __name__ == "__main__":
    num_configs = generate_parameter_sweep()
```

```bash
#!/bin/bash
#SBATCH --job-name=config_sweep
#SBATCH --array=1-216  # Total number of configurations
#SBATCH --cpus-per-task=8
#SBATCH --mem=32G
#SBATCH --time=04:00:00

# Load configuration for this task
CONFIG_FILE="configs/config_$(printf "%03d" $SLURM_ARRAY_TASK_ID).json"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Configuration file not found: $CONFIG_FILE"
    exit 1
fi

echo "Using configuration: $CONFIG_FILE"

# Run experiment with configuration
python train_with_config.py \
    --config "$CONFIG_FILE" \
    --output "results/experiment_${SLURM_ARRAY_TASK_ID}/"
```

## Workflow and Dependency Management

### Sequential Job Dependencies

Chain jobs with dependencies:

```bash
#!/bin/bash
# Multi-stage workflow with dependencies

# Stage 1: Data preprocessing
JOB1=$(sbatch --parsable \
              --job-name=preprocess \
              --output=logs/preprocess_%j.out \
              preprocess_data.sh)

echo "Submitted preprocessing job: $JOB1"

# Stage 2: Model training (depends on preprocessing)
JOB2=$(sbatch --parsable \
              --dependency=afterok:$JOB1 \
              --job-name=training \
              --output=logs/training_%j.out \
              train_model.sh)

echo "Submitted training job: $JOB2"

# Stage 3: Model evaluation (depends on training)
JOB3=$(sbatch --parsable \
              --dependency=afterok:$JOB2 \
              --job-name=evaluation \
              --output=logs/evaluation_%j.out \
              evaluate_model.sh)

echo "Submitted evaluation job: $JOB3"

# Stage 4: Results analysis (depends on evaluation)
JOB4=$(sbatch --parsable \
              --dependency=afterok:$JOB3 \
              --job-name=analysis \
              --output=logs/analysis_%j.out \
              analyze_results.sh)

echo "Submitted analysis job: $JOB4"
echo "Workflow submitted: $JOB1 -> $JOB2 -> $JOB3 -> $JOB4"
```

### Parallel Workflow Branches

Create parallel processing workflows:

```bash
#!/bin/bash
# Parallel workflow with convergence

# Data preparation
PREP_JOB=$(sbatch --parsable data_preparation.sh)

# Parallel processing branches
BRANCH1=$(sbatch --dependency=afterok:$PREP_JOB --parsable analysis_branch1.sh)
BRANCH2=$(sbatch --dependency=afterok:$PREP_JOB --parsable analysis_branch2.sh)
BRANCH3=$(sbatch --dependency=afterok:$PREP_JOB --parsable analysis_branch3.sh)

# Convergence job (wait for all branches)
MERGE_JOB=$(sbatch --dependency=afterok:$BRANCH1:$BRANCH2:$BRANCH3 \
                   --parsable merge_results.sh)

echo "Parallel workflow:"
echo "  Preparation: $PREP_JOB"
echo "  Branch 1: $BRANCH1"
echo "  Branch 2: $BRANCH2" 
echo "  Branch 3: $BRANCH3"
echo "  Merge: $MERGE_JOB"
```

## Environment and Software Management

### Module Loading

Configure software environment:

```bash
#!/bin/bash
# Software environment setup

# Clear any existing modules
module purge

# Load core modules
module load gcc/11.2.0
module load python/3.9.7
module load openmpi/4.1.1

# Load domain-specific modules
module load fftw/3.3.10
module load hdf5/1.12.1
module load netcdf/4.8.1

# Load GPU modules (if needed)
if [[ "$SLURM_GRES" == *"gpu"* ]]; then
    module load cuda/11.8
    module load cudnn/8.6.0
    module load nccl/2.12.12
fi

# Display loaded modules
echo "Loaded modules:"
module list

# Set environment variables
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
export MPI_RANKS_PER_NODE=1
export PYTHONPATH="${PYTHONPATH}:$(pwd)/lib"

# Verify software availability
python --version
gcc --version
```

### Container-Based Jobs

Use containers for consistent environments:

```bash
#!/bin/bash
#SBATCH --job-name=container_job
#SBATCH --cpus-per-task=16
#SBATCH --mem=64G
#SBATCH --time=04:00:00

# Singularity container execution
singularity exec \
    --bind /data:/data \
    --bind /results:/results \
    tensorflow_latest.sif \
    python /data/train_model.py --output /results/

# Docker execution (if available)
docker run --rm \
    --gpus all \
    -v $(pwd)/data:/workspace/data \
    -v $(pwd)/results:/workspace/results \
    tensorflow/tensorflow:latest-gpu \
    python /workspace/data/train_model.py
```

### Virtual Environment Management

Manage Python virtual environments:

```bash
#!/bin/bash
# Python virtual environment setup

# Create virtual environment if it doesn't exist
if [[ ! -d "venv" ]]; then
    echo "Creating virtual environment..."
    python -m venv venv
    
    # Activate and install packages
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
else
    # Activate existing environment
    source venv/bin/activate
fi

# Verify environment
echo "Python path: $(which python)"
echo "Installed packages:"
pip list

# Run job with activated environment
python analysis_script.py
```

## Monitoring and Debugging

### Real-Time Monitoring

Monitor job progress during execution:

```bash
#!/bin/bash
# Job monitoring script

monitor_job() {
    local job_id="$1"
    
    echo "Monitoring job $job_id..."
    
    while squeue -j "$job_id" &>/dev/null; do
        # Job status
        echo "=== Job Status $(date) ==="
        squeue -j "$job_id" --format="%.18i %.9P %.20j %.8u %.8T %.10M %.6D %R"
        
        # Resource usage
        echo "=== Resource Usage ==="
        sstat -j "$job_id" --format=JobID,AveCPU,AveRSS,MaxRSS --parsable2 | tail -1
        
        # GPU usage (if applicable)
        if command -v nvidia-smi &>/dev/null; then
            echo "=== GPU Usage ==="
            nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total \
                      --format=csv,noheader,nounits
        fi
        
        echo ""
        sleep 60
    done
    
    # Final job statistics
    echo "=== Final Job Statistics ==="
    sacct -j "$job_id" --format=JobID,JobName,State,ExitCode,Elapsed,MaxRSS,MaxVMSize
}

# Usage: monitor_job <job_id>
```

### Debugging Failed Jobs

Diagnose and troubleshoot job failures:

```bash
#!/bin/bash
# Job debugging utility

debug_job() {
    local job_id="$1"
    
    echo "Debugging job $job_id"
    echo "==================="
    
    # Basic job information
    echo "Job Information:"
    scontrol show job "$job_id"
    echo ""
    
    # Job accounting
    echo "Job Accounting:"
    sacct -j "$job_id" --format=JobID,JobName,State,ExitCode,Start,End,Elapsed,MaxRSS,MaxVMSize
    echo ""
    
    # Check output files
    echo "Output Files:"
    find . -name "*${job_id}*" -type f | while read file; do
        echo "File: $file"
        echo "Size: $(stat -c%s "$file") bytes"
        echo "Last 10 lines:"
        tail -10 "$file"
        echo "---"
    done
    
    # Check for common issues
    echo "Common Issues Check:"
    
    # Memory issues
    max_rss=$(sacct -j "$job_id" --format=MaxRSS --noheader --parsable2)
    if [[ "$max_rss" == *"G" ]]; then
        echo "⚠️  High memory usage detected: $max_rss"
    fi
    
    # Time limit issues
    state=$(sacct -j "$job_id" --format=State --noheader --parsable2)
    if [[ "$state" == "TIMEOUT" ]]; then
        echo "⚠️  Job exceeded time limit"
    fi
    
    # Exit code check
    exit_code=$(sacct -j "$job_id" --format=ExitCode --noheader --parsable2)
    if [[ "$exit_code" != "0:0" ]]; then
        echo "⚠️  Non-zero exit code: $exit_code"
    fi
}
```

## Advanced Submission Techniques

### Dynamic Resource Allocation

Adjust resources based on input size:

```python
#!/usr/bin/env python3
"""
Dynamic resource calculator
"""

import os
import sys
from pathlib import Path

def calculate_resources(input_file):
    """Calculate optimal resources based on input size"""
    
    file_size = Path(input_file).stat().st_size
    size_gb = file_size / (1024**3)
    
    # Base resource calculations
    if size_gb < 1:
        cpus = 4
        memory = "16G"
        time = "02:00:00"
    elif size_gb < 10:
        cpus = 8
        memory = "32G"
        time = "04:00:00"
    elif size_gb < 100:
        cpus = 16
        memory = "64G"
        time = "08:00:00"
    else:
        cpus = 32
        memory = "128G"
        time = "24:00:00"
    
    return cpus, memory, time

def submit_dynamic_job(input_file, script):
    """Submit job with dynamically calculated resources"""
    
    cpus, memory, time = calculate_resources(input_file)
    
    # Create submission command
    cmd = f"""sbatch \\
        --job-name=dynamic_analysis \\
        --cpus-per-task={cpus} \\
        --mem={memory} \\
        --time={time} \\
        --export=INPUT_FILE={input_file} \\
        {script}"""
    
    print(f"Submitting job with resources: {cpus} CPUs, {memory} memory, {time} time")
    print(f"Command: {cmd}")
    
    # Execute submission
    os.system(cmd)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python dynamic_submit.py <input_file> <script>")
        sys.exit(1)
    
    submit_dynamic_job(sys.argv[1], sys.argv[2])
```

### Adaptive Job Submission

Implement retry logic and adaptive scheduling:

```bash
#!/bin/bash
# Adaptive job submission with retry logic

submit_with_retry() {
    local script="$1"
    local max_attempts=3
    local current_attempt=1
    local base_memory=32
    local base_time="04:00:00"
    
    while [[ $current_attempt -le $max_attempts ]]; do
        echo "Submission attempt $current_attempt of $max_attempts"
        
        # Calculate resources for this attempt
        memory=$((base_memory * current_attempt))
        
        # Adjust time limit for retry attempts
        case $current_attempt in
            1) time="$base_time" ;;
            2) time="08:00:00" ;;
            3) time="24:00:00" ;;
        esac
        
        echo "Using resources: ${memory}G memory, $time time"
        
        # Submit job
        job_id=$(sbatch --parsable \
                       --job-name="adaptive_job_attempt_${current_attempt}" \
                       --mem="${memory}G" \
                       --time="$time" \
                       "$script")
        
        if [[ $? -eq 0 ]]; then
            echo "Job submitted successfully: $job_id"
            
            # Wait for job completion
            while squeue -j "$job_id" &>/dev/null; do
                sleep 60
            done
            
            # Check job outcome
            exit_code=$(sacct -j "$job_id" --format=ExitCode --noheader --parsable2)
            state=$(sacct -j "$job_id" --format=State --noheader --parsable2)
            
            if [[ "$exit_code" == "0:0" && "$state" == "COMPLETED" ]]; then
                echo "Job completed successfully"
                return 0
            else
                echo "Job failed with exit code $exit_code, state $state"
                if [[ "$state" == "OUT_OF_MEMORY" || "$state" == "TIMEOUT" ]]; then
                    echo "Resource issue detected, will retry with increased resources"
                else
                    echo "Non-resource related failure, aborting retries"
                    return 1
                fi
            fi
        else
            echo "Job submission failed"
        fi
        
        ((current_attempt++))
    done
    
    echo "All retry attempts exhausted"
    return 1
}

# Usage
submit_with_retry "analysis_script.sh"
```

## Best Practices Summary

### Resource Management

- Right-size resources based on actual requirements
- Monitor resource usage and adjust accordingly
- Use job arrays for parameter sweeps
- Implement proper cleanup procedures

### Reliability

- Include comprehensive error handling
- Implement checkpointing for long jobs
- Use retry logic for transient failures
- Validate inputs before processing

### Efficiency

- Use local scratch space for I/O intensive operations
- Optimize parallel processing strategies
- Minimize data movement and copying
- Choose appropriate queues and partitions

### Monitoring

- Implement progress tracking and logging
- Monitor resource utilization during execution
- Set up notifications for job completion
- Debug failures systematically

## Next Steps

After mastering job submission:

- [Share Job Submissions](./share-submission) - Collaborate with team members
- [Delete Job Submissions](./delete-submission) - Manage job lifecycle
- Explore advanced workflow management tools
- Optimize submission strategies based on usage patterns
