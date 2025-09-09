# Example Terraform plan for installing vantage-agent and jobbergate-agent from PyPI using the module

module "vantage_jobbergate_agents" {
  source = "../../modules/vantage_jobbergate_agents"

  ssh_user        = var.ssh_user
  ssh_private_key = var.ssh_private_key
  host            = var.host

  oidc_client_id     = var.oidc_client_id
  oidc_client_secret = var.oidc_client_secret
  cluster_name       = var.cluster_name
}

variable "ssh_user" {
  description = "SSH username for the target host"
  type        = string
}

variable "ssh_private_key" {
  description = "SSH private key for authentication"
  type        = string
  sensitive   = true
}

variable "host" {
  description = "Target host IP or DNS"
  type        = string
}

variable "oidc_client_id" {
  description = "OIDC client ID for both agents"
  type        = string
}

variable "oidc_client_secret" {
  description = "OIDC client secret for both agents"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Cluster name for vantage-agent"
  type        = string
}

resource "null_resource" "install_agents_pypi" {
  connection {
    type        = "ssh"
    user        = var.ssh_user
    private_key = var.ssh_private_key
    host        = var.host
  }

  # Create directories and Python venvs, install agents
  provisioner "remote-exec" {
    inline = [
      "sudo mkdir -p /srv/vantage-agent-venv /srv/jobbergate-agent-venv /etc/vantage-agent /etc/jobbergate-agent",
      "python3 -m venv /srv/vantage-agent-venv",
      "python3 -m venv /srv/jobbergate-agent-venv",
      "/srv/vantage-agent-venv/bin/pip install vantage-agent",
      "/srv/jobbergate-agent-venv/bin/pip install jobbergate-agent"
    ]
  }

  # Render and upload environment files
  provisioner "file" {
    content     = templatefile("${path.module}/files/vantage-agent.env.tmpl", {
      oidc_client_id     = var.oidc_client_id,
      oidc_client_secret = var.oidc_client_secret,
      cluster_name       = var.cluster_name
    })
    destination = "/tmp/vantage-agent.env"
  }

  provisioner "file" {
    content     = templatefile("${path.module}/files/jobbergate-agent.env.tmpl", {
      oidc_client_id     = var.oidc_client_id,
      oidc_client_secret = var.oidc_client_secret
    })
    destination = "/tmp/jobbergate-agent.env"
  }

  # Render and upload systemd service files
  provisioner "file" {
    content     = templatefile("${path.module}/files/vantage-agent.service.tmpl", {})
    destination = "/tmp/vantage-agent.service"
  }

  provisioner "file" {
    content     = templatefile("${path.module}/files/jobbergate-agent.service.tmpl", {})
    destination = "/tmp/jobbergate-agent.service"
  }

  # Move files into place and enable/start services
  provisioner "remote-exec" {
    inline = [
      "sudo mv /tmp/vantage-agent.env /etc/vantage-agent/vantage-agent.env",
      "sudo mv /tmp/jobbergate-agent.env /etc/jobbergate-agent/jobbergate-agent.env",
      "sudo mv /tmp/vantage-agent.service /etc/systemd/system/vantage-agent.service",
      "sudo mv /tmp/jobbergate-agent.service /etc/systemd/system/jobbergate-agent.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable vantage-agent",
      "sudo systemctl start vantage-agent",
      "sudo systemctl enable jobbergate-agent",
      "sudo systemctl start jobbergate-agent"
    ]
  }
}
