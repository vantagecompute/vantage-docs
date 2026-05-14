---
title: Reference
description: License server ports, protocols, and configuration fields.
---

# Licenses — Reference

## Default ports

| License server | Default port |
|---|---|
| FlexLM | 27000 |
| RLM | 5054 |
| LMX | 6200 |
| LS-DYNA | Varies by vendor |
| DSLS | Varies by vendor |
| OLicense | 7374 |

## Registration fields

When adding a license server in Vantage, these fields are available:

| Field | Required | Description |
|---|---|---|
| Name | Yes | A label for the server |
| Type | Yes | FlexLM, RLM, LMX, LS-DYNA, DSLS, or OLicense |
| Hostname | Yes | Server IP or DNS name reachable from Vantage |
| Port | Yes | The license server's listening port |
| Credentials | Varies | Some license types require authentication |
| Description | No | Optional notes about this server |

## HA configuration

For high availability, configure two or more license servers and register all endpoints in Vantage. Vantage fails over automatically if the primary server becomes unreachable. See the how-to guides for [FlexLM HA](/platform/licenses/how-to-guides/flexlm/high-availability), [RLM HA](/platform/licenses/how-to-guides/rlm/high-availability), and others.
