---
title: Compute and clusters
description: Where workloads physically run — profiles, providers, regions.
---

# Compute and clusters

A cluster is a Kubernetes or Slurm cluster Vantage manages on your behalf. Compute profiles describe the *shape* of compute (GPU type, count, autoscaling bounds, instance class) and are reused across products. Compute providers (AWS, Azure, GCP, on-prem) are the physical substrate.

## Cluster types

Vantage provisions three kinds of clusters. Your choice determines the scheduler and which workloads can run.

| Type | Scheduler | Best for |
|---|---|---|
| Slurm | Slurm (batch jobs) | Traditional HPC — simulations, MPI, batch pipelines |
| Kubernetes | Kubernetes | Workbench sessions, ML training, containerized workloads |
| Slurm on Kubernetes | Slurm inside K8s | HPC scheduling on cloud-native, auto-scaled infrastructure |

## Compute profiles

A compute profile bundles GPU vendor and count per node, instance type, autoscaling min/max, and a default cost rate. Sessions, training jobs, sweeps, and endpoints all reference a profile — choose one once and the rest of the form configures around it.

Profiles live at the workspace level. Your admin defines which profiles are available.

## Compute providers

Providers are the physical infrastructure Vantage provisions clusters on.

| Provider | What it's for |
|---|---|
| Public clouds (AWS, Azure, GCP) | Elastic capacity, global regions, spot pricing |
| Cudo Compute | Cost-efficient GPU cloud |
| On-premises / LXD | Your own hardware, maximum control |
| Vantage partners (atNorth, BuzzHPC, RCI) | Pre-integrated managed colocation and HPC |

## Regions and availability

Cloud clusters run in the region you select during creation. Slurm clusters can span multiple availability zones within a region. On-premises clusters report their location as configured by your admin.
