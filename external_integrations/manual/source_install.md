# Source Installation of Vantage-Agent and Jobbergate-Agent

This guide explains how to install and configure the `vantage-agent` and `jobbergate-agent` on your on-premises cluster nodes using PyPI packages. For the most up-to-date and detailed instructions, please refer to the official documentation: [Vantage Compute Docs – Connect an On-Prem Cluster (Manual Systemd)](https://docs.vantagecompute.ai/docs/how-to-guides/getting-started/clusters/connect-an-on-prem-cluster#manually-create-systemd-processes)

---

## Prerequisites
- Python 3.8+
- pip
- Systemd (for process management)
- Network access to Vantage and Jobbergate APIs

---

## Step 1: Create a Python Virtual Environment

It is recommended to use a virtual environment for each agent:

```bash
python3 -m venv /opt/vantage-agent/venv
python3 -m venv /opt/jobbergate-agent/venv
```

---

## Step 2: Install the Agents from PyPI

Activate each virtual environment and install the agent:

```bash
# Install vantage-agent
source /opt/vantage-agent/venv/bin/activate
pip install vantage-agent

deactivate

# Install jobbergate-agent
source /opt/jobbergate-agent/venv/bin/activate
pip install jobbergate-agent

deactivate
```

---

## Step 3: Create Environment Files for Configuration

Configure each agent using an environment file. This is the recommended approach for secure and flexible configuration.

### Example `.env` for `vantage-agent`

Create `/etc/vantage-agent/vantage-agent.env`:

```env
VANTAGE_AGENT_OIDC_CLIENT_ID=<your-oidc-client-id>
VANTAGE_AGENT_OIDC_CLIENT_SECRET=<your-oidc-client-secret>
VANTAGE_AGENT_CLUSTER_NAME=<your-cluster-name>
# ... other environment variables ...
```

### Example `.env` for `jobbergate-agent`

Create `/etc/jobbergate-agent/jobbergate-agent.env`:

```env
JOBBERGATE_AGENT_OIDC_CLIENT_ID=<your-oidc-client-id>
JOBBERGATE_AGENT_OIDC_CLIENT_SECRET=<your-oidc-client-secret>
# ... other environment variables ...
```

Refer to the [official documentation](https://docs.vantagecompute.ai/docs/how-to-guides/getting-started/clusters/connect-an-on-prem-cluster#configuring-the-jobbergate-agent) for a full list of supported environment variables.

---

## Step 4: Create Systemd Service Files

Create a systemd unit file for each agent, ensuring the environment file is loaded.

### Example for `vantage-agent`:

```ini
# /etc/systemd/system/vantage-agent.service
[Unit]
Description=vantage-agent
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/srv/vantage-agent-venv
ExecStart=/srv/vantage-agent-venv/bin/vtg-run

[Install]
Alias=vantage-agent.service
WantedBy=multi-user.target
```

### Example for `jobbergate-agent`:

```ini
# /etc/systemd/system/jobbergate-agent.service
[Unit]
Description=jobbergate-agent
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/srv/jobbergate-agent-venv
ExecStart=/srv/jobbergate-agent-venv/bin/jg-run

[Install]
Alias=jobbergate-agent.service
WantedBy=multi-user.target
```

> **Note:** Adjust `WorkingDirectory`, `ExecStart`, and `EnvironmentFile` paths as needed for your environment.

---

## Step 5: Enable and Start the Services

```bash
sudo systemctl daemon-reload
sudo systemctl enable vantage-agent
sudo systemctl start vantage-agent

sudo systemctl enable jobbergate-agent
sudo systemctl start jobbergate-agent
```

---

## Troubleshooting & More Information
- Check logs with `journalctl -u vantage-agent` and `journalctl -u jobbergate-agent`.
- For advanced configuration and troubleshooting, see the [official Vantage documentation](https://docs.vantagecompute.ai/docs/how-to-guides/getting-started/clusters/connect-an-on-prem-cluster#manually-create-systemd-processes).

---

For questions or support, please refer to the official documentation or contact the Vantage Compute team.
