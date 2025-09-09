---
id: flexlm-ls-dyna-user-managed-server-setup
title: User-Managed FlexLM Server Setup
sidebar_position: 2
description: Set up and configure your own FlexLM license server for integration with Vantage License Manager.
---

This guide walks you through setting up your own FlexLM license server that will integrate with Vantage License Manager. With a user-managed setup, you maintain full control over your license server infrastructure while benefiting from Vantage's monitoring and management capabilities.

## Prerequisites

Before setting up your FlexLM server, ensure you have:

- **License Files**: Valid license files from your software vendor
- **Server Hardware**: Dedicated server or virtual machine meeting vendor requirements
- **Network Access**: Connectivity between your FlexLM server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **Firewall Configuration**: Appropriate ports open for FlexLM communication

## Supported Operating Systems

FlexLM servers can be deployed on:

- **Linux**: RHEL 7/8/9, CentOS 7/8, Ubuntu 18.04/20.04/22.04
- **Windows**: Windows Server 2016/2019/2022
- **Unix**: Solaris, AIX (vendor-specific support)

## Installation Steps

### 1. Download FlexLM Software

```bash
# Example for Linux installation
wget https://vendor-download-url/flexlm-installer.tar.gz
tar -xzf flexlm-installer.tar.gz
cd flexlm-installer
```

### 2. Install License Manager

```bash
# Install FlexLM daemon
sudo ./install_flexlm.sh

# Verify installation
lmutil lmver
```

### 3. Configure License Files

```bash
# Copy license files to appropriate directory
sudo cp *.lic /opt/flexlm/licenses/

# Set appropriate permissions
sudo chown flexlm:flexlm /opt/flexlm/licenses/*.lic
sudo chmod 644 /opt/flexlm/licenses/*.lic
```

### 4. Start License Server

```bash
# Start the license manager
sudo systemctl start flexlm
sudo systemctl enable flexlm

# Verify server status
lmutil lmstat -a
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 27000-27009**: Default FlexLM port range
- **Vendor-specific ports**: As defined in license files
- **HTTPS (443)**: For Vantage integration

### Firewall Configuration (Linux)

```bash
# Open FlexLM ports
sudo firewall-cmd --permanent --add-port=27000-27009/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **FlexLM** as the server type
5. Choose **User-Managed** deployment
6. Enter your server details:
   - **Server Hostname/IP**
   - **Port Number**
   - **Vendor Daemon Information**

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type flexlm --server-port 27000
```

### 3. Verify Integration

```bash
# Test connection to Vantage
vantage-license-monitor test-connection

# Check license server status
lmutil lmstat -a
```

## Security Best Practices

### Server Hardening

- **Regular Updates**: Keep FlexLM software updated
- **Access Control**: Restrict access to license server
- **Encryption**: Use TLS for network communication
- **Monitoring**: Enable audit logging

### License File Security

```bash
# Secure license file permissions
sudo chmod 600 /opt/flexlm/licenses/*.lic
sudo chown root:flexlm /opt/flexlm/licenses/*.lic

# Backup license files
sudo cp /opt/flexlm/licenses/*.lic /backup/licenses/
```

## Maintenance and Monitoring

### Regular Tasks

- **License Expiration Monitoring**: Track license expiration dates
- **Usage Analytics**: Monitor license utilization patterns
- **Performance Monitoring**: Track server performance metrics
- **Backup Procedures**: Regular backup of configuration and license files

### Troubleshooting Commands

```bash
# Check license server status
lmutil lmstat -a

# Verify license file validity
lmutil lmcksum license.lic

# Restart license server
sudo systemctl restart flexlm

# View license server logs
sudo tail -f /opt/flexlm/logs/debug.log
```

## Common Issues and Solutions

### License Server Won't Start

**Problem**: FlexLM daemon fails to start

**Solutions**:
- Verify license file syntax and permissions
- Check for port conflicts
- Review system logs for error messages
- Ensure hostname matches license file

### Cannot Connect from Vantage

**Problem**: Vantage cannot communicate with license server

**Solutions**:
- Verify firewall configuration
- Check network connectivity
- Confirm server hostname/IP in Vantage configuration
- Test with `telnet hostname port`

### High License Denials

**Problem**: Users experiencing license checkout failures

**Solutions**:
- Monitor license utilization patterns
- Review license pool allocation
- Check for license server performance issues
- Consider license optimization strategies

## Support and Resources

### Vendor Documentation

- Consult your software vendor's FlexLM documentation
- Review vendor-specific configuration requirements
- Check for vendor updates and patches

### Vantage Support

- Access Vantage documentation portal
- Submit support tickets through Vantage dashboard
- Join Vantage community forums

## Next Steps

After setting up your user-managed FlexLM server:

1. **Configure High Availability**: Set up redundant license servers
2. **Implement Monitoring**: Enable comprehensive license monitoring
3. **Optimize Usage**: Analyze usage patterns and optimize license allocation
4. **Security Review**: Conduct regular security assessments

For advanced configuration options, contact your FlexLM vendor or see additional documentation in the Vantage dashboard.
