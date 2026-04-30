---
title: Submit Your First Job
description: Run computational workloads with real-time monitoring
---

## Overview

Job Submissions let you run computational workloads on your cluster with real-time monitoring and metrics. Once submitted, you can track job progress, view logs, and monitor resource usage.

## What You'll Learn

- How to navigate to the Job Submissions dashboard
- How to create a job submission
- How to monitor job progress and metrics

## Prerequisites

- A connected cluster (see [Create a Cluster](./create-cluster-intro.md))
- A job script (see [Create a Job Script](./create-job-script-intro.md))

## Step 1: Access the Job Submissions Dashboard

Navigate to the [Job Submissions section](https://app.vantagecompute.ai/jobs/submissions) in the Vantage web UI using the left sidebar.

![Job submissions dashboard](./img/create-job-submission-intro-00.png)

## Step 2: Create a Job Submission

Click the **Create Job Submission** button in the upper right corner to open the submission form.

![Create job submission button](./img/create-job-submission-intro-01.png)

## Step 3: Configure Submission

Provide the following details:

- **Name**: Enter a name for your submission (e.g., `my-first-job`)
- **Job Script**: Select your previously created job script
- **Cluster**: Select `my-first-cluster`
- **Partition**: Select the appropriate partition

Click **Create** to submit the job.

![Job submission configuration](./img/create-job-submission-intro-02.png)

## Step 4: Monitor Job Progress

After submission, you'll be redirected to the Job Submission Progress view. Watch the job state change as it moves through the queue from pending to running to completed.

![Job progress log](./img/create-job-submission-intro-03.png)

## Step 5: View Job Metrics

Job Submission metrics provide near real-time observability and diagnostics for your workload.

![Job metrics dashboard](./img/create-job-submission-intro-04.png)

## Summary

You've successfully submitted your first job! You now understand the basics of the Vantage platform including cluster creation, notebook deployment, job script creation, and job submission with monitoring.

## Go Deeper

- [Cloud Clusters - AWS](https://docs.vantagecompute.ai/platform/compute-providers/)
- [Cloud Clusters - GCP](https://docs.vantagecompute.ai/platform/compute-providers/)
- [Cloud Clusters - Azure](https://docs.vantagecompute.ai/platform/compute-providers/)
- [On-Premises Clusters](https://docs.vantagecompute.ai/platform/clusters/)
- [Storage Solutions](https://docs.vantagecompute.ai/platform/storage/)
- [License Management](https://docs.vantagecompute.ai/platform/licenses/)
- [Cluster Federations](https://docs.vantagecompute.ai/platform/federations/)

## Next Steps

- [Learn about Jobs](https://docs.vantagecompute.ai/platform/jobs/)
- [Explore Job Templates](https://docs.vantagecompute.ai/platform/jobs/tutorials/)
- [Connect a Cloud Provider](https://docs.vantagecompute.ai/platform/compute-providers/)
