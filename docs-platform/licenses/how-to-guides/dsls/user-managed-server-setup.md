---
id: dsls-ls-dyna-user-managed-server-setup
title: User-Managed DSLS Server Setup
sidebar_position: 2
description: Set up and configure your own DSLS license server for integration with Vantage License Manager.
---

This guide walks you through setting up your own DSLS (Dassault Systèmes License Server) that will integrate with Vantage License Manager. DSLS manages licenses for the complete Dassault Systèmes portfolio including SOLIDWORKS, CATIA, SIMULIA, and other 3DEXPERIENCE applications.

## Prerequisites

Before setting up your DSLS server, ensure you have:

- **License Agreement**: Valid Dassault Systèmes license agreement
- **License Files**: DSLS license files (.lic format)
- **Server Hardware**: Dedicated server meeting Dassault Systèmes requirements
- **Network Access**: Connectivity between your DSLS server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **3DEXPERIENCE Account**: Valid Dassault Systèmes customer account

## Supported Operating Systems

DSLS servers are supported on:

- **Windows**: Windows Server 2016/2019/2022 (recommended)
- **Linux**: RHEL 7/8/9, CentOS 7/8, SUSE Linux Enterprise
- **AIX**: IBM AIX 7.1+ (for enterprise environments)

## Installation Steps

### 1. Download DSLS Software

```bash
# Download from Dassault Systèmes Customer Portal
# Access: https://3ds.com/support/download-center/
# Download DSLS installer package

# For Windows
# Run: DSLS_Setup.exe

# For Linux
tar -xzf DSLS_Linux_x64.tar.gz
cd DSLS_Linux
```

### 2. Install DSLS Server

#### Windows Installation

```powershell
# Run DSLS installer as administrator
.\DSLS_Setup.exe /S /INSTALLDIR="C:\DSLS" /SERVICENAME="DSLS"

# Verify installation
cd "C:\DSLS\bin"
.\dsls_server.exe -version
```

#### Linux Installation

```bash
# Create DSLS directory structure
sudo mkdir -p /opt/dsls/server
sudo mkdir -p /opt/dsls/licenses
sudo mkdir -p /opt/dsls/logs

# Extract and install DSLS
sudo tar -xzf DSLS_Linux_x64.tar.gz -C /opt/dsls/server/

# Set executable permissions
sudo chmod +x /opt/dsls/server/bin/*

# Create dsls user
sudo useradd -r -s /bin/false dsls
sudo chown -R dsls:dsls /opt/dsls/
```

### 3. Configure License Files

```bash
# Copy DSLS license files
sudo cp *.lic /opt/dsls/licenses/

# Set appropriate permissions
sudo chown dsls:dsls /opt/dsls/licenses/*
sudo chmod 644 /opt/dsls/licenses/*

# Verify license files
/opt/dsls/server/bin/dsls_server -licstat
```

### 4. Create DSLS Configuration

#### Linux Configuration

```bash
# Create DSLS server configuration
sudo cat > /opt/dsls/server/dsls.conf << EOF
# DSLS Server Configuration
LICENSE_FILE=/opt/dsls/licenses/dsls.lic
LOG_FILE=/opt/dsls/logs/dsls.log
LOG_LEVEL=INFO
SERVER_PORT=27000
VENDOR_DAEMON_PORT=27001
DEBUG_LOG_FILE=/opt/dsls/logs/debug.log
TIMEOUT=300
LINGER=300
REPORTLOG=/opt/dsls/logs/report.log
EOF
```

#### Windows Configuration

```powershell
# Create DSLS service configuration
New-Item -Path "C:\DSLS\conf" -ItemType Directory -Force

@"
# DSLS Server Configuration
LICENSE_FILE=C:\DSLS\licenses\dsls.lic
LOG_FILE=C:\DSLS\logs\dsls.log
LOG_LEVEL=INFO
SERVER_PORT=27000
VENDOR_DAEMON_PORT=27001
DEBUG_LOG_FILE=C:\DSLS\logs\debug.log
TIMEOUT=300
LINGER=300
REPORTLOG=C:\DSLS\logs\report.log
"@ | Out-File -FilePath "C:\DSLS\conf\dsls.conf" -Encoding ASCII
```

### 5. Start DSLS Server

#### Linux Service Configuration

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/dsls.service << EOF
[Unit]
Description=Dassault Systemes License Server
After=network.target

[Service]
Type=forking
User=dsls
Group=dsls
ExecStart=/opt/dsls/server/bin/dsls_server -c /opt/dsls/server/dsls.conf
WorkingDirectory=/opt/dsls/server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start dsls
sudo systemctl enable dsls
```

#### Windows Service Configuration

```powershell
# Install DSLS as Windows service
cd "C:\DSLS\bin"
.\dsls_server.exe -install -service -config "C:\DSLS\conf\dsls.conf"

# Start DSLS service
Start-Service DSLS

# Set service to start automatically
Set-Service -Name DSLS -StartupType Automatic
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 27000**: DSLS license server port
- **Port 27001**: DSLS vendor daemon port
- **Port 27002-27009**: Additional vendor daemon ports (if needed)
- **HTTPS (443)**: For Vantage integration
- **Port 1947**: For DSLS web interface (optional)

### Firewall Configuration

#### Linux Firewall

```bash
# Configure iptables
sudo iptables -A INPUT -p tcp --dport 27000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 27001 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 1947 -j ACCEPT

# For firewalld
sudo firewall-cmd --permanent --add-port=27000/tcp
sudo firewall-cmd --permanent --add-port=27001/tcp
sudo firewall-cmd --permanent --add-port=1947/tcp
sudo firewall-cmd --reload
```

#### Windows Firewall

```powershell
# Configure Windows Firewall
New-NetFirewallRule -DisplayName "DSLS Server" -Direction Inbound -Protocol TCP -LocalPort 27000 -Action Allow
New-NetFirewallRule -DisplayName "DSLS Vendor" -Direction Inbound -Protocol TCP -LocalPort 27001 -Action Allow
New-NetFirewallRule -DisplayName "DSLS Web" -Direction Inbound -Protocol TCP -LocalPort 1947 -Action Allow
```

## DSLS Specific Configuration

### Vendor Daemon Configuration

```bash
# Configure vendor-specific settings
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# Vendor Daemon Configuration
VENDOR_DAEMON=dsls /opt/dsls/server/bin/dsls_vendor
VENDOR_TIMEOUT=300
VENDOR_LINGER=300

# Application-specific settings
SOLIDWORKS_TIMEOUT=1800
CATIA_TIMEOUT=3600
SIMULIA_TIMEOUT=7200
EOF
```

### Feature Grouping

```bash
# Create feature groups for different applications
sudo cat > /opt/dsls/server/feature_groups.conf << EOF
# DSLS Feature Groups
[SOLIDWORKS]
features=swpremium,swprofessional,swstandard,swsimulation

[CATIA]
features=catv5,catv6,catdesign,catanalysis

[SIMULIA]
features=abaqus,tosca,isight,fesafe

[3DEXPERIENCE]
features=3dx_catia,3dx_solidworks,3dx_simulia
EOF
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **DSLS** as the server type
5. Choose **User-Managed** deployment
6. Enter server details:
   - **Server Hostname/IP**
   - **Port Number** (typically 27000)
   - **Vendor Daemon Port** (typically 27001)
   - **Application Types** (SOLIDWORKS, CATIA, SIMULIA, etc.)

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure for DSLS
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type dsls --server-port 27000
```

### 3. Verify Integration

```bash
# Test DSLS server
/opt/dsls/server/bin/dsls_server -licstat

# Test Vantage connection
vantage-license-monitor test-connection
```

## Advanced Configuration

### High Availability Setup

```bash
# Configure redundant DSLS server
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# High Availability Configuration
REDUNDANT_SERVER=dsls-backup.domain.com
HEARTBEAT_INTERVAL=30
FAILOVER_TIMEOUT=120
SYNC_ENABLED=YES
EOF
```

### Load Balancing

```bash
# Configure load balancing for multiple DSLS servers
sudo cat > /opt/dsls/server/loadbalance.conf << EOF
# Load Balancing Configuration
PRIMARY_SERVER=dsls1.domain.com:27000
SECONDARY_SERVER=dsls2.domain.com:27000
TERTIARY_SERVER=dsls3.domain.com:27000
LOAD_ALGORITHM=round_robin
HEALTH_CHECK_INTERVAL=60
EOF
```

## Performance Tuning

### Memory Optimization

```bash
# Configure memory settings for DSLS
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# Memory Optimization
MAX_MEMORY=8GB
MEMORY_WARNING_THRESHOLD=6GB
GARBAGE_COLLECTION_INTERVAL=300
CACHE_SIZE=512MB
EOF
```

### Connection Optimization

```bash
# Optimize for high concurrent connections
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# Connection Optimization
MAX_CONNECTIONS=1000
CONNECTION_TIMEOUT=300
KEEP_ALIVE=YES
TCP_NODELAY=YES
EOF
```

## Application-Specific Configuration

### SOLIDWORKS Configuration

```bash
# Configure SOLIDWORKS-specific settings
sudo cat > /opt/dsls/server/solidworks.conf << EOF
# SOLIDWORKS Configuration
SW_LICENSE_USE_TIMEOUT=1800
SW_BORROW_TIMEOUT=86400
SW_DENY_BORROW=NO
SW_INCLUDE_BORROW=YES
SW_MAX_OVERDRAFT=10
EOF
```

### CATIA Configuration

```bash
# Configure CATIA-specific settings
sudo cat > /opt/dsls/server/catia.conf << EOF
# CATIA Configuration
CATIA_LICENSE_TIMEOUT=3600
CATIA_FEATURE_VERSION=latest
CATIA_CONCURRENT_LIMIT=unlimited
CATIA_RESERVATION_ENABLED=YES
EOF
```

### SIMULIA Configuration

```bash
# Configure SIMULIA-specific settings
sudo cat > /opt/dsls/server/simulia.conf << EOF
# SIMULIA Configuration
ABAQUS_LICENSE_TIMEOUT=7200
ABAQUS_TOKENS_PER_CORE=5
TOSCA_LICENSE_TIMEOUT=14400
FESAFE_LICENSE_TIMEOUT=3600
EOF
```

## Monitoring and Logging

### Enhanced Logging

```bash
# Configure comprehensive logging
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# Logging Configuration
DEBUG_LOGGING=YES
VENDOR_DEBUG=YES
REPORTLOG_ENABLED=YES
REPORTLOG_ROTATION=daily
REPORTLOG_RETENTION=30
AUDIT_LOGGING=YES
USAGE_LOGGING=YES
EOF
```

### Real-time Monitoring

```bash
# Monitor DSLS server status
watch -n 5 "/opt/dsls/server/bin/dsls_server -licstat"

# Monitor system resources
htop
iostat -x 1

# Monitor DSLS processes
ps aux | grep dsls
```

## License Management

### Adding New Licenses

```bash
# Add new DSLS license file
sudo cp new_dsls_license.lic /opt/dsls/licenses/

# Update license file path if needed
sudo sed -i 's/LICENSE_FILE=.*/LICENSE_FILE=\/opt\/dsls\/licenses\/new_dsls_license.lic/' /opt/dsls/server/dsls.conf

# Restart DSLS server
sudo systemctl restart dsls

# Verify new licenses
/opt/dsls/server/bin/dsls_server -licstat
```

### License Validation

```bash
# Validate license files
/opt/dsls/server/bin/dsls_server -validate

# Check license expiration
/opt/dsls/server/bin/dsls_server -expiry

# Test specific feature checkout
/opt/dsls/server/bin/dsls_server -checkout swpremium
```

## User Management

### User Access Control

```bash
# Create user access configuration
sudo cat > /opt/dsls/server/users.conf << EOF
# User Access Configuration
INCLUDE USER engineering
INCLUDE USER design_team
EXCLUDE USER temp_users
MAX_USERS_PER_LICENSE=unlimited
RESERVATION_ENABLED=YES
EOF
```

### Group Configuration

```bash
# Configure group-based licensing
sudo cat > /opt/dsls/server/groups.conf << EOF
# Group Configuration
[engineering_group]
users=user1,user2,user3
max_solidworks=10
max_catia=5
priority=high

[design_group]
users=user4,user5,user6
max_solidworks=5
max_catia=3
priority=medium
EOF
```

## Security Configuration

### Access Control

```bash
# Configure IP-based access control
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# Access Control
INCLUDE_IP=192.168.1.0/24
INCLUDE_IP=10.0.0.0/8
EXCLUDE_IP=0.0.0.0/0
AUTHENTICATION_REQUIRED=YES
EOF
```

### SSL Configuration

```bash
# Generate SSL certificates
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/dsls/server/server.key -out /opt/dsls/server/server.crt -days 365 -nodes

# Configure SSL
sudo cat >> /opt/dsls/server/dsls.conf << EOF
# SSL Configuration
SSL_ENABLED=YES
SSL_CERT=/opt/dsls/server/server.crt
SSL_KEY=/opt/dsls/server/server.key
SSL_PORT=27443
EOF
```

## Troubleshooting

### Common Issues

#### Server Startup Problems

```bash
# Check configuration syntax
/opt/dsls/server/bin/dsls_server -config /opt/dsls/server/dsls.conf -test

# Verify license files
ls -la /opt/dsls/licenses/
/opt/dsls/server/bin/dsls_server -validate

# Check system logs
sudo journalctl -u dsls -f
```

#### License Checkout Failures

```bash
# Check license availability
/opt/dsls/server/bin/dsls_server -licstat

# Verify network connectivity
telnet dsls-server 27000

# Review server logs
sudo tail -f /opt/dsls/logs/dsls.log
```

#### Application Connection Issues

```bash
# Test from client machine
telnet dsls-server 27000

# Check vendor daemon status
/opt/dsls/server/bin/dsls_server -status

# Verify feature availability
/opt/dsls/server/bin/dsls_server -licstat -feature swpremium
```

## Backup and Recovery

### DSLS Server Backup

```bash
# Create backup script
sudo cat > /opt/dsls/backup-dsls.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/dsls"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration and licenses
tar -czf $BACKUP_DIR/dsls-config-$DATE.tar.gz /opt/dsls/server/
tar -czf $BACKUP_DIR/dsls-licenses-$DATE.tar.gz /opt/dsls/licenses/
tar -czf $BACKUP_DIR/dsls-logs-$DATE.tar.gz /opt/dsls/logs/

# Backup DSLS database (if applicable)
/opt/dsls/server/bin/dsls_server -backup $BACKUP_DIR/dsls-db-$DATE.bak

# Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.bak" -mtime +30 -delete
EOF

sudo chmod +x /opt/dsls/backup-dsls.sh

# Schedule backup
echo "0 2 * * * root /opt/dsls/backup-dsls.sh" | sudo tee -a /etc/crontab
```

## Integration with Applications

### SOLIDWORKS Integration

```bash
# Configure SOLIDWORKS client
export SW_LICENSE_SERVER=@dsls-server:27000

# Registry setting for Windows
reg add "HKLM\SOFTWARE\SolidWorks\Licenses\SW License Server" /v "SolidNetWork License" /t REG_SZ /d "@dsls-server:27000"
```

### CATIA Integration

```bash
# Set CATIA environment variables
export CATIALic_WS=dsls-server:27000
export CATSysLicenseMode=TCP

# For CATIA V6
export DS_LICENSE_SERVER=27000@dsls-server
```

### SIMULIA Integration

```bash
# Configure ABAQUS license server
export ABAQUSLM_LICENSE_FILE=@dsls-server:27000

# For Tosca
export TOSCA_LICENSE_FILE=@dsls-server:27000
```

## Performance Monitoring

### Server Metrics

```bash
# Create monitoring script
cat > /opt/dsls/monitor-dsls.sh << 'EOF'
#!/bin/bash
echo "=== DSLS License Server Status ==="
/opt/dsls/server/bin/dsls_server -licstat

echo "=== System Resources ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2 $3 $4}'

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h /opt/dsls

echo "Network Connections:"
netstat -tuln | grep -E '27000|27001'
EOF

chmod +x /opt/dsls/monitor-dsls.sh

# Run monitoring every 5 minutes
echo "*/5 * * * * root /opt/dsls/monitor-dsls.sh >> /var/log/dsls-monitor.log" | sudo tee -a /etc/crontab
```

## Docker Deployment

### Container Setup

```bash
# Create Dockerfile for DSLS server
cat > Dockerfile << EOF
FROM centos:8

# Install dependencies
RUN yum update -y && yum install -y \
    glibc \
    libstdc++ \
    net-tools \
    redhat-lsb-core \
    && yum clean all

# Create dsls user
RUN useradd -r -s /bin/false dsls

# Copy DSLS server
COPY DSLS_Linux/ /opt/dsls/server/
COPY dsls.conf /opt/dsls/server/
COPY licenses/ /opt/dsls/licenses/

# Set permissions
RUN chown -R dsls:dsls /opt/dsls/ && \
    chmod +x /opt/dsls/server/bin/*

# Expose ports
EXPOSE 27000 27001 1947

# Start DSLS server
USER dsls
WORKDIR /opt/dsls/server
CMD ["./bin/dsls_server", "-c", "/opt/dsls/server/dsls.conf"]
EOF

# Build and run container
docker build -t dsls-server .
docker run -d -p 27000:27000 -p 27001:27001 --name dsls-server dsls-server
```

## Next Steps

After setting up your user-managed DSLS server:

1. **Application Integration**: Configure all Dassault Systèmes applications
2. **User Training**: Train users on license policies and best practices
3. **Performance Monitoring**: Implement comprehensive monitoring
4. **High Availability**: Configure redundant servers for critical applications
5. **License Optimization**: Monitor usage patterns and optimize allocation

For advanced DSLS configurations and 3DEXPERIENCE integration, contact Dassault Systèmes or see additional documentation in the Vantage dashboard.
