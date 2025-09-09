---
id: public-clouds-gcp-create-a-cluster
title: Create a GCP Cluster
slug: /platform/clusters/tutorials/public-clouds/gcp/create-a-cluster
---

Learn how to create your first cluster on Google Cloud Platform using Vantage's streamlined deployment process.

## Overview

This tutorial guides you through the complete process of deploying a compute cluster on GCP, from initial project configuration to successful deployment. You'll learn how to leverage GCP's powerful infrastructure while maintaining the simplicity of Vantage's management interface.

## Prerequisites

Before you begin, ensure you have:

- An active Google Cloud Platform project with billing enabled
- GCP Service Account with appropriate permissions
- Vantage account with GCP integration permissions
- Basic understanding of GCP regions and zones

## Step 1: Configure GCP Integration

### Connect Your GCP Project

1. Navigate to **Settings** > **Cloud Accounts** in your Vantage dashboard
2. Click **Add Cloud Account** and select **Google Cloud Platform**
3. Provide your GCP project details:
   - Project ID
   - Service Account JSON key
   - Default region and zone preferences

### Set Up Service Account Permissions

Create a service account with the following roles:

- Compute Admin
- Service Account User
- Project IAM Admin (for dynamic permission management)
- Monitoring Viewer

## Step 2: Choose Your Cluster Configuration

### Select Region and Zone

1. In the Vantage cluster creation wizard, select your preferred GCP region
2. Choose zones based on your latency and compliance requirements
3. Consider proximity to your data and disaster recovery needs

### Configure Machine Types

Choose machine types based on your workload:

- **General Purpose** (N1, N2, E2): Balanced CPU and memory
- **Compute Optimized** (C2): High-performance computing workloads
- **Memory Optimized** (M1, M2): Memory-intensive applications
- **GPU Instances** (N1 with GPU): Machine learning and scientific computing

## Step 3: Network Configuration

### VPC Setup

Configure your Virtual Private Cloud:

- Create a new VPC or use an existing one
- Set up subnets in your chosen regions
- Configure Cloud Router for external connectivity
- Set up Cloud NAT for private instance internet access

### Firewall Rules

Create firewall rules for cluster communication:

- Allow SSH access (port 22) from your IP ranges
- Open cluster communication ports
- Configure application-specific ports as needed
- Implement least-privilege access principles

## Step 4: Deploy the Cluster

### Review Configuration

Before deployment, review:

- Machine type specifications and count
- Network configuration and security settings
- Storage configuration and performance requirements
- Estimated costs including sustained use discounts

### Launch Deployment

1. Click **Create Cluster** to begin deployment
2. Monitor the deployment progress in the Vantage dashboard
3. GCP Deployment Manager will provision the infrastructure
4. Wait for all instances to reach "RUNNING" status

## Step 5: Verify Deployment

### Check Cluster Status

1. Navigate to **Clusters** in your Vantage dashboard
2. Verify all nodes are healthy and connected
3. Check the cluster's external IP address and endpoints
4. Confirm managed instance group is properly configured

### Test Connectivity

1. SSH into the head node using the provided connection details
2. Run basic cluster health checks
3. Verify job scheduler is running (if applicable)
4. Test internal node communication

## Next Steps

Now that your GCP cluster is running:

- [Manage your cluster](./manage-cluster.md) for ongoing operations
- [Share your cluster](./share-cluster.md) with team members
- Submit your first compute job
- Set up monitoring with Cloud Operations

## Troubleshooting

### Common Issues

#### Deployment Fails

- Check GCP quotas for your project and region
- Verify service account permissions are correct
- Ensure selected machine types are available in your zone
- Review firewall rules and network configuration

#### Cannot Connect to Cluster

- Verify firewall rules allow SSH access from your IP
- Check that your IP address is in allowed ranges
- Confirm the cluster is in "RUNNING" state
- Validate SSH key configuration

#### High Costs

- Review machine type selections and sizes
- Consider using preemptible instances for fault-tolerant workloads
- Set up billing alerts in GCP console
- Optimize for sustained use discounts

#### Quota Issues

- Check compute quotas in GCP console
- Request quota increases if needed
- Consider spreading workload across multiple regions
- Monitor resource usage patterns

For additional support, contact the Vantage support team or check our troubleshooting guides.
