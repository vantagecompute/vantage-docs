# vantage_agents_pypi Ansible Role

This role installs and configures the `vantage-agent` and `jobbergate-agent` from PyPI on Linux hosts (Debian, Ubuntu, RHEL, CentOS, Rocky, Alma, etc.). It sets OIDC credentials and cluster name, creates environment files, and ensures both agents are running as systemd services.

## Requirements
- Linux host (Debian/Ubuntu or RHEL/CentOS/Rocky/Alma)
- Python 3, pip, and venv available (role will install if missing)
- Ansible 2.9+

## Role Variables
| Variable           | Description                                 | Default |
|--------------------|---------------------------------------------|---------|
| oidc_client_id     | OIDC client ID for both agents              | ""      |
| oidc_client_secret | OIDC client secret for both agents          | ""      |
| cluster_name       | Cluster name for vantage-agent              | ""      |

## Example Playbook

```yaml
- hosts: util_node
  become: true
  vars:
    oidc_client_id: "<your-oidc-client-id>"
    oidc_client_secret: "<your-oidc-client-secret>"
    cluster_name: "<your-cluster-name>"
  roles:
    - role: vantage_agents_pypi
```

> **Note:** The role will detect the OS and use the appropriate package manager (`apt`, `dnf`, or `yum`) to install Python and dependencies if needed.

## License
Apache-2.0

## Author Information
Vantage Compute <info@vantagecompute.ai>
