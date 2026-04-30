---
id: user-managed-server-setup
title: User-Managed LMX Server Setup
sidebar_position: 2
description: Set up and configure your own LMX license server for integration with Vantage License Manager.
---

This guide walks you through setting up your own LMX (License Manager X) license server that will integrate with Vantage License Manager. LMX provides modern license management with cloud-ready features and enhanced security.

## Prerequisites

Before setting up your LMX server, ensure you have:

- **License Files**: Valid LMX license files from your software vendor
- **Server Hardware**: Dedicated server or virtual machine meeting vendor requirements
- **Network Access**: Connectivity between your LMX server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **SSL Certificates**: Optional SSL certificates for HTTPS communication

## Supported Operating Systems

LMX servers can be deployed on:

- **Linux**: RHEL 7/8/9, CentOS 7/8, Ubuntu 18.04/20.04/22.04, SUSE Linux
- **Windows**: Windows Server 2016/2019/2022, Windows 10/11
- **macOS**: macOS 10.15+ (for development environments)
- **Docker**: Container deployment with official LMX images

## Installation Steps

### 1. Download LMX Software

```bash
# Download LMX from X-Formation
# Visit: https://www.x-formation.com/download/
wget https://download.x-formation.com/lmx-latest-linux-x64.tar.gz
tar -xzf lmx-latest-linux-x64.tar.gz
cd lmx
```

### 2. Install LMX Server

```bash
# Copy LMX binaries to system directory
sudo mkdir -p /opt/lmx/bin
sudo cp lmx-serv /opt/lmx/bin/
sudo cp lmxendutil /opt/lmx/bin/

# Set executable permissions
sudo chmod +x /opt/lmx/bin/*

# Create LMX user
sudo useradd -r -s /bin/false lmx
```

### 3. Configure License Files

```bash
# Create license directory
sudo mkdir -p /opt/lmx/licenses
sudo mkdir -p /opt/lmx/config

# Copy license files
sudo cp *.lic /opt/lmx/licenses/

# Set appropriate permissions
sudo chown -R lmx:lmx /opt/lmx/
sudo chmod 644 /opt/lmx/licenses/*.lic
```

### 4. Create LMX Configuration

```bash
# Create LMX server configuration
sudo cat > /opt/lmx/config/lmx.conf << EOF
# LMX Server Configuration
LICENSEPATH /opt/lmx/licenses
LOGFILE /var/log/lmx/lmx.log
LOGFORMAT COMBINED
PORT 6200
HTTPS_PORT 6201
WEBSERVER ON
WEBPORT 8080
HTTPS_WEBPORT 8443
EOF
```

### 5. Start LMX Server

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/lmx.service << EOF
[Unit]
Description=LMX License Server
After=network.target

[Service]
Type=forking
User=lmx
Group=lmx
ExecStart=/opt/lmx/bin/lmx-serv -c /opt/lmx/config/lmx.conf
WorkingDirectory=/opt/lmx
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Create log directory
sudo mkdir -p /var/log/lmx
sudo chown lmx:lmx /var/log/lmx

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start lmx
sudo systemctl enable lmx
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 6200**: Default LMX server port
- **Port 6201**: HTTPS LMX server port
- **Port 8080**: LMX web interface
- **Port 8443**: HTTPS LMX web interface
- **HTTPS (443)**: For Vantage integration

### SSL Configuration

```bash
# Generate self-signed certificate (for testing)
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/lmx/config/server.key -out /opt/lmx/config/server.crt -days 365 -nodes

# Update LMX configuration for SSL
sudo cat >> /opt/lmx/config/lmx.conf << EOF
SSL_CERT /opt/lmx/config/server.crt
SSL_KEY /opt/lmx/config/server.key
EOF

# Restart LMX server
sudo systemctl restart lmx
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **LMX** as the server type
5. Choose **User-Managed** deployment
6. Enter server details:
   - **Server Hostname/IP**
   - **Port Number** (typically 6200)
   - **Web Interface Port** (typically 8080)
   - **SSL Configuration** (if enabled)

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type lmx --server-port 6200
```

### 3. Verify Integration

```bash
# Test LMX server
lmxendutil -licstat

# Test Vantage connection
vantage-license-monitor test-connection
```

## Web Interface Management

### Access LMX Web Interface

1. Open browser to `http://your-server:8080` or `https://your-server:8443`
2. Configure administrative access
3. Monitor license usage through web interface
4. Configure server settings and policies

### Web Interface Security

```bash
# Configure web interface authentication
# Edit /opt/lmx/config/lmx.conf
sudo cat >> /opt/lmx/config/lmx.conf << EOF
WEB_AUTH ON
WEB_USERNAME admin
WEB_PASSWORD your_secure_password
EOF

sudo systemctl restart lmx
```

## License Management

### Adding New Licenses

```bash
# Add new license file
sudo cp new_license.lic /opt/lmx/licenses/

# Reload licenses
lmxendutil -licreload

# Verify license is loaded
lmxendutil -licstat
```

### License File Validation

```bash
# Check license file
lmxendutil -licstat -f feature_name

# Verify license checkout
lmxendutil -checkout feature_name
lmxendutil -checkin feature_name
```

## Advanced Configuration

### High Availability Setup

```bash
# Configure for HA deployment
sudo cat >> /opt/lmx/config/lmx.conf << EOF
# High Availability Configuration
MASTERSERVER primary-lmx-server.domain.com
SLAVESERVER secondary-lmx-server.domain.com
HEARTBEAT 30
EOF
```

### Performance Tuning

```bash
# Optimize for high load
sudo cat >> /opt/lmx/config/lmx.conf << EOF
# Performance Settings
MAXUSERS 1000
TIMEOUT 300
BORROWTIMEOUT 86400
LINGER 300
EOF
```

## Monitoring and Logging

### Enhanced Logging

```bash
# Configure detailed logging
sudo cat >> /opt/lmx/config/lmx.conf << EOF
# Logging Configuration
LOGLEVEL DEBUG
LOGFILE /var/log/lmx/lmx.log
AUDITLOG /var/log/lmx/audit.log
ERRORLOG /var/log/lmx/error.log
EOF
```

### Log Rotation

```bash
# Create logrotate configuration
sudo cat > /etc/logrotate.d/lmx << EOF
/var/log/lmx/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    postrotate
        /bin/systemctl reload lmx
    endscript
}
EOF
```

## Security Configuration

### Access Control

```bash
# Configure IP-based access control
sudo cat >> /opt/lmx/config/lmx.conf << EOF
# Access Control
INCLUDE CLIENT 192.168.1.0/24
EXCLUDE CLIENT 0.0.0.0/0
EOF
```

### License Security

```bash
# Secure license files
sudo chmod 600 /opt/lmx/licenses/*.lic
sudo chown root:lmx /opt/lmx/licenses/*.lic

# Enable license encryption (if supported)
sudo cat >> /opt/lmx/config/lmx.conf << EOF
ENCRYPT_COMM ON
EOF
```

## Troubleshooting

### Server Diagnostics

```bash
# Check LMX server status
lmxendutil -licstat

# Test server connectivity
telnet lmx-server 6200

# Review server logs
sudo tail -f /var/log/lmx/lmx.log
```

### Common Issues

#### Server Won't Start

```bash
# Check configuration syntax
/opt/lmx/bin/lmx-serv -c /opt/lmx/config/lmx.conf -test

# Verify file permissions
ls -la /opt/lmx/config/
ls -la /opt/lmx/licenses/

# Check system logs
sudo journalctl -u lmx -f
```

#### License Checkout Failures

```bash
# Verify license availability
lmxendutil -licstat -f feature_name

# Check client connectivity
telnet lmx-server 6200

# Review license file
cat /opt/lmx/licenses/license.lic
```

## Backup and Recovery

### Automated Backup

```bash
# Create backup script
sudo cat > /opt/lmx/backup-lmx.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/lmx"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration and licenses
tar -czf $BACKUP_DIR/lmx-config-$DATE.tar.gz /opt/lmx/
tar -czf $BACKUP_DIR/lmx-logs-$DATE.tar.gz /var/log/lmx/

# Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

sudo chmod +x /opt/lmx/backup-lmx.sh

# Schedule backup
echo "0 2 * * * root /opt/lmx/backup-lmx.sh" | sudo tee -a /etc/crontab
```

## Docker Deployment

### Docker Container Setup

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y wget

# Install LMX
COPY lmx-latest-linux-x64.tar.gz /tmp/
RUN cd /tmp && tar -xzf lmx-latest-linux-x64.tar.gz
RUN mkdir -p /opt/lmx/bin && cp /tmp/lmx/lmx-serv /opt/lmx/bin/

# Copy configuration
COPY lmx.conf /opt/lmx/config/
COPY licenses/ /opt/lmx/licenses/

# Expose ports
EXPOSE 6200 6201 8080 8443

# Start LMX server
CMD ["/opt/lmx/bin/lmx-serv", "-c", "/opt/lmx/config/lmx.conf"]
EOF

# Build and run container
docker build -t lmx-server .
docker run -d -p 6200:6200 -p 8080:8080 --name lmx-server lmx-server
```

## Performance Monitoring

### Server Metrics

```bash
# Monitor LMX processes
ps aux | grep lmx-serv
top -p $(pgrep lmx-serv)

# Check memory and CPU usage
free -h
iostat -x 1

# Monitor network connections
netstat -tuln | grep -E '6200|8080'
```

### License Usage Analytics

```bash
# Generate usage reports
lmxendutil -licstat > /tmp/license-usage.txt

# Monitor real-time usage
watch -n 5 "lmxendutil -licstat"
```

## Integration Testing

### Client Configuration Testing

```bash
# Set environment variables
export LMX_LICENSE_FILE=@lmx-server:6200

# Test application integration
your_application --license-test

# Verify license checkout
lmxendutil -checkout feature_name
sleep 10
lmxendutil -checkin feature_name
```

## Next Steps

After setting up your user-managed LMX server:

1. **High Availability**: Configure redundant LMX servers for failover
2. **Monitoring Integration**: Enable comprehensive monitoring with Vantage
3. **Performance Optimization**: Monitor and optimize server performance
4. **Security Hardening**: Implement additional security measures
5. **User Training**: Train users on LMX-specific features and policies

For advanced LMX features and enterprise configurations, contact your LMX vendor or see additional documentation in the Vantage dashboard.
