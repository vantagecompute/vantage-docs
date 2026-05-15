---
id: vantage-hosted
title: Vantage-Hosted License Servers
sidebar_position: 2
description: Vantage deploys and manages your license servers — FlexLM, RLM, LMX, and others.
slug: /platform/licenses/vantage-hosted
---

# Vantage-Hosted License Servers

Vantage-hosted license servers are fully managed — Vantage deploys, configures, and maintains the server infrastructure. You provide the license file, Vantage handles the rest.

## Supported license types

Vantage-hosted servers support FlexLM, RLM, LMX, LS-DYNA, DSLS, and OLicense. Each gets a dedicated server instance with monitoring, automated backups, and high-availability failover.

## Getting started

1. **Contact Vantage support** to discuss your license requirements — server type, expected concurrent usage, geographic needs.

1. **Provide your license files**. Vantage installs them on the provisioned server.

1. **Vantage deploys the server**. You get the server endpoint to use in your job configurations. No infrastructure setup on your end.

1. **Test with a workload**. Submit a job that requires a license and verify checkout works.

## High availability

Vantage-hosted servers are deployed in HA pairs with automatic failover. If the primary server becomes unreachable, Vantage routes license requests to the secondary without manual intervention.

## Security

License traffic stays within Vantage's network. Servers are isolated per customer. Access logs are available on request.
