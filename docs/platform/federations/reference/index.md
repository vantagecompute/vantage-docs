---
title: Reference
description: CLI commands, fields, and configuration for compute federations.
---

# Federations — Reference

Federations are managed through the Vantage CLI `vantage cluster federation` command group.

## Commands

| Command | Description |
|---|---|
| `create` | Create a new federation. Requires a name. Optional `--description` adds a human-readable label. |
| `list` | List all federations in the organization. Shows name, description, and cluster count. |
| `get` | Get details of a specific federation by name. Returns metadata and associated cluster IDs. |
| `update` | Update a federation's name or description. Use `vantage cluster federation update <name> --description "new desc"`. |
| `delete` | Delete a federation by name. Removes the federation grouping; member clusters are unaffected. |

## Global flags

| Flag | Description |
|---|---|
| `--json` | Output in JSON format for programmatic use or jq piping |
| `--verbose`, `-v` | Enable verbose terminal output |
| `--profile` | Use a specific CLI profile |

## Behavior notes

- A federation with no member clusters will hold submitted jobs in the federation queue until a cluster is added.
- Deleting a federation does not delete or modify the member clusters — they continue running independently.
- Clusters can belong to only one federation at a time. Moving a cluster to a new federation removes it from the previous one.
- Job routing considers cluster capacity, partition availability, and job resource requirements. Vantage does not support custom routing policies — routing is automatic.

## Related concepts

See [Concepts](/platform/federations/concepts) for the mental models behind federations, or the [CLI reference](/reference/cli/commands#cluster-federation) for full command documentation.
