---
id: how-to-guides
title: License Management
sidebar_position: 6
description: License server management, monitoring, and optimization in Vantage Compute.
---

Vantage provides comprehensive license management capabilities for engineering and scientific software, supporting multiple license server technologies and deployment models. This guide introduces the two primary approaches to license management in Vantage and helps you choose the right deployment model for your organization.

## Supported License Server Technologies

- **[FlexLM](/platform/licenses/how-to-guides/flexlm/)**: FLEXnet Publisher floating license management
- **[RLM](/platform/licenses/how-to-guides/rlm/)**: Reprise License Manager with modern web interface
- **[LMX](/platform/licenses/how-to-guides/lmx/)**: License Manager X for cloud-ready applications
- **[OLicense](/platform/licenses/how-to-guides/olicense/)**: Enterprise license management with advanced analytics
- **[LS-DYNA](/platform/licenses/how-to-guides/ls-dyna/)**: LSTC license servers for explicit dynamics simulation
- **[DSLS](/platform/licenses/how-to-guides/dsls/)**: Dassault Systèmes license servers

## License Server Categories

Vantage supports two distinct categories of license server deployment; User-Hosted and Vantage-Hosted. Each with unique advantages and use cases:

### User-Hosted License Servers

Traditional license server deployment where your organization manages the license server infrastructure within your own environment (on-premises, private cloud, or your own cloud accounts).

- **Full Control**: Complete administrative control over license server configuration, security, and access policies
- **Existing Infrastructure**: Leverage your current license server investments and configurations
- **Custom Integration**: Direct integration with existing authentication systems, monitoring tools, and network infrastructure
- **Compliance Requirements**: Ideal for organizations with strict data sovereignty or regulatory compliance requirements
- **Hybrid Deployment**: Mix of on-premises and cloud-based license servers as needed

### Vantage-Hosted License Servers

Fully managed license server deployment where Vantage operates the license infrastructure within Kubernetes clusters associated with your Vantage organization.

- **Managed Service**: Vantage handles all server deployment, maintenance, updates, and monitoring
- **Rapid Deployment**: Quick setup with minimal configuration required
- **Automatic Scaling**: Dynamic scaling based on license demand and usage patterns
- **Integrated Analytics**: Deep integration with Vantage License Manager for comprehensive insights
- **Multi-tenant Security**: Isolated environments with enterprise-grade security controls
- **Global Distribution**: License servers deployed across multiple regions for optimal performance

## Getting Started

- **Quick Setup Guides**: Step-by-step instructions for each license server technology
- **Best Practices**: Recommended configurations and optimization strategies

## Deployment Model Comparison

| Aspect | User-Hosted | Vantage-Hosted |
|--------|-------------|----------------|
| **Administrative Control** | Full control over all aspects | Vantage manages infrastructure |
| **Setup Complexity** | Manual installation and configuration | Automated deployment |
| **Maintenance** | Your team handles updates and patches | Vantage manages all maintenance |
| **Scalability** | Manual scaling planning required | Automatic scaling based on demand |
| **Integration Effort** | Manual vantage-agent configuration | Built-in integration |
| **Time to Production** | Days to weeks depending on complexity | Minutes to hours |
| **Cost Model** | Hardware + license + operational costs | Service-based pricing |
| **Customization** | Unlimited customization options | Standardized configurations |
| **Security** | Your security policies and controls | Vantage enterprise security standards |
| **Compliance** | Full compliance responsibility | Shared compliance model |

## Adding License Servers to Vantage

### User-Hosted License Server Integration

When using your own license server infrastructure, integration with Vantage involves:

**1. License Server Preparation**:
- Install and configure your chosen license server technology
- Set up license files and vendor daemons
- Configure network access and firewall rules
- Implement high availability if required

**2. Vantage Agent Deployment**:
- Install the vantage-agent on systems that can access your license servers
- Configure agent to monitor specific license server endpoints
- Set up authentication and secure communication channels
- Configure data collection intervals and monitoring scope

**3. Vantage Platform Configuration**:
- Register license servers in your Vantage organization
- Configure access policies and user permissions
- Set up monitoring dashboards and alerting rules
- Integrate with job scheduling and resource allocation

**Benefits**:
- Leverage existing license server investments
- Maintain complete control over license policies
- Integrate with existing enterprise systems
- Support complex multi-site deployments

**Considerations**:
- Requires in-house license server expertise
- Ongoing maintenance and support responsibility
- Manual high availability configuration
- Network connectivity requirements between sites

### Vantage-Hosted License Server Deployment

When using Vantage-managed license servers, the process involves:

**1. Service Provisioning**:
- Select license server technology and configuration template
- Specify geographic regions and availability requirements
- Define initial license allocation and scaling policies
- Configure integration with Vantage job scheduling

**2. Kubernetes Deployment**:
- Vantage automatically deploys license server containers
- Sets up persistent storage for license data and logs
- Configures load balancing and service discovery
- Implements monitoring and health checks

**3. License File Integration**:
- Upload license files through Vantage console
- Automatic license validation and activation
- Centralized license renewal and update management
- Real-time license usage tracking and analytics

**4. Advanced Features**:
- Geographic license distribution for global teams
- Automatic failover and disaster recovery
- Cost optimization through usage-based scaling
- Integration with Vantage identity and access management

**Benefits**:
- Zero infrastructure management overhead
- Built-in high availability and disaster recovery
- Automatic scaling and performance optimization
- Deep integration with Vantage analytics and cost management

**Considerations**:
- Requires trust in Vantage-managed infrastructure
- Standardized configurations may limit customization
- Dependency on Vantage service availability
- Data residency considerations for some compliance requirements

## Choosing the Right Deployment Model

### Choose User-Hosted When:
- You have existing license server infrastructure and expertise
- Strict data sovereignty or compliance requirements exist
- Complex custom integrations with enterprise systems are needed
- You require unlimited control over license server configuration
- Multi-vendor license management across heterogeneous environments

### Choose Vantage-Hosted When:
- You want to focus on research and engineering rather than infrastructure
- Rapid deployment and minimal setup time are priorities
- You need automatic scaling and global distribution capabilities
- Built-in high availability and disaster recovery are requirements
- You prefer predictable service-based pricing models

## Key Features

### License Monitoring & Analytics
- Real-time license usage tracking across all server types
- Comprehensive usage analytics and cost optimization insights
- Automated alerting for license shortages and optimization opportunities
- Historical trending and capacity planning tools

### High Availability & Scalability
- Automatic failover and disaster recovery configurations
- Geographic distribution for global teams
- Load balancing and performance optimization
- Kubernetes-based scaling for Vantage-hosted servers

### Integration & Automation
- Seamless integration with Vantage job scheduling
- Automated license allocation and optimization
- API access for custom integrations
- Enterprise authentication and access control

## Deployment Models

### User-Hosted License Servers
Perfect for organizations that:
- Have existing license server infrastructure
- Require complete administrative control
- Need custom enterprise integrations
- Have specific compliance or data sovereignty requirements

### Vantage-Hosted License Servers
Ideal for teams that want:
- Zero infrastructure management overhead
- Rapid deployment and automatic scaling
- Built-in high availability and monitoring
- Deep integration with Vantage analytics

## Next Steps

Based on your deployment model choice:

**For User-Hosted License Servers**:
1. Review the specific setup guides for your license server technology
2. Plan your vantage-agent deployment strategy
3. Configure network access and security policies
4. Set up monitoring and alerting integration

**For Vantage-Hosted License Servers**:
1. Contact Vantage support to discuss your requirements
2. Plan license file migration and validation
3. Configure user access and permissions
4. Set up job integration and resource policies

## Support & Resources

- **Documentation**: Detailed setup guides for each license server technology
- **Professional Services**: Expert guidance for complex deployments and Vantage experts can assist with deployment planning and implementation
- **Community Support**: Access to user forums and knowledge base
- **24/7 Support**: Enterprise support for mission-critical environments
- **Training Programs**: License management best practices and optimization

---

> **Getting Started**: New to license management in Vantage? Start with our [Quick Start Guide](/getting-started) to set up your first license server integration.
