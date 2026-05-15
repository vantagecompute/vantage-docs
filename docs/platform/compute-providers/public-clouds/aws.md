---
title: Amazon Web Services
description: Connect your AWS account to Vantage using an IAM role ARN.
---

# Amazon Web Services

Connect your AWS account so Vantage can provision EC2-based clusters in your chosen region.

## Credentials

Vantage needs an **IAM Role ARN** — a role in your AWS account that grants Vantage permission to provision and deprovision compute resources.
You create this role once; the ARN is what Vantage stores.

## Setup methods

Two paths are available in the **Create Cloud Account** dialog:

**Assisted Setup (recommended)** — Vantage walks you through deploying a CloudFormation stack in your AWS account.
The stack creates the IAM role with the correct trust policy and permissions automatically.
Click through to the AWS Console, deploy the stack, then return to finish.

**Existing ARN Configuration** — Paste an IAM role ARN you've already created.
Vantage validates it immediately — checking that the role exists, is accessible, and has the required permissions.

## Steps

1. Go to **Admin** > **Cloud Accounts**.
1. Click <kbd>Create Cloud Account</kbd> and select **AWS**.
1. Enter an **Account name** and optional description.
1. Choose a setup method. For Assisted Setup, click through to the AWS Console, deploy the stack, and return. For Existing ARN, paste the role ARN.
1. Submit. Vantage validates and saves the account.

:::tip
Spot instances can cut EC2 costs by up to 90% for fault-tolerant workloads. Configure spot usage at the cluster level — the IAM role just needs permission to request spot capacity.
:::
