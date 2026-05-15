---
title: Glossary
description: Terms used across the Vantage docs.
---

# Glossary

**Access mode** — Controls how many nodes can mount a volume simultaneously and whether they can write. Options: ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod.

**Agent** — Software installed on your infrastructure that connects on-premises resources to Vantage. Runs as a systemd service and reports node availability.

**API key** — A token used for programmatic access to the Vantage API. Generated from your profile settings.

**Authentication** — How you prove identity to Vantage. Options: OAuth (sign in with Google or GitHub) or federated SSO (your own identity provider via OIDC).

**Canary** — A new endpoint version receiving a fraction of traffic during a rollout. Gradually shifts traffic as confidence increases.

**Catalog** — A library of pre-built job scripts in the Jobs section. Browse, clone, and submit without writing a script from scratch.

**CephFS** — A distributed file system for high-throughput parallel access across many nodes. Supports internal (backed by a PVC), external (standalone Ceph cluster), and system (cluster-level integration) source modes.

**Cloud account** — A named credential binding between Vantage and a compute provider. Stores what Vantage needs to provision and deprovision resources — an IAM role ARN for AWS, a service principal for Azure, a service account key for GCP. One account can back multiple clusters.

**Cluster** — A physical Kubernetes or Slurm cluster Vantage manages. Workspaces live inside clusters; users can switch between clusters their team has access to.

**Compute profile** — Reusable shape of compute (GPU + count + instance type + bounds).

**Compute provider** — A supported source of compute: AWS, Azure, GCP, Cudo Compute, LXD, or On-Premises. Each has different credential requirements and capabilities.

**Control plane** — Vantage's management layer that handles provisioning, orchestration, monitoring, and API requests. Runs separately from your compute clusters.

**Endpoint** — An inference service serving a model behind an HTTP URL.

**Federation** — A group of clusters treated as a single logical compute pool. Jobs submitted to a federation run on whichever cluster has capacity.

**Idle spend** — Cost accrued by compute that's reserved but not running work (typically GPU util < 5%).

**Initializer** — A pre-training step that fetches a dataset or base model into local cache.

**Job** — A unit of computational work submitted to a cluster. Defined by a script or template, tracked through submission lifecycle.

**Job script** — The script defining a job's commands and resource requirements (Slurm directives, environment variables, entrypoint).

**Job submission** — A specific instance of a job run, tracked from queued to running to completed. Each submission has its own logs, metrics, and status.

**Job template** — A reusable job configuration. Defines the script, resource defaults, and parameterization so teams can submit consistent jobs without writing scripts.

**License checkout** — The process of reserving a license from a license server before a job starts. Vantage checks out the license, runs the job, then releases it back to the pool.

**License feature** — A specific software feature that requires a license checkout. Defined in the license file and referenced in job configurations.

**Model** — A registered, versioned artifact in the catalog.

**NFS** — A network file share. Can be external (point to an existing NFS server) or internal (export an existing PVC over NFS to share across namespaces).

**Node** — A single machine in a cluster that runs workloads. Cloud nodes are provisioned and deprovisioned automatically by Vantage.

**Node group** — A pool of identically-sized machines on a Kubernetes cluster, scaled up and down automatically. Each node group is a billing unit.

**Organization** — The top-level account containing all your users, teams, clusters, and resources. Billing and global settings are managed at the organization level.

**Partition** — A job queue on a Slurm cluster. Each partition targets a pool of nodes and applies rules: max run time, allowed users, priority class.

**Permission group** — A named set of permissions. Users are assigned to groups rather than individual permissions. Built-in groups include Regular User, Full Admin, Cluster Admin, and others.

**Persistent Volume Claim (PVC)** — A Kubernetes storage request backed by a storage class. Namespace-scoped and tied to a specific performance tier.

**Pipeline** — A multi-step DAG of containerized tasks.

**Preset** — A pre-configured session environment that pins image, compute profile, and storage settings. Useful for standardizing team development environments.

**Runtime** — A pre-built training environment — framework + image + parallelism strategy.

**Service** — An add-on capability within Workbench: Cloud Shell (browser terminal), Remote Desktop (X2Go GUI), or PVC Viewer (file browser).

**Session** — An interactive notebook or development environment (JupyterLab, VS Code, RStudio) running on managed compute.

**Storage class** — A Kubernetes storage profile that defines the provisioner, performance tier, and reclaim policy for PVCs.

**Sweep** — A hyperparameter-search experiment containing many trial runs.

**Team** — A group of users with shared cluster access and resource ownership. Resources belong to exactly one team. Users can belong to multiple teams with different roles.

**Trial** — One concrete run inside a sweep, with one specific parameter combination.

**Training job** — A finite, distributed training run submitted through Workbench.

**User-hosted** — A license server you run on your own infrastructure. Vantage connects to it at job time.

**Vantage-hosted** — A license server Vantage manages for you. Automatic updates, monitoring, and high availability.

**Workspace** — Your team's slice of the Vantage cluster, with quota, RBAC, and a cost envelope.
