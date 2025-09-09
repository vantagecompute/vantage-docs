---
id: public-clouds-aws-share-cluster
title: Share an AWS Cluster
slug: /platform/clusters/tutorials/public-clouds/aws/share-cluster
---

Learn how to securely share your AWS clusters with team members, set up proper access controls, and manage collaborative access using Vantage and AWS IAM integration.

## Overview

This tutorial guides you through the process of sharing AWS clusters with your team while maintaining security best practices and proper access controls. You'll learn how to leverage AWS IAM integration for seamless and secure collaboration.

## Prerequisites

Before you begin, ensure you have:

- An active AWS cluster deployed through Vantage
- Administrative access to both Vantage and AWS accounts
- Understanding of AWS IAM concepts (users, roles, policies)
- List of team members who need cluster access

## Understanding Access Models

### Vantage-Managed Access

Vantage provides centralized access management:

- **User Authentication**: Single sign-on through Vantage
- **Role-Based Permissions**: Predefined roles for different access levels
- **Audit Logging**: Complete access history and usage tracking
- **Resource Quotas**: Individual user resource limits

### AWS IAM Integration

Leverage native AWS security features:

- **IAM Roles**: AWS-native role assumption
- **Cross-Account Access**: Share clusters across AWS accounts
- **Temporary Credentials**: Time-limited access tokens
- **Fine-Grained Permissions**: Resource-level access control

## Setting Up Team Access

### Step 1: Configure Vantage User Management

#### Add Team Members

1. Navigate to **Settings** > **Users** in your Vantage dashboard
2. Click **Invite Users** and enter email addresses
3. Select appropriate role levels:
   - **Cluster Admin**: Full cluster management access
   - **Power User**: Job submission and monitoring
   - **Read-Only**: View-only access to cluster status

#### Configure User Roles

Set up role-based access control:

1. **Cluster Administrator**:
   - Create, modify, and delete clusters
   - Manage user access and permissions
   - View billing and usage reports

2. **Compute User**:
   - Submit and monitor jobs
   - Access cluster resources
   - View personal usage statistics

3. **Observer**:
   - View cluster status and health
   - Monitor job queues and completions
   - Access documentation and tutorials

### Step 2: AWS IAM Configuration

#### Create IAM Policies

Set up specific policies for cluster access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/VantageCluster": "your-cluster-name"
        }
      }
    }
  ]
}
```

#### Set Up Cross-Account Access

For multi-account organizations:

1. Create a cross-account IAM role in the cluster's AWS account
2. Configure trust relationships with team member accounts
3. Set up role assumption policies in Vantage
4. Test cross-account access and permissions

### Step 3: Configure SSH Access

#### Shared SSH Keys

Manage SSH access for direct cluster connection:

1. **Centralized Key Management**:
   - Generate individual SSH key pairs for each user
   - Store public keys in cluster configuration
   - Rotate keys regularly for security

2. **Key Distribution**:
   - Securely share private keys with authorized users
   - Use encrypted channels for key transmission
   - Document key usage and ownership

#### Bastion Host Setup

Implement secure access through bastion hosts:

1. **Deploy Bastion Instance**:
   - Create a dedicated bastion host in a public subnet
   - Configure security groups for restricted access
   - Install and configure SSH access logging

2. **User Access Configuration**:
   - Set up individual user accounts on bastion
   - Configure SSH key-based authentication
   - Implement session recording and monitoring

## Implementing Access Controls

### Resource Quotas

Set limits to prevent resource abuse:

1. **Per-User Limits**:
   - Maximum concurrent jobs
   - CPU hours per day/week/month
   - Memory usage restrictions
   - Storage allocation limits

2. **Project-Based Quotas**:
   - Team resource pools
   - Department budget allocations
   - Shared resource scheduling

### Time-Based Access

Control when users can access resources:

1. **Business Hours Restriction**:
   - Limit access to business hours only
   - Configure timezone-aware scheduling
   - Allow emergency access procedures

2. **Temporary Access**:
   - Grant time-limited access for contractors
   - Set up automatic access expiration
   - Implement access renewal workflows

### Job Scheduling Policies

Manage job submission and execution:

1. **Priority Queues**:
   - High priority for critical workloads
   - Fair-share scheduling for regular users
   - Low priority for experimental jobs

2. **Resource Preemption**:
   - Allow admin jobs to preempt user jobs
   - Configure graceful job interruption
   - Implement job restart mechanisms

## Monitoring and Auditing

### Access Logging

Track cluster usage and access:

1. **User Activity Monitoring**:
   - Login and logout events
   - Job submission and completion
   - Resource usage patterns
   - File access and transfers

2. **Administrative Actions**:
   - User permission changes
   - Cluster configuration modifications
   - Resource allocation adjustments

### Usage Analytics

Generate insights from cluster usage:

1. **Resource Utilization Reports**:
   - Per-user resource consumption
   - Peak usage times and patterns
   - Cost allocation by user or project

2. **Performance Metrics**:
   - Job completion rates and times
   - Queue wait times by priority
   - Resource efficiency measurements

### Compliance and Security

Maintain security standards:

1. **Regular Access Reviews**:
   - Quarterly user access audits
   - Remove inactive user accounts
   - Update permissions based on role changes

2. **Security Monitoring**:
   - Failed login attempt tracking
   - Unusual access pattern detection
   - Automated security alert notifications

## Best Practices for Shared Clusters

### Security Guidelines

- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Regular Access Reviews**: Audit permissions quarterly
- **Multi-Factor Authentication**: Require MFA for admin access
- **Encrypted Communications**: Use SSL/TLS for all connections

### Operational Practices

- **Clear Documentation**: Maintain user guides and procedures
- **Training Programs**: Educate users on cluster policies
- **Support Channels**: Establish help desk for user issues
- **Change Management**: Document and communicate changes

### Cost Management

- **Chargeback Mechanisms**: Allocate costs to departments
- **Budget Alerts**: Notify users of spending limits
- **Resource Optimization**: Regular right-sizing reviews
- **Scheduled Shutdowns**: Automatic off-hours shutdown

## Troubleshooting Access Issues

### Common Problems

#### User Cannot Access Cluster

- Verify user account status in Vantage
- Check AWS IAM permissions and policies
- Validate SSH key configuration
- Confirm VPN or network connectivity

#### Permission Denied Errors

- Review user role assignments
- Check resource-level permissions
- Verify AWS IAM policy attachments
- Test with elevated permissions

#### Job Submission Failures

- Check user resource quotas
- Verify queue permissions
- Validate job scheduler configuration
- Review cluster capacity limits

## Advanced Sharing Scenarios

### Multi-Team Environments

Manage complex organizational structures:

- **Department Isolation**: Separate resource pools
- **Cross-Team Collaboration**: Shared project spaces
- **Hierarchical Permissions**: Manager oversight capabilities

### External Collaborations

Securely share with external partners:

- **Guest Accounts**: Time-limited external access
- **Data Isolation**: Separate workspaces for external users
- **Compliance Controls**: Meet regulatory requirements

## Next Steps

Enhance your cluster sharing setup:

- Implement advanced monitoring and alerting
- Set up automated user provisioning
- Explore federated identity integration
- Configure disaster recovery procedures

For complex organizational requirements or advanced security configurations, consult the Vantage documentation or contact our enterprise support team.
