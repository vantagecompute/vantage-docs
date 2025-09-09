---
id: public-clouds-azure-manage-cluster
title: Manage an Azure Cluster
slug: /platform/clusters/tutorials/public-clouds/azure/manage-cluster
---

Learn how to effectively manage, monitor, and maintain your Azure clusters using Vantage's comprehensive management tools and Azure's native monitoring services.

## Overview

This tutorial covers the essential operations for managing Azure clusters throughout their lifecycle, from day-to-day monitoring to scaling operations and maintenance tasks using Azure's comprehensive management tools.

## Prerequisites

Before you begin, ensure you have:

- An active Azure cluster deployed through Vantage
- Administrative access to the cluster and Azure subscription
- Basic understanding of Azure Monitor and Virtual Machine services
- Familiarity with your cluster's workload patterns

## Monitoring Your Cluster

### Real-time Dashboard

Access your cluster's health through the Vantage dashboard:

1. Navigate to **Clusters** > **Your Azure Cluster**
2. Review the real-time status indicators:
   - VM health and availability across availability zones
   - CPU and memory utilization across different VM sizes
   - Network traffic and managed disk performance
   - Job queue status and completion rates

### Azure Monitor Integration

Monitor detailed metrics through Azure Monitor:

- **VM Metrics**: CPU, memory, disk I/O, network throughput
- **Scale Set Metrics**: Scaling activities and health checks
- **Application Insights**: Custom application performance monitoring
- **Cost Management**: Spending analysis and budget tracking

### Setting Up Alerts

Configure proactive monitoring:

1. Set CPU utilization thresholds (e.g., greater than 80% for 5 minutes)
2. Monitor memory usage and disk space across managed disks
3. Track job failure rates and queue lengths
4. Set up cost alerts and budget notifications

## Scaling Operations

### Manual Scaling

Adjust cluster size based on current needs:

1. In the Vantage dashboard, go to **Cluster Settings**
2. Modify the **Instance Count** or **VM Sizes**
3. Review the estimated cost impact including reserved instance pricing
4. Apply changes and monitor virtual machine scale set updates

### Auto Scaling Configuration

Set up dynamic scaling with virtual machine scale sets:

1. **Scale-out Rules**: Add VMs when demand increases
   - Target metrics: CPU greater than 70%, Queue length greater than 10 jobs
   - Cooldown periods to prevent rapid scaling oscillation
   - Maximum instance limits for cost control

2. **Scale-in Rules**: Remove VMs when demand decreases
   - Target metrics: CPU less than 30%, Empty queue for 10 minutes
   - Minimum instance requirements for service availability
   - Graceful job completion handling

### VM Size Optimization

Optimize for cost and performance:

1. **Performance Analysis**:
   - Monitor resource utilization patterns across VM families
   - Identify bottlenecks (CPU, memory, network, storage)
   - Analyze job completion times across different VM sizes

2. **Right-sizing Recommendations**:
   - Use Azure Advisor optimization suggestions
   - Test different VM families (D, F, E, H series)
   - Consider Azure Spot Virtual Machines for cost savings

## Maintenance Operations

### Software Updates

Keep your cluster secure and up-to-date:

1. **Operating System Updates**:
   - Schedule maintenance windows using Azure Update Management
   - Use rolling updates with virtual machine scale sets
   - Test updates on development environments first

2. **Application Updates**:
   - Update job schedulers and runtime environments
   - Maintain version compatibility across cluster nodes
   - Document changes and implement rollback procedures

### Security Management

Maintain cluster security:

1. **Access Control**:
   - Regularly review Azure Active Directory permissions
   - Rotate service principal secrets and certificates
   - Monitor access logs in Azure Activity Log

2. **Network Security**:
   - Update network security group rules as needed
   - Review VNet configurations and subnet security
   - Implement network segmentation with application security groups

### Backup and Recovery

Protect your cluster data:

1. **Configuration Backups**:
   - Export ARM templates and cluster configurations
   - Document custom settings and integrations
   - Store configurations in Azure DevOps or GitHub

2. **Data Backups**:
   - Set up automated managed disk snapshots
   - Configure cross-region backup replication
   - Test recovery procedures with Azure Site Recovery

## Performance Optimization

### Resource Allocation

Optimize resource usage:

1. **Job Scheduling**:
   - Configure job priorities and resource limits
   - Implement fair-share scheduling policies
   - Optimize job placement across availability zones

2. **Storage Performance**:
   - Use appropriate managed disk types (Premium SSD, Standard SSD)
   - Configure disk caching for optimal I/O performance
   - Implement data lifecycle policies with Azure Storage

### Cost Optimization

Manage cluster costs effectively:

1. **Instance Management**:
   - Use Azure Spot Virtual Machines for non-critical workloads (up to 90% savings)
   - Schedule clusters for business hours only
   - Implement automated shutdown policies with Azure Automation

2. **Storage Optimization**:
   - Use Azure Blob Storage for long-term data archival
   - Implement data compression and deduplication
   - Clean up temporary files and snapshots regularly

3. **Reserved Instances**:
   - Evaluate reserved instance pricing for predictable workloads
   - Monitor utilization patterns for optimization opportunities
   - Consider Azure Hybrid Benefit for Windows Server workloads

## Troubleshooting Common Issues

### Performance Problems

#### High CPU Usage

- Identify resource-intensive jobs with Azure Monitor
- Consider scaling up to larger VM sizes
- Optimize application code and resource allocation

#### Memory Issues

- Monitor memory usage patterns and page file activity
- Adjust job memory limits and VM configurations
- Upgrade to memory-optimized VM sizes (E or M series)

#### Network Bottlenecks

- Monitor network utilization with Azure Network Watcher
- Consider accelerated networking for high-throughput workloads
- Use proximity placement groups for low-latency applications

### Connectivity Issues

#### SSH Access Problems

- Verify network security group rules allow SSH access
- Check VNet routing and virtual network gateway configuration
- Validate SSH key configuration in Azure Key Vault

#### Job Submission Failures

- Check job scheduler health and system logs
- Verify queue configurations and resource availability
- Monitor managed disk performance and availability

### Cost and Billing Issues

#### Unexpected High Costs

- Review detailed cost analysis in Azure Cost Management
- Check for orphaned resources (disks, public IPs, load balancers)
- Verify Spot VM usage and interruption patterns

#### Resource Quota Limits

- Monitor quotas in Azure portal
- Request quota increases through Azure support portal
- Consider distributing workload across multiple regions

## Best Practices

### Daily Operations

- Review cluster health dashboards in Vantage and Azure portal
- Monitor cost and usage reports with Azure Cost Management
- Check for security alerts and recommended updates

### Weekly Reviews

- Analyze performance trends and resource utilization patterns
- Review and adjust auto-scaling policies based on workload patterns
- Plan for upcoming capacity needs and maintenance windows

### Monthly Maintenance

- Perform security updates using Azure Update Management
- Review and optimize costs with Azure Advisor recommendations
- Test backup and recovery procedures
- Update documentation and operational procedures

## Next Steps

Continue improving your cluster management:

- [Share your cluster](./share-cluster.md) with team members
- Implement advanced monitoring with Application Insights
- Set up disaster recovery with Azure Site Recovery
- Explore hybrid connectivity with Azure ExpressRoute

For additional support and advanced configurations, consult the Vantage documentation or contact our support team.
