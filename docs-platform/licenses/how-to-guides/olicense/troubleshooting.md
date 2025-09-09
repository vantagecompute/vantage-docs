---
id: olicense-troubleshooting
title: Troubleshooting
sidebar_position: 5
description: Comprehensive troubleshooting guide for OLicense servers, enterprise features, and Vantage integration.
---

# OLicense Troubleshooting Guide

This comprehensive guide covers troubleshooting common issues with OLicense servers, including enterprise integration problems, database connectivity issues, clustering failures, and Vantage monitoring challenges.

## Common Issues Overview

OLicense troubleshooting typically involves these main categories:

| Issue Category | Common Symptoms | Impact Level |
|---|---|---|
| **License Server Issues** | Server startup failures, license checkout errors | High |
| **Database Connectivity** | Connection timeouts, replication lag, corruption | Critical |
| **Enterprise Integration** | LDAP authentication failures, API errors | Medium |
| **Clustering Problems** | Split-brain scenarios, failover issues, sync problems | Critical |
| **Performance Issues** | Slow responses, memory leaks, high CPU usage | Medium |
| **Vantage Integration** | Monitoring gaps, alert failures, data inconsistencies | Medium |

## License Server Issues

### Issue: OLicense Server Won't Start

**Symptoms:**
- Service fails to start
- Port binding errors
- Configuration validation failures
- License file corruption errors

**Diagnosis:**
```bash
# Check service status
systemctl status olicense
journalctl -u olicense -f

# Check configuration file syntax
/opt/olicense/bin/olicense-server --verify-config
/opt/olicense/bin/olicense-server --test-config /opt/olicense/config/olicense.conf

# Check port availability
netstat -tuln | grep 27015
lsof -i :27015

# Validate license files
/opt/olicense/bin/olicense-verify --license-file /opt/olicense/licenses/master.lic
```

**Solutions:**

1. **Fix Configuration Issues:**
```bash
# Backup current config
cp /opt/olicense/config/olicense.conf /opt/olicense/config/olicense.conf.backup

# Reset to default configuration
/opt/olicense/bin/olicense-server --generate-default-config > /opt/olicense/config/olicense.conf

# Validate configuration step by step
/opt/olicense/bin/olicense-server --validate-section SERVER
/opt/olicense/bin/olicense-server --validate-section DATABASE
/opt/olicense/bin/olicense-server --validate-section LICENSING
```

2. **Fix Port Conflicts:**
```bash
# Find process using the port
sudo lsof -i :27015
sudo kill -9 <PID>

# Or change OLicense port
sed -i 's/Port = 27015/Port = 27016/' /opt/olicense/config/olicense.conf
```

3. **Fix License File Issues:**
```bash
# Check license file permissions
ls -la /opt/olicense/licenses/
chmod 644 /opt/olicense/licenses/*.lic
chown olicense:olicense /opt/olicense/licenses/*.lic

# Validate license file integrity
/opt/olicense/bin/olicense-verify --comprehensive /opt/olicense/licenses/master.lic

# Regenerate license cache
rm -rf /opt/olicense/cache/licenses/*
/opt/olicense/bin/olicense-server --rebuild-license-cache
```

### Issue: License Checkout Failures

**Symptoms:**
- Users unable to checkout licenses
- "License server unavailable" errors
- Timeout errors during checkout
- License conflicts

**Diagnosis:**
```bash
# Check available licenses
curl -s http://localhost:8443/api/licenses/available | jq '.'

# Monitor license usage in real-time
tail -f /opt/olicense/logs/usage.log

# Test license checkout manually
/opt/olicense/bin/olicense-client --checkout --feature "MATLAB" --user "testuser"

# Check license server connectivity from client
telnet olicense-server.company.com 27015
```

**Solutions:**

1. **Fix License Pool Issues:**
```bash
# Check license pool status
curl -s http://localhost:8443/api/licenses/pool-status | jq '.'

# Recalculate license pools
curl -X POST http://localhost:8443/api/licenses/recalculate-pools

# Force release stuck licenses
curl -X POST http://localhost:8443/api/licenses/force-release \
    -H "Content-Type: application/json" \
    -d '{"feature": "MATLAB", "user": "stuck_user"}'
```

2. **Fix Client Connectivity:**
```bash
# Update client configuration
echo "SERVER=olicense-server.company.com:27015" > /opt/client/olicense.conf
echo "TIMEOUT=60" >> /opt/client/olicense.conf
echo "RETRY_COUNT=3" >> /opt/client/olicense.conf

# Test network connectivity
ping olicense-server.company.com
traceroute olicense-server.company.com
nmap -p 27015 olicense-server.company.com
```

## Database Connectivity Issues

### Issue: Database Connection Failures

**Symptoms:**
- "Cannot connect to database" errors
- License server fails to start with database errors
- Replication lag alerts
- Database timeout errors

**Diagnosis:**
```bash
# Test database connectivity
psql -h olicense-db-primary -U olicense -d olicense -c "SELECT 1;"

# Check database status
pg_isready -h olicense-db-primary -p 5432
systemctl status postgresql

# Monitor database connections
psql -h olicense-db-primary -U olicense -d olicense -c "
SELECT 
    client_addr, 
    state, 
    COUNT(*) 
FROM pg_stat_activity 
WHERE datname = 'olicense' 
GROUP BY client_addr, state;"

# Check replication status
psql -h olicense-db-primary -U olicense -d olicense -c "
SELECT 
    client_addr, 
    state, 
    sent_lsn, 
    write_lsn, 
    flush_lsn, 
    replay_lsn 
FROM pg_stat_replication;"
```

**Solutions:**

1. **Fix Connection Pool Issues:**
```bash
# Increase connection limits in PostgreSQL
echo "max_connections = 400" >> /etc/postgresql/15/main/postgresql.conf
echo "shared_buffers = 512MB" >> /etc/postgresql/15/main/postgresql.conf
systemctl restart postgresql

# Adjust OLicense connection pool
sed -i 's/ConnectionPool = 50/ConnectionPool = 100/' /opt/olicense/config/olicense.conf
systemctl restart olicense
```

2. **Fix Replication Issues:**
```bash
# Check replication lag
psql -h olicense-db-standby -U olicense -d olicense -c "
SELECT 
    CASE 
        WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() 
        THEN 0 
        ELSE EXTRACT (EPOCH FROM now() - pg_last_xact_replay_timestamp()) 
    END AS log_delay;"

# Restart replication if stuck
systemctl stop postgresql  # on standby
rm -rf /var/lib/postgresql/15/main
pg_basebackup -h olicense-db-primary -D /var/lib/postgresql/15/main -U replicator -P -W
systemctl start postgresql
```

3. **Database Performance Tuning:**
```sql
-- Optimize for OLicense workload
-- Execute on primary database

-- Update table statistics
ANALYZE license_usage;
ANALYZE license_servers;
ANALYZE user_sessions;

-- Rebuild indexes if fragmented
REINDEX INDEX CONCURRENTLY idx_licenses_status_user;
REINDEX INDEX CONCURRENTLY idx_licenses_feature_time;

-- Update PostgreSQL configuration
ALTER SYSTEM SET effective_cache_size = '2GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
SELECT pg_reload_conf();
```

### Issue: Database Corruption

**Symptoms:**
- Checksum failures
- Index corruption errors
- Data inconsistency between primary and standby
- License count discrepancies

**Diagnosis:**
```bash
# Check database integrity
psql -h olicense-db-primary -U olicense -d olicense -c "
SELECT 
    schemaname, 
    tablename, 
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

# Check for corruption
pg_checksums --check -D /var/lib/postgresql/15/main

# Verify table consistency
psql -h olicense-db-primary -U olicense -d olicense -c "
SELECT 
    tablename, 
    n_tup_ins, 
    n_tup_upd, 
    n_tup_del, 
    n_live_tup, 
    n_dead_tup 
FROM pg_stat_user_tables;"
```

**Solutions:**

1. **Repair Minor Corruption:**
```bash
# Rebuild corrupted indexes
psql -h olicense-db-primary -U olicense -d olicense -c "
REINDEX TABLE license_usage;
REINDEX TABLE license_servers;
REINDEX TABLE user_sessions;"

# Update table statistics
psql -h olicense-db-primary -U olicense -d olicense -c "
VACUUM ANALYZE license_usage;
VACUUM ANALYZE license_servers;
VACUUM ANALYZE user_sessions;"
```

2. **Restore from Backup (Major Corruption):**
```bash
# Stop OLicense servers
systemctl stop olicense

# Restore database from backup
systemctl stop postgresql
rm -rf /var/lib/postgresql/15/main/*
pg_basebackup -h backup-server -D /var/lib/postgresql/15/main -U postgres
systemctl start postgresql

# Verify restoration
psql -h localhost -U olicense -d olicense -c "SELECT COUNT(*) FROM license_usage;"
systemctl start olicense
```

## Enterprise Integration Issues

### Issue: LDAP Authentication Failures

**Symptoms:**
- Users cannot authenticate via LDAP
- "Invalid credentials" errors for valid users
- LDAP connection timeouts
- Group membership not recognized

**Diagnosis:**
```bash
# Test LDAP connectivity
ldapsearch -x -H ldap://ldap.company.com -D "cn=olicense,ou=service,dc=company,dc=com" -W -b "dc=company,dc=com" "(uid=testuser)"

# Check LDAP configuration in OLicense
curl -s http://localhost:8443/api/auth/ldap/status | jq '.'

# Monitor LDAP authentication logs
tail -f /opt/olicense/logs/auth.log | grep LDAP

# Test user authentication
curl -X POST http://localhost:8443/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username": "testuser", "password": "testpass", "method": "ldap"}'
```

**Solutions:**

1. **Fix LDAP Configuration:**
```bash
# Update LDAP settings in OLicense config
cat >> /opt/olicense/config/olicense.conf << EOF

[LDAP]
LDAPEnabled = true
LDAPServer = ldap://ldap.company.com:389
LDAPBindDN = cn=olicense,ou=service,dc=company,dc=com
LDAPBindPassword = service_password
LDAPBaseDN = dc=company,dc=com
LDAPUserFilter = (uid=%s)
LDAPGroupFilter = (member=%s)
LDAPUserAttributes = uid,cn,mail,employeeNumber
LDAPGroupAttributes = cn,description
LDAPTimeout = 30
LDAPSSLEnabled = true
LDAPSSLVerify = false

EOF
```

2. **Fix SSL/TLS Issues:**
```bash
# Download LDAP server certificate
openssl s_client -showcerts -connect ldap.company.com:636 < /dev/null | \
    openssl x509 -outform PEM > /opt/olicense/certs/ldap-ca.pem

# Update certificate trust store
cat /opt/olicense/certs/ldap-ca.pem >> /etc/ssl/certs/ca-certificates.crt
update-ca-certificates
```

3. **Fix Group Mapping:**
```bash
# Configure group mapping
curl -X POST http://localhost:8443/api/auth/groups/mapping \
    -H "Content-Type: application/json" \
    -d '{
        "mappings": [
            {"ldap_group": "engineering", "olicense_role": "power_user"},
            {"ldap_group": "managers", "olicense_role": "admin"},
            {"ldap_group": "contractors", "olicense_role": "basic_user"}
        ]
    }'
```

### Issue: API Integration Problems

**Symptoms:**
- API calls return authentication errors
- Rate limiting errors
- Timeout errors on API requests
- Malformed response data

**Diagnosis:**
```bash
# Test API endpoint availability
curl -I http://localhost:8443/api/health

# Check API authentication
curl -X POST http://localhost:8443/api/auth/token \
    -H "Content-Type: application/json" \
    -d '{"username": "api_user", "password": "api_password"}'

# Monitor API request logs
tail -f /opt/olicense/logs/api.log | grep ERROR

# Test specific API endpoints
curl -H "Authorization: Bearer $TOKEN" \
    http://localhost:8443/api/licenses/available | jq '.'
```

**Solutions:**

1. **Fix API Authentication:**
```bash
# Generate new API key
curl -X POST http://localhost:8443/api/auth/api-keys \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name": "integration_key", "permissions": ["read", "write"], "expires": "2025-12-31"}'

# Update API rate limits
sed -i 's/APIRateLimit = 100/APIRateLimit = 1000/' /opt/olicense/config/olicense.conf
systemctl restart olicense
```

2. **Fix API Performance:**
```bash
# Enable API caching
cat >> /opt/olicense/config/olicense.conf << EOF

[API]
CachingEnabled = true
CacheTTL = 300
CacheSize = 128MB
CompressionEnabled = true
KeepAliveEnabled = true
MaxRequestSize = 10MB

EOF
```

## Clustering and High Availability Issues

### Issue: Split-Brain Scenarios

**Symptoms:**
- Multiple servers claiming to be primary
- Inconsistent license counts between nodes
- Client applications getting different responses
- Cluster status shows conflicts

**Diagnosis:**
```bash
# Check cluster status on all nodes
for node in olicense-primary-01 olicense-secondary-01; do
    echo "Checking $node:"
    curl -s http://$node:8443/api/cluster/status | jq '.role, .cluster_state'
    echo ""
done

# Check arbitrator status
curl -s http://olicense-arbitrator-01:8443/api/arbitrator/status | jq '.'

# Monitor cluster communication
tcpdump -i eth0 -n port 27015 | grep -E "(primary|secondary|arbitrator)"
```

**Solutions:**

1. **Immediate Split-Brain Resolution:**
```bash
# Stop all cluster nodes
for node in olicense-primary-01 olicense-secondary-01; do
    ssh $node "systemctl stop olicense"
done

# Start arbitrator first
ssh olicense-arbitrator-01 "systemctl start olicense"
sleep 30

# Start primary with cluster reset
ssh olicense-primary-01 "/opt/olicense/bin/olicense-server --cluster-reset --start"
sleep 60

# Start secondary
ssh olicense-secondary-01 "systemctl start olicense"

# Verify cluster health
curl -s http://olicense-primary-01:8443/api/cluster/status | jq '.cluster_health'
```

2. **Prevent Future Split-Brain:**
```bash
# Configure split-brain prevention
cat >> /opt/olicense/config/olicense.conf << EOF

[SPLIT_BRAIN_PREVENTION]
QuorumRequired = true
MinimumNodes = 2
ArbitratorRequired = true
NetworkPartitionDetection = true
AutoQuarantine = true
QuarantineTimeout = 300

EOF
```

### Issue: Failover Not Working

**Symptoms:**
- Secondary server doesn't take over when primary fails
- Manual failover commands fail
- Clients unable to reconnect after failover
- Database connection issues during failover

**Diagnosis:**
```bash
# Test failover mechanism
curl -X POST http://olicense-secondary-01:8443/api/cluster/test-failover

# Check database connectivity from secondary
ssh olicense-secondary-01 "psql -h olicense-db-standby -U olicense -d olicense -c 'SELECT 1;'"

# Verify load balancer configuration
curl -s http://load-balancer:8443/api/pools/olicense/status

# Check network connectivity between nodes
for node in olicense-primary-01 olicense-secondary-01; do
    ping -c 3 $node
    telnet $node 27015
done
```

**Solutions:**

1. **Fix Failover Configuration:**
```bash
# Update failover settings
sed -i 's/FailoverTimeout = 90/FailoverTimeout = 60/' /opt/olicense/config/olicense.conf
sed -i 's/FailoverEnabled = false/FailoverEnabled = true/' /opt/olicense/config/olicense.conf

# Configure database failover
cat >> /opt/olicense/config/olicense.conf << EOF

[DATABASE_FAILOVER]
PrimaryDB = olicense-db-primary:5432
StandbyDB = olicense-db-standby:5432
FailoverTimeout = 60
AutoPromoteStandby = true
HealthCheckInterval = 30

EOF
```

2. **Test Failover Procedure:**
```bash
# Manual failover test script
#!/bin/bash

echo "Testing failover procedure..."

# Simulate primary failure
ssh olicense-primary-01 "systemctl stop olicense"

# Wait for automatic failover
sleep 120

# Verify secondary became primary
SECONDARY_STATUS=$(curl -s http://olicense-secondary-01:8443/api/cluster/status | jq -r '.role')
if [ "$SECONDARY_STATUS" = "primary" ]; then
    echo "Failover successful"
else
    echo "Failover failed"
    exit 1
fi

# Test license functionality
curl -s http://olicense-secondary-01:8443/api/licenses/test-checkout | jq '.'
```

## Performance Issues

### Issue: High Memory Usage

**Symptoms:**
- OLicense server consuming excessive memory
- Out of memory errors
- System becoming unresponsive
- Memory leaks in long-running processes

**Diagnosis:**
```bash
# Monitor OLicense memory usage
ps aux | grep olicense
top -p $(pgrep olicense-server)

# Check for memory leaks
valgrind --tool=massif /opt/olicense/bin/olicense-server --test-mode

# Analyze memory allocation
curl -s http://localhost:8443/api/system/memory | jq '.'

# Check Java heap usage (if applicable)
jstat -gc $(pgrep java)
```

**Solutions:**

1. **Optimize Memory Configuration:**
```bash
# Adjust memory limits
cat >> /opt/olicense/config/olicense.conf << EOF

[MEMORY]
MaxHeapSize = 2GB
InitialHeapSize = 512MB
CacheSize = 256MB
BufferSize = 64MB
GCAlgorithm = G1GC

EOF

# System-level memory optimization
echo "vm.swappiness = 10" >> /etc/sysctl.conf
echo "vm.dirty_ratio = 15" >> /etc/sysctl.conf
sysctl -p
```

2. **Implement Memory Monitoring:**
```bash
# Create memory monitoring script
cat > /opt/olicense/scripts/memory-monitor.sh << 'EOF'
#!/bin/bash

MEMORY_THRESHOLD=80
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')

if (( $(echo "$MEMORY_USAGE > $MEMORY_THRESHOLD" | bc -l) )); then
    echo "High memory usage detected: ${MEMORY_USAGE}%"
    
    # Force garbage collection
    curl -X POST http://localhost:8443/api/system/gc
    
    # Clear caches
    curl -X POST http://localhost:8443/api/system/clear-cache
    
    # Log memory status
    curl -s http://localhost:8443/api/system/memory >> /var/log/olicense/memory.log
fi
EOF

chmod +x /opt/olicense/scripts/memory-monitor.sh

# Schedule memory monitoring
echo "*/5 * * * * /opt/olicense/scripts/memory-monitor.sh" | crontab -
```

### Issue: Database Performance Problems

**Symptoms:**
- Slow license checkout/checkin operations
- Database query timeouts
- High database CPU usage
- Long-running queries

**Diagnosis:**
```sql
-- Check slow queries
SELECT 
    query,
    mean_exec_time,
    calls,
    total_exec_time
FROM pg_stat_statements 
WHERE mean_exec_time > 1000  -- queries taking more than 1 second
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check table sizes and bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_dead_tup,
    n_live_tup,
    ROUND(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) as bloat_percentage
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    indexrelname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan
FROM pg_stat_user_indexes 
WHERE idx_scan = 0;  -- unused indexes
```

**Solutions:**

1. **Optimize Database Queries:**
```sql
-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_license_usage_checkout_time_feature 
ON license_usage(checkout_time, feature_name) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_user_sessions_last_activity 
ON user_sessions(last_activity) 
WHERE status = 'active';

-- Optimize frequently used queries
CREATE OR REPLACE VIEW active_licenses AS
SELECT 
    l.feature_name,
    l.user_id,
    l.checkout_time,
    u.username,
    u.department
FROM license_usage l
JOIN users u ON l.user_id = u.id
WHERE l.status = 'active';
```

2. **Database Maintenance:**
```bash
# Automated database maintenance script
cat > /opt/olicense/scripts/db-maintenance.sh << 'EOF'
#!/bin/bash

# Vacuum and analyze tables
psql -h olicense-db-primary -U olicense -d olicense -c "
VACUUM ANALYZE license_usage;
VACUUM ANALYZE user_sessions;
VACUUM ANALYZE license_servers;
"

# Update table statistics
psql -h olicense-db-primary -U olicense -d olicense -c "
ANALYZE;
"

# Check for bloated tables
psql -h olicense-db-primary -U olicense -d olicense -c "
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(tablename) DESC;
"
EOF

# Schedule maintenance
echo "0 2 * * 0 /opt/olicense/scripts/db-maintenance.sh" | crontab -
```

## Vantage Integration Issues

### Issue: Monitoring Data Missing

**Symptoms:**
- Vantage dashboard showing incomplete data
- Missing license usage metrics
- Agent connection failures
- Data synchronization delays

**Diagnosis:**
```bash
# Check vantage-agent status
vantage-agent status --detailed

# Test connectivity to Vantage cloud
vantage-agent test-connection

# Check OLicense API connectivity
curl -H "Authorization: Bearer $(vantage-agent get-token)" \
    http://localhost:8443/api/licenses/usage | jq '.'

# Monitor agent logs
tail -f /var/log/vantage-agent/olicense.log | grep ERROR
```

**Solutions:**

1. **Fix Agent Configuration:**
```bash
# Reconfigure vantage-agent for OLicense
vantage-agent configure \
    --server-type olicense \
    --server-host localhost \
    --server-port 8443 \
    --api-endpoint "/api" \
    --ssl-verify false \
    --collection-interval 30

# Update authentication
vantage-agent auth reset
vantage-agent auth configure \
    --method api_key \
    --api-key "your_olicense_api_key"
```

2. **Fix Data Collection:**
```bash
# Enable comprehensive data collection
cat > /etc/vantage-agent/olicense-collection.yaml << EOF
collection:
  license_usage:
    enabled: true
    interval: 30
    details: comprehensive
    
  user_sessions:
    enabled: true
    interval: 60
    inactive_threshold: 3600
    
  server_health:
    enabled: true
    interval: 15
    metrics: [cpu, memory, disk, network]
    
  database_metrics:
    enabled: true
    interval: 60
    include_replication: true
    
  cluster_status:
    enabled: true
    interval: 30
    include_failover_status: true
EOF

systemctl restart vantage-agent
```

## Emergency Procedures

### Complete System Recovery

```bash
#!/bin/bash
# Emergency OLicense recovery procedure

echo "Starting emergency OLicense recovery..."

# Step 1: Stop all services
systemctl stop olicense
systemctl stop postgresql
systemctl stop vantage-agent

# Step 2: Check filesystem integrity
fsck /dev/mapper/vg-olicense
fsck /dev/mapper/vg-postgres

# Step 3: Restore from backup
rsync -avz /backup/olicense/latest/ /opt/olicense/
rsync -avz /backup/postgresql/latest/ /var/lib/postgresql/

# Step 4: Start services in order
systemctl start postgresql
sleep 30
systemctl start olicense
sleep 60
systemctl start vantage-agent

# Step 5: Verify system health
curl -s http://localhost:8443/api/health | jq '.'
vantage-agent status

echo "Recovery completed. Verify system functionality."
```

### License Emergency Access

```bash
# Emergency license access for critical operations
/opt/olicense/bin/olicense-server --emergency-mode \
    --bypass-authentication \
    --unlimited-licenses \
    --duration 4_hours \
    --reason "System recovery"
```

## Preventive Maintenance

### Automated Health Checks

```bash
#!/bin/bash
# Weekly OLicense health check script

# System resources
df -h /opt/olicense /var/lib/postgresql
free -h
iostat -x 1 5

# OLicense specific checks
curl -s http://localhost:8443/api/health/comprehensive | jq '.'
/opt/olicense/bin/olicense-verify --comprehensive

# Database health
psql -h localhost -U olicense -d olicense -c "
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size('olicense')) as value
UNION ALL
SELECT 
    'Active Connections',
    COUNT(*)::text
FROM pg_stat_activity 
WHERE datname = 'olicense';"

# Performance analysis
curl -s http://localhost:8443/api/performance/summary | jq '.'
```

## Next Steps

With comprehensive OLicense troubleshooting procedures in place, you should be able to:

- **Diagnose Issues**: Quickly identify root causes of OLicense problems
- **Resolve Problems**: Apply targeted solutions for common issues
- **Prevent Issues**: Implement monitoring and maintenance procedures
- **Handle Emergencies**: Execute recovery procedures when needed

---

> **Troubleshooting Best Practice**: OLicense enterprise environments involve complex interactions between license servers, databases, clustering, and enterprise integrations. Systematic diagnosis using built-in tools, comprehensive logging, and proactive monitoring through Vantage enables rapid problem resolution. Regular health checks and performance optimization prevent most issues before they impact users.
