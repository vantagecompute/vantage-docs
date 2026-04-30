---
id: compute-providers-self-hosted-setup
sidebar_position: 1
title: Self Hosted Setup
description: Step-by-step guide to setting up a self-hosted Vantage Compute instance.
---

# Self Hosted Setup

Complete guide to setting up and deploying your own Vantage Compute instance in your environment.

## Prerequisites Checklist

Before beginning the setup process, ensure you have:

### Infrastructure Requirements
- **Compute Resources**: 
  - Minimum: 4 vCPU, 16 GB RAM, 100 GB storage
  - Recommended: 8 vCPU, 32 GB RAM, 500 GB storage
- **Network Access**: Reliable internet connection with sufficient bandwidth
- **SSL Certificate**: Valid SSL certificate for HTTPS access
- **Domain Name**: Registered domain name for the Vantage instance

### Software Dependencies
- **Container Platform**: Docker 20.10+ or Kubernetes 1.20+
- **Database**: PostgreSQL 12+ (recommended) or MySQL 8.0+
- **Web Server**: Nginx 1.18+ or Apache 2.4+
- **Operating System**: Linux (Ubuntu 20.04+, CentOS 8+, or RHEL 8+)

### Access and Permissions
- **Administrative Access**: Root or sudo access to target servers
- **Network Configuration**: Ability to configure firewalls and load balancers
- **DNS Management**: Access to configure DNS records
- **Certificate Management**: Ability to install and manage SSL certificates

## Setup Methods

### Method 1: Docker Compose (Recommended for Single Instance)

#### Step 1: Download and Prepare
```bash
# Download Vantage Compute Docker Compose files
curl -O https://releases.vantagecompute.ai/docker-compose.yml
curl -O https://releases.vantagecompute.ai/.env.example

# Copy and customize environment file
cp .env.example .env
```

#### Step 2: Configure Environment
Edit the `.env` file with your specific configuration:

```bash
# Basic Configuration
VANTAGE_DOMAIN=your-domain.com
VANTAGE_EMAIL=admin@your-domain.com
VANTAGE_SECRET_KEY=your-secret-key-here

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=vantage
DB_USER=vantage
DB_PASSWORD=secure-password-here

# Storage Configuration
DATA_PATH=/opt/vantage/data
LOGS_PATH=/opt/vantage/logs

# Security Configuration
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/key.pem
```

#### Step 3: Deploy Services
```bash
# Create data directories
sudo mkdir -p /opt/vantage/{data,logs}
sudo chown -R $USER:$USER /opt/vantage

# Start services
docker-compose up -d

# Verify services are running
docker-compose ps
```

#### Step 4: Initialize Database
```bash
# Run database migrations
docker-compose exec api python manage.py migrate

# Create admin user
docker-compose exec api python manage.py createsuperuser
```

### Method 2: Kubernetes Deployment

#### Step 1: Prepare Kubernetes Cluster
```bash
# Verify cluster access
kubectl cluster-info

# Create namespace
kubectl create namespace vantage-compute
```

#### Step 2: Configure Secrets and ConfigMaps
```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: vantage-secrets
  namespace: vantage-compute
type: Opaque
data:
  secret-key: <base64-encoded-secret-key>
  db-password: <base64-encoded-db-password>
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: vantage-config
  namespace: vantage-compute
data:
  domain: "your-domain.com"
  db-host: "postgres"
  db-name: "vantage"
  db-user: "vantage"
```

#### Step 3: Deploy Database
```yaml
# postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: vantage-compute
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        env:
        - name: POSTGRES_DB
          value: vantage
        - name: POSTGRES_USER
          value: vantage
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: vantage-secrets
              key: db-password
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-data
        persistentVolumeClaim:
          claimName: postgres-pvc
```

#### Step 4: Deploy Vantage Services
```yaml
# vantage-api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vantage-api
  namespace: vantage-compute
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vantage-api
  template:
    metadata:
      labels:
        app: vantage-api
    spec:
      containers:
      - name: api
        image: vantagecompute/api:latest
        env:
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: vantage-secrets
              key: secret-key
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: vantage-config
              key: db-host
        ports:
        - containerPort: 8000
```

### Method 3: Manual Installation

#### Step 1: Install Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip postgresql nginx redis-server

# CentOS/RHEL
sudo yum install python3 python3-pip postgresql-server nginx redis
```

#### Step 2: Configure Database
```bash
# Initialize PostgreSQL
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE vantage;
CREATE USER vantage WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE vantage TO vantage;
\q
```

#### Step 3: Install Vantage Compute
```bash
# Create user and directories
sudo useradd -r -s /bin/false vantage
sudo mkdir -p /opt/vantage/{app,data,logs}
sudo chown -R vantage:vantage /opt/vantage

# Download and install application
cd /opt/vantage/app
sudo -u vantage wget https://releases.vantagecompute.ai/vantage-latest.tar.gz
sudo -u vantage tar -xzf vantage-latest.tar.gz

# Install Python dependencies
sudo -u vantage pip3 install -r requirements.txt
```

## Configuration

### Environment Configuration
Create `/opt/vantage/app/.env`:

```bash
# Application Settings
DEBUG=False
ALLOWED_HOSTS=your-domain.com
SECRET_KEY=your-secret-key-here

# Database Settings
DATABASE_URL=postgresql://vantage:password@localhost:5432/vantage

# Cache Settings
REDIS_URL=redis://localhost:6379/0

# Storage Settings
MEDIA_ROOT=/opt/vantage/data/media
STATIC_ROOT=/opt/vantage/data/static

# Logging Settings
LOG_LEVEL=INFO
LOG_FILE=/opt/vantage/logs/vantage.log

# Email Settings (optional)
EMAIL_HOST=smtp.your-domain.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@your-domain.com
EMAIL_HOST_PASSWORD=email-password
```

### Web Server Configuration
Nginx configuration (`/etc/nginx/sites-available/vantage`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    client_max_body_size 100M;

    location / {
        proxy_pass http\://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /opt/vantage/data/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /opt/vantage/data/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Systemd Service Configuration
Create `/etc/systemd/system/vantage.service`:

```ini
[Unit]
Description=Vantage Compute API Server
After=network.target postgresql.service redis.service

[Service]
Type=forking
User=vantage
Group=vantage
WorkingDirectory=/opt/vantage/app
Environment=DJANGO_SETTINGS_MODULE=vantage.settings.production
ExecStart=/usr/local/bin/gunicorn --daemon --bind 127.0.0.1:8000 --workers 4 vantage.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Initial Setup and Configuration

### Database Migration and Setup
```bash
# Run database migrations
python manage.py migrate

# Create static files
python manage.py collectstatic --noinput

# Create superuser account
python manage.py createsuperuser
```

### Firewall Configuration
```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (adjust port as needed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw --force enable
```

### SSL Certificate Setup
```bash
# Using Let's Encrypt (recommended)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# Or install custom certificate
sudo cp your-cert.pem /etc/ssl/certs/vantage.crt
sudo cp your-key.pem /etc/ssl/private/vantage.key
sudo chmod 600 /etc/ssl/private/vantage.key
```

## Verification and Testing

### Service Health Checks
```bash
# Check service status
systemctl status vantage
systemctl status nginx
systemctl status postgresql

# Check logs
journalctl -u vantage -f
tail -f /opt/vantage/logs/vantage.log
```

### Functionality Testing
1. **Web Interface**: Access https://your-domain.com and verify login
2. **API Endpoints**: Test API endpoints for proper responses
3. **Database Connectivity**: Verify database operations work correctly
4. **File Uploads**: Test file upload and download functionality

### Performance Testing
```bash
# Test concurrent connections
ab -n 100 -c 10 https://your-domain.com/api/health/

# Monitor resource usage
htop
iostat 1
```

## Security Hardening

### System Security
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Disable unnecessary services
sudo systemctl disable apache2  # if not needed
sudo systemctl disable sendmail  # if not needed
```

### Application Security
1. **Change Default Passwords**: Ensure all default passwords are changed
2. **Enable Two-Factor Authentication**: Configure 2FA for admin accounts
3. **Configure Rate Limiting**: Implement API rate limiting
4. **Setup Monitoring**: Configure security monitoring and alerting

### Network Security
1. **Firewall Rules**: Configure restrictive firewall rules
2. **VPN Access**: Consider VPN for administrative access
3. **Network Segmentation**: Isolate Vantage from other systems
4. **Intrusion Detection**: Setup intrusion detection system

## Backup and Recovery

### Database Backup
```bash
# Create backup script
cat > /opt/vantage/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/vantage/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U vantage vantage | gzip > $BACKUP_DIR/vantage_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "vantage_*.sql.gz" -mtime +30 -delete
EOF

chmod +x /opt/vantage/backup-db.sh

# Setup cron job for daily backups
echo "0 2 * * * /opt/vantage/backup-db.sh" | sudo crontab -u vantage -
```

### Application Data Backup
```bash
# Backup configuration and data
tar -czf /opt/vantage/backups/vantage-data-$(date +%Y%m%d).tar.gz \
    /opt/vantage/app/.env \
    /opt/vantage/data/media \
    /etc/nginx/sites-available/vantage
```

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check database credentials and connectivity
2. **SSL Certificate Issues**: Verify certificate paths and permissions
3. **Static File Issues**: Run `collectstatic` and check file permissions
4. **Memory Issues**: Monitor memory usage and adjust worker processes

### Log Locations
- **Application Logs**: `/opt/vantage/logs/vantage.log`
- **Nginx Logs**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **PostgreSQL Logs**: `/var/log/postgresql/postgresql-*.log`
- **System Logs**: `journalctl -u vantage`

### Support Resources
- **Documentation**: Comprehensive setup and administration guides
- **Community Support**: User forums and community resources
- **Professional Support**: Enterprise support options
- **Professional Services**: Expert deployment assistance

## Next Steps

After successful setup:

1. **Configure Monitoring**: Setup comprehensive monitoring and alerting
2. **User Management**: Create user accounts and configure permissions
3. **Integration**: Integrate with existing enterprise systems
4. **Optimization**: Optimize performance based on usage patterns
5. **Management**: Establish ongoing management procedures

For ongoing management and maintenance, see our [Management Guide](compute-providers-self-hosted-management).
