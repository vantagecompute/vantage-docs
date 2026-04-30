---
id: public-clouds-azure-create-a-cluster
title: Create an Azure Cluster
slug: /platform/clusters/tutorials/public-clouds/azure/create-a-cluster
---

Learn how to create your first cluster on Microsoft Azure using Vantage's streamlined deployment process.

## Overview

This tutorial guides you through the complete process of deploying a compute cluster on Azure, from initial subscription configuration to successful deployment. You'll learn how to leverage Azure's robust infrastructure while maintaining the simplicity of Vantage's management interface.

## Prerequisites

Before you begin, ensure you have:

- An active Microsoft Azure subscription with billing enabled
- Azure service principal with appropriate permissions
- Vantage account with Azure integration permissions
- Basic understanding of Azure regions and availability zones

## Step 1: Configure Azure Integration

### Connect Your Azure Subscription

1. Navigate to **Settings** > **Cloud Accounts** in your Vantage dashboard
2. Click **Add Cloud Account** and select **Microsoft Azure**
3. Provide your Azure subscription details:
   - Subscription ID
   - Service Principal credentials (Client ID, Client Secret, Tenant ID)
   - Default region and resource group preferences

### Set Up Service Principal Permissions

Create a service principal with the following roles:

- Virtual Machine Contributor
- Network Contributor
- Storage Account Contributor
- Monitoring Reader

## Step 2: Choose Your Cluster Configuration

### Select Region and Availability Zone

1. In the Vantage cluster creation wizard, select your preferred Azure region
2. Choose availability zones based on your latency and compliance requirements
3. Consider proximity to your data sources and disaster recovery needs

### Configure Virtual Machine Sizes

Choose VM sizes based on your workload:

- **General Purpose** (B, D, F series): Balanced CPU-to-memory ratio
- **Compute Optimized** (F series): High CPU-to-memory ratio
- **Memory Optimized** (E, M series): High memory-to-CPU ratio
- **GPU Instances** (N series): Machine learning and HPC workloads

## Step 3: Network Configuration

### Virtual Network Setup

Configure your Virtual Network (VNet):

- Create a new VNet or use an existing one
- Set up subnets for different cluster components
- Configure virtual network gateway for hybrid connectivity
- Set up NAT gateway for outbound internet access

### Network Security Groups

Create network security groups with appropriate rules:

- Allow SSH access (port 22) from your IP ranges
- Open cluster communication ports
- Configure application-specific ports as needed
- Implement least-privilege network access

## Step 4: Deploy the Cluster

### Review Configuration

Before deployment, review:

- VM size specifications and instance count
- Network configuration and security settings
- Storage configuration (managed disks, storage accounts)
- Estimated costs including reserved instance options

### Launch Deployment

1. Click **Create Cluster** to begin deployment
2. Monitor the deployment progress in the Vantage dashboard
3. Azure Resource Manager will provision the infrastructure
4. Wait for all VMs to reach "Running" status

## Step 5: Verify Deployment

### Check Cluster Status

1. Navigate to **Clusters** in your Vantage dashboard
2. Verify all nodes are healthy and connected
3. Check the cluster's public IP address and load balancer configuration
4. Confirm virtual machine scale set is properly configured

### Test Connectivity

1. SSH into the head node using the provided connection details
2. Run basic cluster health checks
3. Verify job scheduler is running (if applicable)
4. Test internal node communication within the VNet

## Next Steps

Now that your Azure cluster is running:

- [Manage your cluster](./manage-cluster.md) for ongoing operations
- [Share your cluster](./share-cluster.md) with team members
- Submit your first compute job
- Set up monitoring with Azure Monitor

## Troubleshooting

### Common Issues

#### Deployment Fails

- Check Azure subscription quotas and limits
- Verify service principal permissions are correct
- Ensure selected VM sizes are available in your region
- Review network security group and VNet configuration

#### Cannot Connect to Cluster

- Verify network security group rules allow SSH access
- Check that your IP address is in allowed ranges
- Confirm the cluster VMs are in "Running" state
- Validate SSH key configuration and Azure Key Vault integration

#### High Costs

- Review VM size selections and instance counts
- Consider using Azure Spot Virtual Machines for fault-tolerant workloads
- Set up cost alerts and budgets in Azure Cost Management
- Evaluate reserved instance pricing for predictable workloads

#### Resource Quota Issues

- Check compute quotas in Azure portal
- Request quota increases through Azure support
- Consider distributing workload across multiple regions
- Monitor resource usage patterns and optimization opportunities

#### Network Connectivity Problems

- Verify VNet peering and routing configuration
- Check DNS resolution and custom DNS settings
- Validate load balancer health probes and backend pools
- Test connectivity with Azure Network Watcher

For additional support, contact the Vantage support team or check our troubleshooting guides.
