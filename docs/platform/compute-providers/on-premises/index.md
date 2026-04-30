---
id: on-premises
sidebar_position: 1
title: Self Hosted Introduction
description: Introduction to self-hosting Vantage Compute in your own environment.
slug: /self-hosted
---

Deploy and manage your own instance of Vantage Compute in your environment for complete control, customization, and data sovereignty.

## Overview

Self-hosting Vantage Compute provides:

- **Complete Control**: Full control over the platform configuration and data
- **Data Sovereignty**: Keep all data within your infrastructure boundaries
- **Custom Integration**: Deep integration with existing enterprise systems
- **Compliance**: Meet strict regulatory and security requirements
- **Cost Predictability**: Avoid per-usage fees with your own infrastructure

## Deployment Options

### Single Instance Deployment

Deploy Vantage Compute as a single instance for smaller organizations:

- **All-in-One**: Database, API, and web interface on a single server
- **Quick Setup**: Fastest way to get started with self-hosting
- **Resource Efficiency**: Minimal infrastructure requirements
- **Development/Testing**: Ideal for development and testing environments

### High Availability Deployment

Deploy Vantage Compute with redundancy for production environments:

- **Load Balancing**: Multiple API and web servers behind load balancers
- **Database Clustering**: Redundant database servers with failover
- **Container Orchestration**: Kubernetes or Docker Swarm deployment
- **Geographic Distribution**: Multi-region deployment for disaster recovery

### Microservices Architecture

Deploy individual Vantage components separately:

- **Scalable Components**: Scale individual services based on demand
- **Technology Flexibility**: Use different technologies for different components
- **Independent Updates**: Update components independently
- **Advanced Monitoring**: Fine-grained monitoring and alerting

## Prerequisites

### Infrastructure Requirements

- **Compute Resources**: Sufficient CPU, memory, and storage for your workload
- **Network Infrastructure**: Reliable networking with appropriate bandwidth
- **Storage Systems**: Persistent storage for databases and file systems
- **Load Balancers**: For high availability deployments

### Software Prerequisites

- **Container Platform**: Docker, Kubernetes, or similar container orchestration
- **Database System**: PostgreSQL, MySQL, or compatible database
- **Web Server**: Nginx, Apache, or compatible web server/proxy
- **SSL/TLS**: Valid SSL certificates for secure communications

### Operational Requirements

- **System Administration**: Skilled administrators for deployment and maintenance
- **Monitoring Tools**: Infrastructure and application monitoring systems
- **Backup Systems**: Regular backup and disaster recovery procedures
- **Security Tools**: Intrusion detection, vulnerability scanning, and security monitoring

## Architecture Components

### Core Platform Services

- **API Server**: RESTful API for all platform operations
- **Web Interface**: User-facing web application
- **Database**: Persistent storage for configuration and metadata
- **Message Queue**: Asynchronous task processing and communication
- **File Storage**: Storage for job files, logs, and user data

### Cluster Management

- **Cluster Controllers**: Manage and monitor compute clusters
- **Agent Communications**: Secure communication with cluster agents
- **Resource Discovery**: Automatic discovery of available resources
- **Job Scheduling**: Intelligent job placement and execution

### Integration Services

- **Authentication**: User authentication and authorization
- **API Gateway**: Single entry point for all API requests
- **Logging Service**: Centralized logging and audit trails
- **Monitoring Service**: Platform and infrastructure monitoring

## Security Considerations

### Network Security

- **Firewall Configuration**: Restrict access to required ports and services
- **VPN Access**: Secure remote access for administrators
- **Network Segmentation**: Isolate Vantage components from other systems
- **SSL/TLS Encryption**: Encrypt all communications

### Data Protection

- **Database Encryption**: Encrypt sensitive data at rest
- **Backup Encryption**: Encrypt all backup data
- **Key Management**: Secure storage and rotation of encryption keys
- **Data Classification**: Classify and handle data based on sensitivity

### Access Control

- **Multi-Factor Authentication**: Strong authentication for administrative access
- **Role-Based Access Control**: Granular permissions and role assignments
- **API Security**: Secure API endpoints with proper authentication
- **Audit Logging**: Comprehensive logging of all access and operations

### Compliance and Governance

- **Regulatory Compliance**: Meet industry-specific compliance requirements
- **Data Retention**: Implement appropriate data retention policies
- **Privacy Controls**: Ensure user privacy and data protection
- **Security Auditing**: Regular security assessments and penetration testing

## Deployment Models

### Container-Based Deployment

Deploy using Docker containers:

- **Docker Compose**: Simple multi-container deployment
- **Docker Swarm**: Container orchestration with Docker Swarm
- **Kubernetes**: Enterprise-grade container orchestration
- **OpenShift**: Red Hat's Kubernetes platform

### Virtual Machine Deployment

Deploy on virtual machines:

- **VMware vSphere**: VMware virtualization platform
- **Hyper-V**: Microsoft virtualization platform
- **KVM/QEMU**: Open-source virtualization
- **Cloud VMs**: Virtual machines on public cloud platforms

### Bare Metal Deployment

Deploy directly on physical servers:

- **Performance**: Maximum performance with no virtualization overhead
- **Control**: Complete control over hardware and system configuration
- **Security**: Enhanced security with no hypervisor layer
- **Compliance**: Meet requirements that prohibit virtualization

## Getting Started

### Planning Phase

1. **Requirements Assessment**: Define performance, security, and compliance requirements
2. **Architecture Design**: Design the deployment architecture
3. **Infrastructure Planning**: Plan hardware and network requirements
4. **Security Planning**: Define security controls and procedures

### Preparation Phase

1. **Infrastructure Setup**: Prepare servers, networking, and storage
2. **Software Installation**: Install required software dependencies
3. **Security Configuration**: Configure firewalls, SSL certificates, and access controls
4. **Monitoring Setup**: Install and configure monitoring tools

### Deployment Phase

1. **Component Installation**: Install and configure Vantage components
2. **Integration Testing**: Test integration with existing systems
3. **Performance Testing**: Validate performance under expected loads
4. **Security Testing**: Conduct security testing and validation

### Production Phase

1. **Go-Live**: Deploy to production environment
2. **User Training**: Train administrators and end users
3. **Monitoring**: Implement comprehensive monitoring and alerting
4. **Maintenance**: Establish maintenance and update procedures

## Support and Maintenance

### Professional Services
- **Deployment Assistance**: Expert help with planning and deployment
- **Custom Development**: Custom integrations and feature development
- **Training Services**: Administrator and user training programs
- **Consulting**: Architecture and optimization consulting

### Ongoing Support
- **Technical Support**: Access to technical support resources
- **Documentation**: Comprehensive deployment and administration guides
- **Community Support**: Access to user community and forums
- **Update Services**: Regular platform updates and security patches

### Monitoring and Optimization
- **Performance Monitoring**: Continuous monitoring of system performance
- **Capacity Planning**: Monitoring growth and planning expansion
- **Security Monitoring**: Ongoing security monitoring and threat detection
- **Optimization Services**: Performance tuning and optimization

## Best Practices

### Deployment
- **Start Small**: Begin with a minimal deployment and expand as needed
- **Test Thoroughly**: Extensive testing in non-production environments
- **Document Everything**: Maintain comprehensive documentation
- **Plan for Scale**: Design for future growth and expansion

### Operations
- **Automate Processes**: Automate routine maintenance and operations
- **Monitor Continuously**: Implement comprehensive monitoring and alerting
- **Regular Backups**: Maintain regular backup and disaster recovery procedures
- **Security Updates**: Keep all components updated with security patches

### Governance
- **Change Management**: Implement formal change control processes
- **Access Reviews**: Regular review of user access and permissions
- **Compliance Audits**: Regular compliance and security audits
- **Incident Response**: Establish incident response procedures

## Next Steps

To get started with self-hosting Vantage Compute:

1. **[Setup Guide](/platform/compute-providers/on-premises/compute-providers-self-hosted-setup)** - Detailed setup and installation instructions
2. **[Management Guide](/platform/compute-providers/on-premises/compute-providers-self-hosted-management)** - Ongoing management and maintenance
3. **Contact Sales** - Discuss licensing and professional services
4. **Professional Services** - Get expert help with deployment and customization

For specific deployment scenarios and detailed configuration guides, select the appropriate option from the navigation menu.
