---
id: public-clouds-azure-share-cluster
title: Share an Azure Cluster
slug: /platform/clusters/tutorials/public-clouds/azure/share-cluster
---

Learn how to securely share your Azure clusters with team members, set up proper access controls, and manage collaborative access using Vantage and Azure Active Directory integration.

## Overview

This tutorial guides you through the process of sharing Azure clusters with your team while maintaining security best practices and proper access controls. You'll learn how to leverage Azure Active Directory and role-based access control for seamless and secure collaboration.

## Prerequisites

Before you begin, ensure you have:

- An active Azure cluster deployed through Vantage
- Administrative access to both Vantage and Azure Active Directory
- Understanding of Azure RBAC concepts (users, groups, service principals, managed identities)
- List of team members who need cluster access

## Understanding Access Models

### Vantage-Managed Access

Vantage provides centralized access management:

- **User Authentication**: Single sign-on through Vantage with Azure AD integration
- **Role-Based Permissions**: Predefined roles for different access levels
- **Audit Logging**: Complete access history and usage tracking
- **Resource Quotas**: Individual user resource limits and cost allocation

### Azure Active Directory Integration

Leverage native Azure security features:

- **Azure RBAC**: Fine-grained role-based access control
- **Managed Identities**: Secure service-to-service authentication
- **Conditional Access**: Advanced security policies and MFA
- **Privileged Identity Management**: Just-in-time access for administrative roles

## Setting Up Team Access

### Step 1: Configure Vantage User Management

#### Add Team Members

1. Navigate to **Settings** > **Users** in your Vantage dashboard
2. Click **Invite Users** and enter Azure AD user principals or email addresses
3. Select appropriate role levels:
   - **Cluster Admin**: Full cluster management access
   - **Compute User**: Job submission and resource access
   - **Observer**: Read-only access to cluster status and metrics

#### Configure User Roles

Set up role-based access control:

1. **Cluster Administrator**:
   - Create, modify, and delete clusters
   - Manage user access and permissions
   - View billing and usage reports
   - Configure auto-scaling and maintenance policies

2. **Compute User**:
   - Submit and monitor jobs
   - Access cluster compute resources
   - View personal usage statistics
   - Manage personal data and workspaces

3. **Observer**:
   - View cluster status and health metrics
   - Monitor job queues and completion rates
   - Access documentation and tutorials
   - Generate read-only usage reports

### Step 2: Azure Active Directory Configuration

#### Create Azure AD Groups

Set up groups for team management:

1. Create security groups in Azure AD:
   - **Vantage-Cluster-Admins**
   - **Vantage-Compute-Users**
   - **Vantage-Observers**

2. Assign appropriate Azure RBAC roles to groups:
   - Virtual Machine Contributor
   - Monitoring Reader
   - Storage Blob Data Contributor
   - Network Contributor (limited scope)

#### Configure Custom RBAC Roles

Create specialized roles for cluster access:

```json
{
  "Name": "Vantage Cluster User",
  "Description": "Custom role for Vantage cluster users",
  "Actions": [
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Insights/metrics/read",
    "Microsoft.Insights/metricDefinitions/read"
  ],
  "NotActions": [
    "Microsoft.Compute/virtualMachines/delete"
  ],
  "AssignableScopes": [
    "/subscriptions/{subscription-id}/resourceGroups/{cluster-rg}"
  ]
}
```

### Step 3: Configure Secure Access Methods

#### Azure Bastion Integration

Implement secure RDP/SSH access:

1. **Deploy Azure Bastion** in the cluster's VNet
2. **Configure Host Pool** for different user groups
3. **Set up Session Recording** for compliance
4. **Implement Just-In-Time Access** for administrative tasks

#### Managed Identity Configuration

Set up service-to-service authentication:

1. **System-Assigned Managed Identity** for cluster VMs
2. **User-Assigned Managed Identity** for shared services
3. **Role Assignments** with minimal required permissions
4. **Key Vault Integration** for secrets management

## Implementing Access Controls

### Resource-Level Permissions

Set granular access controls:

1. **Resource Group Scope**:
   - Limit access to specific cluster resource groups
   - Prevent accidental modification of shared resources
   - Implement resource locks for critical components

2. **VM-Level Access**:
   - Role assignments at individual VM level
   - Startup/shutdown permissions without delete access
   - Performance monitoring without configuration changes

### Conditional Access Policies

Implement advanced security controls:

1. **Multi-Factor Authentication**:
   - Require MFA for all administrative access
   - Configure trusted locations and devices
   - Implement risk-based authentication

2. **Device Compliance**:
   - Require managed or compliant devices
   - Implement device-based access policies
   - Monitor and log device access patterns

### Azure Policy Integration

Enforce organizational standards:

1. **Resource Tagging Requirements**:
   - Mandatory cost center and project tags
   - Automated tag inheritance
   - Compliance reporting and remediation

2. **Security Baseline Policies**:
   - Enforce encryption at rest and in transit
   - Require approved VM extensions only
   - Implement network security requirements

## Monitoring and Auditing

### Activity Logging

Track cluster usage and access:

1. **Azure Activity Log**:
   - Administrative actions and configuration changes
   - Resource creation, modification, and deletion
   - Role assignment and permission changes

2. **Azure AD Audit Logs**:
   - User authentication and authorization events
   - Group membership changes
   - Conditional access policy evaluations

### Custom Monitoring

Implement application-level tracking:

1. **Job Submission Tracking**:
   - User-specific job submission patterns
   - Resource usage by user and project
   - Cost allocation and chargeback reporting

2. **Performance Analytics**:
   - User efficiency and resource utilization
   - Queue wait times by user priority
   - Cost optimization opportunities

### Compliance Reporting

Generate audit and compliance reports:

1. **Access Reviews**:
   - Quarterly user access certification
   - Automated access review workflows
   - Exception reporting and remediation

2. **Security Assessments**:
   - Azure Security Center recommendations
   - Vulnerability assessment reports
   - Compliance dashboard monitoring

## Best Practices for Shared Clusters

### Security Guidelines

- **Zero Trust Approach**: Verify every access request
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Regular Access Reviews**: Quarterly certification with Azure AD Access Reviews
- **Multi-Factor Authentication**: Required for all administrative access

### Operational Practices

- **Clear Documentation**: Maintain comprehensive user guides and procedures
- **Training Programs**: Regular security awareness and Azure best practices training
- **Support Channels**: Dedicated help desk with Azure expertise
- **Change Management**: Formal approval process for access changes

### Cost Management

- **Chargeback Implementation**: Use resource tags for accurate cost allocation
- **Budget Controls**: Set spending limits per user or department
- **Resource Optimization**: Regular Azure Advisor reviews and implementation
- **Reserved Capacity**: Optimize costs with reserved instances and savings plans

## Troubleshooting Access Issues

### Common Problems

#### User Cannot Access Cluster

- Verify Azure AD group membership and role assignments
- Check conditional access policy compliance
- Validate Azure Bastion configuration and connectivity
- Confirm subscription and resource group permissions

#### Permission Denied Errors

- Review custom RBAC role definitions and assignments
- Check Azure Policy compliance and restrictions
- Validate managed identity configuration
- Test with elevated permissions to isolate issues

#### Authentication Failures

- Verify Azure AD user account status and MFA setup
- Check conditional access policy requirements
- Validate device compliance and trust status
- Review Azure AD sign-in logs for detailed error information

## Advanced Sharing Scenarios

### Multi-Tenant Environments

Manage complex organizational structures:

- **Azure AD B2B**: External user collaboration
- **Cross-Tenant Access**: Resource sharing across Azure tenants
- **Guest User Management**: Limited access for external partners

### Enterprise Integration

Connect with existing enterprise systems:

- **Active Directory Federation**: Hybrid identity integration
- **SCIM Provisioning**: Automated user lifecycle management
- **API Integration**: Custom applications with Azure AD authentication

### Compliance and Governance

Meet regulatory and organizational requirements:

- **Azure Blueprints**: Standardized cluster deployment templates
- **Azure Policy**: Automated compliance monitoring and enforcement
- **Azure Arc**: Hybrid and multi-cloud governance

## Next Steps

Enhance your cluster sharing setup:

- Implement advanced monitoring with Azure Sentinel
- Set up automated user provisioning with Azure AD Connect
- Explore integration with Azure DevOps for CI/CD workflows
- Configure disaster recovery with Azure Site Recovery

For complex organizational requirements or advanced security configurations, consult the Vantage documentation or contact our enterprise support team.
