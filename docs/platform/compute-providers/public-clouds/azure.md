---
title: Microsoft Azure
description: Connect your Azure subscription to Vantage using a service principal.
---

# Microsoft Azure

Connect your Azure subscription so Vantage can provision VM-based clusters in your chosen region.

## Credentials

Vantage needs a **Service Principal** with contributor access to your subscription or resource group.
The service principal supplies the client ID, tenant ID, and client secret that Vantage uses to authenticate and manage resources.

## Steps

1. Go to **Admin** > **Cloud Accounts**.
1. Click <kbd>Create Cloud Account</kbd> and select **Azure**.
1. Enter an **Account name** and optional description.
1. Expand the **Advanced** section and provide your service principal credentials: client ID, tenant ID, and client secret.
1. Submit. Vantage validates and saves the account.

:::tip
Azure Spot VMs can save up to 90% on interruptible workloads. Reserved Instances pay off for jobs running steadily more than a few hours per day. Configure these at the cluster level, not the cloud account level.
:::
