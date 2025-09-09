# Install Vantage and Jobbergate Agents Using Snaps with Terraform

This example demonstrates how to use Terraform to install and configure the `vantage-agent` and `jobbergate-agent` snaps on a remote host.

## Example Usage

Create a `terraform.tfvars` file with your values:

```hcl
ssh_user        = "ubuntu"
ssh_private_key = file("~/.ssh/id_rsa")
host            = "1.2.3.4"
oidc_client_id  = "your-oidc-client-id"
oidc_client_secret = "your-oidc-client-secret"
cluster_name    = "my-cluster"
```

Then run:

```bash
terraform init
terraform apply
```

## Usage

1. Set the required variables in a `terraform.tfvars` file or via the CLI.
2. Run `terraform init` and `terraform apply` in this directory.

## Required Variables
- `ssh_user`: SSH username for the target host
- `ssh_private_key`: SSH private key for authentication
- `host`: Target host IP or DNS
- `oidc_client_id`: OIDC client ID for both agents
- `oidc_client_secret`: OIDC client secret for both agents
- `cluster_name`: Cluster name for vantage-agent

## What This Example Does
- Installs snapd if needed
- Installs the `vantage-agent` and `jobbergate-agent` snaps
- Configures OIDC credentials and cluster name
- Enables and starts both agent services

## Outputs
- `vantage_agent_snap_status`: Status message for vantage-agent installation
- `jobbergate_agent_snap_status`: Status message for jobbergate-agent installation

---

Author: Vantage Compute <info@vantagecompute.ai>
