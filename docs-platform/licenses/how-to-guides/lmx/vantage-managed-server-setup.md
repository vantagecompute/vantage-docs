---
id: vantage-managed-server-setup
title: Vantage-Managed LMX Server Setup
sidebar_position: 1
description: Deploy and configure LMX license servers using Vantage's fully managed service.
---

This guide covers setting up LMX (License Manager X) license servers through Vantage's fully managed service. Vantage handles all infrastructure, maintenance, security, and monitoring while providing you with a production-ready LMX deployment.

## Overview

Vantage-managed LMX servers offer:

- **Fully Managed Infrastructure**: No server maintenance required
- **High Availability**: Built-in redundancy and failover
- **Automatic Scaling**: Dynamic resource allocation based on demand
- **Enterprise Security**: Advanced security features and compliance
- **24/7 Monitoring**: Continuous monitoring and alerting
- **Backup and Recovery**: Automated backup and disaster recovery

## Prerequisites

Before deploying a Vantage-managed LMX server:

- **Vantage Account**: Active Vantage subscription with license management enabled
- **License Files**: Valid LMX license files from your software vendor
- **Network Configuration**: Proper network connectivity and firewall rules
- **Administrative Access**: Vantage administrator permissions

## Deployment Process

### 1. Access License Management

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Deploy New Server**
4. Select **LMX** as the license server type
5. Choose **Vantage-Managed** deployment option

### 2. Configure Deployment Settings

#### Basic Configuration

- **Server Name**: Choose a descriptive name for your LMX server
- **Region**: Select the AWS region closest to your users
- **Instance Size**: Choose from predefined configurations:
  - **Small**: 2 vCPU, 4GB RAM (up to 50 concurrent licenses)
  - **Medium**: 4 vCPU, 8GB RAM (up to 200 concurrent licenses)
  - **Large**: 8 vCPU, 16GB RAM (up to 500 concurrent licenses)
  - **X-Large**: 16 vCPU, 32GB RAM (up to 1000+ concurrent licenses)

#### Network Configuration

- **VPC Selection**: Choose your existing VPC or create new
- **Subnet**: Select appropriate subnet with internet access
- **Security Groups**: Configure access rules for:
  - Port 6200 (LMX server)
  - Port 6201 (LMX HTTPS)
  - Port 8080 (Web interface)
  - Port 8443 (Web interface HTTPS)

#### High Availability Options

- **Multi-AZ Deployment**: Enable for production workloads
- **Auto-failover**: Automatic failover to secondary instance
- **Load Balancing**: Distribute requests across multiple instances

### 3. Upload License Files

1. Click **Upload License Files**
2. Select your LMX license files (.lic extension)
3. Verify license information is parsed correctly
4. Configure license-specific settings:
   - **License Priority**: Set priority for multiple licenses
   - **Feature Groups**: Organize features into logical groups
   - **Usage Limits**: Set per-user or per-group limits

### 4. Configure Server Settings

#### Server Configuration

```yaml
# LMX Server Configuration (managed by Vantage)
server:
  port: 6200
  https_port: 6201
  web_port: 8080
  https_web_port: 8443
  log_level: INFO
  max_connections: 1000

# Authentication Settings
authentication:
  ldap_integration: true
  sso_enabled: true
  multi_factor_auth: false

# Performance Settings
performance:
  connection_timeout: 300
  borrow_timeout: 86400
  heartbeat_interval: 30
```

#### Security Configuration

- **SSL/TLS**: Enable HTTPS for all communications
- **Access Control**: Configure IP-based access restrictions
- **Authentication**: Integrate with your existing identity provider
- **Audit Logging**: Enable comprehensive audit logging

### 5. Launch Deployment

1. Review all configuration settings
2. Estimate costs based on usage patterns
3. Click **Deploy LMX Server**
4. Monitor deployment progress in real-time

## CLI-Based Deployment

Alternatively, you can provision your Vantage-managed LMX server using the Vantage CLI for modern DevOps workflows and automation.

### 1. Install and Setup Vantage CLI

```bash
# Install Vantage CLI
curl -L https://releases.vantage.io/cli/latest/install.sh | bash

# Authenticate with Vantage
vantage auth login

# Verify installation
vantage version
```

### 2. Create LMX Server Configuration

Create a comprehensive configuration file for your LMX server:

```yaml
# lmx-config.yaml
apiVersion: v1
kind: LicenseServer
metadata:
  name: "lmx-production"
  description: "Production LMX server for engineering applications"
  labels:
    environment: "production"
    team: "engineering"
    vendor: "x-formation"

spec:
  type: "lmx"
  deployment: "vantage-managed"
  
  infrastructure:
    region: "us-east-1"
    instance_type: "high-performance"
    multi_az: true
    auto_scaling: true
    
  configuration:
    server_port: 6200
    https_port: 6201
    web_port: 8080
    ssl_web_port: 8443
    ssl_enabled: true
    compression: true
    
  licensing:
    concurrent_limit: "unlimited"
    borrow_enabled: true
    borrow_timeout: 86400
    heartbeat_interval: 30
    
  security:
    web_auth: true
    admin_username: "admin"
    admin_password: "auto-generated"
    encryption: "AES-256"
    access_control:
      include_networks:
        - "192.168.0.0/16"
        - "10.0.0.0/8"
        
  monitoring:
    enabled: true
    web_interface: true
    metrics_collection: "detailed"
    alerts:
      license_exhaustion:
        threshold: 90
        recipients: ["admin@company.com"]
      server_performance:
        cpu_threshold: 80
        memory_threshold: 85
        
  backup:
    enabled: true
    frequency: "daily"
    retention_days: 30
    cross_region: true
```

### 3. Deploy LMX Server

```bash
# Validate configuration first
vantage license-servers validate --config lmx-config.yaml

# Create the LMX server
vantage license-servers create --config lmx-config.yaml --wait

# Monitor deployment progress
vantage license-servers status lmx-production --watch --timeout 10m

# Get server details
vantage license-servers describe lmx-production
```

### 4. Upload and Configure Licenses

```bash
# Upload LMX license files
vantage license-servers upload-licenses lmx-production 
  --files "licenses/*.lic" 
  --validate-signatures 
  --auto-reload

# Verify license loading
vantage license-servers licenses status lmx-production

# Check specific features
vantage license-servers licenses features lmx-production 
  --detailed 
  --show-expiry
```

### 5. Configure LMX-Specific Features

```bash
# Configure advanced LMX settings
vantage license-servers configure lmx-production 
  --max-users 1000 
  --timeout 300 
  --linger 300

# Enable high availability
vantage license-servers configure lmx-production 
  --enable-ha 
  --backup-server lmx-backup 
  --heartbeat-interval 30

# Configure borrowing policies
vantage license-servers configure lmx-production 
  --borrowing-policy "feature1:7d,feature2:1d" 
  --max-borrow-time 168h

# Set up load balancing
vantage license-servers configure lmx-production 
  --enable-load-balancing 
  --algorithm round-robin 
  --health-check-interval 60
```

### 6. Advanced LMX Management

#### License Analytics and Reporting

```bash
# Get real-time usage statistics
vantage license-servers monitor lmx-production 
  --real-time 
  --metrics "usage,performance,connections"

# Generate detailed usage reports
vantage license-servers report lmx-production 
  --type comprehensive 
  --period quarterly 
  --include-trends 
  --format pdf

# Export license usage data
vantage license-servers export lmx-production 
  --type usage-data 
  --date-range "2024-01-01,2024-12-31" 
  --format json 
  --output lmx-usage-2024.json
```

#### User and Access Management

```bash
# Configure user access patterns
vantage license-servers users configure lmx-production 
  --user-limits "engineering:50,design:30,students:10" 
  --priority-users "john.doe,jane.smith"

# Set up access control lists
vantage license-servers acl create lmx-production 
  --name "engineering-access" 
  --hosts "eng-*.company.com" 
  --features "advanced_feature,premium_module"

# Configure time-based restrictions
vantage license-servers schedule create lmx-production 
  --name "business-hours" 
  --time-range "08:00-18:00" 
  --days "mon-fri" 
  --features "standard_features"
```

#### Performance Optimization

```bash
# Optimize for high concurrency
vantage license-servers tune lmx-production 
  --max-connections 2000 
  --connection-pool-size 100 
  --cache-size 1GB

# Configure compression settings
vantage license-servers configure lmx-production 
  --compression-level 6 
  --compression-threshold 1KB

# Enable performance monitoring
vantage license-servers monitor enable lmx-production 
  --metrics "cpu,memory,network,disk" 
  --interval 30s 
  --retention 90d
```

### 7. Web Interface Management via CLI

```bash
# Configure web interface settings
vantage license-servers web-config lmx-production 
  --theme corporate 
  --language en 
  --timezone "America/New_York" 
  --session-timeout 1800

# Manage web interface users
vantage license-servers web-users add lmx-production 
  --username "webadmin" 
  --role administrator 
  --email "webadmin@company.com"

# Export web interface configuration
vantage license-servers web-config export lmx-production 
  --output lmx-web-config.json
```

### 8. Monitoring and Alerting Configuration

```bash
# Set up comprehensive monitoring
vantage license-servers monitoring configure lmx-production 
  --enable-detailed-logging 
  --log-retention 90d 
  --audit-events all

# Create custom alerts
vantage license-servers alerts create lmx-production 
  --name "feature-exhaustion" 
  --condition "feature:matlab usage > 95%" 
  --actions "email:matlab-admin@company.com,slack:#matlab-alerts"

# Configure webhook notifications
vantage license-servers webhooks create lmx-production 
  --url "https://company.com/webhooks/lmx" 
  --events "checkout,checkin,denial,error" 
  --auth-token "webhook-secret-token"

# Set up performance alerts
vantage license-servers alerts create lmx-production 
  --name "performance-degradation" 
  --condition "response_time > 5s OR cpu > 90%" 
  --actions "pagerduty:license-ops-team"
```

### 9. Backup and Disaster Recovery

```bash
# Configure automated backups
vantage license-servers backup configure lmx-production 
  --schedule "0 2 * * *" 
  --retention 90d 
  --cross-region us-west-2 
  --encryption enabled

# Create manual backup
vantage license-servers backup create lmx-production 
  --description "Pre-maintenance backup $(date)" 
  --include-logs 
  --compress

# Test backup integrity
vantage license-servers backup verify lmx-production 
  --backup-id "backup-20240315-020000"

# Restore from backup
vantage license-servers backup restore lmx-production 
  --backup-id "backup-20240315-020000" 
  --target-server lmx-dr 
  --confirm
```

### 10. Maintenance and Updates

```bash
# Schedule maintenance window
vantage license-servers maintenance schedule lmx-production 
  --window "2024-03-20T02:00:00Z/PT2H" 
  --description "Monthly maintenance update" 
  --notify-users

# Update LMX version
vantage license-servers upgrade lmx-production 
  --version "5.2.1" 
  --maintenance-window "2024-03-20T02:00:00Z" 
  --backup-before-upgrade

# Apply configuration changes
vantage license-servers apply lmx-production 
  --config lmx-config-updated.yaml 
  --rolling-update 
  --health-check-timeout 300s

# Restart server gracefully
vantage license-servers restart lmx-production 
  --graceful 
  --drain-connections 
  --timeout 600s
```

### 11. Integration and Automation

#### CI/CD Pipeline Integration

```yaml
# .gitlab-ci.yml example
deploy-lmx:
  stage: deploy
  image: vantage/cli:latest
  script:
    - vantage auth token-login
    - vantage license-servers validate --config lmx-config.yaml
    - |
      if vantage license-servers exists lmx-production; then
        vantage license-servers update lmx-production --config lmx-config.yaml
      else
        vantage license-servers create --config lmx-config.yaml --wait
      fi
    - vantage license-servers health-check lmx-production
  environment:
    name: production
  only:
    - main
```

#### Terraform Integration

```hcl
# terraform/lmx.tf
resource "vantage_license_server" "lmx_production" {
  name        = "lmx-production"
  type        = "lmx"
  config_file = file("${path.module}/lmx-config.yaml")
  
  lifecycle {
    create_before_destroy = true
  }
}

output "lmx_server_endpoint" {
  value = vantage_license_server.lmx_production.endpoint
}
```

#### Ansible Playbook

```yaml
# ansible/deploy-lmx.yml
---
- name: Deploy LMX License Server
  hosts: localhost
  tasks:
    - name: Create LMX server
      shell: |
        vantage license-servers create --config lmx-config.yaml
      register: deployment_result
      
    - name: Wait for deployment
      shell: |
        vantage license-servers status lmx-production --wait
        
    - name: Upload licenses
      shell: |
        vantage license-servers upload-licenses lmx-production --files "{{ license_files }}"
```

### 12. Monitoring and Troubleshooting

```bash
# Get comprehensive server status
vantage license-servers status lmx-production 
  --detailed 
  --include-metrics 
  --include-logs

# Debug connection issues
vantage license-servers debug lmx-production 
  --test-connectivity 
  --trace-requests 
  --verbose

# Analyze performance issues
vantage license-servers analyze lmx-production 
  --performance-report 
  --time-range "last-24h" 
  --include-recommendations

# Export diagnostic information
vantage license-servers diagnostics export lmx-production 
  --output lmx-diagnostics.tar.gz 
  --include-configs 
  --include-logs
```

### 13. Destroy Server

```bash
# Graceful shutdown with user notification
vantage license-servers destroy lmx-production 
  --backup-before-destroy 
  --notify-users "Server maintenance - migrating to new instance" 
  --grace-period 2h 
  --confirm

# Emergency shutdown
vantage license-servers destroy lmx-production 
  --force 
  --no-backup 
  --confirm "EMERGENCY_SHUTDOWN"
```

## Post-Deployment Configuration

### 1. Verify Server Status

Once deployment is complete:

1. Check server status in the Vantage dashboard
2. Verify all license features are loaded correctly
3. Test connectivity from client machines
4. Confirm web interface accessibility

### 2. Configure Monitoring

#### Built-in Monitoring

Vantage automatically monitors:

- **Server Health**: CPU, memory, disk usage
- **License Usage**: Real-time license checkout/checkin
- **Performance Metrics**: Response times, throughput
- **Error Rates**: Failed requests and error patterns

#### Custom Alerts

Set up alerts for:

- **License Exhaustion**: When licenses reach 90% usage
- **Server Downtime**: When server becomes unavailable
- **Performance Degradation**: When response times exceed thresholds
- **Security Events**: Unauthorized access attempts

### 3. User Access Configuration

#### LDAP Integration

```yaml
ldap:
  server: ldap://your-ldap-server.com
  base_dn: "ou=users,dc=company,dc=com"
  bind_dn: "cn=admin,dc=company,dc=com"
  bind_password: "your_password"
  user_filter: "(uid=%s)"
```

#### SSO Configuration

1. Navigate to **Authentication → SSO**
2. Select your identity provider (SAML, OIDC)
3. Configure SSO settings
4. Test SSO integration
5. Enable SSO for LMX server access

## License Management

### Adding New Licenses

1. Navigate to **Licenses → Files**
2. Click **Upload New License**
3. Select your new LMX license file
4. The server automatically reloads licenses
5. Verify new features are available

### License Policies

#### Usage Policies

Configure policies for:

- **User Limits**: Maximum licenses per user
- **Group Limits**: Maximum licenses per group
- **Time Restrictions**: Limit access to business hours
- **Priority Users**: Guarantee access for critical users

#### Reservation Policies

Set up license reservations:

- **Named User Reservations**: Reserve licenses for specific users
- **Group Reservations**: Reserve licenses for departments
- **Workstation Reservations**: Reserve licenses for specific machines

### License Analytics

#### Usage Reports

Generate reports for:

- **Historical Usage**: License usage trends over time
- **Peak Usage**: Identify peak usage periods
- **User Activity**: Track individual user license consumption
- **Feature Utilization**: Analyze which features are most used

#### Cost Optimization

- **License Right-sizing**: Identify underutilized licenses
- **Usage Forecasting**: Predict future license needs
- **Cost Allocation**: Allocate license costs to departments

## Integration with Applications

### Client Configuration

Configure client applications to connect to your Vantage-managed LMX server:

```bash
# Set environment variable
export LMX_LICENSE_FILE=@your-lmx-server.vantage.io:6200

# Or configure in application settings
LMX_LICENSE_FILE=@your-lmx-server.vantage.io:6200
```

### API Integration

Use Vantage APIs to integrate license management:

```python
import requests

# Get license status
response = requests.get(
    'https://api.vantage.io/v1/licenses/lmx/status',
    headers={'Authorization': 'Bearer your_api_token'}
)

license_status = response.json()
```

## High Availability Features

### Multi-AZ Deployment

Vantage-managed LMX servers support:

- **Primary/Secondary Setup**: Automatic failover between AZs
- **Data Replication**: Real-time license data synchronization
- **Health Monitoring**: Continuous health checks
- **Automatic Recovery**: Self-healing infrastructure

### Disaster Recovery

Built-in disaster recovery includes:

- **Automated Backups**: Hourly configuration and license backups
- **Cross-Region Replication**: Backup to secondary region
- **Point-in-Time Recovery**: Restore to any point in the last 30 days
- **RTO/RPO**: 15-minute RTO, 5-minute RPO

## Security Features

### Network Security

- **VPC Isolation**: Deployed in isolated VPC
- **Security Groups**: Configurable firewall rules
- **DDoS Protection**: AWS Shield protection included
- **WAF Integration**: Web Application Firewall for web interface

### Data Security

- **Encryption at Rest**: AES-256 encryption for all data
- **Encryption in Transit**: TLS 1.3 for all communications
- **Key Management**: AWS KMS for encryption key management
- **Compliance**: SOC 2, ISO 27001, GDPR compliance

### Access Security

- **Multi-Factor Authentication**: Optional MFA for admin access
- **Role-Based Access**: Granular permission controls
- **API Security**: OAuth 2.0 and API key authentication
- **Audit Logging**: Comprehensive audit trail

## Performance Optimization

### Auto-Scaling

Vantage automatically scales your LMX server:

- **Vertical Scaling**: Increase instance size during peak usage
- **Horizontal Scaling**: Add additional server instances
- **Cost Optimization**: Scale down during low usage periods

### Performance Monitoring

Real-time performance metrics:

- **Response Time**: Average license checkout time
- **Throughput**: Licenses checked out per second
- **Concurrency**: Simultaneous active connections
- **Resource Utilization**: CPU, memory, network usage

## Maintenance and Updates

### Automatic Maintenance

Vantage handles all maintenance:

- **Security Updates**: Automatic security patch installation
- **LMX Updates**: Managed LMX version upgrades
- **OS Updates**: Operating system maintenance
- **Infrastructure Updates**: Hardware and network improvements

### Maintenance Windows

Configure maintenance preferences:

- **Preferred Windows**: Schedule maintenance during low-usage periods
- **Emergency Patches**: Critical security updates outside windows
- **Advance Notice**: 48-hour notice for planned maintenance

## Troubleshooting

### Common Issues

#### Connection Problems

1. Check security group configurations
2. Verify network connectivity from client
3. Review Vantage server status dashboard
4. Contact Vantage support if issues persist

#### License Checkout Failures

1. Verify license file validity in dashboard
2. Check license availability and usage
3. Review user permissions and policies
4. Examine audit logs for detailed error information

### Support Resources

- **24/7 Support**: Available through Vantage dashboard
- **Knowledge Base**: Comprehensive documentation
- **Community Forums**: User community and best practices
- **Professional Services**: Implementation and optimization consulting

## Monitoring and Alerting

### Built-in Dashboards

Vantage provides pre-built dashboards for:

- **Server Health**: Overall server status and performance
- **License Usage**: Real-time and historical usage patterns
- **User Activity**: Individual and group usage statistics
- **System Metrics**: Infrastructure performance metrics

### Custom Alerts

Configure alerts for business-critical events:

```yaml
alerts:
  - name: "High License Usage"
    condition: "usage > 90%"
    notification: "email, slack"
    
  - name: "Server Unavailable"
    condition: "health_status != healthy"
    notification: "email, pagerduty"
    
  - name: "Performance Degradation"
    condition: "response_time > 5s"
    notification: "email"
```

## Cost Management

### Usage-Based Billing

Vantage-managed LMX servers use usage-based billing:

- **Base Infrastructure**: Fixed monthly cost based on instance size
- **License Management**: Per-license-per-month fee
- **Data Transfer**: Charges for data transfer outside AWS region
- **Premium Features**: Additional cost for advanced features

### Cost Optimization

- **Right-sizing**: Automatic recommendations for optimal instance size
- **Reserved Capacity**: Discount for long-term commitments
- **Spot Instances**: Use spot instances for development/testing
- **Cost Alerts**: Notifications when costs exceed thresholds

## Migration and Onboarding

### Migration from Self-Managed

Vantage provides migration assistance:

1. **Assessment**: Analyze current LMX setup
2. **Migration Plan**: Develop detailed migration strategy
3. **Data Migration**: Transfer licenses and configurations
4. **Testing**: Validate functionality before cutover
5. **Cutover**: Seamless transition to Vantage-managed

### Onboarding Process

1. **Initial Setup**: Deploy server with basic configuration
2. **License Upload**: Import existing license files
3. **User Integration**: Connect with identity systems
4. **Testing**: Validate application connectivity
5. **Production Cutover**: Switch production workloads

## Best Practices

### Configuration Best Practices

- **Use Multi-AZ**: Always enable for production workloads
- **Enable SSL**: Use HTTPS for all communications
- **Configure Monitoring**: Set up comprehensive monitoring and alerting
- **Regular Reviews**: Periodically review usage and costs

### Security Best Practices

- **Principle of Least Privilege**: Grant minimum required permissions
- **Regular Access Reviews**: Audit user access quarterly
- **Strong Authentication**: Enable MFA where possible
- **Network Segmentation**: Use security groups to limit access

### Performance Best Practices

- **Monitor Usage Patterns**: Track peak usage times
- **Optimize Client Configuration**: Configure clients for optimal performance
- **Regular Performance Reviews**: Monitor and optimize regularly
- **Capacity Planning**: Plan for growth and peak usage

## Next Steps

After deploying your Vantage-managed LMX server:

1. **User Training**: Train users on new license server access
2. **Integration Testing**: Validate all applications work correctly
3. **Performance Monitoring**: Establish baseline performance metrics
4. **Policy Configuration**: Fine-tune license policies based on usage
5. **Cost Optimization**: Optimize configuration for cost-effectiveness

For advanced configurations and enterprise features, contact Vantage Professional Services or explore additional documentation in the Vantage dashboard.
