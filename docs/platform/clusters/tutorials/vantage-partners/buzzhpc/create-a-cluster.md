---
id: vantage-partners-buzzhpc-create-a-cluster
title: Create a BuzzHPC Cluster
slug: /platform/clusters/tutorials/vantage-partners/buzzhpc/create-a-cluster
---

Learn how to create your first high-performance computing cluster on BuzzHPC's specialized infrastructure using Vantage's research-optimized deployment process.

## Overview

This tutorial guides you through deploying a scientific computing cluster on BuzzHPC's purpose-built HPC infrastructure. You'll learn how to leverage their specialized hardware, software stack, and research-focused optimizations while maintaining the simplicity of Vantage's management interface.

## Prerequisites

Before you begin, ensure you have:

- An active BuzzHPC partnership agreement through Vantage
- BuzzHPC account credentials and resource allocation
- Understanding of your computational science requirements
- Basic knowledge of HPC concepts (MPI, parallel computing, job scheduling)

## Step 1: Configure BuzzHPC Integration

### Connect Your BuzzHPC Account

1. Navigate to **Settings** > **Cloud Accounts** in your Vantage dashboard
2. Click **Add Cloud Account** and select **BuzzHPC**
3. Provide your BuzzHPC integration details:
   - Account credentials and API access tokens
   - Resource allocation and quota information
   - Preferred HPC cluster configurations
   - Research institution affiliation details

### Verify HPC Capabilities

Configure access to specialized HPC features:

- High-speed interconnect access (InfiniBand, Omni-Path)
- Parallel file system availability
- Scientific software stack access
- Specialized hardware (GPUs, high-memory nodes)
- Research data storage integration

## Step 2: Choose Your HPC Configuration

### Select Compute Architecture

1. **CPU-Optimized Nodes**:
   - High-core count processors for parallel workloads
   - Optimized for scientific computing applications
   - Advanced vector processing capabilities
   - Memory configurations for computational requirements

2. **GPU-Accelerated Nodes**:
   - NVIDIA Tesla/A100 for CUDA workloads
   - AMD Instinct for ROCm applications
   - Machine learning and AI acceleration
   - Computational fluid dynamics and molecular modeling

3. **High-Memory Nodes**:
   - Large memory configurations for in-memory computing
   - Optimized for genome analysis and large datasets
   - Memory-bound scientific applications
   - Large-scale simulation preprocessing

### Configure HPC Networking

Set up high-performance interconnects:

- **InfiniBand Configuration**: Low-latency, high-bandwidth networking
- **Parallel File System Access**: Shared storage for HPC workloads
- **MPI Optimization**: Message passing interface tuning
- **Network Topology**: Optimized for your specific parallel algorithms

## Step 3: Scientific Software Stack Setup

### Pre-configured Software Environment

Access BuzzHPC's scientific software stack:

1. **Computational Science Applications**:
   - Molecular dynamics (GROMACS, NAMD, LAMMPS)
   - Computational fluid dynamics (OpenFOAM, ANSYS Fluent)
   - Quantum chemistry (Gaussian, VASP, CP2K)
   - Climate and weather modeling (WRF, CESM)

2. **Development Tools and Libraries**:
   - Compiler suites (Intel, GNU, PGI)
   - MPI implementations (OpenMPI, Intel MPI, MVAPICH)
   - Mathematical libraries (Intel MKL, BLAS, LAPACK)
   - Debugging and profiling tools (Intel VTune, TAU)

### Custom Software Installation

Configure additional research software:

- Module system setup for software environment management
- Custom application compilation and optimization
- Research-specific library installation
- Performance tuning for your specific workloads

## Step 4: Data Management Configuration

### Research Data Storage

Set up scientific data management:

1. **High-Performance Storage**:
   - Parallel file systems for concurrent data access
   - High-throughput data transfer capabilities
   - Backup and archival storage integration
   - Research data lifecycle management

2. **Data Transfer Optimization**:
   - GridFTP for large scientific datasets
   - Aspera for high-speed file transfers
   - Research network integration (Internet2, ESnet)
   - Data staging and preprocessing workflows

### Collaborative Data Sharing

Configure research collaboration features:

- Shared project directories and permissions
- Version control integration for research code
- Data sharing protocols for multi-institutional projects
- Compliance with research data management requirements

## Step 5: Deploy the HPC Cluster

### Review HPC Configuration

Before deployment, review:

- Compute node specifications and interconnect topology
- Scientific software stack and module configuration
- Storage and data management setup
- Network performance and bandwidth requirements
- Cost allocation and research budget considerations

### Launch HPC Deployment

1. Click **Create Cluster** to begin HPC deployment
2. Monitor deployment progress in Vantage dashboard
3. BuzzHPC infrastructure provisioning and optimization
4. Wait for all HPC nodes to reach operational status
5. Verify scientific software stack availability

## Step 6: Verify HPC Deployment

### Check Cluster Status

1. Navigate to **Clusters** in your Vantage dashboard
2. Verify all HPC nodes are healthy and connected
3. Check high-speed interconnect status and performance
4. Confirm job scheduler (Slurm/PBS) is operational

### Validate HPC Performance

1. Run HPC benchmarks and performance tests
2. Test MPI communication and scaling
3. Verify parallel file system performance
4. Validate GPU acceleration if applicable

### Test Scientific Applications

1. Load and test pre-configured scientific software
2. Run sample computational jobs
3. Verify module system functionality
4. Test data access and transfer performance

## Step 7: Optimize for Research Workloads

### Performance Tuning

Optimize cluster for scientific computing:

1. **Application-Specific Optimization**:
   - Compiler flags and optimization settings
   - MPI parameter tuning for your applications
   - Memory allocation and NUMA optimization
   - I/O optimization for data-intensive workloads

2. **Job Scheduling Optimization**:
   - Queue configuration for different job types
   - Priority settings for research priorities
   - Resource allocation policies
   - Fair-share scheduling for multi-user environments

### Research Workflow Integration

Integrate with existing research workflows:

- Version control systems (Git, SVN) for research code
- Research data management systems integration
- Laboratory information management system (LIMS) connectivity
- Computational notebook integration (Jupyter, R Markdown)

## Next Steps

Now that your BuzzHPC cluster is running:

- [Manage your cluster](./manage-cluster.md) for ongoing HPC operations
- [Share your cluster](./share-cluster.md) with research collaborators
- Submit your first scientific computing jobs
- Set up advanced HPC monitoring and optimization

## Troubleshooting

### Common HPC Issues

#### Performance Problems

- Check MPI scaling and communication patterns
- Verify interconnect performance and configuration
- Monitor memory usage and NUMA effects
- Optimize I/O patterns for parallel file systems

#### Scientific Software Issues

- Verify module system configuration and dependencies
- Check compiler and library compatibility
- Validate license availability for commercial software
- Test application-specific performance optimizations

#### Network and Storage Issues

- Test InfiniBand/high-speed interconnect performance
- Verify parallel file system mounting and permissions
- Check data transfer rates and optimization
- Monitor storage usage and quota management

#### Job Scheduling Problems

- Review job scheduler configuration and policies
- Check resource allocation and queue limits
- Verify fair-share scheduling and priority settings
- Monitor job efficiency and resource utilization

For additional support with BuzzHPC specialized configurations or scientific computing optimization, contact the Vantage support team or BuzzHPC directly through our research partnership channels.
