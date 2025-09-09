---
id: on-premise-create-cluster
title: Create an On-Premise Cluster
slug: /platform/clusters/tutorials/on-premise/create-cluster
---

Learn how to create your first on-premise cluster using Vantage's comprehensive deployment tools for self-hosted infrastructure.

## Overview

This tutorial guides you through the complete process of deploying a Vantage cluster on your own infrastructure, from initial preparation to successful deployment. You'll learn how to leverage your existing hardware while maintaining the simplicity of Vantage's management interface.

## Prerequisites

Before you begin, ensure you have:

- Physical servers or virtual machines ready for cluster deployment
- Network infrastructure configured with appropriate VLANs and subnets
- Administrative access to all target systems
- Understanding of your organization's security and networking policies

## Step 1: Infrastructure Assessment and Preparation

### Hardware Inventory

Document your available infrastructure:

1. **Compute Resources**:
   - Server specifications (CPU, RAM, storage)
   - Network interface configurations
   - Power and cooling capacity
   - Physical rack space and connectivity

2. **Network Infrastructure**:
   - Switch configurations and VLAN assignments
   - Firewall rules and security policies
   - DNS and DHCP server configurations
   - Internet connectivity and bandwidth

### System Preparation

Prepare your systems for Vantage deployment:

1. **Operating System Installation**:
   - Install supported Linux distribution (Ubuntu 20.04+ or CentOS 8+)
   - Configure network interfaces and IP addressing
   - Update system packages and security patches
   - Configure SSH access and key-based authentication

2. **Storage Configuration**:
   - Configure local storage for operating system and applications
   - Set up shared storage if using distributed file systems
   - Configure backup and disaster recovery storage
   - Implement storage encryption if required

## Step 2: Network Configuration

### Network Topology Planning

Design your cluster network architecture:

1. **Management Network**:
   - Dedicated network for cluster administration
   - Secure access for Vantage management components
   - Monitoring and logging traffic isolation
   - Out-of-band management for hardware monitoring

2. **Compute Network**:
   - High-bandwidth network for inter-node communication
   - Low-latency connections for parallel computing workloads
   - Quality of Service (QoS) configuration for priority traffic
   - Network segmentation for security and performance

### Firewall and Security Configuration

Implement security measures for cluster protection:

1. **Firewall Rules**:
   - Configure iptables or firewalld for node protection
   - Open required ports for Vantage components
   - Implement network segmentation and access controls
   - Configure logging and monitoring for security events

2. **Network Security**:
   - Implement VPN access for remote management
   - Configure network intrusion detection systems
   - Set up certificate management for secure communications
   - Implement network monitoring and alerting

## Step 3: Vantage Agent Installation

### Download and Install Vantage Components

Install Vantage software on your infrastructure:

1. **Download Vantage Installer**:
   - Access the Vantage on-premise installer from your account portal
   - Verify installer checksums and digital signatures
   - Transfer installer to your management system
   - Prepare installation configuration files

2. **Agent Installation**:
   - Install Vantage agents on all cluster nodes
   - Configure agent communication with Vantage controllers
   - Set up authentication and authorization credentials
   - Verify agent connectivity and registration

### Configuration Management

Configure Vantage for your environment:

1. **Cluster Configuration**:
   - Define cluster topology and node roles
   - Configure resource allocation and scheduling policies
   - Set up storage and network resource definitions
   - Implement backup and disaster recovery procedures

2. **Integration Configuration**:
   - Connect with existing identity management systems
   - Configure monitoring and logging integrations
   - Set up notification and alerting systems
   - Implement compliance and audit logging

## Step 4: Storage and Data Management

### Storage System Configuration

Set up storage for cluster operations:

1. **Local Storage**:
   - Configure local disk storage for node-specific data
   - Set up temporary storage for job processing
   - Configure log storage and rotation policies
   - Implement local backup and recovery procedures

2. **Shared Storage**:
   - Configure Network File System (NFS) or distributed storage
   - Set up high-availability storage for critical data
   - Configure storage replication and backup systems
   - Implement data lifecycle management policies

### Data Security and Compliance

Implement data protection measures:

1. **Encryption Configuration**:
   - Configure encryption at rest for sensitive data
   - Implement encryption in transit for network communications
   - Set up key management and rotation procedures
   - Configure secure key storage and access controls

2. **Compliance Implementation**:
   - Implement data retention and deletion policies
   - Configure audit logging for data access and modifications
   - Set up compliance reporting and monitoring
   - Implement data classification and access controls

## Step 5: Cluster Deployment

### Initial Deployment

Deploy your Vantage cluster:

1. **Cluster Initialization**:
   - Run Vantage cluster initialization commands
   - Verify all nodes are properly registered and communicating
   - Configure cluster-wide settings and policies
   - Set up initial user accounts and access controls

2. **Service Configuration**:
   - Configure job scheduling and resource management
   - Set up monitoring and alerting services
   - Configure backup and disaster recovery services
   - Implement health checking and self-healing capabilities

### Verification and Testing

Validate your cluster deployment:

1. **Connectivity Testing**:
   - Test inter-node communication and network performance
   - Verify storage access and performance
   - Test external connectivity and internet access
   - Validate security configurations and access controls

2. **Functional Testing**:
   - Submit test jobs to verify job scheduling
   - Test resource allocation and scaling capabilities
   - Verify monitoring and alerting functionality
   - Test backup and recovery procedures

## Step 6: Performance Optimization

### System Tuning

Optimize your cluster for performance:

1. **Hardware Optimization**:
   - Configure CPU governor settings for performance
   - Optimize memory allocation and swap configuration
   - Configure network interface bonding and optimization
   - Implement power management for energy efficiency

2. **Software Optimization**:
   - Tune kernel parameters for cluster workloads
   - Configure job scheduler settings for optimal throughput
   - Optimize network stack parameters for high-performance computing
   - Configure storage subsystem for optimal I/O performance

### Monitoring and Alerting Setup

Implement comprehensive monitoring:

1. **Performance Monitoring**:
   - Set up CPU, memory, and network utilization monitoring
   - Configure storage performance and capacity monitoring
   - Implement application performance monitoring
   - Set up custom metrics for business-specific requirements

2. **Alerting Configuration**:
   - Configure alerts for system failures and performance issues
   - Set up notification channels (email, SMS, chat)
   - Implement escalation procedures for critical alerts
   - Configure automated remediation for common issues

## Next Steps

Now that your on-premise cluster is running:

- [Manage your cluster](./manage-cluster.md) for ongoing operations and maintenance
- [Share your cluster](./share-cluster.md) with team members and configure access controls
- Set up advanced monitoring and optimization features
- Plan for capacity expansion and scaling

## Troubleshooting

### Common Deployment Issues

#### Network Connectivity Problems

- Verify firewall rules allow required communications
- Check DNS resolution and network routing
- Validate VLAN configurations and switch settings
- Test network performance and latency

#### Storage Configuration Issues

- Verify shared storage mounting and permissions
- Check storage performance and capacity
- Validate backup and recovery configurations
- Test storage failover and redundancy

#### Authentication and Authorization Problems

- Verify SSL/TLS certificate configurations
- Check identity management system integration
- Validate user account and permission configurations
- Test access control and authentication flows

#### Performance Optimization Challenges

- Monitor resource utilization patterns
- Identify and resolve performance bottlenecks
- Optimize workload scheduling and placement
- Tune system parameters for specific workloads

For additional support with on-premise deployments, consult the Vantage documentation or contact our enterprise support team for assistance with complex infrastructure configurations.
