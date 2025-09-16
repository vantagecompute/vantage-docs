---
id: server-setup
title: Server Setup
sidebar_position: 2
description: Deploy and configure OLicense servers with enterprise database integration and high availability.
---

# OLicense Server Setup

This guide provides comprehensive instructions for deploying and configuring OLicense servers with enterprise database integration, authentication systems, and Vantage License Manager connectivity. OLicense offers sophisticated license management capabilities that require careful planning and configuration to maximize performance and reliability in enterprise environments.

## Installation Prerequisites

### System Requirements

**Minimum Hardware Requirements**:
- **CPU**: 4 cores (8+ cores recommended for enterprise deployments)
- **Memory**: 8 GB RAM (16+ GB recommended for large user bases)
- **Storage**: 100 GB available disk space (SSD recommended)
- **Network**: 1 Gbps Ethernet with low-latency connectivity to client systems

**Recommended Enterprise Configuration**:
- **CPU**: 16+ cores with high single-thread performance
- **Memory**: 32+ GB RAM with ECC for data integrity
- **Storage**: 500+ GB NVMe SSD with RAID 1 for redundancy
- **Network**: 10 Gbps network with redundant connections and QoS configuration

### Operating System Support

**Linux Distributions** (Recommended):
```bash
# RHEL/CentOS/Rocky Linux 8/9
sudo yum update -y
sudo yum install -y epel-release
sudo yum groupinstall -y "Development Tools"
sudo yum install -y openssl-devel zlib-devel libcurl-devel

# Ubuntu/Debian LTS
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential libssl-dev zlib1g-dev libcurl4-openssl-dev
sudo apt install -y postgresql-client mysql-client
```

**Windows Server** (Alternative):
- Windows Server 2019/2022 with latest updates
- .NET Framework 4.8 or .NET 6+ runtime
- Visual C++ Redistributables (latest version)
- Administrative privileges for service installation

### Database Requirements

**PostgreSQL** (Recommended):
```bash
# Install PostgreSQL 14/15
sudo yum install -y postgresql-server postgresql-contrib  # RHEL/CentOS
# or
sudo apt install -y postgresql postgresql-contrib  # Ubuntu/Debian

# Initialize and configure database
sudo postgresql-setup initdb  # RHEL/CentOS only
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create OLicense database and user
sudo -u postgres psql <<EOF
CREATE DATABASE olicense_db;
CREATE USER olicense_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE olicense_db TO olicense_user;
ALTER USER olicense_user CREATEDB;
\q
EOF
```

**Oracle Database** (Enterprise):
```sql
-- Oracle database setup for OLicense
CREATE TABLESPACE olicense_ts
DATAFILE '/opt/oracle/oradata/XE/olicense_ts.dbf'
SIZE 1G AUTOEXTEND ON NEXT 100M MAXSIZE 10G;

CREATE USER olicense_user
IDENTIFIED BY secure_password_here
DEFAULT TABLESPACE olicense_ts
QUOTA UNLIMITED ON olicense_ts;

GRANT CONNECT, RESOURCE, CREATE VIEW TO olicense_user;
GRANT CREATE ANY SEQUENCE TO olicense_user;
GRANT CREATE ANY TABLE TO olicense_user;
```

**SQL Server** (Windows Environments):
```sql
-- SQL Server setup for OLicense
CREATE DATABASE OLicenseDB
ON (NAME = 'OLicense_Data',
    FILENAME = 'C:\Data\OLicense.mdf',
    SIZE = 1GB,
    MAXSIZE = 10GB,
    FILEGROWTH = 100MB)
LOG ON (NAME = 'OLicense_Log',
        FILENAME = 'C:\Data\OLicense.ldf',
        SIZE = 100MB,
        MAXSIZE = 1GB,
        FILEGROWTH = 10MB);

CREATE LOGIN olicense_user WITH PASSWORD = 'SecurePassword123!';
USE OLicenseDB;
CREATE USER olicense_user FOR LOGIN olicense_user;
ALTER ROLE db_owner ADD MEMBER olicense_user;
```

## OLicense Server Installation

### Download and Install OLicense

```bash
# Create OLicense system user
sudo useradd -r -s /bin/bash -d /opt/olicense -m olicense
sudo mkdir -p /opt/olicense/{bin,config,licenses,logs,data,ssl}

# Download OLicense server (example version)
cd /opt/olicense
sudo wget https://releases.optimalcomputing.com/olicense/v4.2.1/olicense-server-4.2.1-linux-x64.tar.gz
sudo tar -xzf olicense-server-4.2.1-linux-x64.tar.gz
sudo chown -R olicense:olicense /opt/olicense/

# Install OLicense server
sudo -u olicense /opt/olicense/install.sh --install-dir=/opt/olicense --config-dir=/opt/olicense/config
```

### Core Configuration

```python
import textwrap
import json
import os

def create_olicense_config():
    """Create comprehensive OLicense server configuration."""
    
    main_config = textwrap.dedent("""
        # OLicense Server Main Configuration
        # /opt/olicense/config/olicense.conf
        
        [server]
        # Basic server settings
        server_name = olicense-prod-01
        server_id = ol-prod-001
        listen_port = 5053
        admin_port = 8443
        api_port = 8080
        
        # Security settings
        enable_ssl = true
        ssl_cert_file = /opt/olicense/ssl/server.crt
        ssl_key_file = /opt/olicense/ssl/server.key
        ssl_ca_file = /opt/olicense/ssl/ca.crt
        require_client_cert = false
        
        # Performance settings
        max_connections = 1000
        connection_timeout = 300
        thread_pool_size = 50
        memory_limit = 4096M
        
        [database]
        # Database configuration
        type = postgresql
        host = localhost
        port = 5432
        database = olicense_db
        username = olicense_user
        password = secure_password_here
        ssl_mode = require
        
        # Connection pooling
        pool_size = 20
        pool_max_overflow = 30
        pool_timeout = 30
        pool_recycle = 3600
        
        # Database optimizations
        enable_query_cache = true
        cache_size = 1000
        enable_prepared_statements = true
        
        [authentication]
        # Authentication providers
        enable_local_auth = true
        enable_ldap_auth = true
        enable_saml_auth = false
        default_auth_provider = ldap
        
        # LDAP configuration
        ldap_server = ldap://ldap.company.com:389
        ldap_base_dn = dc=company,dc=com
        ldap_bind_dn = cn=olicense,ou=service,dc=company,dc=com
        ldap_bind_password = ldap_service_password
        ldap_user_filter = (uid={username})
        ldap_group_filter = (memberUid={username})
        
        # Session management
        session_timeout = 28800  # 8 hours
        max_sessions_per_user = 5
        enable_session_sharing = true
        
        [licensing]
        # License management
        license_file_path = /opt/olicense/licenses
        enable_license_sharing = true
        enable_license_borrowing = true
        default_borrow_period = 24h
        max_borrow_period = 168h  # 7 days
        
        # Usage tracking
        enable_usage_tracking = true
        usage_log_level = detailed
        usage_retention_days = 365
        enable_real_time_reporting = true
        
        # Feature management
        enable_feature_versioning = true
        enable_feature_dependencies = true
        enable_custom_attributes = true
        
        [logging]
        # Logging configuration
        log_level = info
        log_file = /opt/olicense/logs/olicense.log
        error_log_file = /opt/olicense/logs/olicense-error.log
        access_log_file = /opt/olicense/logs/olicense-access.log
        
        # Log rotation
        log_max_size = 100MB
        log_backup_count = 10
        log_rotation_time = daily
        
        # Audit logging
        enable_audit_logging = true
        audit_log_file = /opt/olicense/logs/olicense-audit.log
        audit_events = login,logout,license_checkout,license_checkin,admin_changes
        
        [api]
        # API configuration
        enable_rest_api = true
        enable_soap_api = true
        api_authentication = token
        api_rate_limiting = true
        api_rate_limit = 1000/hour
        
        # API security
        api_cors_enabled = true
        api_cors_origins = https://vantage.company.com
        api_require_https = true
        
        [monitoring]
        # Health monitoring
        enable_health_checks = true
        health_check_interval = 30
        enable_performance_metrics = true
        metrics_retention_days = 30
        
        # SNMP monitoring
        enable_snmp = true
        snmp_port = 161
        snmp_community = olicense_monitor
        
        # External monitoring
        enable_prometheus_metrics = true
        prometheus_port = 9090
        
        [notifications]
        # Email notifications
        smtp_server = smtp.company.com
        smtp_port = 587
        smtp_username = olicense@company.com
        smtp_password = smtp_password_here
        smtp_use_tls = true
        
        # Alert settings
        enable_license_expiry_alerts = true
        license_expiry_warning_days = 30,7,1
        enable_usage_threshold_alerts = true
        usage_threshold_percent = 90,95,98
        
        [integration]
        # Vantage integration
        enable_vantage_integration = true
        vantage_api_endpoint = https://api.vantage.company.com
        vantage_api_key = vantage_api_key_here
        vantage_sync_interval = 60
        
        # External integrations
        enable_webhook_notifications = true
        webhook_endpoints = https://monitoring.company.com/webhooks/olicense
        webhook_events = license_checkout,license_checkin,server_status
        """).strip()
    
    return main_config

# Generate main configuration
config_content = create_olicense_config()
print("OLicense main configuration ready")
```

### Advanced Feature Configuration

```python
import textwrap

def create_feature_definitions():
    """Create advanced OLicense feature definitions."""
    
    features_config = textwrap.dedent("""
        # OLicense Feature Definitions
        # /opt/olicense/config/features.conf
        
        [feature:matlab_core]
        display_name = "MATLAB Core"
        description = "MATLAB basic computational engine"
        version = "R2023b"
        vendor = "MathWorks"
        license_type = floating
        max_users = 100
        default_checkout_duration = 8h
        allow_borrowing = true
        max_borrow_duration = 72h
        priority_groups = engineering,research
        
        # Usage policies
        max_concurrent_per_user = 2
        max_daily_hours_per_user = 12
        allow_queue_waiting = true
        queue_timeout = 1800  # 30 minutes
        
        # Integration settings
        track_detailed_usage = true
        enable_cost_tracking = true
        cost_per_hour = 5.50
        billing_increment = 15min
        
        [feature:matlab_toolboxes]
        display_name = "MATLAB Toolboxes"
        description = "MATLAB specialized toolboxes"
        version = "R2023b"
        vendor = "MathWorks"
        license_type = feature_counted
        
        # Toolbox-specific features
        toolbox_signal_processing_max = 25
        toolbox_image_processing_max = 15
        toolbox_statistics_max = 20
        toolbox_optimization_max = 10
        toolbox_parallel_computing_max = 50
        
        # Dependencies
        depends_on = matlab_core
        exclusive_with = matlab_student
        
        [feature:solidworks_premium]
        display_name = "SolidWorks Premium"
        description = "SolidWorks CAD software premium edition"
        version = "2024"
        vendor = "Dassault Systemes"
        license_type = named_user
        max_named_users = 50
        
        # CAD-specific settings
        allow_home_use = true
        home_use_duration = 30days
        require_network_validation = true
        validation_interval = 24h
        
        # Performance tracking
        track_file_operations = true
        track_rendering_time = true
        track_simulation_usage = true
        
        [feature:ansys_mechanical]
        display_name = "ANSYS Mechanical"
        description = "ANSYS finite element analysis"
        version = "2024R1"
        vendor = "ANSYS"
        license_type = floating
        max_users = 25
        
        # HPC integration
        hpc_enabled = true
        hpc_cores_per_license = 8
        hpc_max_cores_per_job = 128
        hpc_scheduler_integration = slurm,pbs,sge
        
        # Solver-specific licensing
        solver_structural_max = 15
        solver_thermal_max = 10
        solver_fluid_max = 8
        solver_electromagnetic_max = 5
        
        [feature:office_365_e3]
        display_name = "Microsoft Office 365 E3"
        description = "Office 365 enterprise subscription"
        vendor = "Microsoft"
        license_type = subscription_based
        subscription_users = 500
        
        # Office 365 specific settings
        apps_included = word,excel,powerpoint,outlook,teams,sharepoint,onedrive
        cloud_storage_per_user = 1TB
        teams_enabled = true
        sharepoint_enabled = true
        
        # Usage tracking
        track_app_usage = true
        track_collaboration_features = true
        track_cloud_storage_usage = true
        
        [licensing_policies]
        # Global licensing policies
        default_checkout_grace_period = 15min
        license_reservation_enabled = true
        max_reservation_duration = 24h
        
        # Fair usage policies
        enable_fair_share_scheduling = true
        fair_share_algorithm = weighted_round_robin
        fair_share_time_window = 7days
        
        # Geographic policies
        enable_geographic_restrictions = true
        allowed_countries = US,CA,UK,DE,FR,JP,AU
        timezone_aware_licensing = true
        
        # Emergency policies
        enable_emergency_override = true
        emergency_override_duration = 4h
        emergency_contact = license-admin@company.com
        """).strip()
    
    return features_config

# Generate feature configuration
features_content = create_feature_definitions()
print("OLicense feature definitions ready")
```

### User and Group Management

```bash
# Configure user groups and permissions
sudo -u olicense tee /opt/olicense/config/groups.conf <<'EOF'
# OLicense User Groups Configuration

[group:engineering]
display_name = "Engineering Team"
description = "Mechanical and electrical engineers"
ldap_group = cn=engineering,ou=groups,dc=company,dc=com
priority = high
license_allocation_weight = 2.0

# Feature access
allowed_features = matlab_core,matlab_toolboxes,solidworks_premium,ansys_mechanical
denied_features = office_365_e3
default_features = matlab_core,solidworks_premium

# Usage limits
max_concurrent_licenses = 50
max_daily_hours = 12
max_weekly_hours = 60
allow_overtime_usage = true

# Permissions
can_borrow_licenses = true
can_make_reservations = true
can_view_usage_reports = true
can_manage_own_sessions = true

[group:research]
display_name = "Research and Development"
description = "R&D scientists and researchers"
ldap_group = cn=research,ou=groups,dc=company,dc=com
priority = high
license_allocation_weight = 1.8

# Feature access
allowed_features = matlab_core,matlab_toolboxes,ansys_mechanical
special_access_features = research_computing_cluster
default_features = matlab_core

# Research-specific settings
allow_academic_features = true
extended_borrow_duration = true
max_borrow_duration = 168h  # 7 days
priority_queue_access = true

[group:students]
display_name = "Student Users"
description = "University students and interns"
ldap_group = cn=students,ou=groups,dc=company,dc=com
priority = low
license_allocation_weight = 0.5

# Limited feature access
allowed_features = matlab_core,solidworks_standard
denied_features = ansys_mechanical,premium_toolboxes
student_mode = true

# Usage restrictions
max_concurrent_licenses = 10
max_daily_hours = 4
max_session_duration = 2h
no_borrowing_allowed = true

[group:administrators]
display_name = "License Administrators"
description = "System and license administrators"
ldap_group = cn=license_admins,ou=groups,dc=company,dc=com
priority = admin
license_allocation_weight = 0.1

# Administrative permissions
admin_privileges = full
can_manage_all_licenses = true
can_force_release_licenses = true
can_modify_configurations = true
can_view_all_reports = true
can_manage_users = true

# Emergency access
emergency_override_access = true
bypass_usage_limits = true
EOF
```

### SSL Certificate Configuration

```bash
# Generate SSL certificates for OLicense
sudo -u olicense mkdir -p /opt/olicense/ssl
cd /opt/olicense/ssl

# Create private key
sudo -u olicense openssl genrsa -out server.key 4096

# Create certificate signing request
sudo -u olicense openssl req -new -key server.key -out server.csr -subj \
  "/C=US/ST=State/L=City/O=Company/OU=IT/CN=olicense.company.com"

# Generate self-signed certificate (or use CA-signed)
sudo -u olicense openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# Create certificate authority (for client certificates if needed)
sudo -u olicense openssl genrsa -out ca.key 4096
sudo -u olicense openssl req -new -x509 -days 3650 -key ca.key -out ca.crt -subj \
  "/C=US/ST=State/L=City/O=Company/OU=IT/CN=OLicense-CA"

# Set appropriate permissions
sudo chmod 600 /opt/olicense/ssl/*.key
sudo chmod 644 /opt/olicense/ssl/*.crt
sudo chown -R olicense:olicense /opt/olicense/ssl/
```

### Service Configuration

```bash
# Create systemd service for OLicense
sudo tee /etc/systemd/system/olicense.service <<'EOF'
[Unit]
Description=OLicense Server
Documentation=https://docs.optimalcomputing.com/olicense/
After=network.target postgresql.service

[Service]
Type=forking
User=olicense
Group=olicense
WorkingDirectory=/opt/olicense
ExecStartPre=/opt/olicense/bin/olicense-check-config
ExecStart=/opt/olicense/bin/olicense-server --daemon --config=/opt/olicense/config/olicense.conf
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/opt/olicense/bin/olicense-server --stop
PIDFile=/opt/olicense/olicense.pid
Restart=always
RestartSec=10
LimitNOFILE=65536
LimitNPROC=32768

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/opt/olicense/logs /opt/olicense/data /opt/olicense/config
ProtectHome=yes

# Environment variables
Environment=OLICENSE_HOME=/opt/olicense
Environment=OLICENSE_CONFIG=/opt/olicense/config/olicense.conf
Environment=JAVA_OPTS="-Xmx4g -Xms2g -XX:+UseG1GC"

[Install]
WantedBy=multi-user.target
EOF

# Enable and start OLicense service
sudo systemctl daemon-reload
sudo systemctl enable olicense
sudo systemctl start olicense

# Check service status
sudo systemctl status olicense
```

## Vantage Integration Setup

### Configure Vantage Connection

```bash
# Register OLicense server with Vantage
vantage licenses add-server olicense-production \
  --type olicense \
  --hostname olicense.company.com \
  --port 5053 \
  --api-port 8080 \
  --admin-port 8443 \
  --ssl-enabled \
  --api-key "your-olicense-api-key" \
  --description "Production OLicense server"

# Configure authentication
vantage licenses configure-auth olicense-production \
  --auth-type token \
  --api-token "secure-api-token-here" \
  --ssl-verify true \
  --ssl-cert-path /opt/olicense/ssl/ca.crt

# Set up data synchronization
vantage licenses configure-sync olicense-production \
  --sync-interval 60 \
  --sync-usage-data \
  --sync-feature-data \
  --sync-user-data \
  --enable-real-time-events

# Configure monitoring
vantage licenses configure-monitoring olicense-production \
  --enable-health-checks \
  --health-check-interval 30 \
  --enable-performance-monitoring \
  --enable-usage-analytics \
  --enable-cost-tracking
```

### Advanced Integration Features

```python
import textwrap

def create_vantage_integration_config():
    """Create advanced Vantage integration configuration."""
    
    integration_config = textwrap.dedent("""
        # Vantage-OLicense Integration Configuration
        # /opt/olicense/config/vantage-integration.conf
        
        [vantage_connection]
        # Vantage API connection
        api_endpoint = https://api.vantage.company.com/v2
        api_key = vantage_api_key_here
        api_secret = vantage_api_secret_here
        timeout = 30
        retry_attempts = 3
        retry_delay = 5
        
        # SSL configuration
        ssl_verify = true
        ssl_cert_bundle = /opt/olicense/ssl/vantage-ca-bundle.crt
        ssl_client_cert = /opt/olicense/ssl/vantage-client.crt
        ssl_client_key = /opt/olicense/ssl/vantage-client.key
        
        [data_synchronization]
        # Sync settings
        sync_interval = 60  # seconds
        batch_size = 1000
        max_retries = 5
        enable_compression = true
        
        # Data types to sync
        sync_license_usage = true
        sync_user_sessions = true
        sync_feature_data = true
        sync_cost_data = true
        sync_performance_metrics = true
        sync_audit_logs = true
        
        # Real-time events
        enable_real_time_events = true
        event_buffer_size = 10000
        event_flush_interval = 10
        
        [analytics_integration]
        # Usage analytics
        enable_usage_analytics = true
        analytics_granularity = hourly
        historical_data_retention = 2years
        
        # Cost analytics
        enable_cost_analytics = true
        cost_allocation_method = actual_usage
        chargeback_enabled = true
        department_mapping = ldap_group_based
        
        # Predictive analytics
        enable_predictive_models = true
        ml_model_types = usage_forecasting,cost_optimization,license_rightsizing
        model_update_frequency = weekly
        
        [optimization_features]
        # License optimization
        enable_auto_optimization = true
        optimization_algorithms = usage_based,cost_based,fairness_based
        optimization_frequency = daily
        optimization_window = 30days
        
        # Alert integration
        enable_vantage_alerts = true
        alert_escalation = true
        alert_channels = email,slack,teams,webhook
        
        # Reporting integration
        enable_automated_reports = true
        report_frequency = weekly,monthly,quarterly
        report_recipients = license-admins@company.com,management@company.com
        
        [custom_integrations]
        # Webhook integrations
        enable_webhooks = true
        webhook_endpoints = [
            {
                "url": "https://monitoring.company.com/olicense/events",
                "events": ["license_checkout", "license_checkin", "user_login"],
                "auth_type": "bearer_token",
                "auth_value": "webhook_token_here"
            },
            {
                "url": "https://billing.company.com/license/usage",
                "events": ["usage_data", "cost_data"],
                "auth_type": "api_key",
                "auth_value": "billing_api_key_here"
            }
        ]
        
        # API integration
        enable_custom_apis = true
        api_rate_limit = 1000/hour
        api_authentication = oauth2
        
        [performance_optimization]
        # Caching
        enable_caching = true
        cache_size = 1GB
        cache_ttl = 3600  # 1 hour
        cache_type = redis
        redis_host = redis.company.com
        redis_port = 6379
        redis_password = redis_password_here
        
        # Database optimization
        enable_connection_pooling = true
        pool_size = 50
        pool_max_overflow = 100
        enable_query_optimization = true
        query_timeout = 30
        
        # Network optimization
        enable_compression = true
        compression_level = 6
        tcp_keepalive = true
        tcp_nodelay = true
        """).strip()
    
    return integration_config

# Generate integration configuration
integration_content = create_vantage_integration_config()
print("Vantage integration configuration ready")
```

## License File Management

### License File Installation

```bash
# Install OLicense license files
sudo -u olicense mkdir -p /opt/olicense/licenses/{production,development,backup}

# Example license file installation
sudo -u olicense tee /opt/olicense/licenses/production/matlab.lic <<'EOF'
# MATLAB License File for OLicense
FEATURE MATLAB mathworks 2024.0607 permanent uncounted \
    VENDOR_STRING="MATLAB_R2023b" HOSTID=ANY TS_OK \
    SIGN="A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0"

FEATURE Statistics_Toolbox mathworks 2024.0607 permanent 20 \
    VENDOR_STRING="Statistics_and_Machine_Learning_Toolbox" \
    HOSTID=ANY TS_OK \
    SIGN="B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1"

FEATURE Signal_Toolbox mathworks 2024.0607 permanent 25 \
    VENDOR_STRING="Signal_Processing_Toolbox" \
    HOSTID=ANY TS_OK \
    SIGN="C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2"
EOF

# Validate license files
sudo -u olicense /opt/olicense/bin/olicense-validate -license /opt/olicense/licenses/production/matlab.lic

# Set up license file monitoring
sudo -u olicense tee /opt/olicense/bin/monitor-licenses.sh <<'EOF'
#!/bin/bash
# Monitor OLicense license files for changes and expiration

LICENSE_DIR="/opt/olicense/licenses/production"
LOG_FILE="/opt/olicense/logs/license-monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_license_expiration() {
    local license_file="$1"
    
    # Extract expiration dates from license file
    local expiry_dates=$(grep -E "permanent|[0-9]{2}-[a-z]{3}-[0-9]{4}" "$license_file" | \
                        grep -v permanent | \
                        grep -oE "[0-9]{2}-[a-z]{3}-[0-9]{4}")
    
    if [ -n "$expiry_dates" ]; then
        while read -r expiry_date; do
            # Convert to epoch time for comparison
            local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null)
            local current_epoch=$(date +%s)
            local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
            
            if [ "$days_until_expiry" -le 30 ] && [ "$days_until_expiry" -gt 0 ]; then
                log_message "WARNING: License in $license_file expires in $days_until_expiry days"
            elif [ "$days_until_expiry" -le 0 ]; then
                log_message "CRITICAL: License in $license_file has expired"
            fi
        done <<< "$expiry_dates"
    fi
}

# Check all license files
for license_file in "$LICENSE_DIR"/*.lic; do
    if [ -f "$license_file" ]; then
        log_message "Checking license file: $license_file"
        
        # Validate license file syntax
        if /opt/olicense/bin/olicense-validate -license "$license_file" >/dev/null 2>&1; then
            log_message "License file validation: PASS"
            check_license_expiration "$license_file"
        else
            log_message "License file validation: FAIL"
        fi
    fi
done

log_message "License monitoring check completed"
EOF

sudo chmod +x /opt/olicense/bin/monitor-licenses.sh

# Schedule regular license monitoring
echo "0 6 * * * /opt/olicense/bin/monitor-licenses.sh" | sudo -u olicense crontab -
```

## Firewall and Network Configuration

### Firewall Rules

```bash
# Configure firewall for OLicense
# RHEL/CentOS/Rocky Linux with firewalld
sudo firewall-cmd --permanent --add-port=5053/tcp  # OLicense server port
sudo firewall-cmd --permanent --add-port=8080/tcp  # API port
sudo firewall-cmd --permanent --add-port=8443/tcp  # Admin web interface
sudo firewall-cmd --permanent --add-port=9090/tcp  # Prometheus metrics
sudo firewall-cmd --reload

# Ubuntu/Debian with ufw
sudo ufw allow 5053/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8443/tcp
sudo ufw allow 9090/tcp

# Advanced firewall rules for specific networks
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.0/8" port protocol="tcp" port="5053" accept'
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.0.0/16" port protocol="tcp" port="8080" accept'
```

### Network Performance Tuning

```bash
# Optimize network settings for OLicense
sudo tee -a /etc/sysctl.conf <<'EOF'
# OLicense network optimizations
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr
net.ipv4.tcp_slow_start_after_idle = 0
EOF

sudo sysctl -p
```

## Testing and Validation

### Server Functionality Tests

```bash
# Create comprehensive OLicense testing script
sudo -u olicense tee /opt/olicense/bin/test-server.sh <<'EOF'
#!/bin/bash
# OLicense Server Testing Script

TEST_LOG="/opt/olicense/logs/server-test.log"

log_test() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - TEST: $1" | tee -a "$TEST_LOG"
}

# Test 1: Server connectivity
log_test "Testing OLicense server connectivity"
if curl -k -s https://localhost:8443/health >/dev/null; then
    log_test "Server connectivity: PASS"
else
    log_test "Server connectivity: FAIL"
fi

# Test 2: Database connectivity
log_test "Testing database connectivity"
if /opt/olicense/bin/olicense-admin --test-database >/dev/null 2>&1; then
    log_test "Database connectivity: PASS"
else
    log_test "Database connectivity: FAIL"
fi

# Test 3: License file validation
log_test "Testing license file validation"
license_files_valid=true
for license_file in /opt/olicense/licenses/production/*.lic; do
    if [ -f "$license_file" ]; then
        if ! /opt/olicense/bin/olicense-validate -license "$license_file" >/dev/null 2>&1; then
            log_test "License file validation FAILED: $license_file"
            license_files_valid=false
        fi
    fi
done

if $license_files_valid; then
    log_test "License file validation: PASS"
else
    log_test "License file validation: FAIL"
fi

# Test 4: API functionality
log_test "Testing API functionality"
api_key="your-api-key-here"
if curl -k -s -H "Authorization: Bearer $api_key" \
   https://localhost:8080/api/v1/licenses >/dev/null; then
    log_test "API functionality: PASS"
else
    log_test "API functionality: FAIL"
fi

# Test 5: Feature checkout/checkin
log_test "Testing feature checkout/checkin"
if /opt/olicense/bin/olicense-client --checkout matlab_core --user testuser >/dev/null 2>&1; then
    log_test "Feature checkout: PASS"
    
    if /opt/olicense/bin/olicense-client --checkin matlab_core --user testuser >/dev/null 2>&1; then
        log_test "Feature checkin: PASS"
    else
        log_test "Feature checkin: FAIL"
    fi
else
    log_test "Feature checkout: FAIL"
fi

log_test "OLicense server testing completed"
EOF

sudo chmod +x /opt/olicense/bin/test-server.sh

# Run initial tests
sudo -u olicense /opt/olicense/bin/test-server.sh
```

### Performance Benchmarking

```python
import textwrap
import subprocess
import time

def create_performance_benchmark():
    """Create OLicense performance benchmarking script."""
    
    benchmark_script = textwrap.dedent("""
        #!/bin/bash
        # OLicense Performance Benchmarking Script
        
        BENCHMARK_LOG="/opt/olicense/logs/performance-benchmark.log"
        CONCURRENT_USERS="1 5 10 20 50 100"
        TEST_DURATION=60  # seconds
        
        log_benchmark() {
            echo "$(date '+%Y-%m-%d %H:%M:%S') - BENCHMARK: $1" | tee -a "$BENCHMARK_LOG"
        }
        
        # Function to test license operations
        test_license_operations() {
            local num_users=$1
            local duration=$2
            
            log_benchmark "Testing with $num_users concurrent users for ${duration}s"
            
            # Start background processes to simulate concurrent users
            for ((i=1; i<=num_users; i++)); do
                {
                    local start_time=$(date +%s)
                    local end_time=$((start_time + duration))
                    local operations=0
                    
                    while [ $(date +%s) -lt $end_time ]; do
                        # Checkout license
                        if /opt/olicense/bin/olicense-client --checkout matlab_core --user "user$i" >/dev/null 2>&1; then
                            # Brief usage simulation
                            sleep 0.1
                            
                            # Checkin license
                            if /opt/olicense/bin/olicense-client --checkin matlab_core --user "user$i" >/dev/null 2>&1; then
                                operations=$((operations + 1))
                            fi
                        fi
                        
                        sleep 0.5  # Brief pause between operations
                    done
                    
                    echo "User $i completed $operations operations"
                } &
            done
            
            # Wait for all background processes to complete
            wait
            
            # Calculate performance metrics
            local total_time=$duration
            local avg_response_time=$(curl -s -k "https://localhost:8080/api/v1/metrics/response_time" | jq '.average')
            local total_operations=$(curl -s -k "https://localhost:8080/api/v1/metrics/operations" | jq '.total')
            
            log_benchmark "Results for $num_users users:"
            log_benchmark "  Total operations: $total_operations"
            log_benchmark "  Operations per second: $((total_operations / duration))"
            log_benchmark "  Average response time: ${avg_response_time}ms"
            
            # Brief cooldown
            sleep 10
        }
        
        log_benchmark "Starting OLicense performance benchmark"
        
        # Test with different user loads
        for users in $CONCURRENT_USERS; do
            test_license_operations "$users" "$TEST_DURATION"
        done
        
        log_benchmark "Performance benchmark completed"
        """).strip()
    
    return benchmark_script

# Create performance benchmark
benchmark_content = create_performance_benchmark()
print("Performance benchmark script ready")
```

## Next Steps

With OLicense server successfully installed and configured, proceed to:

- **[Monitoring & Analytics](/platform/licenses/how-to-guides/olicense/monitoring)**: Set up comprehensive monitoring
- **[High Availability](/platform/licenses/how-to-guides/olicense/high-availability)**: Configure clustering and disaster recovery
- **[Troubleshooting](/platform/licenses/how-to-guides/olicense/troubleshooting)**: Learn to resolve common issues

---

> **Setup Best Practice**: OLicense requires careful attention to database configuration and performance tuning for optimal operation in enterprise environments. The combination of proper SSL configuration, database optimization, and Vantage integration provides a robust foundation for enterprise license management. Regular testing and monitoring of the setup ensures reliable operation and early detection of potential issues.
