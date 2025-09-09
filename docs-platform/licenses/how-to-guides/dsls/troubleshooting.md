---
id: dsls-troubleshooting
title: Troubleshooting
sidebar_position: 5
description: Comprehensive troubleshooting guide for DSLS license servers, token management, and Vantage integration.
---

# DSLS Troubleshooting Guide

This comprehensive guide covers troubleshooting common issues with Dassault Systèmes License Server (DSLS), including token management problems, academic licensing issues, high availability failures, and Vantage integration challenges.

## Common Issues Overview

DSLS troubleshooting typically involves these main categories:

| Issue Category | Common Symptoms | Impact Level |
|---|---|---|
| **Token Allocation** | Users unable to checkout licenses, token exhaustion | High |
| **Academic Licensing** | Student access failures, course scheduling conflicts | High |
| **Server Performance** | Slow checkouts, high memory usage, connection timeouts | Medium |
| **High Availability** | Failover failures, split-brain scenarios, sync issues | Critical |
| **Vantage Integration** | Monitoring gaps, data collection failures, alert issues | Medium |
| **Product-Specific** | ABAQUS/CATIA/SolidWorks connection problems | High |

## Token Management Issues

### Issue: Token Exhaustion

**Symptoms:**
- Users receiving "No tokens available" errors
- License checkout failures during peak hours
- Queue buildup in academic environments

**Diagnosis:**
```bash
# Check current token allocation
/opt/dsls/bin/DSLicSrv -tokens -detailed

# Example output showing exhaustion:
# Product: ABAQUS_STANDARD
# Total Tokens: 50
# In Use: 50 (100%)
# Queued Users: 8
# Peak Usage: 52 (104% - overcommitted)

# Check token usage history
/opt/dsls/bin/DSLicSrv -usage-history -product abaqus_standard -timeframe "last 24 hours"

# Analyze usage patterns
vantage-agent analyze dsls --token-exhaustion --product abaqus_standard
```

**Solutions:**

1. **Immediate Relief:**
```bash
# Identify idle or hung sessions
/opt/dsls/bin/DSLicSrv -sessions -idle-threshold 3600

# Force release abandoned sessions
/opt/dsls/bin/DSLicSrv -release-session -user "idle_user@company.com" -force

# Implement temporary token reallocation
/opt/dsls/bin/DSLicSrv -reallocate-tokens \
    --from abaqus_explicit \
    --to abaqus_standard \
    --count 10 \
    --temporary
```

2. **Long-term Solutions:**
```bash
# Enable dynamic token allocation
/opt/dsls/bin/DSLicSrv -configure \
    --dynamic-allocation enabled \
    --reallocation-threshold 80% \
    --reallocation-interval 300

# Implement academic priority scheduling
/opt/dsls/bin/DSLicSrv -configure-academic \
    --priority-scheduling enabled \
    --course-hours-priority high \
    --research-hours-priority medium
```

### Issue: Token Synchronization Failures

**Symptoms:**
- Token counts differ between primary and backup servers
- Failed checkouts despite available tokens
- Cluster synchronization warnings

**Diagnosis:**
```bash
# Check cluster token synchronization
/opt/dsls/bin/DSLicSrv -cluster-sync-status

# Compare token states between nodes
PRIMARY_TOKENS=$(/opt/dsls/bin/DSLicSrv -tokens -server dsls-primary-01)
BACKUP_TOKENS=$(/opt/dsls/bin/DSLicSrv -tokens -server dsls-backup-01)

echo "Primary: $PRIMARY_TOKENS"
echo "Backup: $BACKUP_TOKENS"

# Check synchronization logs
tail -f /opt/dsls/logs/sync.log | grep ERROR
```

**Solutions:**
```bash
# Force token synchronization
/opt/dsls/bin/DSLicSrv -force-sync-tokens \
    --source dsls-primary-01 \
    --target dsls-backup-01 \
    --verify

# Reset token state on backup (if corruption detected)
/opt/dsls/bin/DSLicSrv -reset-token-state \
    --node dsls-backup-01 \
    --import-from dsls-primary-01

# Configure enhanced synchronization monitoring
echo "SYNC_VERIFICATION_INTERVAL=60" >> /opt/dsls/config/cluster.conf
echo "SYNC_FAILURE_RETRY_COUNT=5" >> /opt/dsls/config/cluster.conf
systemctl restart dsls
```

## Academic Licensing Issues

### Issue: Student Access Failures

**Symptoms:**
- Students unable to access software during class hours
- Academic multiplier not applying correctly
- Course-specific licensing conflicts

**Diagnosis:**
```bash
# Check academic pool status
/opt/dsls/bin/DSLicSrv -academic-status

# Verify student enrollment synchronization
/opt/dsls/bin/DSLicSrv -verify-academic-sync \
    --course "ME-541" \
    --semester "fall-2024"

# Check academic multiplier application
/opt/dsls/bin/DSLicSrv -academic-usage -detailed

# Example output:
# Course: ME-541 (Finite Element Analysis)
# Enrolled Students: 45
# Active Sessions: 42
# Academic Tokens Used: 42 * 0.2 = 8.4 tokens
# Commercial Tokens Used: 8.4 tokens (incorrect - should use academic pool)
```

**Solutions:**

1. **Fix Academic Pool Configuration:**
```bash
# Reconfigure academic pools
/opt/dsls/bin/DSLicSrv -configure-academic \
    --pool-size 200 \
    --multiplier 0.2 \
    --strict-enforcement true \
    --student-verification ldap

# Verify course scheduling integration
/opt/dsls/bin/DSLicSrv -sync-course-schedule \
    --lms canvas \
    --academic-year 2024-2025 \
    --auto-provision true
```

2. **Fix Student Authentication:**
```bash
# Check LDAP integration
/opt/dsls/bin/DSLicSrv -test-ldap \
    --user "student@university.edu" \
    --group "students"

# Reconfigure student classification
/opt/dsls/bin/DSLicSrv -classify-users \
    --undergraduate-domain "@student.university.edu" \
    --graduate-domain "@grad.university.edu" \
    --faculty-domain "@faculty.university.edu"
```

### Issue: Course Scheduling Conflicts

**Symptoms:**
- Multiple courses competing for same token pool
- Lab sessions unable to start due to license unavailability
- Uneven distribution across academic departments

**Diagnosis:**
```bash
# Analyze course scheduling conflicts
vantage-agent analyze dsls --course-conflicts \
    --timeframe "current_week" \
    --breakdown hourly

# Check overlapping course schedules
/opt/dsls/bin/DSLicSrv -course-schedule-analysis \
    --conflicts-only \
    --product abaqus_standard

# Example conflict output:
# Conflict detected:
# Course 1: ME-541 (45 students, Mon/Wed/Fri 2-5 PM)
# Course 2: AE-523 (35 students, Mon/Wed 3-6 PM)
# Overlap: Mon/Wed 3-5 PM (80 students, 16 tokens needed)
# Available: 12 tokens
# Deficit: 4 tokens
```

**Solutions:**
```bash
# Implement course priority scheduling
/opt/dsls/bin/DSLicSrv -configure-course-priority \
    --priority-order "undergraduate,graduate,research" \
    --buffer-percentage 20 \
    --overflow-handling queue

# Configure time-based token allocation
/opt/dsls/bin/DSLicSrv -configure-time-allocation \
    --course-hours "8am-6pm" \
    --research-hours "6pm-8am" \
    --weekend-mode "research-priority"

# Set up automatic conflict resolution
/opt/dsls/bin/DSLicSrv -configure-conflict-resolution \
    --auto-reallocate true \
    --notification-enabled true \
    --alternative-suggestions true
```

## Server Performance Issues

### Issue: High Memory Usage

**Symptoms:**
- DSLS server consuming excessive memory
- System becoming unresponsive
- Token checkout delays

**Diagnosis:**
```bash
# Monitor DSLS memory usage
ps aux | grep DSLicSrv
top -p $(pgrep DSLicSrv)

# Check for memory leaks
valgrind --tool=massif /opt/dsls/bin/DSLicSrv -daemon -config /opt/dsls/config/DSLicSrv.opt

# Analyze memory allocation patterns
/opt/dsls/bin/DSLicSrv -memory-analysis -detailed

# Check cache usage
/opt/dsls/bin/DSLicSrv -cache-stats
```

**Solutions:**

1. **Optimize Memory Configuration:**
```bash
# Adjust memory limits
echo "DSLS_MEMORY_LIMIT=4GB" >> /opt/dsls/config/performance.conf
echo "DSLS_CACHE_SIZE=512MB" >> /opt/dsls/config/performance.conf
echo "DSLS_TOKEN_CACHE_SIZE=128MB" >> /opt/dsls/config/performance.conf

# Configure garbage collection
echo "DSLS_GC_INTERVAL=3600" >> /opt/dsls/config/performance.conf
echo "DSLS_MEMORY_CLEANUP_THRESHOLD=80%" >> /opt/dsls/config/performance.conf
```

2. **Implement Memory Monitoring:**
```bash
# Set up memory alerts
echo "MEMORY_WARNING_THRESHOLD=75%" >> /opt/dsls/config/alerts.conf
echo "MEMORY_CRITICAL_THRESHOLD=90%" >> /opt/dsls/config/alerts.conf
echo "MEMORY_CHECK_INTERVAL=60" >> /opt/dsls/config/alerts.conf
```

### Issue: Connection Timeouts

**Symptoms:**
- Client applications unable to connect to DSLS
- Intermittent license checkout failures
- Network-related error messages

**Diagnosis:**
```bash
# Test network connectivity
telnet dsls-server.company.com 27000

# Check DSLS network configuration
/opt/dsls/bin/DSLicSrv -network-status

# Monitor connection statistics
netstat -an | grep :27000
ss -tuln | grep :27000

# Check firewall rules
iptables -L | grep 27000
firewall-cmd --list-ports
```

**Solutions:**
```bash
# Optimize network configuration
echo "DSLS_MAX_CONNECTIONS=2000" >> /opt/dsls/config/network.conf
echo "DSLS_CONNECTION_TIMEOUT=60" >> /opt/dsls/config/network.conf
echo "DSLS_KEEP_ALIVE_INTERVAL=30" >> /opt/dsls/config/network.conf

# Configure connection pooling
echo "DSLS_CONNECTION_POOL_SIZE=200" >> /opt/dsls/config/network.conf
echo "DSLS_CONNECTION_REUSE=true" >> /opt/dsls/config/network.conf

# Adjust system network limits
echo "net.core.somaxconn = 4096" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 4096" >> /etc/sysctl.conf
sysctl -p
```

## High Availability Issues

### Issue: Failover Not Working

**Symptoms:**
- Backup server not taking over when primary fails
- Split-brain scenarios in cluster
- Clients unable to reconnect after failover

**Diagnosis:**
```bash
# Check cluster status
/opt/dsls/bin/DSLicSrv -cluster-status -verbose

# Verify failover configuration
cat /opt/dsls/config/failover.conf

# Test failover mechanism
/opt/dsls/bin/DSLicSrv -test-failover -dry-run

# Check cluster communication
/opt/dsls/bin/DSLicSrv -cluster-communication-test
```

**Solutions:**

1. **Fix Cluster Configuration:**
```bash
# Reconfigure cluster membership
/opt/dsls/bin/DSLicSrv -reconfigure-cluster \
    --primary dsls-primary-01 \
    --backup dsls-backup-01 \
    --arbitrator dsls-arbitrator-01 \
    --quorum-size 2

# Reset cluster state
/opt/dsls/bin/DSLicSrv -reset-cluster-state --force
```

2. **Configure Split-Brain Prevention:**
```bash
# Enable split-brain detection
echo "SPLIT_BRAIN_DETECTION=true" >> /opt/dsls/config/cluster.conf
echo "QUORUM_ENFORCEMENT=true" >> /opt/dsls/config/cluster.conf
echo "ARBITRATOR_REQUIRED=true" >> /opt/dsls/config/cluster.conf
```

### Issue: Synchronization Lag

**Symptoms:**
- Backup server has stale data
- Token counts inconsistent between nodes
- Delayed updates in cluster

**Diagnosis:**
```bash
# Check synchronization lag
/opt/dsls/bin/DSLicSrv -sync-lag-analysis

# Monitor replication performance
/opt/dsls/bin/DSLicSrv -replication-stats

# Check network latency between nodes
ping -c 10 dsls-backup-01
mtr dsls-primary-01 dsls-backup-01
```

**Solutions:**
```bash
# Optimize synchronization settings
echo "SYNC_INTERVAL=30" >> /opt/dsls/config/cluster.conf
echo "SYNC_BATCH_SIZE=1000" >> /opt/dsls/config/cluster.conf
echo "SYNC_COMPRESSION=true" >> /opt/dsls/config/cluster.conf

# Configure priority synchronization
echo "PRIORITY_SYNC_ACADEMIC=true" >> /opt/dsls/config/cluster.conf
echo "PRIORITY_SYNC_TOKENS=true" >> /opt/dsls/config/cluster.conf
```

## Vantage Integration Issues

### Issue: Monitoring Data Missing

**Symptoms:**
- Vantage dashboard showing incomplete data
- Missing license usage metrics
- Agent connection failures

**Diagnosis:**
```bash
# Check vantage-agent status
vantage-agent status --detailed

# Test connectivity to Vantage cloud
vantage-agent test-connection

# Check data collection logs
tail -f /var/log/vantage-agent/dsls.log

# Verify DSLS API connectivity
curl -X GET "http://localhost:27000/api/status" \
    -H "Authorization: Bearer $(vantage-agent get-token)"
```

**Solutions:**

1. **Fix Agent Configuration:**
```bash
# Reconfigure vantage-agent for DSLS
vantage-agent configure \
    --server-type dsls \
    --server-host localhost \
    --server-port 27000 \
    --collection-interval 60 \
    --retry-attempts 3

# Reset agent authentication
vantage-agent auth reset
vantage-agent auth login
```

2. **Troubleshoot Data Collection:**
```bash
# Enable debug logging
echo "LOG_LEVEL=DEBUG" >> /etc/vantage-agent/config.conf
systemctl restart vantage-agent

# Test specific data collection
vantage-agent collect dsls --test-mode --verbose

# Verify data transmission
vantage-agent transmit --test --show-payload
```

### Issue: Alerts Not Working

**Symptoms:**
- No notifications for critical events
- False positive alerts
- Alert delays

**Diagnosis:**
```bash
# Check alert configuration
vantage-agent show-config alerts

# Test alert triggers
vantage-agent test-alert \
    --type token_exhaustion \
    --severity critical

# Verify notification channels
vantage-agent test-notifications \
    --email \
    --slack \
    --webhook
```

**Solutions:**
```bash
# Reconfigure alert thresholds
vantage-agent configure alerts \
    --token-warning 80% \
    --token-critical 95% \
    --queue-warning 5 \
    --queue-critical 15

# Fix notification channels
vantage-agent configure notifications \
    --email-enabled true \
    --email-recipients "admin@company.com,licenses@company.com" \
    --slack-webhook "https://hooks.slack.com/..." \
    --severity-filter "warning,critical"
```

## Product-Specific Issues

### ABAQUS Issues

**Common Problems:**
- Solver license checkout failures
- CAE interface connection issues
- Academic license not recognized

**Solutions:**
```bash
# Test ABAQUS license connectivity
abaqus licensing info

# Configure ABAQUS environment for DSLS
export LM_LICENSE_FILE=27000@dsls-server.company.com
export ABAQUS_LICENSE_FILE=27000@dsls-server.company.com

# Test license checkout
abaqus licensing checkout ABAQUS_STANDARD

# Academic license configuration
echo "academic=true" >> $HOME/.abaqus_env
echo "academic_license_server=27000@dsls-server.company.com" >> $HOME/.abaqus_env
```

### CATIA Issues

**Common Problems:**
- V6 license server connection failures
- Feature-specific license issues
- PLM integration problems

**Solutions:**
```bash
# Configure CATIA licensing environment
export CATIA_LICENSE_SERVER=27000@dsls-server.company.com
export LM_LICENSE_FILE=27000@dsls-server.company.com

# Test CATIA license connectivity
cnext -license_check

# Fix V6 specific issues
export CATIA_V6_LICENSE_MODE=dsls
export CATIA_V6_TOKEN_ALLOCATION=auto
```

### SolidWorks Issues

**Common Problems:**
- Network license detection failures
- Add-in licensing issues
- Academic edition conflicts

**Solutions:**
```bash
# Configure SolidWorks network licensing
# Edit SolidNetWork License Manager settings:
# Server: dsls-server.company.com
# Port: 27000
# Protocol: DSLS

# Registry configuration (Windows clients)
reg add "HKLM\SOFTWARE\SolidWorks\Network License" \
    /v "Server" /t REG_SZ /d "dsls-server.company.com" /f
reg add "HKLM\SOFTWARE\SolidWorks\Network License" \
    /v "Port" /t REG_DWORD /d "27000" /f
```

## Emergency Procedures

### Complete System Recovery

When DSLS system is completely down:

```bash
#!/bin/bash
# Emergency DSLS recovery procedure

echo "Starting emergency DSLS recovery..."

# Step 1: Stop all DSLS services
systemctl stop dsls
systemctl stop dsls-backup
systemctl stop haproxy

# Step 2: Check filesystem integrity
fsck /shared/dsls

# Step 3: Restore from backup
rsync -avz /backup/dsls/latest/ /opt/dsls/
rsync -avz /backup/shared/latest/ /shared/dsls/

# Step 4: Start primary server in recovery mode
/opt/dsls/bin/DSLicSrv -recovery-mode -single-node

# Step 5: Verify license files
/opt/dsls/bin/DSLicSrv -validate-licenses

# Step 6: Start cluster in stages
systemctl start dsls
sleep 60
systemctl start dsls-backup
sleep 30
systemctl start haproxy

echo "Recovery completed. Verify system status."
```

### Academic Emergency Access

For critical academic situations (exams, project deadlines):

```bash
# Emergency academic access procedure
/opt/dsls/bin/DSLicSrv -emergency-academic-mode \
    --unlimited-tokens \
    --duration 24_hours \
    --notification "Emergency access enabled for final exams"

# Temporary token multiplication
/opt/dsls/bin/DSLicSrv -temporary-multiplier \
    --factor 10 \
    --academic-only \
    --duration 4_hours \
    --reason "Final project presentations"
```

## Preventive Maintenance

### Regular Health Checks

```bash
#!/bin/bash
# Weekly DSLS health check script

# System resources
df -h /opt/dsls /shared/dsls
free -h
iostat -x 1 5

# DSLS specific checks
/opt/dsls/bin/DSLicSrv -health-check --comprehensive
/opt/dsls/bin/DSLicSrv -license-validation --all
/opt/dsls/bin/DSLicSrv -performance-analysis

# Cluster health
/opt/dsls/bin/DSLicSrv -cluster-health --detailed

# Vantage integration
vantage-agent health-check --full

# Academic system integration
/opt/dsls/bin/DSLicSrv -academic-sync-check
```

### Log Analysis and Cleanup

```bash
# Automated log analysis
/opt/dsls/bin/analyze-logs.sh --timeframe "last_week" --errors-only

# Log rotation and cleanup
find /opt/dsls/logs -name "*.log" -mtime +30 -delete
find /shared/dsls/logs -name "*.log" -mtime +30 -delete

# Performance log analysis
grep -i "slow\|timeout\|error" /opt/dsls/logs/*.log | \
    awk '{print $1}' | sort | uniq -c | sort -nr
```

## Support and Escalation

### Collecting Diagnostic Information

```bash
# Comprehensive diagnostic collection
/opt/dsls/bin/collect-diagnostics.sh

# Information collected:
# - System configuration
# - DSLS configuration files
# - Log files (last 7 days)
# - Performance metrics
# - Cluster status
# - License file validation
# - Vantage agent status
# - Academic integration status
```

### Contacting Support

For issues requiring vendor support:

1. **Dassault Systèmes Support**: Include DSLS version, license file hash, and error logs
2. **Vantage Support**: Include vantage-agent logs and configuration
3. **Academic IT Support**: Include course schedules and enrollment data

---

> **Troubleshooting Best Practice**: DSLS issues often involve complex interactions between token management, academic integration, and high availability systems. Systematic diagnosis using built-in tools, combined with comprehensive monitoring through Vantage, enables rapid identification and resolution of problems. Maintaining current documentation and regular testing of recovery procedures is essential for minimizing downtime in academic and enterprise environments.
