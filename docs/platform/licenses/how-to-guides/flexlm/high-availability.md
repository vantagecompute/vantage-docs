---
id: high-availability
title: High Availability
sidebar_position: 4
description: Configure FlexLM for high availability in Vantage environments.
---

# FlexLM High Availability

Ensure your FlexLM license servers remain available for critical workloads with redundant configurations and failover capabilities integrated with Vantage.

## Overview

High availability (HA) for FlexLM involves setting up redundant license servers that can automatically take over if the primary server fails. Vantage provides built-in support for FlexLM HA configurations with automatic failover and monitoring.

## Vantage HA Integration

### HA Configuration in Vantage

```yaml
# License server HA configuration
apiVersion: licensing.vantage.com/v1
kind: LicenseServer
metadata:
  name: flexlm-ha-cluster
spec:
  type: flexlm
  highAvailability:
    enabled: true
    mode: three-server
    primary:
      host: license1.vantage.com
      port: 27000
    secondary:
      host: license2.vantage.com
      port: 27000
    tertiary:
      host: license3.vantage.com
      port: 27000
  monitoring:
    healthCheck:
      interval: 30s
      timeout: 10s
      retries: 3
    failover:
      automatic: true
      threshold: 3  # Failed health checks before failover
      cooldown: 300s  # 5 minutes between failovers
  features:
    - name: FLUENT
      vendor: ansyslmd
    - name: CFX
      vendor: ansyslmd
```

### Vantage HA Management

```bash
# Deploy HA license configuration
vantage licenses deploy flexlm-ha-cluster.yaml

# Check HA status
vantage licenses status flexlm-ha-cluster --show-ha

# View current primary server
vantage licenses primary flexlm-ha-cluster

# Force failover (maintenance scenarios)
vantage licenses failover flexlm-ha-cluster --to license2.vantage.com

# Monitor HA cluster health
vantage licenses monitor flexlm-ha-cluster --follow
```

## Three-Server Redundant Configuration

### License File Configuration

Create redundant license files for all three servers:

```bash
# license1.vantage.com - Primary server license file
SERVER license1.vantage.com 001122334455 27000
SERVER license2.vantage.com 002233445566 27000  
SERVER license3.vantage.com 003344556677 27000

USE_SERVER

VENDOR ansyslmd
FEATURE FLUENT ansyslmd 2023.1000 permanent 50 \
        VENDOR_STRING=ANSYS \
        SIGN=60B459C90C71 \
        dup_group=UHD

FEATURE CFX ansyslmd 2023.1000 permanent 25 \
        VENDOR_STRING=ANSYS \
        SIGN=50A348B80B62 \
        dup_group=UHD

### Network Configuration

**Configure networking for HA:**

```bash
# On each server, configure hostname resolution
sudo tee -a /etc/hosts <<EOF
192.168.1.10 license1.vantage.com license1
192.168.1.11 license2.vantage.com license2  
192.168.1.12 license3.vantage.com license3
EOF

# Configure firewall rules
sudo firewall-cmd --permanent --add-port=27000/tcp
sudo firewall-cmd --permanent --add-port=27001-27020/tcp
sudo firewall-cmd --reload

# Enable IP forwarding if needed for load balancer
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Load Balancer Integration

### HAProxy Configuration

```bash
# Install HAProxy for license server load balancing
sudo yum install haproxy -y

# Configure HAProxy
sudo tee /etc/haproxy/haproxy.cfg > /dev/null <<EOF
global
    daemon
    log 127.0.0.1:514 local0
    
defaults
    mode tcp
    option tcplog
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    retries 3

frontend flexlm_frontend
    bind *:27000
    default_backend flexlm_servers

backend flexlm_servers
    balance roundrobin
    option tcp-check
    tcp-check send "STATUS\r\n"
    tcp-check expect string "license server UP"
    
    server license1 license1.vantage.com:27000 check inter 10s
    server license2 license2.vantage.com:27000 check inter 10s backup
    server license3 license3.vantage.com:27000 check inter 10s backup

listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
EOF

# Start HAProxy
sudo systemctl enable haproxy
sudo systemctl start haproxy
```

### Client Configuration for HA

```bash
# Configure clients to use load balancer
export ANSYSLMD_LICENSE_FILE="27000@license-lb.vantage.com"

# Or configure all three servers as fallback
export ANSYSLMD_LICENSE_FILE="27000@license1.vantage.com:27000@license2.vantage.com:27000@license3.vantage.com"

# For Vantage job submissions
vantage cluster config update \
  --license-servers "27000@license-lb.vantage.com" \
  --license-failover-enabled true
```

## Monitoring and Health Checks

### Vantage HA Monitoring

```bash
# Set up comprehensive monitoring
vantage licenses monitor flexlm-ha-cluster \
  --enable-health-checks \
  --check-interval 30s \
  --alert-on-failover \
  --notification-webhook https://alerts.vantage.com/webhooks/licenses

# Configure alerting rules
vantage alerts create license-ha-alert \
  --condition "license_server_down > 0" \
  --duration 60s \
  --message "FlexLM server in HA cluster is down" \
  --severity critical
```

### Custom Health Check Scripts

```bash
#!/bin/bash
# /opt/flexlm/bin/ha-health-check.sh

SERVERS=("license1.vantage.com" "license2.vantage.com" "license3.vantage.com")
FAILED_SERVERS=()
HEALTHY_SERVERS=()

echo "FlexLM HA Health Check - $(date)"
echo "================================"

for server in "${SERVERS[@]}"; do
    echo -n "Checking $server:27000 ... "
    
    # Test license server response
    if timeout 10 lmutil lmstat -c "27000@$server" > /dev/null 2>&1; then
        echo "OK"
        HEALTHY_SERVERS+=($server)
        
        # Check feature availability
        feature_count=$(lmutil lmstat -f -c "27000@$server" 2>/dev/null | grep -c "Users of")
        echo "  Features available: $feature_count"
        
    else
        echo "FAILED"
        FAILED_SERVERS+=($server)
    fi
done

echo
echo "Summary:"
echo "  Healthy servers: ${#HEALTHY_SERVERS[@]} (${HEALTHY_SERVERS[*]})"
echo "  Failed servers: ${#FAILED_SERVERS[@]} (${FAILED_SERVERS[*]})"

# Update Vantage with health status
if [ ${#HEALTHY_SERVERS[@]} -gt 0 ]; then
    vantage licenses update-health flexlm-ha-cluster \
      --healthy-servers "${HEALTHY_SERVERS[*]}" \
      --failed-servers "${FAILED_SERVERS[*]}"
fi

# Exit with error if no servers are healthy
if [ ${#HEALTHY_SERVERS[@]} -eq 0 ]; then
    echo "CRITICAL: No healthy license servers available!"
    exit 1
fi

exit 0
```

## Testing HA Configuration

### Automated HA Testing

```bash
# Test failover capabilities
#!/bin/bash
# /opt/flexlm/bin/test-ha-failover.sh

echo "Testing FlexLM HA configuration..."

# Test 1: Verify all servers are responding
echo "1. Testing server connectivity..."
for server in license1.vantage.com license2.vantage.com license3.vantage.com; do
    if timeout 10 lmutil lmstat -c "27000@$server" > /dev/null 2>&1; then
        echo "  ✓ $server responding"
    else
        echo "  ✗ $server not responding"
    fi
done

# Test 2: Simulate primary server failure
echo
echo "2. Testing failover (simulation)..."
PRIMARY=$(vantage licenses primary flexlm-ha-cluster)
echo "Current primary: $PRIMARY"

# Test 3: Verify license functionality after failover
echo
echo "3. Testing license functionality..."
NEW_PRIMARY=$(vantage licenses primary flexlm-ha-cluster)
if timeout 30 lmutil lmstat -f FLUENT -c "27000@$NEW_PRIMARY" > /dev/null 2>&1; then
    echo "  ✓ Licenses accessible"
else
    echo "  ✗ License access failed"
fi

echo
echo "HA testing complete"
```

## Backup and Recovery

### Automated Backup Strategy

```bash
# Create backup of license server configuration
#!/bin/bash
# /opt/flexlm/bin/backup-config.sh

BACKUP_DIR="/opt/backups/flexlm/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup license files
cp -r /opt/flexlm/licenses/ $BACKUP_DIR/

# Backup configuration files
cp /etc/systemd/system/flexlm-ansys.service $BACKUP_DIR/
cp /etc/haproxy/haproxy.cfg $BACKUP_DIR/ 2>/dev/null || true

# Export Vantage configuration
vantage licenses export flexlm-ha-cluster > $BACKUP_DIR/vantage-config.yaml

# Create manifest
cat > $BACKUP_DIR/manifest.txt <<EOF
FlexLM HA Configuration Backup
Created: $(date)
Hostname: $(hostname)
Backup includes:
- License files
- Service configuration
- HAProxy configuration (if present)
- Vantage license configuration
EOF

echo "Backup created: $BACKUP_DIR"
```

### Recovery Procedures

```bash
# Restore from backup
#!/bin/bash
# /opt/flexlm/bin/restore-config.sh

BACKUP_DIR=$1
if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: $0 <backup_directory>"
    exit 1
fi

echo "Restoring FlexLM configuration from $BACKUP_DIR"

# Stop services
sudo systemctl stop flexlm-ansys
sudo systemctl stop haproxy 2>/dev/null || true

# Restore license files
sudo cp -r $BACKUP_DIR/licenses/* /opt/flexlm/licenses/

# Restore service configuration
sudo cp $BACKUP_DIR/flexlm-ansys.service /etc/systemd/system/
sudo systemctl daemon-reload

# Restore HAProxy configuration if present
if [ -f "$BACKUP_DIR/haproxy.cfg" ]; then
    sudo cp $BACKUP_DIR/haproxy.cfg /etc/haproxy/
fi

# Restore Vantage configuration
if [ -f "$BACKUP_DIR/vantage-config.yaml" ]; then
    vantage licenses import $BACKUP_DIR/vantage-config.yaml
fi

# Start services
sudo systemctl start flexlm-ansys
sudo systemctl start haproxy 2>/dev/null || true

# Verify restoration
echo "Verification:"
sudo systemctl status flexlm-ansys
lmutil lmstat -c 27000@localhost

echo "Restoration complete"
```

## Performance Optimization for HA

### Load Distribution

```bash
# Configure license load balancing in Vantage
vantage licenses config flexlm-ha-cluster \
  --load-balancing round-robin \
  --sticky-sessions false \
  --health-check-interval 30s

# Optimize for different workload patterns
vantage licenses optimize flexlm-ha-cluster \
  --strategy distributed \
  --prefer-local-server true \
  --connection-pooling enabled
```

### Monitoring Dashboard Configuration

```yaml
# Vantage dashboard for HA monitoring
apiVersion: dashboard.vantage.com/v1
kind: Dashboard
metadata:
  name: flexlm-ha-monitoring
spec:
  title: "FlexLM High Availability Status"
  refresh: 30s
  panels:
  - title: "Server Health Status"
    type: stat
    targets:
    - query: license_server_up{cluster="flexlm-ha-cluster"}
      legend: "{{server}}"
    
  - title: "License Usage Distribution"
    type: bargraph
    targets:
    - query: license_usage_by_server{cluster="flexlm-ha-cluster"}
      legend: "{{server}} - {{feature}}"
    
  - title: "Failover Events"
    type: timeline
    targets:
    - query: license_failover_events{cluster="flexlm-ha-cluster"}
      timeRange: 24h
    
  alerts:
  - name: "HA Cluster Health"
    condition: "healthy_servers < 2"
    severity: warning
    message: "FlexLM HA cluster has less than 2 healthy servers"
```

## Maintenance and Updates

### Rolling Updates

```bash
# Perform rolling update of license servers
#!/bin/bash
# /opt/flexlm/bin/rolling-update.sh

SERVERS=("license1.vantage.com" "license2.vantage.com" "license3.vantage.com")
UPDATE_PACKAGE="/tmp/flexlm-update.tar.gz"

for server in "${SERVERS[@]}"; do
    echo "Updating $server..."
    
    # Put server in maintenance mode
    vantage licenses maintenance flexlm-ha-cluster --server $server --enable
    
    # Wait for connections to drain
    sleep 60
    
    # Perform update on server
    ssh $server "
        sudo systemctl stop flexlm-ansys
        sudo tar -xzf $UPDATE_PACKAGE -C /opt/flexlm/bin
        sudo systemctl start flexlm-ansys
    "
    
    # Verify server is healthy
    sleep 30
    if timeout 30 lmutil lmstat -c "27000@$server" > /dev/null 2>&1; then
        echo "  ✓ $server updated successfully"
        
        # Remove from maintenance mode
        vantage licenses maintenance flexlm-ha-cluster --server $server --disable
    else
        echo "  ✗ $server update failed"
        exit 1
    fi
done

echo "Rolling update completed"
```

## Next Steps

- **[Monitoring & Analytics](monitoring)**: Set up comprehensive monitoring
- **[Troubleshooting](troubleshooting)**: Handle HA-specific issues
- **[FlexLM Introduction](./)**: Return to main FlexLM overview

---

> **Production Recommendation**: Always test HA failover procedures in a staging environment before implementing in production. Document your specific failover scenarios and recovery procedures for your operations team.
ssh "$TARGET_SERVER" "sed -i 's/old-hostname/$(hostname)/g' /opt/flexlm/licenses/ansys-ha.lic"

# Restart service
ssh "$TARGET_SERVER" "systemctl start flexlm-ansys-ha"

# Verify recovery
sleep 10
if ssh "$TARGET_SERVER" "/opt/flexlm/bin/lmutil lmstat -c /opt/flexlm/licenses/ansys-ha.lic" > /dev/null; then
    echo "Recovery successful for $TARGET_SERVER"
else
    echo "Recovery failed for $TARGET_SERVER"
    exit 1
fi
```

## Integration with Vantage HA

### Register HA Cluster

```bash
# Register the HA cluster with Vantage
vantage licenses add \
  --type flexlm-ha \
  --vendor ansys \
  --servers "primary-license.vantage.com:27000,secondary-license.vantage.com:27000,tertiary-license.vantage.com:27000" \
  --name "ANSYS FlexLM HA Cluster" \
  --description "Three-server FlexLM cluster for high availability" \
  --redundancy-mode "three-server" \
  --min-healthy 2

# Configure cluster monitoring
vantage licenses monitor enable ansys-flexlm-ha \
  --interval 30 \
  --check-all-servers \
  --alerts server_down,cluster_degraded,failover_occurred
```

### Cluster Status Dashboard

```bash
# View cluster status in Vantage
vantage licenses status ansys-flexlm-ha --detailed

# Get cluster health metrics
vantage licenses health ansys-flexlm-ha \
  --show-individual-servers \
  --include-performance-metrics

# View failover history
vantage licenses events ansys-flexlm-ha --type failover --last 30d
```

## Performance Optimization

### Network Optimization

```bash
# Optimize TCP settings for license server communication
echo 'net.ipv4.tcp_fin_timeout = 30' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_keepalive_time = 120' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_keepalive_intvl = 30' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_keepalive_probes = 3' >> /etc/sysctl.conf
sysctl -p

# Configure license client timeouts
export FLEXLM_TIMEOUT=10000
export LM_CONNECT_TIMEOUT=10000
```

### Load Distribution

```bash
# Configure preferred server order for different applications
# ANSYS applications prefer primary server
export ANSYSLMD_LICENSE_FILE="27000@primary-license.vantage.com:27000@secondary-license.vantage.com:27000@tertiary-license.vantage.com"

# MATLAB applications prefer secondary server  
export MLM_LICENSE_FILE="27000@secondary-license.vantage.com:27000@primary-license.vantage.com:27000@tertiary-license.vantage.com"
```

## Next Steps

- **[Monitoring & Analytics](monitoring)**: Set up comprehensive cluster monitoring
- **[Troubleshooting](troubleshooting)**: Diagnose HA-specific issues

---

> **Best Practice**: Always test failover scenarios in a development environment before implementing HA in production. Document your disaster recovery procedures and test them regularly.
