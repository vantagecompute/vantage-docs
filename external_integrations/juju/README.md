# [The Slurm Charms](https://github.com/charmed-hpc/slurm-charms)

The Slurm charms are our reference automation for deploying and managing Slurm clusters. We developed and maintained these charms for over 5 years before transferring the project to [charmed-hpc](https://github.com/charmed-hpc). We remain active contributors to the project.

---

## What Are Slurm Charms?

Slurm charms are Juju operators that automate the deployment, configuration, and integration of all core Slurm components (slurmctld, slurmd, slurmdbd, slurmrestd, etc.) and related utilities. They enable rapid, repeatable, and scalable Slurm cluster deployments on any Juju-supported infrastructure (bare metal, VMs, or cloud).

- **Automated deployment**: Deploy a full Slurm stack with a single script or Juju bundle.
- **Integration**: Easily integrate with databases, REST APIs, and utility services.
- **Extensible**: Add custom agents (like Vantage and Jobbergate) for advanced workflows.
- **Open source**: Developed in the open and maintained by the community.

---

## Example: Add a Cluster to Vantage Using Juju

The following script automates the deployment of a Slurm cluster using Juju charms. It sets up all necessary Slurm components, integrates them, and configures the Vantage agents by deploying the `vantage-agent` and `jobbergate-agent` charms with the provided OIDC client credentials.

### Usage

```bash
./deploy_with_slurm.sh <OIDC_CLIENT_ID> <OIDC_CLIENT_SECRET>
```
- `<OIDC_CLIENT_ID>`: The client ID for OIDC authentication.
- `<OIDC_CLIENT_SECRET>`: The client secret for OIDC authentication.

### `deploy_with_slurm.sh`

```bash
#!/bin/bash
# This script deploys a Slurm cluster and adds it to Vantage using Juju and the Slurm Charms
set -eux pipefail

command -v juju >/dev/null 2>&1 || { echo >&2 "juju is required but not installed. Aborting."; exit 1; }
command -v mktemp >/dev/null 2>&1 || { echo >&2 "mktemp is required but not installed. Aborting."; exit 1; }

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <OIDC_CLIENT_ID> <OIDC_CLIENT_SECRET>"
    exit 1
fi

client_id=$1
client_secret=$2
CLUSTER_NAME=$(echo "slurm-$(mktemp -u XXXXX)" | tr '[:upper:]' '[:lower:]')

# Add a juju model
juju add-model $CLUSTER_NAME

# Deploy Slurm core components
juju deploy mysql --channel 8.0/stable
juju deploy slurmctld --channel edge \
    --config cluster-name=$CLUSTER_NAME \
    --config default-partition=compute
juju deploy slurmdbd --channel edge
juju deploy slurmd compute --channel edge
juju deploy slurmrestd --channel edge
juju deploy sackd --channel edge slurm-util

# Integrate Slurm components
juju integrate mysql slurmdbd
juju integrate slurmctld slurmdbd
juju integrate slurmctld slurmd
juju integrate slurmctld slurmrestd
juju integrate slurmctld slurm-util

# Deploy and configure Vantage and Jobbergate agents
juju deploy vantage-agent --channel edge \
    --config vantage-agent-oidc-client-id=$client_id \
    --config vantage-agent-oidc-client-secret=$client_secret \
    --config vantage-agent-cluster-name=$CLUSTER_NAME
juju deploy jobbergate-agent --channel edge \
    --config jobbergate-agent-oidc-client-id=$client_id \
    --config jobbergate-agent-oidc-client-secret=$client_secret

# Integrate agents with Slurm utilities
juju integrate jobbergate-agent slurm-util
juju integrate vantage-agent slurm-util
```

---

## Learn More & Get Support
- [Charmed HPC Slurm Charms](https://github.com/charmed-hpc/slurm-charms)
- [Vantage Compute](https://vantagecompute.ai)
- [Jobbergate](https://github.com/omnivector-solutions/jobbergate)

We are always available to hop on a call. [Drop us a message](mailto:info@vantagecompute.ai) if you would like to learn more or need help with your deployment!