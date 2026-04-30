---
id: compute-providers-public-clouds-gcp
title: Google Cloud Platform (GCP)
sidebar_position: 3
description: Deploy and manage Vantage clusters on Google Cloud Platform (GCP) infrastructure.
---

# Google Cloud Platform (GCP)

Google Cloud Platform (GCP) offers cutting-edge cloud infrastructure built on Google's global network. With advanced AI/ML capabilities and innovative technologies, GCP is an excellent choice for modern HPC workloads with Vantage.

## Overview

GCP provides innovative cloud services with a focus on data analytics, machine learning, and high-performance computing. With Vantage on GCP, you can:

- **Advanced AI/ML**: Leverage Google's world-class AI and machine learning services
- **High-performance networking**: Benefit from Google's global fiber network
- **Sustainable computing**: Run workloads on one of the cleanest clouds in the industry
- **Innovation-first**: Access to cutting-edge technologies and services

## Key GCP Services for HPC

### Compute Services
- **Compute Engine**: High-performance virtual machines with custom machine types
- **Google Kubernetes Engine (GKE)**: Managed Kubernetes for containerized workloads
- **Cloud Run**: Serverless platform for containerized applications
- **Batch**: Fully managed service for scheduling and running batch jobs

### Storage Services
- **Cloud Storage**: Object storage with multiple storage classes for different use cases
- **Persistent Disk**: High-performance block storage for virtual machines
- **Filestore**: Fully managed NFS file storage for applications requiring shared storage
- **Cloud Bigtable**: NoSQL database for large analytical and operational workloads

### Networking
- **Virtual Private Cloud (VPC)**: Global virtual network with advanced networking features
- **Cloud Interconnect**: High-bandwidth, low-latency connections to GCP

## Getting Started with GCP

To deploy Vantage clusters on GCP, you'll need:

1. **GCP Project**: A Google Cloud project with billing enabled
2. **Service Account**: Service account with appropriate IAM permissions
3. **VPC Network**: Virtual network configuration for your clusters
4. **Firewall Rules**: Network security rules for cluster communication
5. **APIs Enabled**: Required GCP APIs activated for your project

## Machine Types for HPC

GCP offers flexible machine types for various HPC requirements:

- **C2/C2D**: Compute-optimized VMs for CPU-intensive workloads
- **N2/N2D**: Balanced VMs with good price-performance for general workloads
- **M1/M2**: Memory-optimized VMs for memory-intensive applications
- **A2**: GPU VMs powered by NVIDIA A100 GPUs for AI and HPC
- **Custom Machine Types**: Tailor CPU and memory to your exact requirements

## Cost Optimization

Maximize value with GCP's cost optimization features:

- **Preemptible VMs**: Save up to 80% on compute costs for fault-tolerant workloads
- **Committed Use Discounts**: Save money with 1-3 year usage commitments
- **Sustained Use Discounts**: Automatic discounts for running VMs continuously
- **Custom Machine Types**: Pay only for the CPU and memory you need

## AI and Machine Learning Integration

GCP excels in AI/ML workloads with:

- **Vertex AI**: Unified machine learning platform for the entire ML workflow
- **AutoML**: Build custom ML models without extensive ML expertise
- **BigQuery**: Serverless data warehouse for analytics at scale
- **TensorFlow**: Open-source ML framework developed by Google

## Developer-Friendly Features

GCP provides excellent developer experience with:

- **Cloud Shell**: Browser-based shell environment with built-in tools
- **Infrastructure as Code**: Deployment Manager and Terraform support
- **Stackdriver**: Comprehensive monitoring, logging, and diagnostics
- **Cloud Build**: Continuous integration and delivery platform

## Next Steps

- Create a GCP Account (see Google Cloud documentation)
- Configure Service Account (see Google Cloud documentation)
- Deploy Your First Cluster

---

> **Innovation focused?** GCP's cutting-edge AI/ML services and developer-friendly tools make it ideal for organizations pushing the boundaries of what's possible.