---
id: user-hosted
title: User-Hosted License Servers
sidebar_position: 3
description: Self-managed license server deployment and integration with Vantage Compute clusters.
slug: /user-hosted
---

User-hosted license servers allow organizations to maintain complete control over their license infrastructure while integrating seamlessly with Vantage Compute clusters. This approach is ideal for organizations with existing license management investments, specific compliance requirements, or the need for custom configurations.

## Overview

With user-hosted license servers, you deploy and manage your license infrastructure on your own hardware or cloud resources while connecting it to Vantage Compute clusters. This model provides maximum flexibility and control while leveraging Vantage's compute and orchestration capabilities.

## Key Benefits

### Complete Control

- Full administrative access to license server configuration
- Custom security policies and access controls
- Integration with existing IT infrastructure
- Compliance with internal governance requirements

### Existing Investment Protection

- Leverage current license server infrastructure
- Preserve existing license management procedures
- Maintain established vendor relationships
- Utilize existing monitoring and backup systems

### Flexible Deployment Options

- On-premises data center deployment
- Private cloud or hybrid cloud configurations
- Multi-site license server distribution
- Custom network and security configurations

### Cost Predictability

- No additional hosting fees from Vantage
- Utilize existing infrastructure capacity
- Predictable operational costs
- Direct vendor support relationships

## Supported License Server Technologies

Vantage integrates with all major license server technologies in user-hosted configurations:

- **FlexLM/FLEXnet**: Industry-standard floating license management
- **RLM**: Reprise License Manager with modern web interface
- **LMX**: X-Formation License Manager X for cloud-ready applications
- **LS-DYNA**: LSTC license servers for explicit dynamics simulation
- **DSLS**: Dassault Systèmes license servers for CAD/CAE applications
- **OLicense**: Enterprise license management with advanced analytics

## Network Architecture

### Connectivity Requirements

User-hosted license servers require reliable network connectivity to Vantage compute clusters:

- **Direct Network Access**: License servers must be accessible from Vantage clusters
- **Firewall Configuration**: Appropriate ports opened for license communication
- **VPN or Private Networks**: Secure connectivity options available
- **Load Balancing**: Support for high-availability license server configurations

### Security Considerations

- **Network Isolation**: Separate license traffic from other network services
- **Access Controls**: IP allowlisting and authentication mechanisms
- **Encryption**: TLS/SSL encryption for license communications
- **Monitoring**: Network traffic and access logging

## Integration with Vantage

### Cluster Configuration

Vantage clusters can be configured to use user-hosted license servers:

- **License Server Registration**: Add license server endpoints to cluster configuration
- **Authentication Setup**: Configure access credentials and certificates
- **Network Routing**: Establish connectivity between clusters and license servers
- **Health Monitoring**: Monitor license server availability and performance

### Job Orchestration`

Vantage automatically handles license management for user jobs:

- **License Checkout**: Automatic license acquisition before job execution
- **Queue Management**: Intelligent queuing based on license availability
- **License Release**: Automatic license return upon job completion
- **Error Handling**: Graceful handling of license acquisition failures

## Deployment Models

### Single Site Deployment

Centralized license server deployment for organizations with concentrated compute resources:

- Single license server or high-availability cluster
- Simplified management and monitoring
- Lower network complexity
- Suitable for most organizations

### Multi-Site Deployment

Distributed license server deployment for geographically distributed organizations:

- Regional license server placement
- Reduced network latency
- Improved fault tolerance
- Support for disaster recovery scenarios

### Hybrid Deployment

Combination of user-hosted and Vantage-hosted license servers:

- Critical licenses hosted internally
- Development/testing licenses hosted by Vantage
- Flexible cost optimization
- Risk mitigation strategies

## Setup and Configuration

### 1. Infrastructure Assessment

Evaluate your current license server infrastructure:

- Existing license server inventory
- Network topology and connectivity
- Security policies and requirements
- High availability and disaster recovery needs

### 2. Network Planning

Design network architecture for Vantage integration:

- Identify required network paths
- Plan firewall rule modifications
- Design VPN or private network connections
- Consider load balancing and redundancy

### 3. License Server Preparation

Prepare license servers for Vantage integration:

- Update license server software if needed
- Configure network access and security
- Set up monitoring and alerting
- Establish backup and recovery procedures

### 4. Vantage Configuration

Configure Vantage clusters to use your license servers:

- Register license server endpoints
- Configure authentication and certificates
- Test connectivity and license checkout
- Set up monitoring and alerting

### 5. Testing and Validation

Thoroughly test the integration:

- Verify license checkout and release
- Test high availability scenarios
- Validate monitoring and alerting
- Performance testing under load

## Monitoring and Management

### License Usage Monitoring

Track license utilization across your infrastructure:

- Real-time license usage dashboards
- Historical usage analytics
- Peak usage identification
- Capacity planning insights

### Performance Monitoring

Monitor license server performance and availability:

- Server health and responsiveness
- Network connectivity status
- License checkout/release times
- Error rates and failure analysis

### Integration Monitoring

Monitor the integration between Vantage and your license servers:

- Cluster-to-license-server connectivity
- Job queue status based on license availability
- License acquisition success rates
- Error logging and alerting

## Security Best Practices

### Access Control

- Implement strong authentication mechanisms
- Use IP allowlisting for license server access
- Regular review and update of access permissions
- Audit trails for all license operations

### Network Security

- Use VPN or private networks for license traffic
- Implement network segmentation
- Regular security assessments
- Encryption for all license communications

### License File Security

- Secure storage of license files
- Regular backup of license configurations
- Access controls for license file modifications
- Version control for license file changes

## Troubleshooting Common Issues

### Connectivity Problems

- Network firewall blocking license traffic
- DNS resolution issues
- VPN or private network connectivity problems
- Load balancer configuration issues

### License Checkout Failures

- License server capacity exceeded
- Network timeouts or connectivity issues
- Authentication or authorization failures
- License file corruption or expiration

### Performance Issues

- Network latency affecting license operations
- License server resource constraints
- High concurrent license demand
- Inefficient license allocation policies

## Migration Strategies

### From Standalone to Vantage-Integrated

Steps to integrate existing license servers with Vantage:

1. **Assessment**: Evaluate current license server setup
2. **Planning**: Design integration architecture
3. **Testing**: Pilot integration with subset of applications
4. **Rollout**: Gradual migration of workloads to Vantage
5. **Optimization**: Fine-tune performance and monitoring

### License Server Upgrades

Best practices for upgrading license servers while maintaining Vantage integration:

- Plan maintenance windows to minimize disruption
- Test upgrades in non-production environments
- Coordinate with Vantage cluster maintenance
- Verify integration after upgrades

## Support and Resources

### Documentation and Guides

- Detailed setup guides for each license server type
- Network configuration examples
- Troubleshooting documentation
- Best practices and recommendations

### Technical Support

- Vantage support for integration issues
- Vendor support for license server problems
- Community forums and knowledge base
- Professional services for complex deployments

### Monitoring Tools

- Integration with existing monitoring systems
- Custom dashboards for license usage
- Alerting and notification systems
- Reporting and analytics tools

## Next Steps

To implement user-hosted license server integration:

1. **Assess Current Infrastructure**: Evaluate your existing license servers
2. **Plan Integration**: Design network and security architecture
3. **Contact Vantage Support**: Discuss integration requirements
4. **Pilot Testing**: Start with non-critical applications
5. **Full Deployment**: Roll out to production workloads

For detailed implementation guidance, see our [License Management How-To Guides](how-to-guides) or contact Vantage support for technical assistance.
