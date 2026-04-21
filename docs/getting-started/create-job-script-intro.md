---
title: Create a Job Script
description: Define computational workloads with reusable job scripts
---

## Overview

Job Scripts define the workloads you want to run on your cluster. They can be submitted to your cluster, shared with your team, customized, cloned, and templated for different use cases.

## What You'll Learn

- How to navigate to the Job Scripts dashboard
- How to create a new job script
- How to write and save an entrypoint file

## Prerequisites

- A connected cluster (see [Create a Cluster](./create-cluster-intro.md))

## Step 1: Access the Job Scripts Dashboard

Navigate to the [Job Scripts section](https://app.vantagecompute.ai/jobs/scripts) in the Vantage web UI using the left sidebar.

![Job scripts dashboard](./img/create-job-script-intro-00.png)

## Step 2: Create a Job Script

Click the **Create Job Script** button in the upper right corner to open the job script creation form.

![Create job script button](./img/create-job-script-intro-01.png)

## Step 3: Select Entrypoint

Provide a name for your job script and select an entrypoint file. Click **Create** to proceed.

![Select entrypoint file](./img/create-job-script-intro-02.png)

## Step 4: Edit Entrypoint File

Click on the entrypoint file to open the editor. Add the following content and save:

```bash
#!/bin/bash
#SBATCH -J sleep-job-%j

sleep 60
```

![Edit entrypoint file](./img/create-job-script-intro-03.png)

## Summary

Your job script is now saved and ready to be submitted to your cluster. Job scripts can be reused, modified, and shared with team members.

## Next Steps

- [Submit Your First Job](./create-job-submission-intro.md)
- [Learn about Job Templates](https://docs.vantagecompute.ai/platform/jobs/tutorials/)
