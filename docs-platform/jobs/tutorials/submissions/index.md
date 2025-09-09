---
id: introduction
title: Job Submissions Introduction
sidebar_label: Introduction
---

Job submissions in Vantage represent the process of requesting computational resources and executing workloads on cluster infrastructure. Understanding job submission workflows is essential for effectively utilizing cluster resources and managing computational tasks.

## What are Job Submissions?

Job submissions are requests to the cluster scheduler that include:

- **Resource Requirements**: CPU, memory, GPU, and storage specifications
- **Execution Instructions**: Scripts, commands, or applications to run
- **Scheduling Parameters**: Priority, queue selection, and timing constraints
- **Environment Configuration**: Software modules, environment variables, and dependencies
- **Input/Output Specifications**: Data sources, output destinations, and file handling

## Types of Job Submissions

### Batch Jobs

Traditional batch processing for non-interactive workloads:

- **Computational Jobs**: CPU-intensive calculations and simulations
- **Data Processing**: Large-scale data analysis and transformation
- **Rendering Jobs**: Graphics and visualization processing
- **Machine Learning**: Model training and hyperparameter optimization

### Interactive Jobs

Real-time interactive computing sessions:

- **Development Work**: Code development and debugging
- **Data Exploration**: Interactive analysis and visualization
- **Testing**: Algorithm testing and validation
- **Prototyping**: Rapid development and experimentation

### Array Jobs

Parallel execution of similar tasks with different parameters:

- **Parameter Sweeps**: Running simulations with different input parameters
- **Data Splits**: Processing datasets divided into chunks
- **Monte Carlo Simulations**: Running multiple random simulations
- **Batch Processing**: Processing multiple files or datasets

### Workflow Jobs

Complex multi-step computational workflows:

- **Pipeline Processing**: Sequential data processing stages
- **Dependency Management**: Jobs with dependencies on other jobs
- **Conditional Execution**: Dynamic workflow paths based on results
- **Resource Optimization**: Dynamic resource allocation across workflow steps

## Job Submission Lifecycle

### Submission Phase

1. **Job Preparation**: Resource planning and script development
2. **Parameter Configuration**: Setting resource requirements and options
3. **Validation**: Checking job specifications and dependencies
4. **Queue Submission**: Submitting job to scheduler queue

### Scheduling Phase

1. **Queue Management**: Job placement in appropriate queue
2. **Resource Allocation**: Matching job requirements with available resources
3. **Priority Processing**: Scheduling based on priority and policies
4. **Execution Start**: Launching job on allocated resources

### Execution Phase

1. **Environment Setup**: Configuring software environment and dependencies
2. **Data Staging**: Moving input data to compute nodes
3. **Job Execution**: Running computational workload
4. **Output Collection**: Gathering results and logs

### Completion Phase

1. **Resource Cleanup**: Releasing allocated resources
2. **Output Transfer**: Moving results to permanent storage
3. **Status Reporting**: Recording job completion status and metrics
4. **Billing and Accounting**: Resource usage tracking and accounting

## Submission Methods

### Command Line Interface

Direct submission using cluster commands:

```bash
# SLURM example
sbatch --job-name=analysis \
       --cpus-per-task=16 \
       --mem=32G \
       --time=04:00:00 \
       --output=job_%j.out \
       analysis_script.sh

# PBS example  
qsub -N analysis \
     -l select=1:ncpus=16:mem=32gb \
     -l walltime=04:00:00 \
     -o job_output.log \
     analysis_script.sh
```

### Web Interface

Browser-based job submission through Vantage portal:

- **Form-Based Submission**: Fill out web forms with job parameters
- **Template Selection**: Choose from pre-configured job templates
- **File Upload**: Upload scripts and data through web interface
- **Real-Time Monitoring**: Track job progress and status

### API Integration

Programmatic submission using REST APIs:

```python
import requests
import json

# Vantage API submission example
job_spec = {
    "name": "data_analysis",
    "script": "analysis.py",
    "resources": {
        "cpus": 16,
        "memory": "32GB",
        "walltime": "04:00:00"
    },
    "environment": {
        "modules": ["python/3.9", "numpy/1.21"],
        "variables": {"OMP_NUM_THREADS": "16"}
    },
    "input_files": ["data.csv", "config.yaml"],
    "output_directory": "/results/analysis_run_001"
}

response = requests.post(
    "https://vantage.cluster.org/api/jobs",
    headers={"Authorization": "Bearer YOUR_TOKEN"},
    json=job_spec
)

job_id = response.json()["job_id"]
print(f"Job submitted with ID: {job_id}")
```

### Workflow Engines

Integration with workflow management systems:

```yaml
# Nextflow example
process ANALYSIS {
    cpus 16
    memory '32 GB'
    time '4h'
    
    input:
    path input_data
    
    output:
    path "results/*"
    
    script:
    """
    python analysis.py --input ${input_data} --output results/
    """
}
```

## Resource Management

### Resource Types

Understanding different resource categories:

#### Compute Resources

- **CPU Cores**: Processing power for computational tasks
- **Memory (RAM)**: Working memory for data processing
- **Local Storage**: Temporary disk space for job execution
- **Network Bandwidth**: Data transfer capabilities

#### Specialized Resources

- **GPUs**: Graphics processing units for parallel computing
- **High Memory Nodes**: Nodes with large memory capacity
- **Fast Storage**: High-performance storage systems
- **Interconnect**: High-speed networking for parallel jobs

#### Software Resources

- **Licensed Software**: Applications requiring license management
- **Container Runtime**: Docker/Singularity container support
- **Parallel Libraries**: MPI, OpenMP, and other parallel frameworks
- **Specialized Tools**: Domain-specific software and libraries

### Resource Specification

Properly specifying resource requirements:

```bash
#!/bin/bash
#SBATCH --job-name=ml_training
#SBATCH --partition=gpu
#SBATCH --nodes=1
#SBATCH --cpus-per-task=16
#SBATCH --mem=128G
#SBATCH --gres=gpu:v100:2
#SBATCH --time=12:00:00
#SBATCH --output=logs/training_%j.out
#SBATCH --error=logs/training_%j.err

# Load required modules
module load python/3.9
module load cuda/11.2
module load cudnn/8.2

# Set environment variables
export OMP_NUM_THREADS=16
export CUDA_VISIBLE_DEVICES=0,1

# Run training job
python train_model.py \
    --data /data/training_set.h5 \
    --output /models/experiment_001/ \
    --batch-size 128 \
    --epochs 100 \
    --gpus 2
```

### Resource Optimization

Strategies for efficient resource utilization:

#### Right-Sizing Resources

- **CPU Allocation**: Match CPU count to application parallelization
- **Memory Sizing**: Allocate sufficient memory without waste
- **Time Limits**: Set realistic walltime limits
- **GPU Usage**: Request GPUs only when needed

#### Monitoring and Tuning

```bash
# Monitor resource usage during execution
monitor_job_resources() {
    local job_id="$1"
    
    while squeue -j "$job_id" &>/dev/null; do
        # CPU and memory usage
        sstat -j "$job_id" --format=JobID,AveCPU,AveRSS,MaxRSS,MaxRSSNode
        
        # GPU utilization (if applicable)
        if command -v nvidia-smi &>/dev/null; then
            nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total \
                      --format=csv,noheader,nounits
        fi
        
        sleep 60
    done
}
```

## Job Queues and Scheduling

### Queue Types

Understanding different queue categories:

#### Standard Queues

- **General Purpose**: Default queue for most workloads
- **Short Jobs**: Quick jobs with limited runtime
- **Long Jobs**: Extended runtime for large computations
- **Development**: Interactive development and testing

#### Specialized Queues

- **GPU Queue**: Jobs requiring GPU resources
- **High Memory**: Jobs requiring large memory allocation
- **Priority Queue**: High-priority or urgent jobs
- **Preemptible**: Lower-cost queue with potential interruption

#### Organizational Queues

- **Project Queues**: Dedicated resources for specific projects
- **Department Queues**: Resources allocated to departments
- **Research Queues**: Academic research allocations
- **Commercial Queues**: Industry and commercial users

### Scheduling Policies

How jobs are prioritized and scheduled:

#### Fair Share Scheduling

- **User Quotas**: Allocation based on user or project quotas
- **Historical Usage**: Priority adjustment based on past usage
- **Resource Sharing**: Fair distribution among users and projects
- **Backfill Scheduling**: Efficient resource utilization

#### Priority-Based Scheduling

```bash
# Submit high-priority job
sbatch --priority=high \
       --qos=urgent \
       critical_analysis.sh

# Submit low-priority job that can be preempted
sbatch --priority=low \
       --qos=preemptible \
       background_processing.sh
```

## Best Practices

### Job Design

Designing efficient and reliable jobs:

#### Modular Design

- **Script Organization**: Break complex workflows into modular components
- **Error Handling**: Implement robust error checking and recovery
- **Logging**: Comprehensive logging for debugging and monitoring
- **Checkpointing**: Save intermediate results for long-running jobs

#### Resource Efficiency

- **Parallel Processing**: Utilize available CPU cores effectively
- **Memory Management**: Optimize memory usage patterns
- **I/O Optimization**: Minimize data movement and file operations
- **Cleanup**: Proper cleanup of temporary files and resources

### Submission Strategy

Optimizing job submission patterns:

#### Batch Optimization

```bash
# Submit multiple related jobs efficiently
for param in $(seq 1 100); do
    sbatch --job-name="analysis_${param}" \
           --export=PARAM=${param} \
           parameter_sweep.sh
done

# Or use job arrays for better efficiency
sbatch --array=1-100 \
       --job-name="parameter_sweep" \
       array_analysis.sh
```

#### Dependency Management

```bash
# Submit jobs with dependencies
job1=$(sbatch --parsable job1.sh)
job2=$(sbatch --dependency=afterok:$job1 --parsable job2.sh)
job3=$(sbatch --dependency=afterok:$job2 --parsable job3.sh)

echo "Submitted workflow: $job1 -> $job2 -> $job3"
```

### Monitoring and Troubleshooting

Tracking job progress and resolving issues:

#### Job Status Monitoring

```bash
# Check job status
squeue -u $USER

# Detailed job information
scontrol show job $JOB_ID

# Job accounting information
sacct -j $JOB_ID --format=JobID,JobName,State,ExitCode,Elapsed,MaxRSS
```

#### Common Issues and Solutions

- **Resource Limitations**: Adjust resource requests based on actual usage
- **Software Dependencies**: Ensure all required modules and libraries are available
- **Data Access**: Verify input data is accessible from compute nodes
- **Output Permissions**: Check write permissions for output directories

## Getting Started

To begin submitting jobs effectively:

1. **Understand Cluster Policies**: Review resource limits and usage policies
2. **Choose Appropriate Queues**: Select queues matching your workload requirements
3. **Start Small**: Begin with simple jobs before scaling to complex workflows
4. **Monitor Usage**: Track resource utilization and optimize accordingly
5. **Learn from Examples**: Study successful job submissions from others

## Next Steps

- [Create Job Submissions](create-submission) - Learn to submit jobs effectively
- [Share Job Submissions](share-submission) - Collaborate on job workflows
- [Delete Job Submissions](delete-submission) - Manage job lifecycle and cleanup
