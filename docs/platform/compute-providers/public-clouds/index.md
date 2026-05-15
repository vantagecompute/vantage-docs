---
title: Public Clouds
description: Connect AWS, Azure, GCP, and Cudo Compute to Vantage for elastic cloud compute.
---

# Public Clouds

Connect your public cloud account so Vantage can provision clusters on elastic, on-demand infrastructure.

Each cloud account stores one credential binding — an IAM role for AWS, a service principal for Azure, a service account for GCP, an API key for Cudo Compute. Add as many accounts as you need — one per project, region, or team.

## Supported providers

- **[Amazon Web Services](/platform/compute-providers/public-clouds/aws)** — Largest VM ecosystem; spot instances, reserved capacity, global regions.
- **[Microsoft Azure](/platform/compute-providers/public-clouds/azure)** — Enterprise-grade cloud; Active Directory integration, hybrid connectivity.
- **[Google Cloud Platform](/platform/compute-providers/public-clouds/gcp)** — AI/ML-focused; fast networking, preemptible VMs.
- **[Cudo Compute](/platform/compute-providers/public-clouds/cudo-compute)** — Cost-efficient GPU cloud; strong price/performance for AI training and inference.

:::tip
Spot, preemptible, and interruptible instances can cut cloud spend by up to 80–90%. Configure spot usage at the cluster level — the cloud account just needs credentials with permission to request those instance types.
:::
