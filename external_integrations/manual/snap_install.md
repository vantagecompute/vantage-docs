# Snap Installation of Vantage-Agent and Jobbergate-Agent

This guide explains how to install and configure the `vantage-agent` and `jobbergate-agent` on your on-premises cluster nodes using Snap packages. For the most up-to-date and detailed instructions, please refer to the official documentation: [Vantage Compute Docs – Connect an On-Prem Cluster (Snap)](https://docs.vantagecompute.ai/docs/how-to-guides/getting-started/clusters/connect-an-on-prem-cluster#install-the-vantage-agent-snap)

---

## Prerequisites
- Ubuntu 20.04+ (or any Linux with snapd)
- snapd installed and running
- Sudo privileges on the target host
- Network access to Vantage and Jobbergate APIs

---

## Step 1: Install Snapd (if needed)

```bash
sudo apt-get update
sudo apt-get install -y snapd
```

---

## Step 2: Install the Agents via Snap

```bash
sudo snap install vantage-agent --classic
sudo snap install jobbergate-agent --classic
```

---

## Step 3: Configure the Agents

Set the OIDC credentials and cluster name for both agents:

```bash
sudo snap set vantage-agent oidc-client-id=<your-oidc-client-id> oidc-client-secret=<your-oidc-client-secret> cluster-name=<your-cluster-name>
sudo snap set jobbergate-agent oidc-client-id=<your-oidc-client-id> oidc-client-secret=<your-oidc-client-secret>
```

---

## Step 4: Enable and Start the Services

```bash
sudo systemctl enable snap.vantage-agent.daemon
sudo systemctl start snap.vantage-agent.daemon

sudo systemctl enable snap.jobbergate-agent.daemon
sudo systemctl start snap.jobbergate-agent.daemon
```

---

## Step 5: Verify Installation

```bash
snap list | grep agent
```
You should see both `vantage-agent` and `jobbergate-agent` listed.

---

## Troubleshooting & More Information
- Check logs with `journalctl -u snap.vantage-agent.daemon` and `journalctl -u snap.jobbergate-agent.daemon`.
- For advanced configuration and troubleshooting, see the [official Vantage documentation](https://docs.vantagecompute.ai/docs/how-to-guides/getting-started/clusters/connect-an-on-prem-cluster#install-the-vantage-agent-snap).

---

For questions or support, please refer to the official documentation or contact the Vantage Compute team.
