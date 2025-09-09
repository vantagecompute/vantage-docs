---
id: rlm-server-setup
title: Server Setup
sidebar_position: 2
description: RLM license server installation and configuration for Vantage integration.
---

# RLM Server Setup

This guide covers the installation and configuration of RLM (Reprise License Manager) servers for optimal integration with Vantage License Manager.

## Single License Server

### Server Installation

```bash
# Download RLM license server components
wget http://vendor.com/rlm/rlm
wget http://vendor.com/rlm/vendor_isv

# Make executable
chmod +x rlm vendor_isv

# Create directory structure
sudo mkdir -p /opt/rlm/{bin,licenses,logs,web}
sudo useradd -r -s /bin/false rlm
sudo chown -R rlm:rlm /opt/rlm

# Install binaries
sudo cp rlm vendor_isv /opt/rlm/bin/

# Create web interface directory
sudo mkdir -p /opt/rlm/web/htdocs
```

### License File Configuration

```bash
# Example: /opt/rlm/licenses/siemens.lic
HOST rlm-server.vantage.com ANY 5053
ISV siemens

# STAR-CCM+ licenses
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    SIGN=60B459C90C71ABC123

# NX CAE licenses
LICENSE siemens NXCAE 2023.1000 31-Dec-2024 10 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    SIGN=50A348B80B62DEF456

# LS-DYNA licenses (if using RLM)
LICENSE lstc LSDYNA 13.1 permanent 8 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=12 \
    SIGN=789GHI456JKL012
```

### RLM Configuration File

```bash
# /opt/rlm/rlm.conf
# Main RLM configuration

# Web interface settings
WEB_INTERFACE_ENABLE 1
WEB_INTERFACE_PORT 5054
WEB_INTERFACE_LOG /opt/rlm/logs/web.log

# License file paths
LICENSE_PATH /opt/rlm/licenses

# Logging configuration
LOG_FILE /opt/rlm/logs/rlm.log
LOG_LEVEL 2

# Security settings
ADMIN_PASSWORD_REQUIRED 1
WEB_INTERFACE_HTTPS 1
WEB_INTERFACE_CERT /opt/rlm/ssl/server.crt
WEB_INTERFACE_KEY /opt/rlm/ssl/server.key

# Performance tuning
MAX_ROAM_COUNT 50
DEFAULT_ROAM_DAYS 7
CONNECTION_TIMEOUT 300
```

### Systemd Service

```ini
# /etc/systemd/system/rlm.service
[Unit]
Description=RLM License Server
After=network.target

[Service]
Type=forking
User=rlm
Group=rlm
WorkingDirectory=/opt/rlm
ExecStart=/opt/rlm/bin/rlm -c /opt/rlm/rlm.conf -dlog /opt/rlm/logs/rlm.log
ExecStop=/opt/rlm/bin/rlm -shutdown
PIDFile=/opt/rlm/rlm.pid
Restart=always
RestartSec=10
Environment="RLM_LICENSE_PATH=/opt/rlm/licenses"
Environment="RLM_LOG_FILE=/opt/rlm/logs/rlm.log"

[Install]
WantedBy=multi-user.target
```

### SSL Certificate Setup

```bash
# Generate self-signed certificate for web interface
sudo mkdir -p /opt/rlm/ssl
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/rlm/ssl/server.key \
  -out /opt/rlm/ssl/server.crt -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=rlm-server.vantage.com"

# Set appropriate permissions
sudo chown -R rlm:rlm /opt/rlm/ssl
sudo chmod 600 /opt/rlm/ssl/server.key
sudo chmod 644 /opt/rlm/ssl/server.crt
```

### Start and Enable Service

```bash
# Enable and start the service
sudo systemctl enable rlm
sudo systemctl start rlm

# Check status
sudo systemctl status rlm

# View logs
sudo journalctl -u rlm -f

# Test web interface access
curl -k https://rlm-server.vantage.com:5054
```

## Environment Configuration

### System-wide Settings

```bash
# /etc/environment
RLM_LICENSE=5053@rlm-server.vantage.com
SIEMENS_LICENSE_FILE=5053@rlm-server.vantage.com
LSTC_LICENSE_SERVER=5053@rlm-server.vantage.com
```

### Application-Specific Configuration

**STAR-CCM+ Configuration**:
```bash
# Siemens STAR-CCM+ licensing setup
export CDLMD_LICENSE_FILE="5053@rlm-server.vantage.com"
export RLM_LICENSE="5053@rlm-server.vantage.com"

# For batch mode
starccm+ -batch -license 5053@rlm-server.vantage.com simulation.java
```

**LS-DYNA Configuration**:
```bash
# LS-DYNA with RLM
export LSTC_LICENSE_SERVER="5053@rlm-server.vantage.com"
export RLM_LICENSE="5053@rlm-server.vantage.com"

# Test LS-DYNA licensing
lsdyna -i test.k -license_server 5053@rlm-server.vantage.com
```

**COMSOL Configuration**:
```bash
# COMSOL Multiphysics
export COMSOL_LICENSE_FILE="5053@rlm-server.vantage.com"

# Test COMSOL licensing
comsol -nn 4 -license_server 5053@rlm-server.vantage.com
```

## Performance Optimization

### Server Tuning

```bash
# Increase file descriptor limits
echo "rlm soft nofile 65536" >> /etc/security/limits.conf
echo "rlm hard nofile 65536" >> /etc/security/limits.conf

# Memory optimization
echo "vm.swappiness = 10" >> /etc/sysctl.conf
echo "vm.dirty_ratio = 15" >> /etc/sysctl.conf
echo "vm.dirty_background_ratio = 5" >> /etc/sysctl.conf

# Network optimization for RLM
echo 'net.core.somaxconn = 2048' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 4096' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_keepalive_time = 300' >> /etc/sysctl.conf
sysctl -p
```

### License File Optimization

```bash
# Optimized RLM license with user groups and reservations
HOST rlm-server.vantage.com ANY 5053
ISV siemens

# Define user groups
GROUP engineering smith jones wilson chen
GROUP research brown davis taylor

# Feature with group restrictions and reservations
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    RESERVE 5 GROUP engineering \
    RESERVE 3 GROUP research \
    TIMEOUT=7200 \
    SIGN=60B459C90C71ABC123

# License with time restrictions
LICENSE siemens NXCAE 2023.1000 permanent 10 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    TIMEUSE 8:00-18:00 \
    WEEKDAYS \
    SIGN=50A348B80B62DEF456
```

## Firewall Configuration

```bash
# Open required ports for RLM
sudo firewall-cmd --permanent --add-port=5053/tcp  # RLM server port
sudo firewall-cmd --permanent --add-port=5054/tcp  # Web interface port
sudo firewall-cmd --permanent --add-port=5055-5060/tcp  # ISV server ports
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 5053 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5054 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5055:5060 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## Security Configuration

### Web Interface Security

```bash
# Configure admin password for web interface
echo "admin:$(openssl passwd -1 'SecurePassword123')" > /opt/rlm/admin_password

# Update rlm.conf for enhanced security
cat >> /opt/rlm/rlm.conf << EOF

# Enhanced security settings
WEB_INTERFACE_ADMIN_PASSWORD_FILE /opt/rlm/admin_password
WEB_INTERFACE_RESTRICT_BY_IP 192.168.1.0/24
REQUIRE_STRONG_AUTHENTICATION 1
SESSION_TIMEOUT 3600

# Disable unnecessary features
DISABLE_ACTIVATION_BY_HTTP 1
DISABLE_DEMO_LICENSES 1
EOF
```

### Access Control

```bash
# License file access control
HOST rlm-server.vantage.com ANY 5053
ISV siemens

# IP-based restrictions
INCLUDEIP 192.168.1.0/24 192.168.10.0/24

# User and host exclusions
EXCLUDE USER baduser HOST compromised-host.vantage.com

# Time-based restrictions
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    INCLUDEIP 192.168.1.0/24 \
    TIMEUSE 6:00-22:00 \
    SIGN=60B459C90C71ABC123
```

## Monitoring Setup

### Log Configuration

```bash
# Enhanced logging configuration in rlm.conf
LOG_FILE /opt/rlm/logs/rlm.log
LOG_LEVEL 3
LOG_ROTATE_SIZE 100000000  # 100MB
LOG_ROTATE_COUNT 10

# Usage reporting
REPORT_LOG /opt/rlm/logs/usage.log
REPORT_LOG_FORMAT extended

# Debug logging for troubleshooting
DEBUG_LOG /opt/rlm/logs/debug.log
DEBUG_LOG_LEVEL 2
```

### Log Rotation

```bash
# Configure log rotation
cat > /etc/logrotate.d/rlm << EOF
/opt/rlm/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    create 644 rlm rlm
    postrotate
        systemctl reload rlm
    endscript
}
EOF
```

### Health Check Scripts

```bash
#!/bin/bash
# /opt/rlm/bin/health-check.sh

RLM_SERVER="5053@rlm-server.vantage.com"
LOG_FILE="/var/log/rlm/health-check.log"
WEB_URL="https\://rlm-server.vantage.com:5054"

check_rlm_server() {
    if timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "$RLM_SERVER" > /dev/null 2>&1; then
        echo "$(date): RLM server is running" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): RLM server is down" >> "$LOG_FILE"
        return 1
    fi
}

check_web_interface() {
    if timeout 10 curl -k -s "$WEB_URL" > /dev/null 2>&1; then
        echo "$(date): RLM web interface is accessible" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): RLM web interface is down" >> "$LOG_FILE"
        return 1
    fi
}

restart_rlm() {
    echo "$(date): Attempting to restart RLM server" >> "$LOG_FILE"
    systemctl restart rlm
    sleep 30
    
    if check_rlm_server && check_web_interface; then
        echo "$(date): RLM server restart successful" >> "$LOG_FILE"
    else
        echo "$(date): RLM server restart failed" >> "$LOG_FILE"
        # Send alert
        mail -s "RLM Server Critical Failure" admin@vantage.com < "$LOG_FILE"
    fi
}

# Main health checks
if ! check_rlm_server; then
    restart_rlm
elif ! check_web_interface; then
    echo "$(date): Web interface issue, restarting RLM" >> "$LOG_FILE"
    restart_rlm
fi

# Check license utilization and alert if high
UTIL=$(/opt/rlm/bin/rlmutil rlmstat -c "$RLM_SERVER" | grep -E "in use" | \
       awk '{print $7}' | tr -d '()' | cut -d'/' -f1)
if [ "$UTIL" -gt 18 ]; then  # Alert at 90% utilization (18/20)
    echo "$(date): High license utilization: $UTIL licenses in use" >> "$LOG_FILE"
    echo "RLM license utilization is at $UTIL/20 (90%+)" | \
        mail -s "RLM High Utilization Alert" admin@vantage.com
fi
```

### Usage Monitoring Script

```bash
#!/bin/bash
# /opt/rlm/bin/usage-monitor.sh

RLM_SERVER="5053@rlm-server.vantage.com"
USAGE_LOG="/opt/rlm/logs/usage-summary.log"

get_license_usage() {
    /opt/rlm/bin/rlmutil rlmstat -c "$RLM_SERVER" -a | \
    awk '/^License server/ {server=$0} 
         /Users of/ {
             feature=$3
             gsub(/:/,"",feature)
             total=$(NF-1)
             used=$NF
             gsub(/[()]/,"",used)
             gsub(/[()]/,"",total)
             split(used,u,"/")
             print strftime("%Y-%m-%d %H:%M:%S") "," feature "," u[1] "," total
         }'
}

# Log usage every hour
echo "timestamp,feature,used,total" > "$USAGE_LOG.tmp"
get_license_usage >> "$USAGE_LOG.tmp"
mv "$USAGE_LOG.tmp" "$USAGE_LOG"
```

### Cron Jobs for Monitoring

```bash
# Add to crontab (crontab -e)
*/5 * * * * /opt/rlm/bin/health-check.sh
0 * * * * /opt/rlm/bin/usage-monitor.sh
```

## Integration with Vantage

### Register Server with Vantage

```bash
# Register the configured RLM server
vantage licenses add \
  --type rlm \
  --vendor siemens \
  --server rlm-server.vantage.com:5053 \
  --web-port 5054 \
  --name "Production Siemens RLM" \
  --description "Main RLM server for Siemens applications"

# Enable monitoring and analytics
vantage licenses monitor enable siemens-rlm \
  --interval 60 \
  --alerts high_usage,server_down,web_interface_down \
  --webhook https://alerts.vantage.com/webhooks/rlm

# Configure usage tracking
vantage licenses analytics enable siemens-rlm \
  --track-users \
  --track-projects \
  --cost-allocation department
```

### Validation and Testing

```bash
# Test server connectivity
vantage licenses test siemens-rlm

# Check discovered features
vantage licenses features siemens-rlm

# View real-time usage
vantage licenses usage siemens-rlm --watch

# Test web interface integration
vantage licenses web-interface siemens-rlm

# Validate license checkout
vantage licenses checkout siemens-rlm STARCCM --user testuser --test
```

## Backup and Recovery

### Comprehensive Backup Script

```bash
#!/bin/bash
# /opt/rlm/bin/backup-rlm.sh

BACKUP_DIR="/backup/rlm"
DATE=$(date +%Y%m%d-%H%M%S)
HOSTNAME=$(hostname)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Stop RLM briefly for consistent backup
systemctl stop rlm
sleep 5

# Create comprehensive backup
tar -czf "$BACKUP_DIR/rlm-complete-$HOSTNAME-$DATE.tar.gz" \
    /opt/rlm/licenses/ \
    /opt/rlm/rlm.conf \
    /opt/rlm/ssl/ \
    /opt/rlm/logs/*.log \
    /etc/systemd/system/rlm.service \
    /etc/logrotate.d/rlm

# Restart RLM
systemctl start rlm

# Verify backup and log
if [ $? -eq 0 ]; then
    echo "$(date): RLM backup successful: $BACKUP_DIR/rlm-complete-$HOSTNAME-$DATE.tar.gz"
    
    # Keep only last 30 days of backups
    find "$BACKUP_DIR" -name "rlm-complete-*.tar.gz" -mtime +30 -delete
else
    echo "$(date): RLM backup failed" | mail -s "RLM Backup Failure" admin@vantage.com
fi
```

### Disaster Recovery Documentation

```bash
# Create disaster recovery information
cat > /opt/rlm/DISASTER_RECOVERY.md << EOF
# RLM Server Disaster Recovery

## Server Information
- Hostname: $(hostname)
- IP Address: $(hostname -I | awk '{print $1}')
- MAC Address: $(ip link show | grep ether | head -1 | awk '{print $2}')
- OS Version: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)
- RLM Version: $(/opt/rlm/bin/rlm -version 2>&1 | head -1)

## License Server Configuration
- Server Port: 5053
- Web Interface Port: 5054
- License Files: /opt/rlm/licenses/
- Configuration: /opt/rlm/rlm.conf
- SSL Certificates: /opt/rlm/ssl/

## Recovery Steps
1. Install RLM software on new server
2. Restore configuration from backup
3. Update hostname/IP in license files if changed
4. Start RLM service
5. Verify web interface access
6. Test license checkout
7. Update Vantage License Manager configuration
8. Notify users of server change

## Emergency Contacts
- System Administrator: admin@vantage.com
- License Administrator: licenses@vantage.com
- Vendor Support: support@siemens.com

## Backup Location
- Daily backups: /backup/rlm/
- Offsite backups: (specify location)
EOF
```

## Next Steps

- **[High Availability Setup](rlm-high-availability)**: Configure redundant RLM servers
- **[Monitoring & Analytics](rlm-monitoring)**: Set up comprehensive monitoring
- **[Troubleshooting](rlm-troubleshooting)**: Diagnose and resolve common issues

---

> **Important**: Always test RLM server configuration in a development environment before deploying to production. The web interface provides additional monitoring and administration capabilities beyond command-line tools.
