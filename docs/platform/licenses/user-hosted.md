---
id: user-hosted
title: User-Hosted License Servers
sidebar_position: 3
description: Run your own license servers and connect them to Vantage clusters.
slug: /platform/licenses/user-hosted
---

# User-Hosted License Servers

User-hosted license servers run on your own infrastructure. You manage deployment, maintenance, and security. Vantage connects to them at job time to check out licenses.

## When to use user-hosted

- You already have license servers running and don't want to migrate.
- Compliance or data-residency requirements mandate that licenses stay on your infrastructure.
- You need custom configurations not supported by the Vantage-hosted option.

## What you need

- A license server (FlexLM, RLM, LMX, LS-DYNA, DSLS, or OLicense) running on a machine that Vantage clusters can reach over the network.
- The server hostname or IP address and port.
- Any required credentials or access keys.

## Network requirements

Vantage clusters must be able to reach the license server on its vendor-specific port. Typical setups involve:

- Opening the license server port in your firewall to Vantage's control-plane IP range (contact support for the current range).
- Configuring DNS or using a static IP so the endpoint doesn't change.
- For HA, running two or more license servers and pointing Vantage to all endpoints.

## Setup steps

1. **Install and configure** your license server software following the vendor's instructions.
1. **Install your license files** on the server and verify licenses are served locally.
1. **Register the server in Vantage** — In the left sidebar, click **Licenses**, then select **Configurations**. Click <kbd>Add License Server</kbd>, and enter the type, hostname, port, and credentials.
1. **Test checkout** — Submit a job that requires a license from that server. Vantage checks out the license before the job starts and releases it on completion.

## Monitoring

User-hosted servers appear on the **Licenses** page with live usage counts — total, checked-out, available. Server health is reported as reachable or unreachable based on periodic connectivity checks from the Vantage control plane.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| Server shown as unreachable | Firewall blocking the license port; DNS resolution failure |
| License checkout fails | Server out of licenses; feature name mismatch; expired license file |
| Intermittent failures | Network latency or packet loss between Vantage and your server |

For detailed setup guides per license server type, see the [How-to guides](/platform/licenses/how-to-guides).
