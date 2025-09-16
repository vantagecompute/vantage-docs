---
id: high-availability
title: High Availability
sidebar_position: 4
description: Configure RLM for high availability in Vantage environments.
---

# RLM High Availability

Ensure your RLM license servers remain available for critical workloads with redundant configurations and failover capabilities integrated with Vantage License Manager.

## Overview

RLM supports several high availability configurations to ensure continuous license service. Unlike traditional license managers, RLM provides modern approaches to redundancy and failover with web-based administration and built-in clustering capabilities.

## Vantage HA Integration for RLM

### HA Configuration in Vantage

```yaml
# RLM HA cluster configuration
apiVersion: licensing.vantage.com/v1
kind: LicenseServer
metadata:
  name: rlm-ha-cluster
spec:
  type: rlm
  highAvailability:
    enabled: true
    mode: active-passive
    primary:
      host: rlm1.vantage.com
      port: 5053
      webPort: 5054
    secondary:
      host: rlm2.vantage.com
      port: 5053
      webPort: 5054
    backup:
      host: rlm3.vantage.com
      port: 5053
      webPort: 5054
  monitoring:
    healthCheck:
      interval: 30s
      timeout: 10s
      retries: 3
      checkWeb: true
    failover:
      automatic: true
      threshold: 2  # Failed health checks before failover
      cooldown: 300s
  features:
    - name: STARCCM
      vendor: siemens
    - name: NXCAE
      vendor: siemens
    - name: LSDYNA
      vendor: lstc
```

### Vantage HA Management

```bash
# Deploy RLM HA configuration
vantage license-servers deploy rlm-ha-cluster.yaml

# Check HA status
vantage license-servers status rlm-ha-cluster --show-ha

# View current active server
vantage licenses primary rlm-ha-cluster

# Force failover for maintenance
vantage licenses failover rlm-ha-cluster --to rlm2.vantage.com

# Monitor HA cluster health
vantage licenses monitor rlm-ha-cluster --follow --include-web
```

## RLM Redundant Server Configuration

### License File Synchronization

RLM requires synchronized license files across all servers in the HA cluster:

```bash
# Primary server license file: /opt/rlm/licenses/siemens.lic
HOST rlm1.vantage.com ANY 5053
HOST rlm2.vantage.com ANY 5053
HOST rlm3.vantage.com ANY 5053
ISV siemens

# Floating licenses with redundancy support
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    REDUNDANT \
    SIGN=60B459C90C71ABC123

LICENSE siemens NXCAE 2023.1000 permanent 10 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    BORROW=24 \
    REDUNDANT \
    SIGN=50A348B80B62DEF456
```

### Server Installation and Configuration

**Install on all HA servers:**

```bash
# On each RLM server (rlm1, rlm2, rlm3)

# 1. Install RLM
sudo mkdir -p /opt/rlm/{bin,licenses,logs,web,ssl}
sudo tar -xzf rlm-package.tar.gz -C /opt/rlm/bin

# 2. Copy identical license files to each server
sudo cp siemens.lic /opt/rlm/licenses/

# 3. Configure RLM with HA settings
sudo tee /opt/rlm/rlm.conf > /dev/null <<EOF
# RLM HA Configuration
LICENSE_PATH /opt/rlm/licenses
LOG_FILE /opt/rlm/logs/rlm.log
LOG_LEVEL 3

# Web interface
WEB_INTERFACE_ENABLE 1
WEB_INTERFACE_PORT 5054
WEB_INTERFACE_HTTPS 1
WEB_INTERFACE_CERT /opt/rlm/ssl/server.crt
WEB_INTERFACE_KEY /opt/rlm/ssl/server.key

# HA settings
REDUNDANT_SERVER_ENABLE 1
REDUNDANT_HEARTBEAT_INTERVAL 30
REDUNDANT_FAILOVER_TIMEOUT 90
REDUNDANT_SYNC_INTERVAL 60

# Performance optimization for HA
CONNECTION_TIMEOUT 300
MAX_CONNECTIONS 500
THREAD_POOL_SIZE 20
EOF

# 4. Create systemd service
sudo tee /etc/systemd/system/rlm-ha.service > /dev/null <<EOF
[Unit]
Description=RLM License Server HA
After=network.target

[Service]
Type=forking
User=rlm
Group=rlm
WorkingDirectory=/opt/rlm
ExecStart=/opt/rlm/bin/rlm -c /opt/rlm/rlm.conf -ha
ExecStop=/opt/rlm/bin/rlm -shutdown
PIDFile=/opt/rlm/rlm.pid
Restart=always
RestartSec=10
Environment="RLM_HA_MODE=1"

[Install]
WantedBy=multi-user.target
EOF

# 5. Start and enable service
sudo systemctl enable rlm-ha
sudo systemctl start rlm-ha
```

## Load Balancer Integration

### HAProxy Configuration for RLM

```bash
# Install and configure HAProxy for RLM HA
sudo yum install haproxy -y

# Configure HAProxy for RLM
sudo tee /etc/haproxy/haproxy.cfg > /dev/null <<EOF
global
    daemon
    log 127.0.0.1:514 local0
    
defaults
    mode tcp
    option tcplog
    timeout connect 5000ms
    timeout client 300000ms
    timeout server 300000ms
    retries 3

# RLM license server frontend
frontend rlm_license_frontend
    bind *:5053
    default_backend rlm_license_servers

# RLM web interface frontend
frontend rlm_web_frontend
    mode http
    bind *:5054
    default_backend rlm_web_servers

# RLM license server backend
backend rlm_license_servers
    balance leastconn
    option tcp-check
    tcp-check send "STATUS\r\n"
    tcp-check expect string "RLM"
    
    server rlm1 rlm1.vantage.com:5053 check inter 10s fall 3 rise 2
    server rlm2 rlm2.vantage.com:5053 check inter 10s fall 3 rise 2 backup
    server rlm3 rlm3.vantage.com:5053 check inter 10s fall 3 rise 2 backup

# RLM web interface backend
backend rlm_web_servers
    mode http
    balance roundrobin
    option httpchk GET /
    
    server rlm1-web rlm1.vantage.com:5054 check inter 10s ssl verify none
    server rlm2-web rlm2.vantage.com:5054 check inter 10s ssl verify none backup
    server rlm3-web rlm3.vantage.com:5054 check inter 10s ssl verify none backup

# Statistics interface
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
    stats admin if TRUE
EOF

# Start HAProxy
sudo systemctl enable haproxy
sudo systemctl start haproxy
```

### Client Configuration for HA

```bash
# Configure clients to use load balancer
export RLM_LICENSE="5053@rlm-lb.vantage.com"
export SIEMENS_LICENSE_FILE="5053@rlm-lb.vantage.com"

# Or configure all servers as fallback
export RLM_LICENSE="5053@rlm1.vantage.com:5053@rlm2.vantage.com:5053@rlm3.vantage.com"

# For Vantage job submissions
vantage cluster config update \
  --license-servers "5053@rlm-lb.vantage.com" \
  --license-failover-enabled true \
  --license-redundancy-mode active-passive
```

## Shared Storage and Synchronization

### NFS for License File Synchronization

```bash
# NFS server setup for shared license storage
sudo mkdir -p /nfs/rlm/{licenses,logs,config}

# /etc/exports
/nfs/rlm 192.168.1.0/24(rw,sync,no_root_squash,no_subtree_check)

# Start NFS
sudo systemctl enable nfs-server
sudo systemctl start nfs-server
sudo exportfs -a
```

**Client Mount Configuration:**
```bash
# Mount on each RLM server
sudo mkdir -p /opt/rlm/shared
sudo mount -t nfs nfs-server.vantage.com:/nfs/rlm /opt/rlm/shared

# /etc/fstab entry
nfs-server.vantage.com:/nfs/rlm /opt/rlm/shared nfs defaults,_netdev 0 0

# Use shared license files
sudo ln -sf /opt/rlm/shared/licenses/siemens.lic /opt/rlm/licenses/
sudo ln -sf /opt/rlm/shared/config/rlm.conf /opt/rlm/
```

### Database Synchronization for Usage Tracking

```sql
-- PostgreSQL cluster for RLM usage tracking
CREATE TABLE rlm_usage_log (
    id SERIAL PRIMARY KEY,
    server_name VARCHAR(255),
    feature_name VARCHAR(255),
    user_name VARCHAR(255),
    hostname VARCHAR(255),
    checkout_time TIMESTAMP,
    checkin_time TIMESTAMP,
    session_duration INTERVAL,
    active_time INTERVAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_rlm_usage_server ON rlm_usage_log(server_name);
CREATE INDEX idx_rlm_usage_feature ON rlm_usage_log(feature_name);
CREATE INDEX idx_rlm_usage_time ON rlm_usage_log(checkout_time);

-- View for current usage
CREATE VIEW rlm_current_usage AS
SELECT 
    server_name,
    feature_name,
    COUNT(*) as active_sessions,
    STRING_AGG(user_name, ', ') as active_users
FROM rlm_usage_log 
WHERE checkin_time IS NULL 
GROUP BY server_name, feature_name;
```

## Monitoring and Health Checks

### Comprehensive Health Check Script

```bash
#!/bin/bash
# /opt/rlm/bin/rlm-ha-health-check.sh

SERVERS=("rlm1.vantage.com" "rlm2.vantage.com" "rlm3.vantage.com")
FAILED_SERVERS=()
HEALTHY_SERVERS=()
WEB_PORTS=("5054" "5054" "5054")

echo "RLM HA Health Check - $(date)"
echo "=============================="

for i in "${!SERVERS[@]}"; do
    server="${SERVERS[$i]}"
    web_port="${WEB_PORTS[$i]}"
    
    echo -n "Checking $server:5053 (license) ... "
    
    # Test RLM license server
    if timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "5053@$server" > /dev/null 2>&1; then
        echo "OK"
        
        # Test web interface
        echo -n "Checking $server:$web_port (web) ... "
        if timeout 10 curl -k -s "https://$server:$web_port/" > /dev/null 2>&1; then
            echo "OK"
            HEALTHY_SERVERS+=($server)
            
            # Check license availability
            feature_count=$(timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "5053@$server" | grep -c "LICENSE")
            echo "  Available features: $feature_count"
        else
            echo "WEB FAILED"
            FAILED_SERVERS+=("$server (web)")
        fi
    else
        echo "LICENSE FAILED"
        FAILED_SERVERS+=("$server (license)")
    fi
done

echo
echo "Summary:"
echo "  Healthy servers: ${#HEALTHY_SERVERS[@]} (${HEALTHY_SERVERS[*]})"
echo "  Failed components: ${#FAILED_SERVERS[@]} (${FAILED_SERVERS[*]})"

# Update Vantage with health status
if [ ${#HEALTHY_SERVERS[@]} -gt 0 ]; then
    vantage licenses update-health rlm-ha-cluster \
      --healthy-servers "${HEALTHY_SERVERS[*]}" \
      --failed-servers "${FAILED_SERVERS[*]}"
fi

# Exit with error if no servers are healthy
if [ ${#HEALTHY_SERVERS[@]} -eq 0 ]; then
    echo "CRITICAL: No healthy RLM servers available!"
    exit 1
fi

exit 0
```

### Automated Failover Script

```bash
#!/bin/bash
# /opt/rlm/bin/rlm-automated-failover.sh

CURRENT_PRIMARY="rlm1.vantage.com"
BACKUP_SERVERS=("rlm2.vantage.com" "rlm3.vantage.com")
FAILOVER_THRESHOLD=3
FAILED_CHECKS=0
LOG_FILE="/var/log/rlm/failover.log"

log_message() {
    echo "$(date): $1" | tee -a "$LOG_FILE"
}

check_server() {
    local server=$1
    if timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "5053@$server" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

check_web_interface() {
    local server=$1
    if timeout 10 curl -k -s "https://$server:5054/" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

failover_to_backup() {
    local backup_server=$1
    
    log_message "Initiating failover to $backup_server"
    
    # Update load balancer to point to backup
    # This depends on your load balancer configuration
    curl -X POST "http://rlm-lb.vantage.com:8404/admin?stats" \
      --data "action=disable&backend=rlm_license_servers&server=rlm1" \
      --data "action=enable&backend=rlm_license_servers&server=${backup_server}"
    
    # Execute failover in Vantage
    vantage licenses failover rlm-ha-cluster --to "$backup_server"
    
    # Update DNS or notify systems
    # Implementation depends on your infrastructure
    
    log_message "Failover completed to $backup_server"
    CURRENT_PRIMARY=$backup_server
    FAILED_CHECKS=0
}

# Main monitoring loop
while true; do
    if check_server "$CURRENT_PRIMARY" && check_web_interface "$CURRENT_PRIMARY"; then
        log_message "Primary server $CURRENT_PRIMARY is healthy"
        FAILED_CHECKS=0
    else
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        log_message "Primary server $CURRENT_PRIMARY check failed ($FAILED_CHECKS/$FAILOVER_THRESHOLD)"
        
        if [ $FAILED_CHECKS -ge $FAILOVER_THRESHOLD ]; then
            log_message "Failover threshold reached for $CURRENT_PRIMARY"
            
            # Find healthy backup server
            for backup in "${BACKUP_SERVERS[@]}"; do
                if check_server "$backup" && check_web_interface "$backup"; then
                    failover_to_backup "$backup"
                    break
                fi
            done
            
            # If no backup is healthy, alert
            if [ $FAILED_CHECKS -ge $FAILOVER_THRESHOLD ]; then
                log_message "CRITICAL: No healthy backup servers available!"
                vantage alerts send critical \
                  --message "RLM HA cluster: No healthy servers available" \
                  --component licensing
            fi
        fi
    fi
    
    sleep 60  # Check every minute
done
```

## Performance Optimization for HA

### Load Distribution Configuration

```bash
# Configure intelligent load balancing in Vantage
vantage licenses config rlm-ha-cluster \
  --load-balancing intelligent \
  --session-affinity true \
  --health-check-interval 30s \
  --failover-detection fast

# Optimize for different workload patterns
vantage licenses optimize rlm-ha-cluster \
  --strategy geographic \
  --prefer-local-server true \
  --connection-pooling enabled \
  --max-connections-per-server 200
```

### Monitoring Dashboard for HA

```yaml
# RLM HA monitoring dashboard
apiVersion: dashboard.vantage.com/v1
kind: Dashboard
metadata:
  name: rlm-ha-monitoring
spec:
  title: "RLM High Availability Status"
  refresh: 30s
  panels:
  - title: "Server Health Matrix"
    type: stat
    targets:
    - query: rlm_server_up{cluster="rlm-ha-cluster"}
      legend: "{{server}}"
    visualization:
      colorMode: "value"
      graphMode: "none"
    
  - title: "License Distribution Across Servers"
    type: bargraph
    targets:
    - query: rlm_license_usage_by_server{cluster="rlm-ha-cluster"}
      legend: "{{server}} - {{feature}}"
    
  - title: "Failover Events Timeline"
    type: timeline
    targets:
    - query: rlm_failover_events{cluster="rlm-ha-cluster"}
      timeRange: 7d
    
  - title: "Response Time by Server"
    type: timeseries
    targets:
    - query: rlm_response_time{cluster="rlm-ha-cluster"}
      legend: "{{server}}"
    
  - title: "Web Interface Status"
    type: stat
    targets:
    - query: rlm_web_interface_up{cluster="rlm-ha-cluster"}
      legend: "{{server}} Web"
    
  alerts:
  - name: "RLM HA Cluster Health"
    condition: "healthy_servers < 2"
    severity: warning
    message: "RLM HA cluster has less than 2 healthy servers"
  
  - name: "Web Interface Down"
    condition: "rlm_web_interface_up == 0"
    severity: warning
    message: "RLM web interface is down on {{$labels.server}}"
```

## Backup and Recovery

### Automated HA Backup Strategy

```bash
#!/bin/bash
# /opt/rlm/bin/rlm-ha-backup.sh

BACKUP_DIR="/backup/rlm-ha"
DATE=$(date +%Y%m%d-%H%M%S)
SERVERS=("rlm1.vantage.com" "rlm2.vantage.com" "rlm3.vantage.com")

mkdir -p "$BACKUP_DIR/$DATE"

for server in "${SERVERS[@]}"; do
    echo "Backing up $server..."
    
    # Create server-specific backup
    ssh "$server" "
        sudo systemctl stop rlm-ha
        tar -czf /tmp/rlm-ha-backup-$DATE.tar.gz \
            /opt/rlm/licenses/ \
            /opt/rlm/rlm.conf \
            /opt/rlm/ssl/ \
            /opt/rlm/logs/rlm.log \
            /etc/systemd/system/rlm-ha.service
        sudo systemctl start rlm-ha
    "
    
    # Download backup
    scp "$server:/tmp/rlm-ha-backup-$DATE.tar.gz" \
        "$BACKUP_DIR/$DATE/$server-backup.tar.gz"
    
    # Clean up remote backup
    ssh "$server" "rm /tmp/rlm-ha-backup-$DATE.tar.gz"
done

# Backup HAProxy configuration
cp /etc/haproxy/haproxy.cfg "$BACKUP_DIR/$DATE/"

# Backup Vantage HA configuration
vantage licenses export rlm-ha-cluster > "$BACKUP_DIR/$DATE/vantage-ha-config.yaml"

# Create cluster documentation
cat > "$BACKUP_DIR/$DATE/cluster-info.txt" << EOF
# RLM HA Cluster Backup
Date: $(date)
Servers: ${SERVERS[*]}
Primary: ${SERVERS[0]}
Load Balancer: rlm-lb.vantage.com
Configuration: Shared NFS storage

# Recovery Instructions
1. Restore each server from backup
2. Verify NFS mounts
3. Start RLM services in order
4. Update load balancer configuration
5. Test failover functionality
EOF

echo "RLM HA cluster backup completed: $BACKUP_DIR/$DATE"
```

## Testing HA Configuration

### HA Testing Script

```bash
#!/bin/bash
# /opt/rlm/bin/test-rlm-ha.sh

echo "Testing RLM HA configuration..."

# Test 1: Verify all servers are responding
echo "1. Testing server connectivity..."
for server in rlm1.vantage.com rlm2.vantage.com rlm3.vantage.com; do
    if timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "5053@$server" > /dev/null 2>&1; then
        echo "  ✓ $server responding"
    else
        echo "  ✗ $server not responding"
    fi
done

# Test 2: Verify web interfaces
echo
echo "2. Testing web interfaces..."
for server in rlm1.vantage.com rlm2.vantage.com rlm3.vantage.com; do
    if timeout 10 curl -k -s "https://$server:5054/" > /dev/null 2>&1; then
        echo "  ✓ $server web interface accessible"
    else
        echo "  ✗ $server web interface not accessible"
    fi
done

# Test 3: Test load balancer
echo
echo "3. Testing load balancer..."
if timeout 10 /opt/rlm/bin/rlmutil rlmstat -c "5053@rlm-lb.vantage.com" > /dev/null 2>&1; then
    echo "  ✓ Load balancer working"
else
    echo "  ✗ Load balancer not working"
fi

# Test 4: Test license checkout through load balancer
echo
echo "4. Testing license functionality..."
if timeout 30 /opt/rlm/bin/rlmutil rlmstat -f -c "5053@rlm-lb.vantage.com" > /dev/null 2>&1; then
    echo "  ✓ License checkout working"
else
    echo "  ✗ License checkout failed"
fi

echo
echo "RLM HA testing complete"
```

## Next Steps

- **[Monitoring & Analytics](/platform/licenses/how-to-guides/rlm/monitoring)**: Set up comprehensive monitoring
- **[Troubleshooting](/platform/licenses/how-to-guides/rlm/troubleshooting)**: Handle HA-specific issues
- **[RLM Introduction](./)**: Return to main RLM overview

---

> **Production Recommendation**: RLM's web-based administration makes HA management more accessible than traditional license managers. Always test failover procedures and ensure your web interface SSL certificates are properly configured for secure remote administration.
