---
id: vantage-managed-server-setup
title: Vantage-Managed FlexLM Server Setup
sidebar_position: 3
description: Configure FlexLM license servers managed entirely by Vantage with zero maintenance overhead.
---

Configure FlexLM license servers managed entirely by Vantage with zero maintenance overhead. Vantage-managed servers provide high availability, automatic updates, and comprehensive monitoring without requiring any infrastructure management on your part.

## Overview

With Vantage-managed FlexLM servers, Vantage handles:

- **Infrastructure Management**: Server provisioning, maintenance, and scaling
- **Software Updates**: Automatic FlexLM updates and security patches
- **High Availability**: Built-in redundancy and failover capabilities
- **Monitoring**: 24/7 monitoring with alerting and reporting
- **Backup and Recovery**: Automated backup and disaster recovery
- **Security**: Enterprise-grade security and compliance

## Prerequisites

Before setting up a Vantage-managed FlexLM server, you need:

- **Valid License Files**: License files from your software vendor
- **Vantage Account**: Active Vantage Compute account with license management permissions
- **Network Configuration**: Proper network connectivity from your compute resources
- **Vendor Information**: Details about your software vendor and license requirements

## Setup Process

### 1. Access License Management

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **FlexLM** as the server type
5. Choose **Vantage-Managed** deployment option

### 2. Configure Server Details

Provide the following information:

- **Server Name**: Descriptive name for your license server
- **Region**: Geographic region for optimal performance
- **Software Vendor**: Select from supported vendors or specify custom
- **License Type**: Specify license model (floating, node-locked, etc.)

### 3. Upload License Files

```bash
# Prepare license files for upload
# Ensure files are in standard FlexLM format (.lic)
# Verify license files contain correct hostnames and vendor information
```

Upload your license files through the Vantage interface:

1. Click **Upload License Files**
2. Select your `.lic` files
3. Verify license information is correctly parsed
4. Review server configuration summary

### 4. Network Configuration

Configure network settings:

- **Access Control**: Define which networks can access the license server
- **Port Configuration**: Vantage automatically manages port allocation
- **DNS Settings**: Optional custom DNS configuration
- **SSL/TLS**: Enable secure communication (recommended)

### 5. Launch Deployment

1. Review all configuration settings
2. Estimate costs based on usage patterns
3. Click **Deploy FlexLM Server**
4. Monitor deployment progress in real-time

## CLI-Based Deployment

Alternatively, you can provision your Vantage-managed FlexLM server using the Vantage CLI for automation and infrastructure-as-code workflows.

### 1. Install Vantage CLI

```bash
# Install via pip
pip install vantage-cli

# Or download binary
curl -L https://releases.vantage.io/cli/latest/vantage-linux-amd64 -o vantage
chmod +x vantage
sudo mv vantage /usr/local/bin/
```

### 2. Authenticate with Vantage

```bash
# Login with your Vantage credentials
vantage auth login

# Or set API token
export VANTAGE_API_TOKEN="your_api_token"
vantage auth token-login
```

### 3. Create FlexLM Server Configuration

Create a configuration file for your FlexLM server:

```yaml
# flexlm-config.yaml
apiVersion: v1
kind: LicenseServer
metadata:
  name: "flexlm-production"
  description: "Production FlexLM server for engineering team"
  tags:
    environment: "production"
    team: "engineering"
    cost-center: "eng-001"

spec:
  type: "flexlm"
  deployment: "vantage-managed"
  
  infrastructure:
    region: "us-east-1"
    instance_type: "professional"
    multi_az: true
    
  configuration:
    server_port: 27000
    vendor_daemon_port: 27001
    ssl_enabled: true
    web_interface: true
    
  licensing:
    concurrent_limit: "unlimited"
    borrow_enabled: true
    timeout: 1800
    
  security:
    authentication: "ldap"
    access_control:
      allowed_networks:
        - "192.168.1.0/24"
        - "10.0.0.0/8"
      denied_networks:
        - "0.0.0.0/0"
        
  monitoring:
    enabled: true
    retention_days: 90
    alerts:
      license_exhaustion:
        enabled: true
        threshold: 90
        notifications: ["email", "slack"]
      server_health:
        enabled: true
        notifications: ["email", "pagerduty"]
        
  backup:
    enabled: true
    schedule: "0 2 * * *"
    retention_days: 30
```

### 4. Deploy FlexLM Server

```bash
# Create the FlexLM server
vantage license-servers create --config flexlm-config.yaml

# Monitor deployment status
vantage license-servers status flexlm-production

# Get detailed information
vantage license-servers describe flexlm-production
```

### 5. Upload License Files

```bash
# Upload license files
vantage license-servers upload-licenses flexlm-production 
  --files license1.lic,license2.lic 
  --validate

# Verify license upload
vantage license-servers list-licenses flexlm-production
```

### 6. Configure Advanced Settings

```bash
# Configure user groups
vantage license-servers configure flexlm-production 
  --user-groups engineering:50,design:30,students:10

# Set up LDAP authentication
vantage license-servers configure flexlm-production 
  --auth-type ldap 
  --ldap-server ldap://company.com 
  --ldap-base-dn "ou=users,dc=company,dc=com"

# Configure high availability
vantage license-servers configure flexlm-production 
  --enable-ha 
  --backup-region us-west-2

# Set up monitoring
vantage license-servers configure flexlm-production 
  --enable-monitoring 
  --webhook-url https://company.slack.com/webhooks/license-alerts
```

### 7. Advanced CLI Operations

#### License Management

```bash
# Check license status
vantage license-servers licenses status flexlm-production

# Add new license file
vantage license-servers licenses add flexlm-production 
  --file new-license.lic 
  --auto-reload

# Remove expired licenses
vantage license-servers licenses remove flexlm-production 
  --expired-only

# Export license usage report
vantage license-servers licenses report flexlm-production 
  --format csv 
  --date-range "2024-01-01,2024-12-31" 
  --output usage-report.csv
```

#### User Management

```bash
# List users
vantage license-servers users list flexlm-production

# Add user to group
vantage license-servers users add flexlm-production 
  --user john.doe 
  --group engineering 
  --priority high

# Set user limits
vantage license-servers users configure flexlm-production 
  --user john.doe 
  --max-licenses 5 
  --max-duration 8h
```

#### Monitoring and Alerts

```bash
# Get real-time status
vantage license-servers monitor flexlm-production --real-time

# Set up custom alerts
vantage license-servers alerts create flexlm-production 
  --name "high-usage-alert" 
  --condition "usage > 85%" 
  --action "email:admin@company.com"

# View alert history
vantage license-servers alerts history flexlm-production
```

#### Backup and Recovery

```bash
# Create manual backup
vantage license-servers backup create flexlm-production 
  --description "Pre-maintenance backup"

# List backups
vantage license-servers backup list flexlm-production

# Restore from backup
vantage license-servers backup restore flexlm-production 
  --backup-id backup-20240315-001 
  --confirm
```

### 8. Update and Maintenance

```bash
# Update server configuration
vantage license-servers update flexlm-production 
  --config flexlm-config-updated.yaml

# Scale server resources
vantage license-servers scale flexlm-production 
  --instance-type enterprise

# Restart server
vantage license-servers restart flexlm-production 
  --maintenance-window "2024-03-15T02:00:00Z"

# Update FlexLM version
vantage license-servers upgrade flexlm-production 
  --version latest 
  --schedule-window "2024-03-15T02:00:00Z"
```

### 9. Destroy Server

```bash
# Destroy the FlexLM server (with confirmation)
vantage license-servers destroy flexlm-production 
  --backup-before-destroy 
  --confirm

# Force destroy without backup (use with caution)
vantage license-servers destroy flexlm-production 
  --force 
  --confirm
```

### 10. Automation Examples

#### Infrastructure as Code

```bash
# Deploy multiple servers from configuration
for config in configs/*.yaml; do
  vantage license-servers create --config "$config"
done

# Bulk operations
vantage license-servers list --tag environment=staging | 
  xargs -I {} vantage license-servers destroy {} --confirm
```

#### CI/CD Integration

```bash
#!/bin/bash
# deploy-flexlm.sh - CI/CD deployment script

set -e

# Validate configuration
vantage license-servers validate --config flexlm-config.yaml

# Deploy server
vantage license-servers create --config flexlm-config.yaml --wait

# Wait for deployment completion
while [ "$(vantage license-servers status flexlm-production --output json | jq -r '.status')" != "running" ]; do
  echo "Waiting for deployment..."
  sleep 30
done

# Upload licenses
vantage license-servers upload-licenses flexlm-production 
  --files "$LICENSE_FILES" 
  --validate

# Run health check
vantage license-servers health-check flexlm-production

echo "FlexLM server deployed successfully!"
```

#### Configuration Management

```bash
# Export current configuration
vantage license-servers export flexlm-production 
  --output flexlm-current-config.yaml

# Compare configurations
vantage license-servers diff flexlm-production 
  --config flexlm-new-config.yaml

# Apply configuration changes
vantage license-servers apply flexlm-production 
  --config flexlm-new-config.yaml 
  --dry-run  # Preview changes first
```

## Server Management

### Dashboard Overview

The Vantage dashboard provides:

- **Real-time Status**: Current server status and health metrics
- **License Utilization**: Active licenses and usage patterns
- **Performance Metrics**: Server performance and response times
- **Historical Data**: Usage trends and analytics

### Configuration Updates

To modify server configuration:

1. Navigate to **Licenses → Servers**
2. Select your FlexLM server
3. Click **Configure**
4. Make necessary changes
5. Apply configuration updates

### License File Management

Update license files when needed:

1. Access server configuration
2. Click **Manage License Files**
3. Upload new or updated license files
4. Vantage automatically handles server restart and validation

## Integration with Compute Resources

### Client Configuration

Configure your compute resources to use the Vantage-managed license server:

```bash
# Set license server environment variables
export LM_LICENSE_FILE=@hostname:port

# For applications requiring specific vendor daemons
export VENDOR_LICENSE_FILE=@vantage-flexlm-server.compute:27000
```

### Application Setup

Most applications automatically detect license servers through:

- Environment variables (`LM_LICENSE_FILE`)
- License file paths
- Registry entries (Windows)
- Application-specific configuration

### Verification

Test license server connectivity:

```bash
# Check license server status
lmutil lmstat -a -c @vantage-flexlm-server.compute:27000

# Verify specific vendor daemon
lmutil lmstat -a -c @vantage-flexlm-server.compute:27000 vendor_daemon
```

## Monitoring and Analytics

### Real-time Monitoring

Vantage provides comprehensive monitoring:

- **License Usage**: Current license checkouts and availability
- **User Activity**: Who is using which licenses
- **Performance Metrics**: Server response times and throughput
- **Alerts**: Automatic notifications for issues or threshold breaches

### Usage Analytics

Access detailed analytics:

- **Utilization Reports**: License usage patterns and trends
- **Peak Usage Analysis**: Identify peak demand periods
- **Cost Optimization**: Recommendations for license allocation
- **Forecasting**: Predict future license requirements

### Custom Alerts

Configure alerts for:

- License server downtime
- High utilization thresholds
- License expiration warnings
- Performance degradation

## Security and Compliance

### Built-in Security

Vantage-managed servers include:

- **Encryption**: All communication encrypted with TLS 1.3
- **Access Controls**: IP-based and identity-based access restrictions
- **Audit Logging**: Comprehensive audit trails for compliance
- **Regular Updates**: Automatic security patches and updates

### Compliance Features

- **SOC 2 Type II**: Compliance with security standards
- **Data Residency**: Control over data location and processing
- **Audit Reports**: Regular compliance and security reports
- **Backup and Recovery**: Automated backup with retention policies

## Troubleshooting

### Common Issues

**License Server Not Responding**
- Check network connectivity from client systems
- Verify license server status in Vantage dashboard
- Review access control settings

**License Checkout Failures**
- Verify license availability in dashboard
- Check application configuration
- Review license file validity

**Performance Issues**
- Monitor server metrics in dashboard
- Check for network latency issues
- Contact Vantage support for optimization

### Support Options

- **24/7 Support**: Round-the-clock technical support
- **Documentation**: Comprehensive online documentation
- **Community Forums**: Access to user community and experts
- **Dedicated Support**: Enterprise customers receive dedicated support

## Pricing and Billing

### Cost Structure

Vantage-managed FlexLM servers are billed based on:

- **Server Instance**: Base cost for managed infrastructure
- **License Monitoring**: Cost per monitored license
- **Data Transfer**: Network usage for license transactions
- **Support Level**: Enhanced support options available

### Cost Optimization

- **Right-sizing**: Vantage automatically optimizes server capacity
- **Regional Placement**: Optimal placement reduces latency and costs
- **Usage Analytics**: Identify opportunities for license optimization
- **Reserved Capacity**: Discounts for committed usage

## Migration from Self-Managed

### Migration Process

To migrate from self-managed to Vantage-managed:

1. **Assessment**: Vantage team assesses current setup
2. **Planning**: Create migration plan with minimal downtime
3. **Preparation**: Set up Vantage-managed server in parallel
4. **Migration**: Coordinated cutover to new server
5. **Validation**: Verify all applications and users have access

### Migration Support

- **Professional Services**: Vantage team assists with migration
- **Documentation**: Step-by-step migration guides
- **Testing**: Comprehensive testing before final cutover
- **Rollback Plan**: Ability to rollback if issues arise

## Best Practices

### Initial Setup

- Plan license server placement for optimal performance
- Configure appropriate access controls from the start
- Set up monitoring and alerting early
- Document configuration for team reference

### Ongoing Management

- Regularly review usage analytics
- Monitor license expiration dates
- Keep application configurations updated
- Maintain communication with software vendors

### Optimization

- Use analytics to optimize license allocation
- Consider license pooling strategies
- Implement usage policies and governance
- Plan for future license requirements

## Next Steps

After setting up your Vantage-managed FlexLM server:

1. **Monitor Performance**: Review initial usage patterns and performance
2. **Optimize Configuration**: Adjust settings based on actual usage
3. **Train Users**: Provide training on new license access methods
4. **Plan Scaling**: Prepare for future growth and requirements

For advanced features and enterprise options, contact your Vantage representative or explore additional documentation in the Vantage dashboard.
