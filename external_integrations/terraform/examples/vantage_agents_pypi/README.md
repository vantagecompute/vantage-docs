# Install Vantage and Jobbergate Agents from PyPI with Terraform

This example demonstrates how to use the provided Terraform module to install and configure the `vantage-agent` and `jobbergate-agent` from PyPI on a remote host.

## Example Usage

Create a `terraform.tfvars` file with your values:

```hcl
ssh_user        = "<your-ssh-username>"  # e.g. "ubuntu", "centos", "ec2-user", etc.
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
- Uses the `vantage_jobbergate_agents` module to:
  - Create Python virtual environments
  - Install both agents from PyPI
  - Configure OIDC credentials and cluster name
  - Set up and start systemd services for both agents

## Outputs
- `vantage_agents_pypi_status`: Status message for PyPI installation

---

Author: Vantage Compute <info@vantagecompute.ai>
