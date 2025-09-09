---
id: lmx-server-setup
title: Server Setup
sidebar_position: 2
description: Install and configure LMX license server with Vantage integration.
---

# LMX Server Setup

This guide covers the installation and configuration of X-Formation LMX license server with full Vantage platform integration. LMX provides advanced license management capabilities including borrowing, geographic distribution, and comprehensive analytics through the Vantage License Manager.

## System Requirements

### Hardware Requirements

**Minimum Configuration**:
- CPU: 2 cores (x86_64)
- RAM: 4 GB
- Storage: 20 GB available space
- Network: 1 Gbps Ethernet

**Recommended Configuration**:
- CPU: 4 cores (x86_64)
- RAM: 8 GB
- Storage: 50 GB SSD
- Network: 10 Gbps Ethernet (for high-usage environments)

**Enterprise Configuration**:
- CPU: 8 cores (x86_64)
- RAM: 16 GB
- Storage: 100 GB SSD (RAID 1)
- Network: Redundant 10 Gbps connections

### Software Requirements

**Operating System**:
- RHEL/CentOS 7.x or 8.x
- Ubuntu 18.04 LTS or 20.04 LTS
- SUSE Linux Enterprise 15.x

**Dependencies**:
```bash
# RHEL/CentOS
sudo yum install -y wget curl gcc glibc-devel openssl-devel

# Ubuntu/Debian
sudo apt update
sudo apt install -y wget curl build-essential libssl-dev

# SUSE
sudo zypper install -y wget curl gcc glibc-devel openssl-devel
```

### Network Requirements

**Port Configuration**:
- **6200**: LMX license server (TCP)
- **8080**: LMX web interface (TCP)
- **6201-6210**: Vendor daemon ports (TCP, configurable)
- **22**: SSH management (TCP)
- **443**: HTTPS for Vantage integration (TCP)

**Firewall Rules**:
```bash
# RHEL/CentOS with firewalld
sudo firewall-cmd --permanent --add-port=6200/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=6201-6210/tcp
sudo firewall-cmd --reload

# Ubuntu with ufw
sudo ufw allow 6200/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 6201:6210/tcp

# Manual iptables
sudo iptables -A INPUT -p tcp --dport 6200 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 6201:6210 -j ACCEPT
```

## LMX Installation

### Download and Install LMX

```bash
# Create LMX user and directories
sudo useradd -r -s /bin/bash -d /opt/lmx -m lmx
sudo mkdir -p /opt/lmx/{bin,licenses,logs,config}
sudo chown -R lmx:lmx /opt/lmx

# Download LMX from X-Formation (requires valid support contract)
# Contact X-Formation support for download access
cd /tmp
wget https://download.x-formation.com/lmx/lmx-v4.9.6-linux-x64.tar.gz

# Extract and install
tar -xzf lmx-v4.9.6-linux-x64.tar.gz
sudo cp lmx-v4.9.6-linux-x64/* /opt/lmx/bin/
sudo chown -R lmx:lmx /opt/lmx/bin/
sudo chmod +x /opt/lmx/bin/*

# Create symbolic links for easy access
sudo ln -s /opt/lmx/bin/lmxendutil /usr/local/bin/
sudo ln -s /opt/lmx/bin/lmxhostid /usr/local/bin/
```

### Verify Installation

```bash
# Check LMX version and hostid
sudo -u lmx /opt/lmx/bin/lmxendutil -licstat
sudo -u lmx /opt/lmx/bin/lmxhostid

# Test basic functionality
sudo -u lmx /opt/lmx/bin/lmxendutil -help
```

## License Server Configuration

### Basic Configuration

Create the main LMX configuration file:

```bash
sudo -u lmx tee /opt/lmx/config/lmx.conf <<EOF
# LMX License Server Configuration
# Integrated with Vantage License Manager

# Server Configuration
LICENSEFILE /opt/lmx/licenses/
LOGFILE /opt/lmx/logs/lmx.log
DEBUGLOGFILE /opt/lmx/logs/debug.log

# Network Configuration
TCPPORT 6200
WEBINTERFACE_ENABLE true
WEBINTERFACE_PORT 8080
WEBINTERFACE_LOGFILE /opt/lmx/logs/web.log

# Security Configuration
WEBINTERFACE_AUTHENTICATION true
WEBINTERFACE_USERS_FILE /opt/lmx/config/users.conf
ENCRYPT_HANDSHAKE true

# Performance Settings
MAX_CONNECTIONS 500
CONNECTION_TIMEOUT 300
HEARTBEAT_INTERVAL 60

# Borrowing Configuration
BORROW_ENABLE true
BORROW_LOWWATER_MARK 2
BORROW_MAX_PERIOD 2419200  # 28 days in seconds

# Geographic Distribution
ALLOW_BORROW_ACROSS_TIMEZONES true
LICENSE_SHARING_ENABLE true

# Vantage Integration
USAGE_LOG_ENABLE true
USAGE_LOG_FILE /opt/lmx/logs/usage.log
USAGE_LOG_INTERVAL 300
WEB_API_ENABLE true

# Vendor-specific Settings
VENDOR_DAEMON_PATH /opt/lmx/bin/vendor/
MAX_VENDOR_DAEMONS 10

# Advanced Features
REDUNDANT_SERVER_ENABLE false
REDUNDANT_SERVER_PORT 6201
EOF
```

### Web Interface Authentication

```bash
# Create web interface users file
sudo -u lmx tee /opt/lmx/config/users.conf <<EOF
# LMX Web Interface Users
# Format: username:password_hash:permissions

# Admin user (replace with secure password hash)
admin:$(echo -n 'SecurePassword123' | sha256sum | cut -d' ' -f1):admin

# Readonly user for Vantage integration
vantage:$(echo -n 'VantageReadonlyPassword' | sha256sum | cut -d' ' -f1):readonly

# Additional users as needed
# monitor:$(echo -n 'MonitorPassword' | sha256sum | cut -d' ' -f1):readonly
EOF

# Secure the users file
sudo chmod 600 /opt/lmx/config/users.conf
```

### SSL/TLS Configuration

```bash
# Create SSL directory
sudo mkdir -p /opt/lmx/ssl
sudo chown lmx:lmx /opt/lmx/ssl

# Generate SSL certificate for web interface
sudo -u lmx openssl req -x509 -newkey rsa:4096 \
  -keyout /opt/lmx/ssl/server.key \
  -out /opt/lmx/ssl/server.crt \
  -days 365 -nodes \
  -subj "/CN=lmx-server.company.com/O=Company Name/C=US"

# Update configuration for SSL
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# SSL Configuration
WEBINTERFACE_SSL_ENABLE true
WEBINTERFACE_SSL_CERT /opt/lmx/ssl/server.crt
WEBINTERFACE_SSL_KEY /opt/lmx/ssl/server.key
WEBINTERFACE_SSL_PORT 8443
EOF
```

## License File Configuration

### Install License Files

```bash
# Create vendor-specific directories
sudo -u lmx mkdir -p /opt/lmx/licenses/{ansys,comsol,starccm}

# Example: Install ANSYS license file
# (Replace with your actual license file from vendor)
sudo -u lmx tee /opt/lmx/licenses/ansys/ansys.lic <<EOF
# ANSYS LMX License File
# Contact ANSYS support for your specific license

FEATURE ANSYS_CFX ansys 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=86400 \
    SIGN=A1B2C3D4E5F6789012345678

FEATURE ANSYS_FLUENT ansys 2023.1000 permanent 50 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=86400 \
    SIGN=F6E5D4C3B2A1987654321098

FEATURE ANSYS_MECHANICAL ansys 2023.1000 permanent 30 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=86400 \
    SIGN=123456789ABCDEF0123456789
EOF

# Example: Install COMSOL license file
sudo -u lmx tee /opt/lmx/licenses/comsol/comsol.lic <<EOF
# COMSOL Multiphysics LMX License File

FEATURE COMSOL_MULTIPHYSICS comsol 2023.1000 permanent 15 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=172800 \
    SIGN=ABCDEF1234567890ABCDEF12

FEATURE COMSOL_CFD comsol 2023.1000 permanent 10 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=172800 \
    SIGN=234567890ABCDEF1234567890
EOF

# Set proper permissions
sudo chmod 644 /opt/lmx/licenses/*/*.lic
```

### Configure License File Discovery

```bash
# Update main configuration for license file discovery
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# License File Configuration
LICENSEFILE_SCAN_ENABLE true
LICENSEFILE_SCAN_RECURSIVE true
LICENSEFILE_CACHE_ENABLE true
LICENSEFILE_CACHE_TIMEOUT 3600

# Vendor-specific Configuration
VENDOR_ANSYS_PATH /opt/lmx/licenses/ansys/
VENDOR_COMSOL_PATH /opt/lmx/licenses/comsol/
VENDOR_STARCCM_PATH /opt/lmx/licenses/starccm/
EOF
```

## Service Configuration

### Create Systemd Service

```bash
sudo tee /etc/systemd/system/lmx.service <<EOF
[Unit]
Description=LMX License Server
Documentation=https://www.x-formation.com/lmx/
After=network.target
Wants=network.target

[Service]
Type=forking
User=lmx
Group=lmx
WorkingDirectory=/opt/lmx
ExecStart=/opt/lmx/bin/lmxendutil -c /opt/lmx/config/lmx.conf
ExecReload=/bin/kill -HUP \$MAINPID
ExecStop=/opt/lmx/bin/lmxendutil -x
PIDFile=/opt/lmx/lmx.pid
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Security settings
NoNewPrivileges=yes
ProtectHome=yes
ProtectSystem=strict
ReadWritePaths=/opt/lmx

# Resource limits
LimitNOFILE=65536
LimitNPROC=32768

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable lmx
sudo systemctl start lmx

# Check service status
sudo systemctl status lmx
```

### Configure Log Rotation

```bash
sudo tee /etc/logrotate.d/lmx <<EOF
/opt/lmx/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 lmx lmx
    postrotate
        /bin/systemctl reload lmx > /dev/null 2>&1 || true
    endscript
}
EOF
```

## Vantage Integration

### Register LMX Server with Vantage

```bash
# Add LMX server to Vantage License Manager
vantage licenses add lmx-server \
  --type lmx \
  --display-name "Main LMX Server" \
  --host lmx-server.company.com \
  --port 6200 \
  --web-port 8080 \
  --web-ssl-port 8443 \
  --web-username vantage \
  --web-password-file /etc/vantage/lmx-readonly-password \
  --ssl-verify false \
  --description "Primary LMX server for ANSYS and COMSOL licenses"

# Configure monitoring and analytics
vantage licenses monitor lmx-server \
  --enable-web-integration \
  --collect-usage-data \
  --enable-cost-tracking \
  --enable-borrowing-analytics \
  --update-interval 300

# Test the integration
vantage licenses test lmx-server --verbose

# Enable optimization features
vantage licenses optimize lmx-server \
  --enable-borrowing \
  --enable-intelligent-queuing \
  --idle-timeout 7200 \
  --borrow-prediction-enable \
  --geographic-optimization true
```

### Configure Secure Authentication

```bash
# Create secure password file for Vantage integration
echo "VantageReadonlyPassword" | sudo tee /etc/vantage/lmx-readonly-password
sudo chmod 600 /etc/vantage/lmx-readonly-password
sudo chown vantage:vantage /etc/vantage/lmx-readonly-password

# Configure API access for advanced integration
vantage licenses api-config lmx-server \
  --enable-rest-api \
  --api-key-file /etc/vantage/lmx-api-key \
  --rate-limit 1000 \
  --enable-webhooks
```

### Test Integration

```bash
# Comprehensive integration test
vantage licenses validate lmx-server --all-checks

# Test specific features
vantage licenses test lmx-server --feature ANSYS_CFX
vantage licenses test lmx-server --feature COMSOL_MULTIPHYSICS

# Verify web interface integration
vantage licenses web-test lmx-server

# Check monitoring data collection
vantage licenses monitor-test lmx-server --duration 300

# Test borrowing functionality
vantage licenses borrow-test lmx-server --feature ANSYS_FLUENT --duration 3600
```

## Advanced Configuration

### Geographic Distribution Setup

```bash
# Configure for multi-site deployment
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# Geographic Distribution Configuration
GEOGRAPHIC_SITES_ENABLE true
LOCAL_SITE_ID "headquarters"
SITE_PRIORITY_LIST "headquarters:1,branch_office:2,remote_site:3"

# Site-specific License Pools
SITE_HEADQUARTERS_LICENSES "ANSYS_CFX:15,ANSYS_FLUENT:35,COMSOL_MULTIPHYSICS:10"
SITE_BRANCH_OFFICE_LICENSES "ANSYS_CFX:3,ANSYS_FLUENT:10,COMSOL_MULTIPHYSICS:3"
SITE_REMOTE_SITE_LICENSES "ANSYS_CFX:2,ANSYS_FLUENT:5,COMSOL_MULTIPHYSICS:2"

# Cross-site Borrowing
CROSS_SITE_BORROW_ENABLE true
CROSS_SITE_BORROW_THRESHOLD 80  # Percent utilization before cross-site borrowing
EOF

# Register site configuration with Vantage
vantage licenses sites configure lmx-server \
  --add-site headquarters --priority 1 \
  --add-site branch_office --priority 2 \
  --add-site remote_site --priority 3 \
  --enable-cross-site-sharing
```

### High-Performance Configuration

```bash
# Optimize for high-concurrency environments
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# High-Performance Settings
THREAD_POOL_SIZE 50
CONNECTION_POOL_SIZE 200
CACHE_SIZE_LICENSES 10000
CACHE_SIZE_USERS 5000
CACHE_SIZE_SESSIONS 15000

# Database Integration (optional)
DATABASE_ENABLE true
DATABASE_TYPE postgresql
DATABASE_HOST lmx-db.company.com
DATABASE_PORT 5432
DATABASE_NAME lmx_analytics
DATABASE_USER lmx_readonly
DATABASE_SSL_ENABLE true

# Performance Monitoring
PERFORMANCE_MONITORING_ENABLE true
PERFORMANCE_LOG_FILE /opt/lmx/logs/performance.log
PERFORMANCE_LOG_INTERVAL 60
EOF
```

### Security Hardening

```bash
# Enhanced security configuration
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# Security Hardening
REQUIRE_STRONG_AUTHENTICATION true
SESSION_TIMEOUT 3600
MAX_FAILED_LOGINS 3
LOCKOUT_DURATION 900

# Network Security
ALLOWED_HOSTS_FILE /opt/lmx/config/allowed_hosts.conf
DENIED_HOSTS_FILE /opt/lmx/config/denied_hosts.conf
REQUIRE_REVERSE_DNS true

# Audit Logging
AUDIT_LOG_ENABLE true
AUDIT_LOG_FILE /opt/lmx/logs/audit.log
AUDIT_LOG_EVENTS "login,logout,borrow,return,admin_action"
EOF

# Create allowed hosts configuration
sudo -u lmx tee /opt/lmx/config/allowed_hosts.conf <<EOF
# Allowed client networks
10.0.0.0/8
192.168.0.0/16
172.16.0.0/12
company.com
*.company.com
EOF
```

## Verification and Testing

### Service Verification

```bash
# Check LMX service status
sudo systemctl status lmx
sudo systemctl is-active lmx

# Test license server functionality
/opt/lmx/bin/lmxendutil -licstat -c 6200@lmx-server.company.com

# Check web interface
curl -k https://lmx-server.company.com:8443/
curl -k -u vantage:VantageReadonlyPassword https://lmx-server.company.com:8443/api/status

# Verify license features
/opt/lmx/bin/lmxendutil -licstat -f ANSYS_CFX -c 6200@lmx-server.company.com
```

### Performance Testing

```bash
# Load testing script
sudo -u lmx tee /opt/lmx/bin/load_test.sh <<'EOF'
#!/bin/bash
# Basic load test for LMX server

echo "Starting LMX load test..."
for i in {1..10}; do
    (
        /opt/lmx/bin/lmxendutil -licstat -c 6200@localhost &
        sleep 1
    ) &
done

wait
echo "Load test completed"
EOF

sudo chmod +x /opt/lmx/bin/load_test.sh
sudo -u lmx /opt/lmx/bin/load_test.sh
```

### Integration Testing

```bash
# Comprehensive Vantage integration test
vantage licenses integration-test lmx-server \
  --test-web-interface \
  --test-license-checkout \
  --test-borrowing \
  --test-monitoring \
  --test-analytics \
  --generate-report

# Test borrowing functionality
vantage licenses borrow ANSYS_CFX \
  --server lmx-server \
  --duration 24h \
  --test-mode

# Verify monitoring data
vantage licenses usage lmx-server --last 1h --detailed
```

## Troubleshooting

### Common Issues

**Service won't start**:
```bash
# Check configuration syntax
sudo -u lmx /opt/lmx/bin/lmxendutil -test -c /opt/lmx/config/lmx.conf

# Check log files
sudo tail -f /opt/lmx/logs/lmx.log
sudo journalctl -u lmx -f

# Verify permissions
sudo ls -la /opt/lmx/
sudo ls -la /opt/lmx/licenses/
```

**License features not available**:
```bash
# Verify license file syntax
sudo -u lmx /opt/lmx/bin/lmxendutil -licverify /opt/lmx/licenses/ansys/ansys.lic

# Check system date/time
date
sudo ntpdate -s time.nist.gov

# Test specific feature
/opt/lmx/bin/lmxendutil -licstat -f ANSYS_CFX -c 6200@localhost
```

## Next Steps

- **[High Availability Setup](lmx-high-availability)**: Configure redundant LMX servers
- **[Monitoring & Analytics](lmx-monitoring)**: Set up comprehensive usage tracking
- **[Troubleshooting Guide](lmx-troubleshooting)**: Diagnose and resolve common issues

---

> **Best Practice**: Always test LMX configuration changes in a non-production environment first. The borrowing and geographic distribution features require careful tuning to match your organization's usage patterns and network topology. Regular monitoring through the Vantage dashboard helps identify optimization opportunities and potential issues before they impact users.
