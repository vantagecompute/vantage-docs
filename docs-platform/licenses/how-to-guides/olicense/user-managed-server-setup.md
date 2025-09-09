---
id: olicense-ls-dyna-user-managed-server-setup
title: User-Managed OLicense Server Setup
sidebar_position: 2
description: Set up and configure your own OLicense server for integration with Vantage License Manager.
---

This guide walks you through setting up your own OLicense (Open License Server) that will integrate with Vantage License Manager. OLicense provides modern, cloud-ready license management with advanced features for enterprise software licensing.

## Prerequisites

Before setting up your OLicense server, ensure you have:

- **License Files**: Valid OLicense license files from your software vendor
- **Server Hardware**: Dedicated server or virtual machine meeting requirements
- **Network Access**: Connectivity between your OLicense server and Vantage infrastructure
- **Administrative Access**: Root/administrator privileges on the target server
- **SSL Certificates**: SSL certificates for secure communication
- **Database**: PostgreSQL or MySQL database for license tracking

## Supported Operating Systems

OLicense servers can be deployed on:

- **Linux**: RHEL 7/8/9, CentOS 7/8, Ubuntu 18.04/20.04/22.04, SUSE Linux
- **Windows**: Windows Server 2016/2019/2022, Windows 10/11
- **macOS**: macOS 10.15+ (for development environments)
- **Docker**: Container deployment with official OLicense images
- **Kubernetes**: Orchestrated deployment with Helm charts

## Installation Steps

### 1. Download OLicense Software

```bash
# Download OLicense from vendor portal
wget https://releases.olicense.com/latest/olicense-server-linux-x64.tar.gz
tar -xzf olicense-server-linux-x64.tar.gz
cd olicense-server
```

### 2. Install Database Prerequisites

#### PostgreSQL Installation

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create OLicense database
sudo -u postgres createuser olicense
sudo -u postgres createdb olicense_db
sudo -u postgres psql -c "ALTER USER olicense PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE olicense_db TO olicense;"
```

#### MySQL Installation

```bash
# Install MySQL
sudo apt install mysql-server

# Create OLicense database
sudo mysql -e "CREATE DATABASE olicense_db;"
sudo mysql -e "CREATE USER 'olicense'@'localhost' IDENTIFIED BY 'secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON olicense_db.* TO 'olicense'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 3. Install OLicense Server

```bash
# Create OLicense directory structure
sudo mkdir -p /opt/olicense/server
sudo mkdir -p /opt/olicense/licenses
sudo mkdir -p /opt/olicense/config
sudo mkdir -p /opt/olicense/logs

# Copy OLicense binaries
sudo cp olicense-server /opt/olicense/server/
sudo cp olicense-admin /opt/olicense/server/
sudo cp olicense-client /opt/olicense/server/

# Set executable permissions
sudo chmod +x /opt/olicense/server/*

# Create olicense user
sudo useradd -r -s /bin/false olicense
sudo chown -R olicense:olicense /opt/olicense/
```

### 4. Configure OLicense Server

```bash
# Create OLicense server configuration
sudo cat > /opt/olicense/config/olicense.conf << EOF
# OLicense Server Configuration
[server]
bind_address = 0.0.0.0
port = 7000
ssl_port = 7443
web_port = 8080
ssl_web_port = 8443

[database]
type = postgresql
host = localhost
port = 5432
database = olicense_db
username = olicense
password = secure_password
connection_pool_size = 20

[licensing]
license_path = /opt/olicense/licenses
license_cache_size = 1000
license_refresh_interval = 300
concurrent_limit = unlimited

[logging]
log_level = INFO
log_file = /opt/olicense/logs/olicense.log
audit_log = /opt/olicense/logs/audit.log
access_log = /opt/olicense/logs/access.log
log_rotation = daily
log_retention_days = 30

[security]
ssl_enabled = true
ssl_cert = /opt/olicense/config/server.crt
ssl_key = /opt/olicense/config/server.key
authentication_required = true
session_timeout = 3600

[performance]
max_connections = 1000
connection_timeout = 300
heartbeat_interval = 30
cache_enabled = true
compression_enabled = true
EOF
```

### 5. Generate SSL Certificates

```bash
# Generate self-signed certificate
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/olicense/config/server.key -out /opt/olicense/config/server.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=olicense-server"

# Set appropriate permissions
sudo chown olicense:olicense /opt/olicense/config/server.*
sudo chmod 600 /opt/olicense/config/server.key
sudo chmod 644 /opt/olicense/config/server.crt
```

### 6. Initialize Database

```bash
# Initialize OLicense database schema
sudo -u olicense /opt/olicense/server/olicense-admin --init-database --config /opt/olicense/config/olicense.conf

# Verify database initialization
sudo -u olicense /opt/olicense/server/olicense-admin --verify-database --config /opt/olicense/config/olicense.conf
```

### 7. Start OLicense Server

```bash
# Create systemd service file
sudo cat > /etc/systemd/system/olicense.service << EOF
[Unit]
Description=OLicense License Server
After=network.target postgresql.service

[Service]
Type=notify
User=olicense
Group=olicense
ExecStart=/opt/olicense/server/olicense-server --config /opt/olicense/config/olicense.conf
WorkingDirectory=/opt/olicense/server
Restart=always
RestartSec=10
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl start olicense
sudo systemctl enable olicense
```

## Network Configuration

### Required Ports

Configure your firewall to allow:

- **Port 7000**: OLicense server port
- **Port 7443**: OLicense SSL server port
- **Port 8080**: OLicense web interface
- **Port 8443**: OLicense SSL web interface
- **HTTPS (443)**: For Vantage integration
- **Database Port**: 5432 (PostgreSQL) or 3306 (MySQL)

### Firewall Configuration

```bash
# Configure iptables
sudo iptables -A INPUT -p tcp --dport 7000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 7443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8443 -j ACCEPT

# For firewalld
sudo firewall-cmd --permanent --add-port=7000/tcp
sudo firewall-cmd --permanent --add-port=7443/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --reload
```

## License Management

### Adding License Files

```bash
# Copy license files
sudo cp *.lic /opt/olicense/licenses/
sudo chown olicense:olicense /opt/olicense/licenses/*.lic
sudo chmod 644 /opt/olicense/licenses/*.lic

# Register licenses with OLicense server
sudo -u olicense /opt/olicense/server/olicense-admin --add-license /opt/olicense/licenses/license1.lic
sudo -u olicense /opt/olicense/server/olicense-admin --add-license /opt/olicense/licenses/license2.lic

# Verify license registration
sudo -u olicense /opt/olicense/server/olicense-admin --list-licenses
```

### License Validation

```bash
# Validate license files
sudo -u olicense /opt/olicense/server/olicense-admin --validate-licenses

# Check license status
sudo -u olicense /opt/olicense/server/olicense-admin --license-status

# Test license checkout
sudo -u olicense /opt/olicense/server/olicense-client --checkout feature_name
sudo -u olicense /opt/olicense/server/olicense-client --checkin feature_name
```

## Vantage Integration

### 1. Register Server with Vantage

1. Log into your Vantage dashboard
2. Navigate to **Licenses → Servers**
3. Click **Add License Server**
4. Select **OLicense** as the server type
5. Choose **User-Managed** deployment
6. Enter server details:
   - **Server Hostname/IP**
   - **Port Number** (typically 7000)
   - **SSL Port** (typically 7443)
   - **Web Interface Port** (typically 8080)
   - **Authentication Type** (certificate or token-based)

### 2. Configure Monitoring Agent

```bash
# Download Vantage monitoring agent
curl -O https://vantage-agents.s3.amazonaws.com/license-monitor/latest/vantage-license-monitor

# Install and configure for OLicense
sudo chmod +x vantage-license-monitor
sudo ./vantage-license-monitor install --server-type olicense --server-port 7000 --ssl-enabled
```

### 3. Verify Integration

```bash
# Test OLicense server
sudo -u olicense /opt/olicense/server/olicense-admin --server-status

# Test Vantage connection
vantage-license-monitor test-connection
```

## Advanced Configuration

### High Availability Setup

```bash
# Configure high availability
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[high_availability]
enabled = true
cluster_nodes = olicense1.domain.com:7000,olicense2.domain.com:7000
node_role = primary
heartbeat_interval = 10
failover_timeout = 30
shared_storage = /shared/olicense
load_balancer = haproxy

[replication]
enabled = true
replication_mode = async
replication_lag_threshold = 5
automatic_failover = true
EOF
```

### Load Balancing with HAProxy

```bash
# Install HAProxy
sudo apt install haproxy

# Configure HAProxy for OLicense
sudo cat > /etc/haproxy/conf.d/olicense.cfg << EOF
# OLicense Load Balancer Configuration
backend olicense_servers
    balance roundrobin
    option httpchk GET /health
    server olicense1 olicense1.domain.com:7000 check
    server olicense2 olicense2.domain.com:7000 check backup

frontend olicense_frontend
    bind *:7000
    default_backend olicense_servers

backend olicense_web_servers
    balance roundrobin
    option httpchk GET /health
    server olicense1_web olicense1.domain.com:8080 check
    server olicense2_web olicense2.domain.com:8080 check backup

frontend olicense_web_frontend
    bind *:8080
    default_backend olicense_web_servers
EOF

# Restart HAProxy
sudo systemctl restart haproxy
```

## Performance Tuning

### Database Optimization

#### PostgreSQL Optimization

```bash
# Optimize PostgreSQL for OLicense
sudo cat >> /etc/postgresql/13/main/postgresql.conf << EOF
# OLicense Database Optimization
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
EOF

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### MySQL Optimization

```bash
# Optimize MySQL for OLicense
sudo cat >> /etc/mysql/mysql.conf.d/olicense.cnf << EOF
[mysqld]
# OLicense Database Optimization
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_size = 32M
max_connections = 200
thread_cache_size = 16
EOF

# Restart MySQL
sudo systemctl restart mysql
```

### Server Performance Optimization

```bash
# Update OLicense configuration for performance
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[performance_tuning]
worker_threads = 8
io_threads = 4
cache_size = 512MB
connection_pool_size = 50
keep_alive_timeout = 60
max_request_size = 10MB
compression_level = 6
enable_http2 = true

[caching]
license_cache_ttl = 300
feature_cache_ttl = 60
user_cache_ttl = 120
session_cache_ttl = 1800
EOF
```

## Security Configuration

### Authentication and Authorization

```bash
# Configure user authentication
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[authentication]
method = ldap
ldap_server = ldap://company.com
ldap_base_dn = ou=users,dc=company,dc=com
ldap_bind_dn = cn=admin,dc=company,dc=com
ldap_bind_password = admin_password
ldap_user_filter = (uid=%s)
ldap_group_filter = (memberUid=%s)

[authorization]
admin_group = olicense_admins
user_group = olicense_users
readonly_group = olicense_readonly
default_permissions = read
EOF
```

### Access Control

```bash
# Configure IP-based access control
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[access_control]
allow_networks = 192.168.1.0/24,10.0.0.0/8
deny_networks = 0.0.0.0/0
rate_limiting = true
max_requests_per_minute = 1000
blacklist_threshold = 10
blacklist_duration = 3600
EOF
```

### API Security

```bash
# Configure API security
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[api_security]
api_key_required = true
api_key_header = X-OLicense-API-Key
jwt_enabled = true
jwt_secret = your_jwt_secret_key
jwt_expiration = 3600
cors_enabled = true
cors_origins = https://vantage.io
EOF
```

## Monitoring and Logging

### Enhanced Logging Configuration

```bash
# Configure comprehensive logging
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[logging_advanced]
structured_logging = true
log_format = json
include_request_id = true
include_user_context = true
sensitive_data_masking = true

[metrics]
prometheus_enabled = true
prometheus_port = 9090
statsd_enabled = false
custom_metrics = true
EOF
```

### Log Rotation

```bash
# Create logrotate configuration
sudo cat > /etc/logrotate.d/olicense << EOF
/opt/olicense/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 640 olicense olicense
    postrotate
        /bin/systemctl reload olicense
    endscript
}
EOF
```

### Real-time Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor OLicense processes
htop -p $(pgrep olicense-server)

# Monitor database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='olicense_db';"

# Monitor network connections
netstat -tuln | grep -E '7000|8080'
```

## Web Interface Management

### Access Web Interface

1. Open browser to `https://your-server:8443`
2. Log in with administrator credentials
3. Configure server settings through web interface
4. Monitor license usage and server status

### Web Interface Configuration

```bash
# Configure web interface settings
sudo cat >> /opt/olicense/config/olicense.conf << EOF
[web_interface]
theme = default
language = en
timezone = UTC
session_timeout = 1800
auto_refresh_interval = 30
show_debug_info = false
enable_api_browser = true
custom_css = /opt/olicense/config/custom.css
EOF
```

## Backup and Recovery

### Automated Backup

```bash
# Create backup script
sudo cat > /opt/olicense/backup-olicense.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/olicense"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup configuration
tar -czf $BACKUP_DIR/olicense-config-$DATE.tar.gz /opt/olicense/config/

# Backup licenses
tar -czf $BACKUP_DIR/olicense-licenses-$DATE.tar.gz /opt/olicense/licenses/

# Backup database
sudo -u postgres pg_dump olicense_db > $BACKUP_DIR/olicense-db-$DATE.sql

# Backup logs
tar -czf $BACKUP_DIR/olicense-logs-$DATE.tar.gz /opt/olicense/logs/

# Cleanup old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

sudo chmod +x /opt/olicense/backup-olicense.sh

# Schedule backup
echo "0 2 * * * root /opt/olicense/backup-olicense.sh" | sudo tee -a /etc/crontab
```

### Disaster Recovery

```bash
# Create disaster recovery script
sudo cat > /opt/olicense/restore-olicense.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/olicense"
RESTORE_DATE=$1

if [ -z "$RESTORE_DATE" ]; then
    echo "Usage: $0 <backup_date>"
    exit 1
fi

# Stop OLicense server
sudo systemctl stop olicense

# Restore configuration
tar -xzf $BACKUP_DIR/olicense-config-$RESTORE_DATE.tar.gz -C /

# Restore licenses
tar -xzf $BACKUP_DIR/olicense-licenses-$RESTORE_DATE.tar.gz -C /

# Restore database
sudo -u postgres dropdb olicense_db
sudo -u postgres createdb olicense_db
sudo -u postgres psql olicense_db < $BACKUP_DIR/olicense-db-$RESTORE_DATE.sql

# Set permissions
sudo chown -R olicense:olicense /opt/olicense/

# Start OLicense server
sudo systemctl start olicense

echo "Restore completed for date: $RESTORE_DATE"
EOF

sudo chmod +x /opt/olicense/restore-olicense.sh
```

## Troubleshooting

### Common Issues

#### Server Startup Problems

```bash
# Check configuration syntax
sudo -u olicense /opt/olicense/server/olicense-server --config /opt/olicense/config/olicense.conf --test-config

# Verify database connectivity
sudo -u olicense /opt/olicense/server/olicense-admin --test-database --config /opt/olicense/config/olicense.conf

# Check system logs
sudo journalctl -u olicense -f
```

#### License Checkout Failures

```bash
# Check license availability
sudo -u olicense /opt/olicense/server/olicense-admin --license-status

# Verify network connectivity
telnet olicense-server 7000

# Review server logs
sudo tail -f /opt/olicense/logs/olicense.log
```

#### Database Connection Issues

```bash
# Test database connection
sudo -u olicense psql -h localhost -U olicense -d olicense_db -c "SELECT version();"

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log

# Monitor database connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='olicense_db';"
```

## Docker Deployment

### Container Setup

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create olicense user
RUN useradd -r -s /bin/false olicense

# Copy OLicense server
COPY olicense-server/ /opt/olicense/server/
COPY olicense.conf /opt/olicense/config/
COPY licenses/ /opt/olicense/licenses/

# Set permissions
RUN chown -R olicense:olicense /opt/olicense/ && \
    chmod +x /opt/olicense/server/*

# Expose ports
EXPOSE 7000 7443 8080 8443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start OLicense server
USER olicense
WORKDIR /opt/olicense/server
CMD ["./olicense-server", "--config", "/opt/olicense/config/olicense.conf"]
EOF

# Build and run container
docker build -t olicense-server .
docker run -d -p 7000:7000 -p 8080:8080 --name olicense-server olicense-server
```

### Kubernetes Deployment

```yaml
# Create Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: olicense-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: olicense-server
  template:
    metadata:
      labels:
        app: olicense-server
    spec:
      containers:
      - name: olicense-server
        image: olicense-server:latest
        ports:
        - containerPort: 7000
        - containerPort: 8080
        env:
        - name: DATABASE_HOST
          value: "postgresql-service"
        volumeMounts:
        - name: config
          mountPath: /opt/olicense/config
        - name: licenses
          mountPath: /opt/olicense/licenses
      volumes:
      - name: config
        configMap:
          name: olicense-config
      - name: licenses
        secret:
          secretName: olicense-licenses
---
apiVersion: v1
kind: Service
metadata:
  name: olicense-service
spec:
  selector:
    app: olicense-server
  ports:
  - name: license-port
    port: 7000
    targetPort: 7000
  - name: web-port
    port: 8080
    targetPort: 8080
  type: LoadBalancer
```

## Next Steps

After setting up your user-managed OLicense server:

1. **Application Integration**: Configure client applications to use OLicense
2. **Monitoring Setup**: Implement comprehensive monitoring and alerting
3. **High Availability**: Configure redundant servers for production
4. **Performance Optimization**: Monitor and optimize server performance
5. **Security Hardening**: Implement additional security measures

For advanced OLicense features and enterprise configurations, contact your OLicense vendor or see additional documentation in the Vantage dashboard.
