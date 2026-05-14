---
title: Reference
description: Permission groups, authentication options, and API key settings.
---

# IAM — Reference

## Built-in permission groups

| Group | Permissions |
|---|---|
| Regular User | Standard platform access — create and manage own resources |
| Full Admin | Full platform administration — users, billing, all settings |
| Cluster Admin | Manage clusters — create, update, delete, monitor |
| Jobs Admin | Manage jobs and scripts — create, submit, cancel |
| Licenses Admin | Manage license servers — add, configure, monitor |
| Notebook Admin | Manage Workbench notebook sessions |
| Organization Admin | Manage organization settings, billing, and members |
| Team Admin | Manage teams — create, add/remove members, configure access |

## Authentication methods

| Method | Use case |
|---|---|
| Google OAuth | Default sign-in — no configuration needed |
| GitHub OAuth | Default sign-in — no configuration needed |
| OIDC SSO | Corporate identity provider (Azure AD, Okta, Keycloak) |
| SAML SSO | Enterprise identity provider with SAML support |
| API key | Programmatic access — generate from user profile |

## API key settings

| Setting | Description |
|---|---|
| Key name | A label to identify the key's purpose |
| Expiration | Optional expiry date. Keys without an expiration date never rotate automatically |
| Permissions | API keys inherit the user's permission groups. No separate API key scopes |
