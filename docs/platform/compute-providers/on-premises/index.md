---
title: On-Premises
description: Connect your own servers or private cloud infrastructure to Vantage.
---

# On-Premises

Connect your own infrastructure so Vantage can schedule workloads on hardware you control.

Vantage supports two on-premises provider types.

| Type | What it's for |
|---|---|
| LXD | System containers on a server you own. Vantage connects via HTTPS and manages container workloads. Good for multi-tenant dev/test and smaller batch jobs. |
| On-Premises | Direct integration for bare-metal or privately managed servers. Use when your infrastructure is reachable from the Vantage control plane. |

## LXD setup

LXD requires three credentials: the server URL, a client certificate, and a client key.

1. Go to **Admin** > **Cloud Accounts**.
1. Click <kbd>Create Cloud Account</kbd> and select **LXD**.
1. Enter an **Account name** and optional description.
1. Enter the **Server URL** (e.g. `https://your-lxd-server:8443`).
1. Paste the **Client Certificate** and **Client Key**.
1. Submit.

## On-Premises setup

1. Go to **Admin** > **Cloud Accounts**.
1. Click <kbd>Create Cloud Account</kbd> and select **On-Premises**.
1. Enter an **Account name** and optional description.
1. Submit.

:::tip
On-premises accounts carry no cloud spend per se — but your hardware runs continuously. Idle nodes still consume power, cooling, and rack space. Plan capacity around your actual workload schedule.
:::
