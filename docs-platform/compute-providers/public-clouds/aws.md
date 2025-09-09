---
id: compute-providers-public-clouds-aws
title: Amazon Web Services (AWS)
sidebar_position: 1
description: Deploy and manage Vantage clusters on Amazon Web Services (AWS) cloud infrastructure.
---

# Amazon Web Services (AWS)

Amazon Web Services (AWS) is one of the leading cloud computing platforms, offering a comprehensive suite of infrastructure services that make it an excellent choice for high-performance computing workloads with Vantage.

## Overview

AWS provides the scalability, reliability, and performance needed for demanding computational workloads. With Vantage on AWS, you can:

- **Auto-scaling clusters**: Automatically scale compute resources based on workload demands
- **Global availability**: Deploy clusters across multiple AWS regions worldwide
- **Cost optimization**: Leverage spot instances and reserved capacity for cost-effective computing
- **Enterprise security**: Benefit from AWS's robust security and compliance features

## Key AWS Services for HPC

### Compute Services
- **Amazon EC2**: Virtual servers with various instance types optimized for compute, memory, or storage
- **AWS Batch**: Fully managed batch computing service for running jobs at any scale
- **Amazon ECS/EKS**: Container orchestration services for containerized workloads

### Storage Services
- **Amazon S3**: Object storage for data lakes, backups, and archival
- **Amazon EFS**: Fully managed file system for shared storage across compute instances
- **Amazon FSx**: High-performance file systems optimized for HPC workloads

### Networking
- **Amazon VPC**: Isolated cloud resources with complete networking control
- **AWS Direct Connect**: Dedicated network connection from your premises to AWS

## Getting Started with AWS

To deploy Vantage clusters on AWS, you'll need:

1. **AWS Account**: An active AWS account with appropriate permissions
2. **IAM Roles**: Properly configured IAM roles for Vantage cluster management
3. **Network Configuration**: VPC and subnet configuration for your clusters
4. **Security Groups**: Network security rules for cluster communication

## Instance Types for HPC

AWS offers several instance families optimized for different HPC use cases:

- **C6i/C6a**: Compute-optimized instances for CPU-intensive workloads
- **M6i/M6a**: General-purpose instances with balanced compute, memory, and networking
- **R6i/R6a**: Memory-optimized instances for memory-intensive applications
- **Hpc6a**: Purpose-built for tightly coupled HPC workloads
- **P4/G5**: GPU instances for AI, machine learning, and parallel computing

## Cost Optimization

Maximize your AWS investment with these strategies:

- **Spot Instances**: Save up to 90% on compute costs for fault-tolerant workloads
- **Reserved Instances**: Predictable workloads benefit from reserved capacity discounts
- **Savings Plans**: Flexible pricing model for consistent usage patterns
- **Auto Scaling**: Automatically adjust capacity to match demand

## Next Steps

- Create an AWS Account (see AWS documentation)
- Configure IAM Roles (see AWS documentation)
- Deploy Your First Cluster

---

> **Ready to get started?** Check out our AWS cluster deployment guide for step-by-step instructions.