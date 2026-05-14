---
title: Tutorials
description: Walk through setting up a license server end-to-end.
---

# Licenses — Tutorials

## Set up a FlexLM license server

This tutorial walks through setting up a FlexLM license server connected to Vantage.

**Prerequisites:** A FlexLM license file from your software vendor, a server (Vantage-hosted or your own).

1. **Choose a hosting model** — Decide between [Vantage-hosted](/platform/licenses/vantage-hosted) (Vantage manages the server) or [User-hosted](/platform/licenses/user-hosted) (you run it).

1. **Obtain your license file** — Request a FlexLM license file from your software vendor. The file contains the feature lines and server hostname that FlexLM uses for checkout.

1. **Deploy the server** — For Vantage-hosted: provide the license file to Vantage support. For user-hosted: install FlexLM on your server, place the license file in the FlexLM installation directory, and start the lmgrd daemon.

1. **Register in Vantage** — In the left sidebar, click **Licenses**, then select **Configurations**. Click **Add License Server**, select FlexLM, enter the hostname and port (default: 27000).

1. **Test the connection** — Vantage pings the server. If it fails, check firewall rules for the license port.

1. **Submit a job** — Configure your job with the license feature name. Vantage checks out a license automatically when the job starts.

For detailed FlexLM configuration, see the [FlexLM how-to guide](/platform/licenses/how-to-guides/flexlm/introduction).
