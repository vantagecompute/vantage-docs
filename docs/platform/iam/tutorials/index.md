---
title: Tutorials
description: Walk through IAM setup — users, SSO, and permission groups.
---

# IAM — Tutorials

## Set up SSO with your identity provider

This tutorial walks through configuring federated SSO so users can sign in with your corporate identity provider instead of Google or GitHub OAuth.

**Prerequisites:** Admin access to your Vantage organization and your identity provider's OIDC or SAML configuration details.

1. **Navigate to Organization Settings** — Click the **Settings** gear icon (bottom-left of the sidebar), then select **Organization Settings**.

1. **Configure identity provider** — Scroll to the **Custom Identity Provider** section. Select your provider: **Azure**, **Google**, or **GitHub**.

1. **Enter provider details** — Fill in the app identifier, client ID, and other fields required by your provider. Vantage auto-generates the redirect URI for you.

1. **Save the configuration** — Click **Save**. Vantage validates the provider details.

1. **Test the connection** — Sign out and sign back in using your identity provider's login flow. If it works, SSO is active.

## Invite and onboard users

For a step-by-step guide on inviting users and assigning permission groups, see [Get started](/platform/iam/get-started).
