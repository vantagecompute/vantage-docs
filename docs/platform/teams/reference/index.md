---
title: Reference
description: Team roles, permissions, and settings reference.
---

# Teams — Reference

## Built-in roles

| Role | Permissions |
|---|---|
| Admin | Full control — manage members, change roles, grant cluster access, delete team |
| Engineer | Create and run workloads, manage their own resources within the team |
| Viewer | Read-only — see team resources, cluster status, and job history |

## Team settings

| Setting | Description |
|---|---|
| Team name | Displayed throughout the platform. Must be unique within the organization. |
| Description | Optional notes about the team's purpose |
| Cluster access | Which clusters this team can use. Members can only see and submit to clusters listed here. |

## Resource ownership

- Every resource belongs to exactly one team.
- Resources are visible only to team members unless explicitly shared.
- When a team is deleted, its resources must be transferred to another team or deleted.
- A user can belong to multiple teams simultaneously with different roles in each.

See [Concepts](/platform/teams/concepts) for background on how teams, roles, and resource ownership work.
