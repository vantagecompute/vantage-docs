---
title: Tutorials
description: Walk through creating and managing compute federations end-to-end.
---

# Federations — Tutorials

## Create a federation and submit a cross-cluster job

This tutorial walks through creating a federation, adding clusters, and submitting a job that routes to an available cluster.

**Prerequisites:** Vantage CLI installed and authenticated, two or more connected clusters.

1. **Create the federation** — `vantage cluster federation create cross-region-pool --description "US and EU cluster pool"`

1. **Verify it was created** — `vantage cluster federation list` shows the new federation. Each entry includes the name, description, and number of associated clusters.

1. **Add clusters to the federation** — Associate clusters during cluster creation or update by specifying the federation name. Run `vantage cluster federation get cross-region-pool` to confirm the clusters appear in the federation's cluster list.

1. **Submit a job targeting the federation** — In the job submission form, select the federation instead of a specific cluster from the cluster dropdown. Vantage routes the job to whichever member cluster has capacity.

1. **Monitor routing** — The submission detail page shows which cluster the job was routed to. If no cluster can accept the job, it waits in the federation queue and retries automatically as capacity opens up.

## Route jobs across regions

Use federations to distribute workloads across clusters in different geographic regions.

1. **Create clusters in multiple regions** — For example, one AWS cluster in `us-east-1` and one in `eu-west-1`.

1. **Create a federation** — `vantage cluster federation create multi-region`

1. **Associate both clusters** — When updating or configuring each cluster, set the federation target to `multi-region`.

1. **Submit jobs without a region preference** — Vantage picks the cluster with available capacity. If your US cluster is fully occupied, the job routes to the EU cluster instead of waiting.

## Burst from on-premises to cloud

Handle peak demand by pairing a small on-premises cluster with one or more cloud clusters.

1. **Connect your on-premises cluster** — Install the Vantage agent on your infrastructure. See the [on-premises guide](/platform/compute-providers/on-premises) for agent setup.

1. **Create a cloud cluster** — Set up an AWS, Azure, or GCP cluster with auto-scaling node groups and a low minimum node count.

1. **Create a federation** — `vantage cluster federation create burst-pool`

1. **Associate both clusters** — Add the on-premises and cloud clusters to the federation.

1. **Submit jobs normally** — Day-to-day jobs run on the on-premises cluster. When demand spikes, Vantage routes overflow jobs to the cloud cluster automatically.

For federation CLI commands, see the [CLI reference](/reference/cli/commands#cluster-federation).
