---
title: How-to guides
description: Task-oriented recipes for creating and managing compute federations.
---

# Federations — How-to guides

All federation operations are performed through the Vantage CLI.

## Manage federations

| Task | Command |
|---|---|
| Create a federation | `vantage cluster federation create <name>` |
| List federations | `vantage cluster federation list` |
| Get federation details | `vantage cluster federation get <name>` |
| Update a federation | `vantage cluster federation update <name>` |
| Delete a federation | `vantage cluster federation delete <name>` |

## Manage federation membership

Clusters are associated with a federation at creation or update time. Run `vantage cluster federation get <name>` to verify which clusters belong to the federation.

## Route jobs to a federation

When submitting a job through the Vantage UI:

1. Open the job submission form.
1. In the cluster selector, choose the federation name instead of a specific cluster.
1. Fill in the remaining job details as usual.
1. Submit. Vantage routes the job to an available member cluster.

Jobs targeting a federation show the assigned cluster on the submission detail page after routing completes.

## Monitor federation usage

Check which jobs ran on which cluster:
1. Open the submission detail page.
1. The **Cluster** field shows the cluster the job was routed to.
1. Use `vantage cluster federation get <name> --json` to see basic federation metadata.

For all CLI flags and options, see the [CLI reference](/reference/cli/commands#cluster-federation).
