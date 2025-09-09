---
id: compute-providers-public-clouds-azure
title: Microsoft Azure
sidebar_position: 2
description: Deploy and manage Vantage clusters on Microsoft Azure cloud infrastructure.
---

# Microsoft Azure

Microsoft Azure is a comprehensive cloud computing platform that provides excellent infrastructure for high-performance computing workloads. Azure's enterprise-grade services and global presence make it an ideal platform for running Vantage clusters.

## Overview

Azure offers enterprise-ready cloud services with strong integration into Microsoft's ecosystem. With Vantage on Azure, you can:

- **Hybrid cloud integration**: Seamlessly connect on-premises and cloud resources
- **Enterprise security**: Leverage Azure's comprehensive security and compliance features
- **Global scale**: Deploy across 60+ Azure regions worldwide
- **Cost management**: Optimize costs with flexible pricing and reserved capacity options

## Key Azure Services for HPC

### Compute Services
- **Azure Virtual Machines**: Scalable virtual machines with HPC-optimized instance types
- **Azure Batch**: Cloud-based job scheduling and compute management service
- **Azure Container Instances**: Serverless containers for containerized workloads
- **Azure Kubernetes Service (AKS)**: Managed Kubernetes for orchestrating containerized applications

### Storage Services
- **Azure Blob Storage**: Massively scalable object storage for data lakes and archives
- **Azure Files**: Fully managed file shares accessible via SMB and NFS protocols
- **Azure NetApp Files**: Enterprise-grade NFS and SMB file storage
- **Azure HPC Cache**: High-performance cache for file-based HPC workloads

### Networking
- **Azure Virtual Network**: Isolated network environment with complete control
- **Azure ExpressRoute**: Private connection between your infrastructure and Azure

## Getting Started with Azure

To deploy Vantage clusters on Azure, you'll need:

1. **Azure Subscription**: An active Azure subscription with sufficient permissions
2. **Service Principal**: Azure AD service principal for Vantage cluster management
3. **Resource Group**: Logical container for your Azure resources
4. **Virtual Network**: Network configuration for cluster communication
5. **Network Security Groups**: Security rules for controlling network traffic

## Virtual Machine Series for HPC

Azure provides several VM series optimized for HPC workloads:

- **HC-series**: Optimized for CPU-intensive HPC applications
- **HB-series**: High-bandwidth memory access for memory-bound HPC workloads
- **HBv2/HBv3-series**: Latest generation high-performance computing VMs
- **NDv2-series**: GPU-optimized VMs for AI and deep learning workloads
- **F-series**: Compute-optimized VMs for CPU-intensive tasks

## Cost Optimization

Optimize your Azure spending with these approaches:

- **Azure Spot VMs**: Save up to 90% on compute costs for interruptible workloads
- **Reserved Instances**: Save money on predictable workloads with 1-3 year commitments
- **Azure Hybrid Benefit**: Use existing Windows Server and SQL Server licenses
- **Auto-scaling**: Automatically scale resources based on demand

## Enterprise Integration

Azure excels in enterprise environments with:

- **Active Directory Integration**: Seamless identity and access management
- **Hybrid Connectivity**: Connect on-premises infrastructure with Azure Arc
- **Compliance**: Extensive compliance certifications and data residency options
- **Management Tools**: Comprehensive monitoring and management through Azure Portal

## Next Steps

- Create an Azure Account (see Azure documentation)
- Configure Service Principal (see Azure documentation)
- Deploy Your First Cluster

---

> **Enterprise ready?** Azure's enterprise-grade features make it perfect for organizations requiring compliance, security, and hybrid cloud capabilities.