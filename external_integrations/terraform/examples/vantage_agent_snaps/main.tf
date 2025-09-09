# Example Terraform plan for installing vantage-agent and jobbergate-agent using snaps

resource "null_resource" "install_agents_snaps" {
  connection {
    type        = "ssh"
    user        = var.ssh_user
    private_key = var.ssh_private_key
    host        = var.host
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y snapd",
      "sudo snap install vantage-agent --classic",
      "sudo snap set vantage-agent oidc-client-id=${var.oidc_client_id} oidc-client-secret=${var.oidc_client_secret} cluster-name=${var.cluster_name}",
      "sudo snap install jobbergate-agent --classic",
      "sudo snap set jobbergate-agent oidc-client-id=${var.oidc_client_id} oidc-client-secret=${var.oidc_client_secret}",
      "sudo systemctl enable snap.vantage-agent.daemon",
      "sudo systemctl start snap.vantage-agent.daemon",
      "sudo systemctl enable snap.jobbergate-agent.daemon",
      "sudo systemctl start snap.jobbergate-agent.daemon"
    ]
  }
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
