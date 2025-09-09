---
id: dsls-server-setup
title: Server Setup
sidebar_position: 2
description: Installation and configuration of DSLS license servers with Vantage integration.
---

# DSLS Server Setup and Configuration

This guide covers the installation and configuration of Dassault Systèmes License Server (DSLS) with full Vantage platform integration. DSLS provides token-based license management for SIMULIA, CATIA, SolidWorks, and other DS products with advanced token optimization through the Vantage License Manager.

## Prerequisites

Before installing DSLS with Vantage integration:

### System Requirements
- **Operating System**: Linux (RHEL/CentOS 7+, Ubuntu 18.04+, SLES 12+)
- **Memory**: Minimum 4GB RAM (8GB recommended for production)
- **Storage**: 20GB for server installation + license files
- **Network**: Dedicated license server network access

### License Information
- Valid DSLS license file from Dassault Systèmes
- Token allocation details and product mappings
- Academic licensing credentials (if applicable)
- High availability configuration requirements

### Network Configuration
- **Port 27000**: DSLS license server communication
- **Port 443/80**: Web administration interface
- **Firewall Rules**: Configure for DS application access

## Installation Process

### Step 1: System Preparation

```bash
# Create system user and directories
sudo useradd -r -s /bin/false dsls
sudo mkdir -p /opt/dsls/{bin,licenses,logs,config,backup}
sudo chown -R dsls:dsls /opt/dsls

# Install required packages
sudo yum install -y glibc.i686 libstdc++.i686 zlib.i686
# For Ubuntu/Debian:
# sudo apt-get install -y libc6:i386 libstdc++6:i386 zlib1g:i386
```

### Step 2: Download and Install DSLS

```bash
# Download DSLS server package
wget https://download.3ds.com/dsls/DSLicSrv_latest.tar.gz
tar -xzf DSLicSrv_latest.tar.gz
cd DSLicSrv_installer

# Run installation
sudo ./install_dsls.sh --prefix=/opt/dsls --user=dsls
```

### Step 3: License File Configuration

```bash
# Copy license file
sudo cp your_dsls_license.txt /opt/dsls/licenses/
sudo chown dsls:dsls /opt/dsls/licenses/your_dsls_license.txt
sudo chmod 644 /opt/dsls/licenses/your_dsls_license.txt

# Validate license file
sudo -u dsls /opt/dsls/bin/DSLicSrv -validate /opt/dsls/licenses/your_dsls_license.txt
```

### Step 4: Server Configuration

Create the main configuration file:

```bash
# /opt/dsls/config/DSLicSrv.opt
# DSLS Server Configuration

# Basic server settings
DSLS_PORT=27000
DSLS_LOG_FILE=/opt/dsls/logs/dsls.log
DSLS_DEBUG_LOG_FILE=/opt/dsls/logs/dsls_debug.log

# Token pool configuration
DSLS_TOKEN_POOL_SIZE=1000
DSLS_MAX_CONCURRENT_USERS=100
DSLS_TOKEN_TIMEOUT=3600

# Academic licensing (if applicable)
DSLS_ACADEMIC_MODE=true
DSLS_ACADEMIC_MULTIPLIER=0.2

# High availability settings
DSLS_HA_ENABLED=true
DSLS_HA_PEER_SERVER=backup-dsls.company.com:27000
DSLS_HA_SYNC_INTERVAL=60

# Web interface
DSLS_WEB_ENABLED=true
DSLS_WEB_PORT=443
DSLS_WEB_SSL_CERT=/opt/dsls/config/server.crt
DSLS_WEB_SSL_KEY=/opt/dsls/config/server.key

# Logging and monitoring
DSLS_LOG_LEVEL=INFO
DSLS_LOG_ROTATION=daily
DSLS_LOG_RETENTION=30

# Performance tuning
DSLS_MAX_CONNECTIONS=500
DSLS_CONNECTION_TIMEOUT=300
DSLS_CACHE_SIZE=100MB
```

### Step 5: Create System Service

```bash
# Create systemd service file
sudo tee /etc/systemd/system/dsls.service << EOF
[Unit]
Description=Dassault Systemes License Server
After=network.target

[Service]
Type=forking
User=dsls
Group=dsls
ExecStart=/opt/dsls/bin/DSLicSrv -daemon -config /opt/dsls/config/DSLicSrv.opt
ExecReload=/bin/kill -HUP \$MAINPID
ExecStop=/bin/kill -TERM \$MAINPID
PIDFile=/opt/dsls/logs/dsls.pid
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable dsls
sudo systemctl start dsls
```

## Product-Specific Configuration

### SIMULIA Configuration

```bash
# Configure Abaqus token allocation
echo "ABAQUS_STANDARD_TOKENS=5" >> /opt/dsls/config/products.conf
echo "ABAQUS_EXPLICIT_TOKENS=5" >> /opt/dsls/config/products.conf
echo "ABAQUS_CFD_TOKENS=10" >> /opt/dsls/config/products.conf
echo "TOSCA_TOKENS=15" >> /opt/dsls/config/products.conf

# Academic settings for SIMULIA
echo "ABAQUS_ACADEMIC_TOKENS=1" >> /opt/dsls/config/products.conf
echo "TOSCA_ACADEMIC_TOKENS=3" >> /opt/dsls/config/products.conf
```

### CATIA Configuration

```bash
# Configure CATIA licensing
echo "CATIA_V6_TOKENS=8" >> /opt/dsls/config/products.conf
echo "CATIA_GENERATIVE_TOKENS=12" >> /opt/dsls/config/products.conf
echo "CATIA_ANALYSIS_TOKENS=15" >> /opt/dsls/config/products.conf

# Academic CATIA settings
echo "CATIA_ACADEMIC_TOKENS=1" >> /opt/dsls/config/products.conf
```

### SolidWorks Configuration

```bash
# Configure SolidWorks licensing
echo "SOLIDWORKS_PREMIUM_TOKENS=3" >> /opt/dsls/config/products.conf
echo "SOLIDWORKS_SIMULATION_TOKENS=8" >> /opt/dsls/config/products.conf
echo "SOLIDWORKS_FLOW_TOKENS=10" >> /opt/dsls/config/products.conf

# Academic SolidWorks settings
echo "SOLIDWORKS_ACADEMIC_TOKENS=1" >> /opt/dsls/config/products.conf
```

## Vantage Integration Setup

### Step 1: Install Vantage Agent

```bash
# Download Vantage agent
curl -O https://releases.vantagecompute.ai/vantage-agent/latest/vantage-agent-linux.tar.gz
tar -xzf vantage-agent-linux.tar.gz

# Install agent
sudo ./install-vantage-agent.sh

# Configure for DSLS monitoring
sudo vantage-agent configure \
  --server-type dsls \
  --server-host localhost \
  --server-port 27000 \
  --license-file /opt/dsls/licenses/your_dsls_license.txt \
  --token-monitoring enabled \
  --product-tracking enabled
```

### Step 2: Agent Configuration

```yaml
# /etc/vantage-agent/dsls.yaml
dsls:
  server:
    host: localhost
    port: 27000
    timeout: 30
  
  monitoring:
    interval: 60
    token_tracking: true
    product_usage: true
    academic_separate: true
    
  products:
    - name: abaqus_standard
      tokens: 5
      category: simulia
    - name: abaqus_explicit  
      tokens: 5
      category: simulia
    - name: catia_v6
      tokens: 8
      category: design
    - name: solidworks_premium
      tokens: 3
      category: design
      
  academic:
    enabled: true
    multiplier: 0.2
    separate_reporting: true
    
  alerts:
    low_tokens: 50
    high_usage: 80
    failed_checkouts: 5
```

### Step 3: Vantage Dashboard Configuration

Connect DSLS to your Vantage organization:

1. **Login to Vantage**: Access your organization dashboard
2. **Navigate to License Management**: Select licenses from main menu
3. **Add License Server**: Choose "Add Server" → "User-Hosted"
4. **Configure DSLS Connection**:
   - Server Type: DSLS
   - Host: your-dsls-server.company.com
   - Port: 27000
   - Agent Endpoint: Vantage agent IP address
   - Authentication: API key from agent installation

## Academic Institution Setup

### Special Academic Configuration

For educational institutions with academic licensing:

```bash
# Enable academic mode
sudo /opt/dsls/bin/DSLicSrv -configure \
  --academic-mode \
  --student-pools \
  --course-scheduling \
  --reduced-tokens

# Configure student access
echo "ACADEMIC_STUDENT_POOL=500" >> /opt/dsls/config/academic.conf
echo "ACADEMIC_FACULTY_POOL=100" >> /opt/dsls/config/academic.conf
echo "ACADEMIC_RESEARCH_POOL=200" >> /opt/dsls/config/academic.conf
```

### Course Scheduling Integration

```bash
# Configure automated course scheduling
echo "COURSE_ABAQUS_101=50_tokens_8am-5pm_weekdays" >> /opt/dsls/config/courses.conf
echo "COURSE_CATIA_201=30_tokens_1pm-6pm_weekdays" >> /opt/dsls/config/courses.conf
```

## High Availability Configuration

### Primary Server Setup

```bash
# Configure as primary server
sudo /opt/dsls/bin/DSLicSrv -configure \
  --ha-primary \
  --ha-peer backup-dsls.company.com:27000 \
  --ha-sync-interval 60 \
  --ha-heartbeat 30
```

### Backup Server Setup

```bash
# Configure backup server
sudo /opt/dsls/bin/DSLicSrv -configure \
  --ha-backup \
  --ha-peer primary-dsls.company.com:27000 \
  --ha-sync-interval 60 \
  --ha-heartbeat 30
```

## Performance Optimization

### Memory and Caching

```bash
# Optimize memory usage
echo "DSLS_MEMORY_LIMIT=2GB" >> /opt/dsls/config/performance.conf
echo "DSLS_CACHE_SIZE=256MB" >> /opt/dsls/config/performance.conf
echo "DSLS_TOKEN_CACHE_TTL=300" >> /opt/dsls/config/performance.conf
```

### Connection Pooling

```bash
# Configure connection optimization
echo "DSLS_MAX_CONNECTIONS=1000" >> /opt/dsls/config/performance.conf
echo "DSLS_CONNECTION_POOL_SIZE=100" >> /opt/dsls/config/performance.conf
echo "DSLS_KEEP_ALIVE_TIMEOUT=60" >> /opt/dsls/config/performance.conf
```

## Security Configuration

### SSL/TLS Setup

```bash
# Generate SSL certificates
sudo openssl req -new -x509 -days 365 -nodes \
  -out /opt/dsls/config/server.crt \
  -keyout /opt/dsls/config/server.key \
  -subj "/CN=dsls-server.company.com"

sudo chown dsls:dsls /opt/dsls/config/server.*
sudo chmod 600 /opt/dsls/config/server.key
```

### Access Controls

```bash
# Configure user access controls
echo "ALLOW_HOSTS=10.0.0.0/8,192.168.0.0/16" >> /opt/dsls/config/security.conf
echo "DENY_HOSTS=default" >> /opt/dsls/config/security.conf
echo "REQUIRE_AUTH=true" >> /opt/dsls/config/security.conf
```

## Verification and Testing

### Server Status Check

```bash
# Check DSLS server status
sudo systemctl status dsls
sudo /opt/dsls/bin/DSLicSrv -status

# Verify token pools
sudo /opt/dsls/bin/DSLicSrv -tokens
sudo /opt/dsls/bin/DSLicSrv -users
```

### License Checkout Test

```bash
# Test license checkout
sudo /opt/dsls/bin/DSLicSrv -checkout abaqus_standard 5
sudo /opt/dsls/bin/DSLicSrv -checkin abaqus_standard 5
```

### Vantage Integration Test

```bash
# Test Vantage agent connectivity
vantage-agent test-connection dsls
vantage-agent status --detailed

# Verify data collection
vantage-agent logs --tail=50
```

## Monitoring and Maintenance

### Log Management

```bash
# Configure log rotation
sudo tee /etc/logrotate.d/dsls << EOF
/opt/dsls/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 dsls dsls
    postrotate
        /bin/kill -HUP `cat /opt/dsls/logs/dsls.pid 2>/dev/null` 2>/dev/null || true
    endscript
}
EOF
```

### Health Monitoring Script

```bash
#!/bin/bash
# /opt/dsls/bin/health_check.sh

DSLS_STATUS=$(/opt/dsls/bin/DSLicSrv -status | grep "Server Status" | awk '{print $3}')
TOKEN_USAGE=$(/opt/dsls/bin/DSLicSrv -tokens | grep "Available" | awk '{print $2}')

if [ "$DSLS_STATUS" != "Running" ]; then
    echo "ERROR: DSLS server is not running"
    exit 1
fi

if [ "$TOKEN_USAGE" -lt 50 ]; then
    echo "WARNING: Low token availability: $TOKEN_USAGE"
fi

echo "DSLS server healthy - Status: $DSLS_STATUS, Available tokens: $TOKEN_USAGE"
exit 0
```

## Troubleshooting

### Common Installation Issues

**Issue**: License file validation fails
```bash
# Check license file format
file /opt/dsls/licenses/your_dsls_license.txt
head -n 10 /opt/dsls/licenses/your_dsls_license.txt

# Verify file permissions
ls -la /opt/dsls/licenses/
```

**Issue**: Service startup failures
```bash
# Check service logs
sudo journalctl -u dsls -f
sudo tail -f /opt/dsls/logs/dsls.log

# Verify configuration
sudo /opt/dsls/bin/DSLicSrv -test-config /opt/dsls/config/DSLicSrv.opt
```

## Next Steps

With DSLS server successfully installed and configured, proceed to:

- **[Monitoring & Analytics](dsls-monitoring)**: Set up comprehensive monitoring
- **[High Availability](dsls-high-availability)**: Configure redundancy and failover
- **[Troubleshooting](dsls-troubleshooting)**: Resolve common issues

---

> **Setup Best Practice**: DSLS token-based licensing requires careful planning of token allocation across DS products. The combination of proper server configuration with Vantage integration provides powerful optimization capabilities for engineering teams. Regular monitoring and adjustment of token pools ensures optimal license utilization across your organization.
