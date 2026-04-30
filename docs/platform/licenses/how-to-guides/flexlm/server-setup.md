---
id: server-setup
title: Server Setup
sidebar_position: 2
description: FlexLM license server installation and configuration for Vantage integration.
---

# FlexLM Server Setup

This guide covers the installation and configuration of FlexLM license servers for optimal integration with Vantage License Manager.

## Single License Server

### Server Installation

```bash
# Download FlexLM license server components
wget http://vendor.com/flexlm/lmgrd
wget http://vendor.com/flexlm/vendor_daemon

# Make executable
chmod +x lmgrd vendor_daemon

# Create directory structure
sudo mkdir -p /opt/flexlm/{bin,licenses,logs}
sudo useradd -r -s /bin/false flexlm
sudo chown -R flexlm:flexlm /opt/flexlm

# Install binaries
sudo cp lmgrd vendor_daemon /opt/flexlm/bin/
```

### License File Configuration

```bash
# Example: /opt/flexlm/licenses/ansys.lic
SERVER license-server.vantage.com 001122334455 27000
DAEMON ansyslmd /opt/flexlm/bin/ansyslmd
USE_SERVER

FEATURE ANSYS ansyslmd 2023.1000 permanent uncounted \
        VENDOR_STRING=ANSYS \
        HOSTID=001122334455 \
        TS_OK SN=123456 \
        ISSUED=01-Jan-2023 \
        NOTICE="ANSYS License"

FEATURE CFX ansyslmd 2023.1000 31-Dec-2024 10 \
        VENDOR_STRING=ANSYS \
        HOSTID=001122334455 \
        TS_OK SN=123456 \
        ISSUED=01-Jan-2023 \
        NOTICE="CFX License"
```

### Systemd Service

```ini
# /etc/systemd/system/flexlm-ansys.service
[Unit]
Description=FlexLM License Server for ANSYS
After=network.target

[Service]
Type=forking
User=flexlm
Group=flexlm
ExecStart=/opt/flexlm/bin/lmgrd -c /opt/flexlm/licenses/ansys.lic -l /var/log/flexlm/ansys.log
ExecStop=/opt/flexlm/bin/lmutil lmdown -c /opt/flexlm/licenses/ansys.lic
PIDFile=/var/run/flexlm/ansys.pid
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Start and Enable Service

```bash
# Enable and start the service
sudo systemctl enable flexlm-ansys
sudo systemctl start flexlm-ansys

# Check status
sudo systemctl status flexlm-ansys

# View logs
sudo journalctl -u flexlm-ansys -f
```

## Environment Configuration

### System-wide Settings

```bash
# /etc/environment
ANSYSLMD_LICENSE_FILE=27000@license-server.vantage.com
LM_LICENSE_FILE=27000@license-server.vantage.com
ALTAIR_LICENSE_PATH=6200@license-server.vantage.com
```

### Application-Specific Configuration

**ANSYS Configuration**:
```bash
# ANSYS licensing setup
export ANSYSLMD_LICENSE_FILE="1055@license-server.vantage.com"
export ANSYS_FLEXLM_DISABLE_DEFLM=1

# For Fluent
export FLUENT_LICENSING=flex
export FLUENT_LICENSE_FILE="$ANSYSLMD_LICENSE_FILE"
```

**MATLAB Configuration**:
```bash
# MATLAB network license
export MLM_LICENSE_FILE="27000@license-server.vantage.com"

# Test MATLAB licensing
matlab -batch "license('test', 'MATLAB')"
```

## Performance Optimization

### Server Tuning

```bash
# Increase file descriptor limits
echo "flexlm soft nofile 65536" >> /etc/security/limits.conf
echo "flexlm hard nofile 65536" >> /etc/security/limits.conf

# Network optimization
echo 'net.core.somaxconn = 1024' >> /etc/sysctl.conf
echo 'net.core.netdev_max_backlog = 5000' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 2048' >> /etc/sysctl.conf
sysctl -p
```

### License File Optimization

```bash
# Optimized feature definitions with timeouts and borrowing
FEATURE FLUENT ansyslmd 2023.1000 permanent 50 \
        VENDOR_STRING=ANSYS \
        HOSTID=001122334455 \
        TS_OK SN=123456 \
        TIMEOUT=3600 \
        BORROW=86400 \
        NOTICE="Fluent with timeout and borrow"

# Access control
INCLUDE FLUENT USER smith jones GROUP engineers
EXCLUDE CFX HOST slow-machine.vantage.com
```

## Firewall Configuration

```bash
# Open required ports
sudo firewall-cmd --permanent --add-port=27000/tcp  # lmgrd port
sudo firewall-cmd --permanent --add-port=27001-27020/tcp  # daemon ports
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 27000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 27001:27020 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## Security Configuration

### Access Control

```bash
# Restrict server access by IP
echo "INCLUDE * INTERNET 192.168.1.0/24" >> /opt/flexlm/licenses/ansys.lic

# User-based restrictions
echo "GROUP engineers USER smith jones wilson" >> /opt/flexlm/licenses/ansys.lic
echo "INCLUDE FLUENT GROUP engineers" >> /opt/flexlm/licenses/ansys.lic
```

### SSL/TLS Configuration (Vendor-specific)

```bash
# Some vendors support encrypted communications
# Check vendor documentation for SSL certificate setup
FEATURE ANSYS ansyslmd 2023.1000 permanent uncounted \
        VENDOR_STRING=ANSYS \
        HOSTID=001122334455 \
        ENCRYPTION_SEEDS="A1B2C3D4 E5F6G7H8" \
        TS_OK
```

## Monitoring Setup

### Log Configuration

```bash
# Configure detailed logging
echo "REPORTLOG /var/log/flexlm/usage.log" >> /opt/flexlm/licenses/ansys.lic
echo "DEBUGLOG /var/log/flexlm/debug.log" >> /opt/flexlm/licenses/ansys.lic

# Log rotation
cat > /etc/logrotate.d/flexlm << EOF
/var/log/flexlm/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    create 644 flexlm flexlm
    postrotate
        systemctl reload flexlm-ansys
    endscript
}
EOF
```

### Health Check Scripts

```bash
#!/bin/bash
# /opt/flexlm/bin/health-check.sh

FLEXLM_SERVER="27000@license-server.vantage.com"
LOG_FILE="/var/log/flexlm/health-check.log"

check_server() {
    if /opt/flexlm/bin/lmutil lmstat -c "$FLEXLM_SERVER" > /dev/null 2>&1; then
        echo "$(date): FlexLM server is running" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): FlexLM server is down" >> "$LOG_FILE"
        return 1
    fi
}

restart_server() {
    echo "$(date): Attempting to restart FlexLM server" >> "$LOG_FILE"
    systemctl restart flexlm-ansys
    sleep 30
    
    if check_server; then
        echo "$(date): FlexLM server restart successful" >> "$LOG_FILE"
    else
        echo "$(date): FlexLM server restart failed" >> "$LOG_FILE"
        # Send alert email
        mail -s "FlexLM Server Down" admin@vantage.com < "$LOG_FILE"
    fi
}

# Main health check
if ! check_server; then
    restart_server
fi
```

### Cron Job for Health Checks

```bash
# Add to crontab (crontab -e)
*/5 * * * * /opt/flexlm/bin/health-check.sh
```

## Integration with Vantage

### Register Server with Vantage

```bash
# Register the configured server
vantage licenses add \
  --type flexlm \
  --vendor ansys \
  --server license-server.vantage.com:27000 \
  --daemon ansyslmd \
  --name "Production ANSYS FlexLM" \
  --description "Main ANSYS license server for production workloads"

# Enable monitoring
vantage licenses monitor enable ansys-flexlm \
  --interval 60 \
  --alerts high_usage,server_down
```

### Validation

```bash
# Test server connectivity
vantage licenses test ansys-flexlm

# Check discovered features
vantage licenses features ansys-flexlm

# View real-time usage
vantage licenses usage ansys-flexlm --watch
```

## Backup and Recovery

### License File Backup

```bash
#!/bin/bash
# /opt/flexlm/bin/backup-licenses.sh

BACKUP_DIR="/backup/flexlm"
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup license files
tar -czf "$BACKUP_DIR/flexlm-licenses-$DATE.tar.gz" \
    /opt/flexlm/licenses/ \
    /opt/flexlm/config/ \
    /etc/systemd/system/flexlm-*.service

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "flexlm-licenses-*.tar.gz" -mtime +30 -delete

echo "$(date): License files backed up to $BACKUP_DIR/flexlm-licenses-$DATE.tar.gz"
```

### Disaster Recovery

```bash
# Document server configuration for disaster recovery
echo "# FlexLM Server Recovery Information" > /opt/flexlm/RECOVERY.md
echo "Server: $(hostname)" >> /opt/flexlm/RECOVERY.md
echo "IP: $(hostname -I)" >> /opt/flexlm/RECOVERY.md
echo "MAC: $(ip link show | grep ether | head -1 | awk '{print $2}')" >> /opt/flexlm/RECOVERY.md
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)" >> /opt/flexlm/RECOVERY.md
echo "FlexLM Version: $(/opt/flexlm/bin/lmgrd -version 2>&1 | head -1)" >> /opt/flexlm/RECOVERY.md
```

## Next Steps

- **[High Availability Setup](high-availability)**: Configure redundant license servers
- **[Monitoring & Analytics](monitoring)**: Set up comprehensive monitoring
- **[Troubleshooting](troubleshooting)**: Diagnose and resolve common issues

---

> **Important**: Always test license server configuration in a development environment before deploying to production. Keep backups of license files and server configurations.
