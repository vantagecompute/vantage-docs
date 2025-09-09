---
id: public-clouds-aws-create-a-cluster
title: Create an AWS Cluster
slug: /platform/clusters/tutorials/public-clouds/aws/create-a-cluster
---

Learn how to create your first cluster on Amazon Web Services using Vantage's streamlined deployment process.

## Overview

This tutorial guides you through the complete process of deploying a compute cluster on AWS, from initial configuration to successful deployment. You'll learn how to leverage AWS's robust infrastructure while maintaining the simplicity of Vantage's management interface.

## Prerequisites

Before you begin, ensure you have:

- An active AWS account with billing enabled
- AWS CLI configured or IAM user credentials ready
- Vantage account with AWS integration permissions
- Basic understanding of AWS regions and availability zones

## Step 1: Configure AWS Integration

### Connect Your AWS Account

1. Navigate to **Settings** > **Cloud Accounts** in your Vantage dashboard
2. Click **Add Cloud Account** and select **Amazon Web Services**
3. Choose your preferred authentication method:
   - **IAM Role** (recommended for production)
   - **Access Keys** (for development/testing)

### Set Up IAM Permissions

Create an IAM role or user with the following permissions:

- EC2 full access
- VPC read/write access
- Auto Scaling permissions
- CloudFormation permissions

## Step 2: Choose Your Cluster Configuration

### Select Region and Zone

1. In the Vantage cluster creation wizard, select your preferred AWS region
2. Choose availability zones based on your latency and compliance requirements
3. Consider data locality and disaster recovery needs

### Configure Instance Types

Choose instance types based on your workload:

- **Compute Optimized** (C5, C6i): CPU-intensive workloads
- **Memory Optimized** (R5, R6i): Memory-intensive applications
- **General Purpose** (M5, M6i): Balanced workloads
- **GPU Instances** (P3, P4): Machine learning and HPC

## Step 3: Network Configuration

### VPC Setup

Configure your Virtual Private Cloud:

- Create a new VPC or use an existing one
- Set up public and private subnets
- Configure internet gateway for external access
- Set up NAT gateway for private subnet internet access

### Security Groups

Create security groups with appropriate rules:

- Allow SSH access (port 22) from your IP ranges
- Open cluster communication ports
- Configure application-specific ports as needed

## Step 4: Deploy the Cluster

### Review Configuration

Before deployment, review:

- Instance specifications and count
- Network configuration
- Security settings
- Estimated costs

### Launch Deployment

1. Click **Create Cluster** to begin deployment
2. Monitor the deployment progress in the Vantage dashboard
3. AWS CloudFormation will provision the infrastructure
4. Wait for all instances to reach "Running" state

## Step 5: Verify Deployment

### Check Cluster Status

1. Navigate to **Clusters** in your Vantage dashboard
2. Verify all nodes are healthy and connected
3. Check the cluster's public IP address and endpoints

### Test Connectivity

1. SSH into the head node using the provided connection details
2. Run basic cluster health checks
3. Verify job scheduler is running (if applicable)

## Next Steps

Now that your AWS cluster is running:

- [Manage your cluster](./manage-cluster.md) for ongoing operations
- [Share your cluster](./share-cluster.md) with team members
- Submit your first compute job
- Set up monitoring and alerting

## Troubleshooting

### Common Issues

#### Deployment Fails

- Check AWS service limits in your account
- Verify IAM permissions are correct
- Ensure selected instance types are available in your region

#### Cannot Connect to Cluster

- Verify security group rules allow SSH access
- Check that your IP address is whitelisted
- Confirm the cluster is in "Running" state

#### High Costs

- Review instance types and sizes
- Consider using spot instances for non-critical workloads
- Set up billing alerts in AWS console

For additional support, contact the Vantage support team or check our troubleshooting guides.
