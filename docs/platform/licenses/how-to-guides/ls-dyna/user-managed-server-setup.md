---
id: user-managed-server-setup
title: User-Managed LS-DYNA Server Setup
sidebar_position: 2
description: Set up and configure your own LS-DYNA license server for integration with Vantage License Manager.
---

This guide walks you through setting up your own LS-DYNA license server that will integrate with Vantage License Manager. LS-DYNA uses a proprietary license management system specifically designed for finite element analysis workloads.

## Prerequisites

Before setting up your LS-DYNA license server, ensure you have:

- **License Agreement**: Valid LS-DYNA license agreement with LSTC
- **License Files**: LS-DYNA license files (.key or .lic format)
- **Server Hardware**: Dedicated server meeting LSTC requirements
- **Network Access**: Connectivity between your license server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **LSTC Account**: Valid account with Livermore Software Technology Corporation

## Supported Operating Systems

LS-DYNA license servers are supported on:

- **Linux**: RHEL 7/8/9, CentOS 7/8, SUSE Linux Enterprise
- **Windows**: Windows Server 2016/2019/2022
- **AIX**: IBM AIX 7.1+ (for high-performance computing environments)
- **Solaris**: Oracle Solaris 11 (legacy support)

## Installation Steps

### 1. Download LS-DYNA License Server

```bash
# Contact LSTC for license server software
# Download from LSTC FTP or customer portal
# Files typically named: lstc_qrun_server_<version>_<platform>

# Extract license server package
tar -xzf lstc_qrun_server_linux.tar.gz
cd lstc_qrun_server
```

### 2. Install License Server

```bash
# Create LS-DYNA directory structure
sudo mkdir -p /opt/lstc/server
sudo mkdir -p /opt/lstc/licenses
sudo mkdir -p /opt/lstc/logs

# Copy license server binaries
sudo cp lstc_qrun_server /opt/lstc/server/
sudo cp lstc_qrun_server_util /opt/lstc/server/

# Set executable permissions
sudo chmod +x /opt/lstc/server/*

# Create lstc user
sudo useradd -r -s /bin/false lstc
sudo chown -R lstc:lstc /opt/lstc/
```

### 3. Configure License Files

```bash
# Copy LS-DYNA license files
sudo cp *.key /opt/lstc/licenses/
sudo cp *.lic /opt/lstc/licenses/

# Set appropriate permissions
sudo chown lstc:lstc /opt/lstc/licenses/*
sudo chmod 644 /opt/lstc/licenses/*

# Verify license files
/opt/lstc/server/lstc_qrun_server_util -licstat
```

### 4. Create Server Configuration

```bash
# Create LS-DYNA server configuration
sudo cat > /opt/lstc/server/lstc.conf << EOF
# LS-DYNA License Server Configuration
LICENSE_PATH=/opt/lstc/licenses
LOG_FILE=/opt/lstc/logs/lstc_server.log
LOG_LEVEL=INFO
SERVER_PORT=31010
QUEUING_ENABLED=YES
MAX_QUEUE_SIZE=100
QUEUE_TIMEOUT=3600
MEMORY_LIMIT=unlimited
EOF
```

### 5. Start LS-DYNA Server

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/lstc-server.service << EOF
[Unit]
Description=LS-DYNA License Server
After=network.target

[Service]
Type=forking
User=lstc
Group=lstc
ExecStart=/opt/lstc/server/lstc_qrun_server -config /opt/lstc/server/lstc.conf
WorkingDirectory=/opt/lstc/server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start lstc-server
sudo systemctl enable lstc-server
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 31010**: Default LS-DYNA license server port
- **Port 31011**: LS-DYNA status port
- **HTTPS (443)**: For Vantage integration
- **SSH (22)**: For remote administration

### Firewall Configuration

```bash
# Configure iptables
sudo iptables -A INPUT -p tcp --dport 31010 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 31011 -j ACCEPT

# Save iptables rules
sudo iptables-save > /etc/iptables/rules.v4
```

## LS-DYNA Specific Configuration

### Queuing System Setup

```bash
# Configure advanced queuing
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Advanced Queuing Configuration
QUEUE_PRIORITY_ENABLED=YES
USER_PRIORITY_FILE=/opt/lstc/server/user_priorities.conf
MEMORY_BASED_QUEUING=YES
SMP_LIMIT=128
MPP_LIMIT=1024
EOF

# Create user priority file
sudo cat > /opt/lstc/server/user_priorities.conf << EOF
# User Priority Configuration
# Format: username:priority (1-10, 10 being highest)
admin:10
engineering:8
students:5
default:3
EOF
```

### Memory Management

```bash
# Configure memory-based licensing
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Memory-based Licensing
MEMORY_LICENSING=YES
MEMORY_UNIT=GB
MEMORY_INCREMENT=1
MAX_MEMORY_PER_USER=64
MEMORY_CHECKOUT_TIMEOUT=300
EOF
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **LS-DYNA** as the server type
5. Choose **User-Managed** deployment
6. Enter server details:
   - **Server Hostname/IP**
   - **Port Number** (typically 31010)
   - **License Type** (SMP, MPP, or both)
   - **Memory Licensing** (if enabled)

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure for LS-DYNA
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type ls-dyna --server-port 31010
```

### 3. Verify Integration

```bash
# Test LS-DYNA server
/opt/lstc/server/lstc_qrun_server_util -licstat

# Test Vantage connection
vantage-license-monitor test-connection
```

## Advanced Configuration

### High Availability Setup

```bash
# Configure redundant server
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# High Availability Configuration
BACKUP_SERVER=lstc-backup.domain.com:31010
HEARTBEAT_INTERVAL=30
FAILOVER_TIMEOUT=120
SYNC_LICENSES=YES
EOF
```

### Load Balancing

```bash
# Configure load balancing for multiple servers
sudo cat > /opt/lstc/server/loadbalance.conf << EOF
# Load Balancing Configuration
SERVERS=lstc1.domain.com:31010,lstc2.domain.com:31010
ALGORITHM=round_robin
HEALTH_CHECK_INTERVAL=60
STICKY_SESSIONS=YES
EOF
```

## Performance Tuning

### SMP/MPP Optimization

```bash
# Optimize for SMP workloads
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# SMP Optimization
SMP_CORES_PER_LICENSE=1
SMP_MAX_CORES=64
SMP_QUEUE_PRIORITY=HIGH
EOF

# Optimize for MPP workloads
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# MPP Optimization
MPP_CORES_PER_LICENSE=1
MPP_MAX_CORES=1024
MPP_INTERCONNECT_AWARE=YES
EOF
```

### Memory Optimization

```bash
# Configure memory-efficient settings
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Memory Optimization
MEMORY_CLEANUP_INTERVAL=300
MEMORY_WARNING_THRESHOLD=80
MEMORY_CRITICAL_THRESHOLD=95
AUTO_MEMORY_RECLAIM=YES
EOF
```

## Monitoring and Logging

### Enhanced Logging

```bash
# Configure comprehensive logging
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Logging Configuration
DEBUG_LOGGING=YES
AUDIT_LOGGING=YES
PERFORMANCE_LOGGING=YES
USER_ACTIVITY_LOGGING=YES
LOG_ROTATION=daily
LOG_RETENTION_DAYS=30
EOF
```

### Real-time Monitoring

```bash
# Monitor LS-DYNA server status
watch -n 5 "/opt/lstc/server/lstc_qrun_server_util -licstat"

# Monitor system resources
htop
iostat -x 1
```

## License Management

### Adding New Licenses

```bash
# Add new LS-DYNA license file
sudo cp new_license.key /opt/lstc/licenses/

# Reload license configuration
/opt/lstc/server/lstc_qrun_server_util -reload

# Verify new licenses
/opt/lstc/server/lstc_qrun_server_util -licstat
```

### License Validation

```bash
# Validate license files
/opt/lstc/server/lstc_qrun_server_util -validate

# Check license expiration
/opt/lstc/server/lstc_qrun_server_util -expiry

# Test license checkout
/opt/lstc/server/lstc_qrun_server_util -checkout SMP 4
```

## User Management

### User Configuration

```bash
# Create user access configuration
sudo cat > /opt/lstc/server/users.conf << EOF
# User Access Configuration
[admin]
max_smp_cores=64
max_mpp_cores=512
priority=10
memory_limit=unlimited

[engineering]
max_smp_cores=32
max_mpp_cores=256
priority=8
memory_limit=64GB

[students]
max_smp_cores=8
max_mpp_cores=64
priority=5
memory_limit=16GB
EOF
```

### Group Policies

```bash
# Configure group-based policies
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Group Policies
GROUP_BASED_LICENSING=YES
GROUP_CONFIG_FILE=/opt/lstc/server/groups.conf
DEFAULT_GROUP=users
EOF

# Create group configuration
sudo cat > /opt/lstc/server/groups.conf << EOF
# Group Configuration
research:max_cores=1024,priority=9
development:max_cores=512,priority=7
training:max_cores=128,priority=5
EOF
```

## Security Configuration

### Access Control

```bash
# Configure IP-based access control
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# Access Control
ALLOWED_NETWORKS=192.168.1.0/24,10.0.0.0/8
DENIED_NETWORKS=0.0.0.0/0
AUTHENTICATION_REQUIRED=YES
EOF
```

### SSL Configuration

```bash
# Generate SSL certificates
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/lstc/server/server.key -out /opt/lstc/server/server.crt -days 365 -nodes

# Configure SSL
sudo cat >> /opt/lstc/server/lstc.conf << EOF
# SSL Configuration
SSL_ENABLED=YES
SSL_CERT=/opt/lstc/server/server.crt
SSL_KEY=/opt/lstc/server/server.key
SSL_PORT=31443
EOF
```

## Troubleshooting

### Common Issues

#### Server Startup Problems

```bash
# Check configuration syntax
/opt/lstc/server/lstc_qrun_server -config /opt/lstc/server/lstc.conf -test

# Verify license files
ls -la /opt/lstc/licenses/
/opt/lstc/server/lstc_qrun_server_util -validate

# Check system logs
sudo journalctl -u lstc-server -f
```

#### License Checkout Failures

```bash
# Check license availability
/opt/lstc/server/lstc_qrun_server_util -licstat

# Verify network connectivity
telnet lstc-server 31010

# Review server logs
sudo tail -f /opt/lstc/logs/lstc_server.log
```

#### Performance Issues

```bash
# Monitor server performance
top -p $(pgrep lstc_qrun_server)

# Check memory usage
free -h
cat /proc/meminfo

# Monitor network connections
netstat -tuln | grep 31010
```

## Backup and Recovery

### License Server Backup

```bash
# Create backup script
sudo cat > /opt/lstc/backup-lstc.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/lstc"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration and licenses
tar -czf $BACKUP_DIR/lstc-config-$DATE.tar.gz /opt/lstc/server/
tar -czf $BACKUP_DIR/lstc-licenses-$DATE.tar.gz /opt/lstc/licenses/
tar -czf $BACKUP_DIR/lstc-logs-$DATE.tar.gz /opt/lstc/logs/

# Database backup (if applicable)
/opt/lstc/server/lstc_qrun_server_util -backup $BACKUP_DIR/lstc-db-$DATE.sql

# Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
EOF

sudo chmod +x /opt/lstc/backup-lstc.sh

# Schedule backup
echo "0 2 * * * root /opt/lstc/backup-lstc.sh" | sudo tee -a /etc/crontab
```

## Integration with LS-DYNA Applications

### Environment Configuration

```bash
# Set LS-DYNA environment variables
export LSTC_LICENSE_SERVER=lstc-server:31010
export LSTC_MEMORY_LICENSING=yes
export LSTC_MAX_MEMORY=32GB

# For multiple servers
export LSTC_LICENSE_SERVER=lstc1:31010,lstc2:31010
```

### Application Testing

```bash
# Test LS-DYNA application with license server
ls-dyna i=test.k memory=4gb ncpu=8

# Verify license usage
/opt/lstc/server/lstc_qrun_server_util -licstat
```

## Performance Monitoring

### Server Metrics

```bash
# Create monitoring script
cat > /opt/lstc/monitor-lstc.sh << 'EOF'
#!/bin/bash
echo "=== LS-DYNA License Server Status ==="
/opt/lstc/server/lstc_qrun_server_util -licstat

echo "=== System Resources ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2 $3 $4}'

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h /opt/lstc

echo "Network Connections:"
netstat -tuln | grep 31010
EOF

chmod +x /opt/lstc/monitor-lstc.sh

# Run monitoring every 5 minutes
echo "*/5 * * * * root /opt/lstc/monitor-lstc.sh >> /var/log/lstc-monitor.log" | sudo tee -a /etc/crontab
```

## Docker Deployment

### Container Setup

```bash
# Create Dockerfile for LS-DYNA server
cat > Dockerfile << EOF
FROM centos:8

# Install dependencies
RUN yum update -y && yum install -y \
    glibc \
    libstdc++ \
    net-tools \
    && yum clean all

# Create lstc user
RUN useradd -r -s /bin/false lstc

# Copy LS-DYNA server
COPY lstc_qrun_server /opt/lstc/server/
COPY lstc_qrun_server_util /opt/lstc/server/
COPY lstc.conf /opt/lstc/server/

# Copy licenses
COPY licenses/ /opt/lstc/licenses/

# Set permissions
RUN chown -R lstc:lstc /opt/lstc/ && \
    chmod +x /opt/lstc/server/lstc_qrun_server*

# Expose ports
EXPOSE 31010 31011

# Start LS-DYNA server
USER lstc
WORKDIR /opt/lstc/server
CMD ["./lstc_qrun_server", "-config", "/opt/lstc/server/lstc.conf"]
EOF

# Build and run container
docker build -t lstc-server .
docker run -d -p 31010:31010 -p 31011:31011 --name lstc-server lstc-server
```

## Next Steps

After setting up your user-managed LS-DYNA server:

1. **Performance Optimization**: Monitor and optimize for your specific workloads
2. **User Training**: Train users on LS-DYNA-specific features and queuing
3. **High Availability**: Configure redundant servers for critical workloads
4. **Integration Testing**: Validate with all LS-DYNA applications in your environment
5. **Monitoring Setup**: Implement comprehensive monitoring and alerting

For advanced LS-DYNA configurations and optimization, contact LSTC or see additional documentation in the Vantage dashboard.
