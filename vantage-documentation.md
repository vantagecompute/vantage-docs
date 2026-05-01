# Vantage Platform — User Journey Documentation

---

## User Journey 1: Creating a Cloud Account

### Overview
Cloud Accounts in Vantage connect your external cloud infrastructure to the platform, enabling you to provision and manage compute resources. Vantage supports six cloud providers.

### How to Navigate There

**Step 1 — Open Settings**

From any page, click the **Settings** icon (gear) in the bottom-left navigation sidebar. A pop-up menu appears with the following options: Organization Settings, Subscription, **Cloud Accounts**, Users, Permission Groups, and Permission Roles.

**Step 2 — Click "Cloud Accounts"**

Click **Cloud Accounts** from the Settings menu. You will be taken to the Cloud Accounts page at `/admin/cloud-accounts`. The page lists all existing accounts in a table with columns for **Provider**, **Name**, and **Actions** (delete). You can search for accounts by name using the search bar.

---

### Creating a New Cloud Account

**Step 3 — Click "Create Cloud Account"**

Click the purple **+ Create Cloud Account** button in the top-right corner. A dropdown menu appears listing all supported cloud providers:
- **GCP** — Google Cloud Platform
- **Azure** — Microsoft Azure
- **AWS** — Amazon Web Services
- **Cudo Compute**
- **LXD**
- **On-Premises**

**Step 4 — Select a Provider**

Click on your desired provider. A modal dialog will appear with fields specific to that provider.

---

### Provider-Specific Fields

#### GCP (Google Cloud Platform)

> *"Google Cloud Platform offering global regions, fast networking, and flexible GPUs/CPUs—ideal for scalable AI, data, and batch workloads with tight IAM and billing controls."*

| Field | Required | Notes |
|---|---|---|
| Account Name | Yes | Name for this account |
| Description | No | Optional description |
| Additional Fields (Key/Value) | No | Expand via "Show additional settings" — add key-value pairs needed to connect to your GCP account |

Click **+ Add Field** to add more key-value pairs. Click **Create Cloud Account** to finish.

---

#### Azure (Microsoft Azure)

> *"Microsoft Azure delivers enterprise-grade compute across worldwide regions, with strong identity/security integration and a broad GPU/VM catalog for AI training, inference, and HPC."*

| Field | Required | Notes |
|---|---|---|
| Account Name | Yes | Name for this account |
| Description | No | Optional description |
| Additional Fields (Key/Value) | No | Expand via "Show additional settings" |

Click **Create Cloud Account** to finish.

---

#### AWS (Amazon Web Services)

AWS requires Vantage to have role-based access to your cloud. The form provides two methods:

**Option A — Assisted Setup** *(recommended for first-time users)*

1. Enter an **Account Name** (required, max 45 characters) and optional **Description**.
2. Under "Assisted Setup", click **Access the AWS Stack Creation page** — this opens AWS in a new tab.
3. **In AWS (Step 1):** Provide a Stack Name, check the acknowledgement box for CloudFormation resources, then click **Create Stack**.
4. **In AWS (Step 2):** Wait for the stack to be created. A blue "IN PROGRESS" label means it is still creating; a green "CREATE_COMPLETE" label means it is done (typically takes a couple of minutes).
5. **Back in Vantage (Step 3):** Close the AWS tab and return to the Vantage form, then click **Next** to validate and finish.

**Option B — Existing ARN Configuration** *(if you already have an IAM role for Vantage)*

1. Select **Existing ARN Configuration**.
2. Enter your **IAM Role ARN** in the field provided.
3. Click **Create Cloud Account**.

A link to Vantage's AWS manual setup documentation is shown at the bottom of the form.

---

#### Cudo Compute

> *"Cudo Compute offers cost-efficient GPU cloud with on-demand and reserved options, simple provisioning, and strong price/performance for AI training, inference, and rendering."*

| Field | Required | Notes |
|---|---|---|
| Account Name | Yes | Name for this account |
| Description | No | Optional description |
| Datacenter ID | Yes | Your Cudo Compute datacenter ID |
| API Key | Yes | Your Cudo Compute API key |
| Additional Fields (Key/Value) | No | Expand via "Show additional settings" |

Click **Create Cloud Account** to finish.

---

#### LXD

> *"LXD runs system containers like lightweight VMs, enabling fast, isolated Linux environments on your infrastructure, ideal for multi-tenant dev/test, CI, and smaller batch workloads."*

| Field | Required | Notes |
|---|---|---|
| Account Name | Yes | Name for this account |
| Description | No | Optional description |
| Server URL | Yes | e.g., `https://your-lxd-server:8443` |
| Client Certificate | Yes | Paste your client certificate |
| Client Key | Yes | Paste your client key |
| Additional Fields (Key/Value) | No | Expand via "Show additional settings" |

Click **Create Cloud Account** to finish.

---

#### On-Premises

> *"Customer-hosted compute in your data center for maximum control, data residency, and security, ideal for steady-state workloads, specialized networking, and integrating with existing HPC stacks."*

| Field | Required | Notes |
|---|---|---|
| Account Name | Yes | Name for this account |
| Description | No | Optional description |
| Additional Fields (Key/Value) | No | Expand via "Show additional settings" |

Click **Create Cloud Account** to finish.

---

## User Journey 2: Creating a Cluster (Prepare Cluster)

### Overview
Clusters in Vantage are compute environments where jobs run. Two cluster types are supported: **Slurm** (traditional HPC) and **Slurm on Kubernetes** (Slurm deployed on an existing K8s cluster).

### How to Navigate There

**Step 1 — Go to Clusters**

Click the **Clusters** icon in the left navigation sidebar. You will land on the Clusters list page showing all existing clusters with columns for **Name**, **Type** (SLURM or SLURM ON K8S), **Status**, **Provider**, **Owner**, and **Actions**.

**Step 2 — Click "Prepare Cluster"**

Click the purple **+ Prepare Cluster** button in the top-right corner. A multi-step wizard dialog opens titled **"Choose Cluster Type"**.

---

### Path A: Creating a Slurm Cluster

**Step 1 of wizard — Choose Type**

Two options are shown side by side:
- **Slurm** — "Traditional HPC workload manager. Configure compute partitions, submit batch jobs, and manage node pools."
- **Slurm on Kubernetes** — "Deploy a Slurm HPC cluster on top of an existing Kubernetes cluster. Manage node groups and partitions via VDeployer."

Click the **Slurm** card to select it, then click **Continue**.

**Step 2 of wizard — Configure (Cluster Details)**

| Field | Required | Notes |
|---|---|---|
| Cluster Name | No | Max 27 characters |
| Cluster Description | No | Max 255 characters |
| Cloud Account | Yes | Select from the dropdown list of your configured cloud accounts |

> **Important:** The fields shown and the number of steps depend on which Cloud Account type you select:
>
> - **For LXD/On-Premises cloud accounts:** No additional fields appear. The button reads **"Create Cluster"** and clicking it immediately creates the cluster. The wizard is only 2 steps.
> - **For cloud provider accounts (e.g., AWS):** Additional fields appear and the wizard has a Step 3 (Partitions). See below.

**Step 2 (continued) — Additional Fields for Cloud Provider Accounts (e.g., AWS)**

When a cloud provider account (e.g., AWS) is selected, a notice appears: *"Cloud clusters are deployed in AWS and scale automatically to the size of the workloads submitted to them."*

| Field | Required | Notes |
|---|---|---|
| Region | Yes | Select your AWS region from the dropdown |
| Head Node Machine Type | Yes | Select a region first, then click **"Select Head Node"** to choose a machine type |
| SSH Key Name | Yes | Select a cloud account and region first |

**Advanced Options** (expand by clicking the toggle) — configure custom networking, leave fields empty to use AWS defaults:

| Field | Required | Notes |
|---|---|---|
| VPC ID | No | Select a Cloud Account and AWS region first |
| Head Node Subnet ID | Yes, if VPC selected | Select a VPC first |
| Compute Node Subnet ID | No (optional) | Select a VPC first |

Click **"Proceed to Select Partitions"** to continue to Step 3.

**Step 3 of wizard — Partitions** *(Cloud provider accounts only)*

Configure the Slurm partitions for your cluster. This step is skipped for LXD/On-Premises accounts.

---

### Path B: Creating a Slurm on Kubernetes Cluster

This path has **4 steps**: Choose Type → Select K8s Cluster → Configure → Creating.

**Step 1 of wizard — Choose Type**

Click the **Slurm on Kubernetes** card. The progress bar updates to show all 4 steps. Click **Continue**.

**Step 2 of wizard — Select K8s Cluster**

A grid of available Kubernetes clusters is displayed, showing each cluster's name and cloud provider type. Click a cluster card to select it (it will show a highlighted border). Click **"Configure Slurm Cluster"** to proceed.

**Step 3 of wizard — Configure**

*Cluster Name section:*

| Field | Notes |
|---|---|
| Slurm Cluster Name | Enter a name (placeholder: "my-slurm-cluster") |
| Parent K8s Cluster | Pre-filled with the K8s cluster selected in Step 2 (read-only) |

*Node Groups section:*

Two node group types are pre-configured:

**Control Plane:**

| Field | Default | Notes |
|---|---|---|
| Name | — | Enter a name for the control plane node group |
| Profile | Medium (8 vCPU / 16 GiB) | Options: Small (4 vCPU / 8 GiB), Medium (8 vCPU / 16 GiB), Large (16 vCPU / 32 GiB) |
| Max Nodes | 1 | Maximum number of nodes |

**Compute Group:**

| Field | Default | Notes |
|---|---|---|
| Name | — | Enter a name for the compute node group |
| Profile | Small (4 vCPU / 8 GiB) | Options: Small, Medium, Large |
| Max Nodes | 10 | Maximum number of nodes |

Click **+ Add Compute Group** to add additional compute node groups.

*Partitions section:*

| Field | Default | Notes |
|---|---|---|
| Partition Name | "compute" | Name for the Slurm partition |
| Node Group | — | Select from the compute groups defined above |
| Default | Enabled | Whether this is the default partition |

Click **+ Add Partition** to add additional partitions.

Click **"Create Slurm Cluster"** to finalize and begin provisioning.

**Step 4 — Creating**

Vantage provisions the cluster. Monitor progress on the Clusters list page — status will show **"preparing"** initially, then transition to **"ready"**.

---

### Tips & Notes

- **Cloud Account required first:** You must create a Cloud Account before creating a cluster.
- **Cluster name limit:** Cluster names are limited to 27 characters for Slurm clusters.
- **LXD clusters:** When using an LXD cloud account with the Slurm type, the wizard is simplified to 2 steps with no Partitions step.
- **Status tracking:** After creation, clusters appear on the Clusters list page with statuses including "preparing", "ready", and "READY" (green indicator for connected clusters).
- **Deleting:** Existing clusters and cloud accounts can be deleted using the trash icon in the Actions column.
