---
id: user-managed-server-setup
title: User-Managed RLM Server Setup
sidebar_position: 2
description: Set up and configure your own RLM license server for integration with Vantage License Manager.
---

This guide walks you through setting up your own RLM (Reprise License Manager) license server that will integrate with Vantage License Manager. With a user-managed setup, you maintain full control over your license server infrastructure while benefiting from Vantage's monitoring and management capabilities.

## Prerequisites

Before setting up your RLM server, ensure you have:

- **License Files**: Valid RLM license files from your software vendor
- **Server Hardware**: Dedicated server or virtual machine meeting vendor requirements
- **Network Access**: Connectivity between your RLM server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **Firewall Configuration**: Appropriate ports open for RLM communication

## Supported Operating Systems

RLM servers can be deployed on:

- **Linux**: RHEL 7/8/9, CentOS 7/8, Ubuntu 18.04/20.04/22.04, SUSE Linux
- **Windows**: Windows Server 2016/2019/2022, Windows 10/11
- **macOS**: macOS 10.15+ (for development environments)

## Installation Steps

### 1. Download RLM Software

```bash
# Download RLM from Reprise Software
# Visit: https://www.reprisesoftware.com/products/downloads.php
wget https://download.reprisesoftware.com/rlm-latest-linux-x64.tar.gz
tar -xzf rlm-latest-linux-x64.tar.gz
cd rlm
```

### 2. Install RLM

```bash
# Copy RLM binaries to system directory
sudo mkdir -p /opt/rlm/bin
sudo cp rlm /opt/rlm/bin/
sudo cp rlmutil /opt/rlm/bin/

# Set executable permissions
sudo chmod +x /opt/rlm/bin/*

# Add to system PATH
echo 'export PATH="/opt/rlm/bin:$PATH"' | sudo tee -a /etc/profile
```

### 3. Configure License Files

```bash
# Create license directory
sudo mkdir -p /opt/rlm/licenses

# Copy license files
sudo cp *.lic /opt/rlm/licenses/

# Set appropriate permissions
sudo chown rlm:rlm /opt/rlm/licenses/*.lic
sudo chmod 644 /opt/rlm/licenses/*.lic
```

### 4. Create RLM Configuration

```bash
# Create RLM configuration file
sudo cat > /opt/rlm/rlm.conf << EOF
# RLM Configuration File
license_path /opt/rlm/licenses
log_file /var/log/rlm/rlm.log
debug_log_file /var/log/rlm/debug.log
web_interface_port 5054
EOF
```

### 5. Start RLM Server

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/rlm.service << EOF
[Unit]
Description=RLM License Server
After=network.target

[Service]
Type=forking
User=rlm
Group=rlm
ExecStart=/opt/rlm/bin/rlm -c /opt/rlm/rlm.conf -dlog +/var/log/rlm/debug.log
PIDFile=/var/run/rlm.pid
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start rlm
sudo systemctl enable rlm
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 5053**: Default RLM server port
- **Port 5054**: RLM web interface
- **Vendor-specific ports**: As defined in license files
- **HTTPS (443)**: For Vantage integration

### Firewall Configuration

```bash
# Open RLM ports
sudo firewall-cmd --permanent --add-port=5053-5054/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **RLM** as the server type
5. Choose **User-Managed** deployment
6. Enter server details:
   - **Server Hostname/IP**
   - **Port Number** (typically 5053)
   - **Web Interface Port** (typically 5054)

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type rlm --server-port 5053
```

### 3. Verify Integration

```bash
# Test RLM server
rlmutil rlmstat -a

# Test Vantage connection
vantage-license-monitor test-connection
```

## Web Interface Configuration

### Access RLM Web Interface

1. Open browser to `http://your-server:5054`
2. Default credentials: admin/admin (change immediately)
3. Configure server settings through web interface
4. Monitor license usage and server status

### Security Configuration

```bash
# Change default web interface password
# This is done through the web interface:
# 1. Login to http://server:5054
# 2. Go to Admin → Users
# 3. Change admin password
# 4. Create additional users as needed
```

## License File Management

### Adding New Licenses

```bash
# Add new license file
sudo cp new_license.lic /opt/rlm/licenses/

# Reread licenses without restart
rlmutil rlmreread

# Verify license is loaded
rlmutil rlmstat -a
```

### License File Validation

```bash
# Check license file syntax
rlmutil rlmcksum /opt/rlm/licenses/license.lic

# Verify license is active
rlmutil rlmstat -f feature_name
```

## Monitoring and Logging

### Configure Logging

Edit `/opt/rlm/rlm.conf`:

```bash
# Enhanced logging configuration
log_file /var/log/rlm/rlm.log
debug_log_file /var/log/rlm/debug.log
log_level normal
separate_license_log on
license_log_file /var/log/rlm/license.log
```

### Log Rotation

```bash
# Create logrotate configuration
sudo cat > /etc/logrotate.d/rlm << EOF
/var/log/rlm/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    postrotate
        /bin/systemctl reload rlm
    endscript
}
EOF
```

## Security Best Practices

### Server Hardening

- **Regular Updates**: Keep RLM software updated to latest version
- **Access Control**: Restrict access to license server and web interface
- **Encryption**: Use HTTPS for web interface communication
- **User Management**: Create separate users for different access levels

### License Protection

```bash
# Secure license files
sudo chmod 600 /opt/rlm/licenses/*.lic
sudo chown root:rlm /opt/rlm/licenses/*.lic

# Backup license files securely
sudo tar -czf /backup/rlm-licenses-$(date +%Y%m%d).tar.gz /opt/rlm/licenses/
```

## Performance Optimization

### Server Configuration

Optimize RLM performance by adjusting `/opt/rlm/rlm.conf`:

```bash
# Performance settings
max_roam_count 10
roam_minimum 300
license_timeout 3600
web_interface_port 5054
web_refresh_rate 30
```

### System Resources

Monitor and optimize system resources:

```bash
# Monitor RLM process
ps aux | grep rlm
top -p $(pgrep rlm)

# Check memory usage
free -h

# Monitor disk space
df -h /opt/rlm /var/log/rlm
```

## Troubleshooting

### Common Issues

**RLM Server Won't Start**

```bash
# Check configuration file
rlm -c /opt/rlm/rlm.conf -test

# Review error logs
sudo tail -f /var/log/rlm/debug.log

# Verify license file syntax
rlmutil rlmcksum /opt/rlm/licenses/*.lic
```

**License Checkout Failures**

```bash
# Check license availability
rlmutil rlmstat -a

# Test specific feature
rlmutil rlmstat -f feature_name

# Check client connectivity
telnet rlm-server 5053
```

**Web Interface Issues**

```bash
# Verify web service is running
netstat -tlnp | grep 5054

# Check web interface logs
sudo grep -i error /var/log/rlm/rlm.log

# Reset web interface
sudo systemctl restart rlm
```

## Backup and Recovery

### Automated Backup

```bash
# Create backup script
sudo cat > /opt/rlm/backup-rlm.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/rlm"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration and licenses
tar -czf $BACKUP_DIR/rlm-config-$DATE.tar.gz /opt/rlm/
tar -czf $BACKUP_DIR/rlm-logs-$DATE.tar.gz /var/log/rlm/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

sudo chmod +x /opt/rlm/backup-rlm.sh

# Schedule daily backup
echo "0 2 * * * root /opt/rlm/backup-rlm.sh" | sudo tee -a /etc/crontab
```

### Recovery Procedures

```bash
# Restore from backup
sudo systemctl stop rlm
sudo tar -xzf /backup/rlm/rlm-config-latest.tar.gz -C /
sudo systemctl start rlm
sudo systemctl status rlm
```

## Integration Testing

### Verify Client Access

```bash
# Test from client machine
export RLM_LICENSE=port@server
rlmutil rlmstat -a -c $RLM_LICENSE

# Test application license checkout
your_application --license-test
```

### Performance Testing

```bash
# Simulate multiple license checkouts
for i in {1..10}; do
    rlmutil rlmstat -f feature_name &
done
wait

# Monitor server performance during test
rlmutil rlmstat -a
```

## Next Steps

After setting up your user-managed RLM server:

1. **Configure High Availability**: Set up redundant license servers
2. **Implement Monitoring**: Enable comprehensive license monitoring with Vantage
3. **Optimize Usage**: Analyze usage patterns and optimize license allocation
4. **Security Review**: Conduct regular security assessments and updates

For advanced configuration and enterprise features, contact your RLM vendor or see additional documentation in the Vantage dashboard.
