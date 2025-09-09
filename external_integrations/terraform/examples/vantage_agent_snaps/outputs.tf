output "vantage_agent_snap_status" {
  description = "Status of the vantage-agent snap installation."
  value       = "Vantage agent snap installation attempted via remote-exec. Check logs for details."
}

output "jobbergate_agent_snap_status" {
  description = "Status of the jobbergate-agent snap installation."
  value       = "Jobbergate agent snap installation attempted via remote-exec. Check logs for details."
}
