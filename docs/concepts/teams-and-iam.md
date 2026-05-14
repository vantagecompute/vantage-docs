---
title: Teams and IAM
description: How permissions, ownership, and collaboration work.
---

# Teams and IAM

Teams group users and own resources. IAM (identity and access management) controls what each team member can do — read, write, delete, deploy. Every resource in Vantage belongs to a team, and every action is authorized against that team's permissions.

## Teams

A team is a group of users that share access to a set of resources — clusters, workspaces, storage, jobs. Teams are the ownership boundary: when you create a resource, it belongs to your current team. Other teams can't see it unless you explicitly share it.

The **Teams** page lists every team you're a member of. Team admins can add and remove members, and assign roles.

## Roles and permissions

Vantage uses role-based access control (RBAC). A role is a set of permissions — create sessions, submit jobs, manage storage, administer teams — that you assign to users within a team.

| Role | Typical permissions |
|---|---|
| Admin | Full control — manage members, roles, quota, billing |
| Engineer | Create and run workloads, manage their own resources |
| Viewer | Read-only access to cluster status, jobs, and usage |
| Custom | Team-specific permission sets defined by the admin |

## Resource ownership

Every resource tracks who created it and which team it belongs to. Ownership controls who can modify or delete it. When you leave a team, your personal resources remain — the team admin can reassign ownership if needed.
