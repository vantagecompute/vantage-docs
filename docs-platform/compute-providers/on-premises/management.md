---
id: compute-providers-self-hosted-management
sidebar_position: 2
title: Self Hosted Management
description: Ongoing management and maintenance of self-hosted Vantage Compute instances.
---

# Self Hosted Management

Comprehensive guide for ongoing management, maintenance, and optimization of your self-hosted Vantage Compute instance.

## Daily Operations

### Health Monitoring
Regular checks to ensure system health and performance:

```bash
# Check service status
sudo systemctl status vantage nginx postgresql redis

# Monitor resource usage
htop
df -h
free -h

# Check application logs
tail -f /opt/vantage/logs/vantage.log

# Monitor API health
curl -s https://your-domain.com/api/health/ | jq
```

### Performance Monitoring
Key metrics to monitor daily:

- **CPU Usage**: Should typically be under 70%
- **Memory Usage**: Monitor for memory leaks or excessive usage
- **Disk Space**: Ensure adequate free space (>20% recommended)
- **Database Performance**: Monitor query performance and connections
- **Response Times**: API and web interface response times

### Log Management
```bash
# Rotate logs to prevent disk space issues
sudo logrotate /etc/logrotate.d/vantage

# Archive old logs
find /opt/vantage/logs -name "*.log.*" -mtime +30 -exec gzip {} \;

# Clean up old compressed logs
find /opt/vantage/logs -name "*.gz" -mtime +90 -delete
```

## Weekly Maintenance

### System Updates
```bash
# Update system packages
sudo apt update && sudo apt list --upgradable
sudo apt upgrade -y

# Update Vantage Compute (if updates available)
cd /opt/vantage/app
sudo -u vantage git pull origin main
sudo -u vantage pip3 install -r requirements.txt --upgrade

# Restart services if needed
sudo systemctl restart vantage
```

### Database Maintenance
```bash
# Database vacuum and analyze
sudo -u postgres psql vantage -c "VACUUM ANALYZE;"

# Check database size and growth
sudo -u postgres psql vantage -c "SELECT pg_size_pretty(pg_database_size('vantage'));"

# Monitor slow queries
sudo -u postgres psql vantage -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

### Backup Verification
```bash
# Verify recent backups exist
ls -la /opt/vantage/backups/

# Test backup restoration (on test system)
gunzip -c /opt/vantage/backups/vantage_latest.sql.gz | psql -h test-server -U vantage vantage_test
```

## Monthly Tasks

### Capacity Planning
Review and analyze capacity metrics:

1. **Storage Growth**: Monitor data and log storage growth trends
2. **User Growth**: Track user registration and activity growth
3. **Performance Trends**: Analyze response time and throughput trends
4. **Resource Utilization**: Review CPU, memory, and disk utilization patterns

### Security Reviews
```bash
# Review user accounts and permissions
sudo -u postgres psql vantage -c "SELECT username, is_active, is_superuser, last_login FROM auth_user;"

# Check for failed login attempts
grep "authentication failed" /opt/vantage/logs/vantage.log | tail -20

# Review SSL certificate expiration
openssl x509 -in /etc/ssl/certs/vantage.crt -noout -dates

# System security updates
sudo unattended-upgrade --dry-run
```

### Performance Optimization
```bash
# Analyze database performance
sudo -u postgres psql vantage -c "SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch FROM pg_stat_user_tables WHERE seq_scan > 1000;"

# Check for missing indexes
sudo -u postgres psql vantage -c "SELECT schemaname, tablename FROM pg_stat_user_tables WHERE seq_scan > idx_scan AND seq_tup_read > 1000;"

# Optimize database if needed
sudo -u postgres psql vantage -c "REINDEX DATABASE vantage;"
```

## User Management

### Adding Users
```bash
# Create user via command line
cd /opt/vantage/app
python manage.py shell

# In Python shell:
from django.contrib.auth.models import User
user = User.objects.create_user('username', 'email@domain.com', 'password')
user.first_name = 'First'
user.last_name = 'Last'
user.save()
```

### Managing Permissions
```bash
# List all users and their permissions
python manage.py shell -c "
from django.contrib.auth.models import User
for user in User.objects.all():
    print(f'{user.username}: active={user.is_active}, staff={user.is_staff}, superuser={user.is_superuser}')
"

# Deactivate user
python manage.py shell -c "
from django.contrib.auth.models import User
user = User.objects.get(username='username')
user.is_active = False
user.save()
"
```

### Password Management
```bash
# Reset user password
python manage.py changepassword username

# Force password reset on next login
python manage.py shell -c "
from django.contrib.auth.models import User
user = User.objects.get(username='username')
user.password_reset_required = True
user.save()
"
```

## Configuration Management

### Environment Configuration
Keep track of configuration changes:

```bash
# Backup current configuration
cp /opt/vantage/app/.env /opt/vantage/backups/.env.$(date +%Y%m%d)

# Version control for configuration
cd /opt/vantage/app
git add .env
git commit -m "Configuration update: $(date)"
```

### Feature Flags and Settings
```bash
# List current settings
python manage.py shell -c "
from django.conf import settings
print('DEBUG:', settings.DEBUG)
print('ALLOWED_HOSTS:', settings.ALLOWED_HOSTS)
print('DATABASE:', settings.DATABASES['default']['NAME'])
"

# Update settings dynamically (if supported)
python manage.py shell -c "
from django.core.management import call_command
call_command('set_setting', 'feature_flag_name', 'True')
"
```

## Scaling and Optimization

### Horizontal Scaling
For high-traffic deployments:

```bash
# Add additional API servers
docker-compose scale api=3

# Configure load balancer (Nginx example)
upstream vantage_backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}
```

### Database Optimization
```bash
# Optimize PostgreSQL configuration
# Edit /etc/postgresql/14/main/postgresql.conf

# Key settings for performance:
shared_buffers = 256MB                  # 25% of RAM
effective_cache_size = 1GB              # 75% of RAM
work_mem = 4MB                          # For sorting operations
maintenance_work_mem = 64MB             # For maintenance operations
checkpoint_completion_target = 0.9      # Smooth checkpoints
wal_buffers = 16MB                      # WAL buffers
```

### Caching Configuration
```bash
# Configure Redis for caching
# Edit /etc/redis/redis.conf

maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## Monitoring and Alerting

### System Monitoring Setup
```bash
# Install monitoring tools
sudo apt install prometheus node-exporter grafana

# Configure Prometheus to scrape metrics
cat > /etc/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  
  - job_name: 'vantage'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
EOF
```

### Application Monitoring
```bash
# Custom health check script
cat > /opt/vantage/health-check.sh << 'EOF'
#!/bin/bash

# Check API health
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://your-domain.com/api/health/)
if [ "$API_STATUS" != "200" ]; then
    echo "CRITICAL: API health check failed (HTTP $API_STATUS)"
    exit 2
fi

# Check database connectivity
DB_STATUS=$(python3 -c "
import psycopg2
try:
    conn = psycopg2.connect('postgresql://vantage:password@localhost:5432/vantage')
    conn.close()
    print('OK')
except:
    print('CRITICAL')
")

if [ "$DB_STATUS" != "OK" ]; then
    echo "CRITICAL: Database connectivity failed"
    exit 2
fi

echo "OK: All health checks passed"
exit 0
EOF

chmod +x /opt/vantage/health-check.sh
```

### Alerting Setup
```bash
# Email alerting script
cat > /opt/vantage/alert.sh << 'EOF'
#!/bin/bash

ALERT_EMAIL="admin@your-domain.com"
SUBJECT="Vantage Alert: $1"
MESSAGE="$2"

echo "$MESSAGE" | mail -s "$SUBJECT" "$ALERT_EMAIL"
EOF

# Cron job for monitoring
echo "*/5 * * * * /opt/vantage/health-check.sh || /opt/vantage/alert.sh 'Health Check Failed' 'Vantage health check failed at $(date)'" | crontab -
```

## Backup and Recovery

### Automated Backup Strategy
```bash
# Enhanced backup script
cat > /opt/vantage/backup-full.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/vantage/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database backup
echo "Starting database backup..."
pg_dump -h localhost -U vantage vantage | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Application data backup
echo "Starting application data backup..."
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" \
    /opt/vantage/app/.env \
    /opt/vantage/data \
    /etc/nginx/sites-available/vantage \
    /etc/ssl/certs/vantage.crt \
    /etc/ssl/private/vantage.key

# Configuration backup
echo "Starting configuration backup..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
    /opt/vantage/app \
    /etc/systemd/system/vantage.service

# Cleanup old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed successfully: $DATE"
EOF

chmod +x /opt/vantage/backup-full.sh

# Schedule daily backups
echo "0 2 * * * /opt/vantage/backup-full.sh >> /opt/vantage/logs/backup.log 2>&1" | sudo crontab -u vantage -
```

### Disaster Recovery Procedures
```bash
# Recovery script template
cat > /opt/vantage/recover.sh << 'EOF'
#!/bin/bash

BACKUP_FILE="$1"
RECOVERY_DATE=$(date +%Y%m%d_%H%M%S)

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

echo "Starting recovery from $BACKUP_FILE at $RECOVERY_DATE"

# Stop services
sudo systemctl stop vantage nginx

# Restore database
echo "Restoring database..."
gunzip -c "$BACKUP_FILE" | sudo -u postgres psql vantage

# Restart services
sudo systemctl start postgresql redis nginx vantage

# Verify recovery
sleep 10
curl -s https://your-domain.com/api/health/

echo "Recovery completed"
EOF

chmod +x /opt/vantage/recover.sh
```

## Troubleshooting

### Common Issues and Solutions

#### High CPU Usage
```bash
# Identify CPU-intensive processes
top -p $(pgrep -d',' -f vantage)

# Check for inefficient database queries
sudo -u postgres psql vantage -c "SELECT query, state, query_start FROM pg_stat_activity WHERE state = 'active';"

# Optimize if needed
python manage.py optimize_queries
```

#### Memory Issues
```bash
# Check memory usage by process
ps aux --sort=-%mem | head

# Monitor for memory leaks
free -m
cat /proc/meminfo

# Restart services if needed
sudo systemctl restart vantage
```

#### Database Performance Issues
```bash
# Check database locks
sudo -u postgres psql vantage -c "SELECT pid, usename, query, state FROM pg_stat_activity WHERE state != 'idle';"

# Analyze slow queries
sudo -u postgres psql vantage -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Run maintenance
sudo -u postgres psql vantage -c "VACUUM ANALYZE;"
```

### Log Analysis
```bash
# Search for errors
grep -i error /opt/vantage/logs/vantage.log | tail -20

# Monitor real-time logs
tail -f /opt/vantage/logs/vantage.log | grep -i "error\|warning\|critical"

# Analyze access patterns
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10
```

## Best Practices

### Security Maintenance
1. **Regular Updates**: Keep all components updated with security patches
2. **Access Reviews**: Regularly review user access and permissions
3. **Audit Logs**: Monitor and analyze security events
4. **Vulnerability Scanning**: Regular security scans and assessments

### Performance Optimization
1. **Monitor Trends**: Track performance metrics over time
2. **Capacity Planning**: Plan for growth and scaling needs
3. **Query Optimization**: Regularly analyze and optimize database queries
4. **Caching Strategy**: Implement appropriate caching mechanisms

### Operational Excellence
1. **Documentation**: Maintain up-to-date operational documentation
2. **Change Management**: Follow formal change control processes
3. **Incident Response**: Have procedures for handling incidents
4. **Recovery Testing**: Regularly test backup and recovery procedures

## Professional Services

For complex management needs, consider professional services:

- **Managed Services**: Fully managed hosting and maintenance
- **Consulting**: Optimization and architecture consulting
- **Support**: 24/7 technical support and monitoring
- **Training**: Advanced administrator training programs

For immediate assistance or professional services, contact our support team through your enterprise portal or sales representative.
