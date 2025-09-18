---
id: index
title: Compute Providers
description: Connect to diverse compute resources with Vantage
---

Vantage supports three main categories of compute providers, each offering distinct advantages and use cases:

### On-Premises Compute Providers

On-premises compute providers allow you to integrate your existing physical or virtualized infrastructure with Vantage's workload management capabilities. This includes bare metal servers, private cloud environments, and traditional HPC clusters.

**Key Features:**

- Direct hardware control and customization
- Integration with existing SLURM, PBS, LSF, and SGE schedulers
- Support for high-performance interconnects like InfiniBand
- Custom security and compliance configurations

**Best For:**

- Organizations with existing HPC infrastructure
- Workloads requiring specific hardware configurations
- Strict data residency and compliance requirements
- High-performance computing with specialized networking

### Public Cloud Compute Providers

Public cloud providers offer scalable, on-demand computing resources from major cloud platforms including AWS, Azure, and Google Cloud Platform. Vantage integrates with these providers to enable seamless multi-cloud workload management.

**Key Features:**

- Virtually unlimited scalability
- Pay-per-use and reserved capacity pricing models
- Wide variety of instance types (CPU, GPU, memory-optimized)
- Global availability with multiple regions and zones

**Best For:**

- Variable or unpredictable workloads
- Rapid scaling requirements
- Geographic distribution of workloads
- Cost optimization through spot/preemptible instances

### Vantage Partner Compute Providers

Vantage Partners are certified providers offering pre-configured, managed compute environments with guaranteed performance, support, and seamless integration with the Vantage platform.

**Key Features:**

- Turnkey HPC solutions with expert support
- Guaranteed performance and availability SLAs
- Sustainable and ethical computing options
- Specialized configurations for AI/ML and scientific computing

**Best For:**

- Organizations wanting managed HPC services
- Specialized workloads requiring expert optimization
- Sustainable computing initiatives
- Rapid deployment without infrastructure management overhead

## Reference Documentation Structure

Each compute provider reference includes:

- **Technical specifications** and supported configurations
- **Integration methods** and setup procedures
- **Performance optimization** guidelines
- **Security and compliance** considerations
- **Cost management** strategies
- **Monitoring and troubleshooting** guidance
- **Best practices** for production deployments

## Getting Started

Choose the appropriate reference documentation based on your compute requirements:

- **[On-Premises Providers](self-hosted)** - For integrating existing infrastructure
- **[Public Cloud Providers](public-clouds)** - For cloud-based deployments
- **[Vantage Partner Providers](/platform/compute-providers/vantage-partners/atnorth)** - For managed HPC services

For implementation guides and step-by-step instructions, see the [Compute Providers section](/platform/compute-providers/) of the documentation.

## Multi-Provider Strategies

Vantage enables hybrid and multi-cloud strategies that combine different provider types:

- **Hybrid Deployments**: Combine on-premises and cloud resources
- **Burst Computing**: Scale from on-premises to cloud during peak demand
- **Cost Optimization**: Leverage different pricing models across providers
- **Workload Distribution**: Route workloads to optimal compute environments

## See Also

- Getting Started with Clusters
- [Compute Provider Setup Guides](/platform/compute-providers/)
- Cluster Management

