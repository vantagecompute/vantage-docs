---
title: Workspaces
description: Your team's slice of the cluster, with quota, RBAC, and a cost envelope.
---

# Workspaces

A workspace is your team's slice of the Vantage cluster. Workspaces hold quota (CPUs, memory, GPUs, storage), an RBAC scope, and a cost envelope. Resources you create in Vantage live inside one workspace at a time. The current workspace is shown in the top-right of the screen — switch with the workspace picker.

## Quota

Every workspace has a resource ceiling: CPU cores, memory, GPU count, and storage capacity. Quota is set by your admin and enforced at resource creation time. When you try to start a Workbench session or submit a job that would exceed the workspace quota, Vantage blocks it.

Quota is not the same as usage. A workspace might have 16 GPUs of quota but only 4 in active use — the remaining 12 are available for new workloads. Check your workspace's current utilization on the Dashboard.

## Cost envelope

Each workspace tracks accumulated spend. Every active resource — running sessions, provisioned nodes, persistent storage — accrues cost against the workspace. The Dashboard shows burn rate ($/hr), accumulated cost, and idle spend.

## Cross-references

- [Teams and IAM](/concepts/teams-and-iam) — who can access which workspaces and what they can do
- [Compute and clusters](/concepts/compute-and-clusters) — the infrastructure behind workspace quota
