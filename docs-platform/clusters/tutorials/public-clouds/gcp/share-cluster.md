---
id: public-clouds-gcp-share-cluster
title: Share a GCP Cluster
slug: /platform/clusters/tutorials/public-clouds/gcp/share-cluster
---

Learn how to securely share your GCP clusters with team members, set up proper access controls, and manage collaborative access using Vantage and Google Cloud IAM integration.

## Overview

This tutorial guides you through the process of sharing GCP clusters with your team while maintaining security best practices and proper access controls. You'll learn how to leverage Google Cloud IAM for seamless and secure collaboration.

## Prerequisites

Before you begin, ensure you have:

- An active GCP cluster deployed through Vantage
- Administrative access to both Vantage and Google Cloud Project
- Understanding of Google Cloud IAM concepts (users, groups, service accounts)
- List of team members who need cluster access

## Understanding Access Models

### Vantage-Managed Access

Vantage provides centralized access management:

- **User Authentication**: Single sign-on through Vantage
- **Role-Based Permissions**: Predefined roles for different access levels
- **Audit Logging**: Complete access history and usage tracking
- **Resource Quotas**: Individual user resource limits and billing allocation

### Google Cloud IAM Integration

Leverage native GCP security features:

- **IAM Roles**: Google Cloud native role-based access
- **Service Accounts**: Application-level access control
- **Conditional Access**: Attribute-based access control (ABAC)
- **Organization Policies**: Enterprise-wide security constraints

## Setting Up Team Access

### Step 1: Configure Vantage User Management

#### Add Team Members

1. Navigate to **Settings** > **Users** in your Vantage dashboard
2. Click **Invite Users** and enter Google accounts or email addresses
3. Select appropriate role levels:
   - **Cluster Admin**: Full cluster management access
   - **Compute User**: Job submission and resource access
   - **Observer**: Read-only access to cluster status

#### Configure User Roles

Set up role-based access control:

1. **Cluster Administrator**:
   - Create, modify, and delete clusters
   - Manage user access and permissions
   - View billing and usage reports
   - Configure auto-scaling policies

2. **Compute User**:
   - Submit and monitor jobs
   - Access cluster compute resources
   - View personal usage statistics
   - Manage personal data and workspaces

3. **Observer**:
   - View cluster status and health metrics
   - Monitor job queues and completion rates
   - Access documentation and tutorials
   - Generate usage reports

### Step 2: Google Cloud IAM Configuration

#### Create Custom IAM Roles

Set up specific roles for cluster access:

```yaml
# Cluster User Role
title: "Vantage Cluster User"
description: "Access to compute resources on Vantage-managed clusters"
stage: "GA"
includedPermissions:
- compute.instances.get
- compute.instances.list
- compute.instances.use
- compute.zones.get
- compute.zones.list
- monitoring.metricDescriptors.list
- monitoring.metrics.list
- monitoring.timeSeries.list
```

#### Set Up Group-Based Access

For team management:

1. Create Google Groups for different access levels
2. Assign IAM roles to groups rather than individual users
3. Add team members to appropriate groups
4. Configure group membership policies

### Step 3: Configure SSH and Remote Access

#### OS Login Integration

Use Google Cloud OS Login for centralized SSH access:

1. **Enable OS Login** on all cluster instances
2. **Grant OS Login Roles** to team members:
   - `roles/compute.osLogin` for standard access
   - `roles/compute.osAdminLogin` for sudo access

3. **Configure SSH Keys** through Google Cloud Console or gcloud CLI
4. **Set up Two-Factor Authentication** for enhanced security

#### Identity-Aware Proxy (IAP)

Implement secure access without VPN:

1. **Enable IAP** for TCP forwarding
2. **Configure IAP Tunnel** for SSH access
3. **Set up IAP Access Policies** based on user identity
4. **Monitor Access** through Cloud Audit Logs

## Implementing Access Controls

### Resource Quotas and Limits

Set limits to prevent resource abuse:

1. **Per-User Quotas**:
   - Maximum concurrent instances
   - CPU hours per billing period
   - Memory usage restrictions
   - Persistent disk allocation limits

2. **Project-Level Controls**:
   - Organization policy constraints
   - Budget alerts and spending limits
   - Resource location restrictions
   - Machine type constraints

### Time-Based Access Controls

Control when users can access resources:

1. **Conditional IAM Policies**:
   - Time-based access restrictions
   - IP address-based access control
   - Device-based access policies
   - Multi-factor authentication requirements

2. **Scheduled Access**:
   - Business hours only access
   - Timezone-aware policies
   - Emergency access procedures
   - Automatic access revocation

### Workload Isolation

Separate different teams or projects:

1. **Subnet Isolation**:
   - Separate subnets for different teams
   - Network-level access controls
   - Traffic monitoring and logging

2. **Service Account Isolation**:
   - Dedicated service accounts per team
   - Limited cross-team resource access
   - Audit trail per service account

## Monitoring and Auditing

### Access Logging

Track cluster usage and access:

1. **Cloud Audit Logs**:
   - Admin activity logs for configuration changes
   - Data access logs for resource usage
   - System event logs for automated actions

2. **Custom Logging**:
   - Application-level access logs
   - Job submission and completion events
   - Resource usage pattern analysis

### Usage Analytics

Generate insights from cluster usage:

1. **Cloud Billing Reports**:
   - Cost breakdown by user and project
   - Resource utilization efficiency
   - Sustained use discount optimization

2. **Performance Metrics**:
   - Job completion rates by user
   - Queue wait times and priorities
   - Resource efficiency measurements

### Compliance and Security

Maintain security standards:

1. **Regular Access Reviews**:
   - Quarterly IAM permission audits
   - Remove inactive user accounts
   - Update permissions based on role changes

2. **Security Monitoring**:
   - Failed authentication tracking
   - Unusual access pattern detection
   - Automated security alert notifications
   - Compliance reporting automation

## Best Practices for Shared Clusters

### Security Guidelines

- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Regular Access Reviews**: Audit permissions quarterly with IAM Recommender
- **Multi-Factor Authentication**: Require 2FA for all admin access
- **Encrypted Communications**: Use TLS for all data transmission

### Operational Practices

- **Clear Documentation**: Maintain user guides and Standard Operating Procedures
- **Training Programs**: Educate users on Google Cloud security best practices
- **Support Channels**: Establish help desk for user issues and requests
- **Change Management**: Document and communicate policy changes

### Cost Management

- **Chargeback Mechanisms**: Use labels for cost allocation
- **Budget Alerts**: Set up proactive budget notifications
- **Resource Optimization**: Regular right-sizing with Recommender
- **Scheduled Operations**: Automatic off-hours cluster management

## Troubleshooting Access Issues

### Common Problems

#### User Cannot Access Cluster

- Verify Google account is added to appropriate groups
- Check IAM permissions and role bindings
- Validate OS Login configuration
- Confirm network connectivity and firewall rules

#### Permission Denied Errors

- Review IAM role assignments and custom roles
- Check organization policy constraints
- Verify service account permissions
- Test with Identity-Aware Proxy if applicable

#### SSH Connection Failures

- Verify OS Login is enabled on instances
- Check SSH key configuration in metadata
- Validate firewall rules for SSH traffic
- Test IAP tunnel configuration

## Advanced Sharing Scenarios

### Multi-Project Environments

Manage complex organizational structures:

- **Cross-Project Access**: Shared VPC and resource access
- **Hierarchical Permissions**: Organization and folder-level policies
- **Centralized Billing**: Consolidated cost management

### External Collaborations

Securely share with external partners:

- **Guest Accounts**: Time-limited external user access
- **Partner Organizations**: Cross-organization resource sharing
- **Compliance Controls**: Meet regulatory and audit requirements

### Hybrid Environments

Integrate with on-premises infrastructure:

- **Cloud Interconnect**: Dedicated network connections
- **Identity Federation**: Integrate with existing Active Directory
- **Hybrid Workloads**: Seamless resource sharing

## Next Steps

Enhance your cluster sharing setup:

- Implement advanced monitoring with Cloud Operations
- Set up automated user provisioning with Cloud Identity
- Explore federated identity with external providers
- Configure disaster recovery across regions

For complex organizational requirements or advanced security configurations, consult the Vantage documentation or contact our enterprise support team.
