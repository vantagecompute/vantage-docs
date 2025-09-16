---
id: troubleshooting
title: Troubleshooting
sidebar_position: 5
description: Diagnose and resolve common LMX license server issues in Vantage environments.
---

# LMX Troubleshooting

This guide helps you diagnose and resolve common X-Formation LMX license server issues within Vantage environments, focusing on integration problems, borrowing issues, and performance optimization for enterprise deployments.

## Vantage Integration Issues

### License Server Connection Problems

**Symptoms**:
- Server appears offline in Vantage dashboard
- "Connection timeout" errors in Vantage logs
- Jobs fail with LMX license checkout errors
- Web interface integration not working

**Diagnosis**:
```bash
# Test basic connectivity to LMX server
vantage licenses test lmx-server --verbose

# Check server status from command line
/opt/lmx/bin/lmxendutil -licstat -c 6200@lmx-server.company.com

# Test network connectivity
telnet lmx-server.company.com 6200
telnet lmx-server.company.com 8080

# Check Vantage integration logs
vantage logs license-monitor --component lmx --tail 100

# Test web interface connectivity
curl -k https://lmx-server.company.com:8080/status
```

**Resolution**:
```bash
# 1. Verify server configuration in Vantage
vantage licenses show lmx-server --full-config

# 2. Update server configuration if needed
vantage licenses update lmx-server \
  --host lmx-server.company.com \
  --port 6200 \
  --web-port 8080 \
  --ssl-port 8443 \
  --type lmx

# 3. Test connection with detailed diagnostics
vantage licenses ping lmx-server --timeout 30 --retry 3

# 4. If SSL issues, check certificates
openssl s_client -connect lmx-server.company.com:8443 -verify_return_error

# 5. Restart license monitoring if needed
vantage system restart license-monitor
```

### Dashboard Data Inconsistencies

**Symptoms**:
- License usage doesn't match LMX web interface
- Borrowing information is incorrect or missing
- Historical data shows gaps or anomalies
- User attribution is wrong

**Diagnosis**:
```bash
# Compare Vantage data with direct LMX query
vantage licenses usage lmx-server --feature ANSYS_CFX --detailed
/opt/lmx/bin/lmxendutil -licstat -f ANSYS_CFX -c 6200@lmx-server.company.com

# Check borrowing status consistency
vantage licenses borrowing-status lmx-server
/opt/lmx/bin/lmxendutil -borrowinfo -c 6200@lmx-server.company.com

# Review monitoring agent status
vantage system status --component license-monitor --server lmx-server

# Check data collection logs for errors
vantage logs license-monitor --component lmx-parser --errors-only

# Verify web interface data
curl -u admin:password -k https://lmx-server.company.com:8080/api/usage
```

**Resolution**:
```bash
# 1. Restart license monitoring agent
vantage system restart license-monitor --component lmx

# 2. Force data refresh from LMX server
vantage licenses refresh lmx-server --force-sync

# 3. Verify and update monitoring configuration
vantage licenses config lmx-server --show-monitoring-config

# 4. Resync historical data if needed
vantage licenses resync lmx-server \
  --full-resync \
  --include-borrowing-data \
  --include-web-interface-data

# 5. Check and fix data parser configuration
vantage licenses config lmx-server --parser-debug-mode true
```

### Borrowing Integration Issues

**Symptoms**:
- Borrowing requests fail through Vantage interface
- Borrowed licenses not showing in dashboard
- Automatic return not working
- Cross-site borrowing failures

**Diagnosis**:
```bash
# Test borrowing functionality
vantage licenses borrow ANSYS_CFX \
  --server lmx-server \
  --duration 8h \
  --test-mode \
  --verbose

# Check borrowing configuration
vantage licenses borrowing-config lmx-server --show-all

# Direct LMX borrowing test
/opt/lmx/bin/lmxendutil -borrow ANSYS_CFX 8:0:0 -c 6200@lmx-server.company.com

# Check borrowing logs
sudo tail -f /opt/lmx/logs/borrowing.log

# Test return functionality
/opt/lmx/bin/lmxendutil -return ANSYS_CFX -c 6200@lmx-server.company.com
```

**Resolution**:
```bash
# 1. Verify borrowing is enabled in LMX configuration
sudo grep -E "BORROW|borrowing" /opt/lmx/config/lmx.conf

# 2. Check license file borrowing permissions
sudo grep -E "BORROW" /opt/lmx/licenses/*/*.lic

# 3. Update Vantage borrowing configuration
vantage licenses borrowing-config lmx-server \
  --enable-borrowing true \
  --default-duration 8h \
  --max-duration 168h \
  --auto-return true

# 4. Test borrowing integration
vantage licenses test-borrowing lmx-server \
  --feature ANSYS_CFX \
  --duration 1h \
  --verify-return

# 5. Check user permissions for borrowing
vantage users permissions john.doe --show-license-borrowing
```

## LMX Server Problems

### Server Startup Failures

**Symptoms**:
- LMX daemon fails to start
- "Cannot bind to port" errors
- License file parsing errors
- SSL certificate issues

**Diagnostic Commands**:
```bash
# Check LMX server startup directly
sudo -u lmx /opt/lmx/bin/lmxendutil -c /opt/lmx/config/lmx.conf -log +

# Test configuration file syntax
sudo -u lmx /opt/lmx/bin/lmxendutil -test -c /opt/lmx/config/lmx.conf

# Check port availability
sudo netstat -tlnp | grep -E ":6200|:8080"
sudo lsof -i :6200

# Verify file permissions
ls -la /opt/lmx/
ls -la /opt/lmx/licenses/
ls -la /opt/lmx/config/

# Check system logs
sudo journalctl -u lmx -f
sudo tail -f /opt/lmx/logs/lmx.log
```

**Common Fixes**:
```bash
# 1. Fix file permissions
sudo chown -R lmx:lmx /opt/lmx/
sudo chmod 644 /opt/lmx/config/lmx.conf
sudo chmod 644 /opt/lmx/licenses/*/*.lic
sudo chmod 755 /opt/lmx/bin/*

# 2. Clear port conflicts
sudo systemctl stop lmx
sudo fuser -k 6200/tcp 8080/tcp
sleep 5
sudo systemctl start lmx

# 3. Fix SSL certificate issues
sudo -u lmx openssl req -x509 -newkey rsa:4096 \
  -keyout /opt/lmx/ssl/server.key \
  -out /opt/lmx/ssl/server.crt \
  -days 365 -nodes \
  -subj "/CN=lmx-server.company.com"

# 4. Test with minimal configuration
sudo -u lmx /opt/lmx/bin/lmxendutil -c /opt/lmx/config/minimal.conf -test

# 5. Check system resources
df -h /opt/lmx
free -h
ps aux | grep lmx
```

### License Feature Availability Issues

**Symptoms**:
- "Feature not found" errors
- Licenses appear expired when they shouldn't be
- Borrowing not allowed for certain features
- Web interface shows incorrect feature counts

**Diagnosis**:
```bash
# Check all available features
/opt/lmx/bin/lmxendutil -licstat -c 6200@lmx-server.company.com

# Check specific feature details
/opt/lmx/bin/lmxendutil -licstat -f ANSYS_CFX -c 6200@lmx-server.company.com

# Verify license file syntax and content
sudo -u lmx /opt/lmx/bin/lmxendutil -licinfo /opt/lmx/licenses/ansys/ansys.lic

# Check system time synchronization
date
timedatectl status
chrony tracking  # or ntpq -p

# Check license file loading
sudo tail -f /opt/lmx/logs/lmx.log | grep -E "LICENSE|FEATURE"

# Test feature checkout directly
/opt/lmx/bin/lmxendutil -checkout ANSYS_CFX 1 -c 6200@lmx-server.company.com
```

**Resolution Steps**:
```bash
# 1. Synchronize system time
sudo chrony sources -v
sudo chrony makestep  # If large time difference

# 2. Reload license files
sudo systemctl reload lmx
# or
/opt/lmx/bin/lmxendutil -reread -c 6200@lmx-server.company.com

# 3. Verify license file format and content
sudo dos2unix /opt/lmx/licenses/*/*.lic
sudo -u lmx /opt/lmx/bin/lmxendutil -licverify /opt/lmx/licenses/ansys/ansys.lic

# 4. Check for license expiration
grep -E "permanent|exp-date" /opt/lmx/licenses/*/*.lic

# 5. Test individual features
for feature in ANSYS_CFX ANSYS_FLUENT COMSOL_MULTIPHYSICS; do
    echo "Testing $feature:"
    /opt/lmx/bin/lmxendutil -licstat -f "$feature" -c 6200@lmx-server.company.com
done

# 6. Update Vantage feature discovery
vantage licenses discover lmx-server --features --force-refresh
```

### High License Usage and Performance Issues

**Symptoms**:
- Slow license checkout/checkin times
- Long job queue times in Vantage
- "All licenses in use" errors frequently
- Web interface becomes unresponsive

**Investigation**:
```bash
# Check current license usage and performance
/opt/lmx/bin/lmxendutil -licstat -a -c 6200@lmx-server.company.com

# Monitor license checkout performance
time /opt/lmx/bin/lmxendutil -checkout ANSYS_CFX 1 -c 6200@lmx-server.company.com
time /opt/lmx/bin/lmxendutil -checkin ANSYS_CFX 1 -c 6200@lmx-server.company.com

# Check server resource usage
top -p $(pgrep lmxendutil)
iostat -x 1 5
netstat -an | grep :6200 | wc -l

# Check for license queuing
vantage licenses queue lmx-server --show-waiting --show-priorities

# Check borrowing load
/opt/lmx/bin/lmxendutil -borrowinfo -c 6200@lmx-server.company.com

# Monitor web interface performance
curl -w "@curl-format.txt" -k -u admin:password \
  "https://lmx-server.company.com:8080/status"
```

**Performance Optimization**:
```bash
# 1. Optimize LMX server configuration
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# Performance Optimization Settings
MAX_CONNECTIONS 1000
CONNECTION_TIMEOUT 300
THREAD_POOL_SIZE 50
CACHE_SIZE_LICENSES 5000
CACHE_SIZE_SESSIONS 10000
HEARTBEAT_INTERVAL 60

# Borrowing Optimization
BORROW_CACHE_ENABLE true
BORROW_CACHE_SIZE 1000
BORROW_CLEANUP_INTERVAL 3600
EOF

# 2. Implement license timeouts for idle sessions
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# Idle Session Management
IDLE_TIMEOUT 7200
IDLE_CHECK_INTERVAL 300
AUTO_CHECKIN_IDLE true
EOF

# 3. Configure license reservations for critical users
# Add to license files:
RESERVE 2 USER critical_user1 critical_user2

# 4. Set up intelligent queuing in Vantage
vantage licenses optimize lmx-server \
  --enable-intelligent-queuing \
  --queue-timeout 1800 \
  --priority-based-allocation \
  --fair-share-scheduling

# 5. Monitor and adjust connection limits
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF
CONCURRENT_CHECKOUTS_MAX 500
PARALLEL_PROCESSING_ENABLE true
LOAD_BALANCING_ENABLE true
EOF

# 6. Restart LMX to apply changes
sudo systemctl restart lmx
```

## Client-Side Issues

### Application License Connection Problems

**Symptoms**:
- Applications can't find license server
- Intermittent license failures
- "License server down" errors
- Borrowing not working from client applications

**Client Diagnosis**:
```bash
# Check environment variables
echo $LMX_LICENSE_FILE
echo $VENDOR_LICENSE_FILE

# Test client connectivity to LMX server
/opt/lmx/bin/lmxendutil -licstat -c 6200@lmx-server.company.com

# Check for client-side LMX libraries
ldd /path/to/application | grep -i lmx
find /usr/local -name "*lmx*" 2>/dev/null

# Test application-specific license checkout
ansys -license_server 6200@lmx-server.company.com -version
comsol -license_file 6200@lmx-server.company.com -version

# Check client-side logs
tail -f ~/.lmx/debug.log
tail -f /tmp/lmx_client.log
```

**Client-Side Fixes**:
```bash
# 1. Set correct environment variables
export LMX_LICENSE_FILE="6200@lmx-server.company.com"
export ANSYS_LICENSE_FILE="6200@lmx-server.company.com"

# 2. Add to user's shell profile
echo 'export LMX_LICENSE_FILE="6200@lmx-server.company.com"' >> ~/.bashrc
echo 'export ANSYS_LICENSE_FILE="6200@lmx-server.company.com"' >> ~/.bashrc

# 3. System-wide configuration
echo 'LMX_LICENSE_FILE=6200@lmx-server.company.com' | sudo tee -a /etc/environment

# 4. Create application-specific license file
mkdir -p ~/.ansys
echo "6200@lmx-server.company.com" > ~/.ansys/licensing.lic

# 5. Test license checkout
/opt/lmx/bin/lmxendutil -checkout ANSYS_CFX 1 -c 6200@lmx-server.company.com

# 6. For Vantage job submissions, verify job configuration
vantage jobs validate your-job.yaml --check-licenses --license-type lmx
```

### Borrowing Problems on Client Side

**Symptoms**:
- Borrowed licenses not working offline
- Cannot return borrowed licenses
- Borrowing duration too short/long
- Multiple borrowing conflicts

**Borrowing Diagnosis**:
```bash
# Check current borrowed licenses
/opt/lmx/bin/lmxendutil -borrowinfo

# Test borrowing functionality
/opt/lmx/bin/lmxendutil -borrow ANSYS_CFX 24:0:0 -c 6200@lmx-server.company.com

# Check borrowed license file location
ls -la ~/.lmx/
cat ~/.lmx/borrowed_licenses.lic

# Test offline functionality
# Disconnect from network
/opt/lmx/bin/lmxendutil -licstat -c 6200@localhost  # Should work with borrowed licenses

# Test license return
/opt/lmx/bin/lmxendutil -return ANSYS_CFX
```

**Borrowing Fixes**:
```bash
# 1. Set appropriate borrowing environment variables
export LMX_BORROW_FILE="~/.lmx/borrowed_licenses.lic"
export LMX_BORROW_DIR="~/.lmx"

# 2. Create borrowing directory with correct permissions
mkdir -p ~/.lmx
chmod 755 ~/.lmx

# 3. Configure automatic borrowing for mobile users
echo "BORROW_DURATION_DEFAULT=24:0:0" >> ~/.lmx/config
echo "AUTO_BORROW_ENABLE=true" >> ~/.lmx/config

# 4. Test borrowing with specific duration
/opt/lmx/bin/lmxendutil -borrow ANSYS_CFX 48:0:0 -c 6200@lmx-server.company.com

# 5. Set up automatic return via cron
echo "0 18 * * * /opt/lmx/bin/lmxendutil -return ALL" | crontab -

# 6. For Vantage-managed borrowing
vantage licenses borrow ANSYS_CFX \
  --duration 24h \
  --auto-return true \
  --mobile-user true
```

## Web Interface Issues

### Web Interface Connectivity Problems

**Symptoms**:
- Cannot access LMX web interface
- SSL/TLS certificate errors
- Authentication failures
- Slow web interface response

**Web Interface Diagnosis**:
```bash
# Check if web interface is enabled and running
sudo grep -E "WEBINTERFACE" /opt/lmx/config/lmx.conf
sudo netstat -tlnp | grep :8080

# Test web interface connectivity
curl -I http://lmx-server.company.com:8080
curl -k -I https://lmx-server.company.com:8443

# Check SSL certificate
openssl s_client -connect lmx-server.company.com:8443 -servername lmx-server.company.com

# Check web interface logs
sudo tail -f /opt/lmx/logs/web.log

# Test authentication
curl -k -u admin:password https://lmx-server.company.com:8443/status
```

**Web Interface Fixes**:
```bash
# 1. Enable web interface in configuration
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF
WEBINTERFACE_ENABLE true
WEBINTERFACE_PORT 8080
WEBINTERFACE_SSL_ENABLE true
WEBINTERFACE_SSL_PORT 8443
EOF

# 2. Generate new SSL certificate
sudo -u lmx openssl req -x509 -newkey rsa:4096 \
  -keyout /opt/lmx/ssl/server.key \
  -out /opt/lmx/ssl/server.crt \
  -days 365 -nodes \
  -subj "/CN=lmx-server.company.com"

# 3. Set up authentication
echo "admin:$(openssl passwd -1 'SecurePassword123')" | sudo tee /opt/lmx/config/users.conf

# 4. Update configuration for authentication
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF
WEBINTERFACE_AUTHENTICATION true
WEBINTERFACE_USERS_FILE /opt/lmx/config/users.conf
EOF

# 5. Restart LMX service
sudo systemctl restart lmx

# 6. Test web interface access
curl -k -u admin:SecurePassword123 https://lmx-server.company.com:8443/status
```

### Web Interface Performance Issues

**Symptoms**:
- Slow loading of usage statistics
- Timeouts when accessing large license pools
- Unresponsive interface during peak usage
- Memory usage problems

**Performance Diagnosis**:
```bash
# Monitor web interface performance
curl -w "@curl-format.txt" -k -u admin:password \
  "https://lmx-server.company.com:8443/"

# Check web server resource usage
ps aux | grep -E "lmx.*web|httpd"
top -p $(pgrep -f "web")

# Monitor active web connections
netstat -an | grep :8080 | wc -l
netstat -an | grep :8443 | wc -l

# Check web interface logs for errors
sudo grep -E "ERROR|WARN|timeout" /opt/lmx/logs/web.log
```

**Performance Optimization**:
```bash
# 1. Optimize web interface configuration
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF

# Web Interface Performance Settings
WEBINTERFACE_MAX_CONNECTIONS 200
WEBINTERFACE_TIMEOUT 300
WEBINTERFACE_CACHE_ENABLE true
WEBINTERFACE_CACHE_SIZE 1000
WEBINTERFACE_COMPRESSION_ENABLE true
WEBINTERFACE_THREAD_POOL_SIZE 20
EOF

# 2. Configure web interface caching
sudo -u lmx tee -a /opt/lmx/config/lmx.conf <<EOF
WEBINTERFACE_STATIC_CACHE_ENABLE true
WEBINTERFACE_API_CACHE_ENABLE true
WEBINTERFACE_CACHE_TIMEOUT 300
EOF

# 3. Set up reverse proxy (nginx) for better performance
sudo tee /etc/nginx/sites-available/lmx-proxy <<EOF
server {
    listen 80;
    server_name lmx-server.company.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache lmx_cache;
        proxy_cache_valid 200 5m;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/lmx-proxy /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## High Availability Issues

### Failover Problems

**Symptoms**:
- Automatic failover not working
- Long failover times
- License sessions lost during failover
- Load balancer not detecting server failures

**HA Diagnosis**:
```bash
# Check HA configuration
vantage licenses ha-status lmx-production --detailed

# Test failover functionality
vantage licenses test-failover lmx-production --dry-run

# Check load balancer health
curl -I http://lmx-lb.company.com:8404/stats

# Monitor server health checks
sudo tail -f /var/log/haproxy.log | grep -E "health|check"

# Test individual server responses
for server in lmx-primary lmx-secondary lmx-tertiary; do
    echo "Testing $server:"
    /opt/lmx/bin/lmxendutil -licstat -c 6200@$server.company.com
done
```

**HA Fixes**:
```bash
# 1. Verify HA configuration
vantage licenses ha-config lmx-production --validate

# 2. Update health check configuration
vantage licenses ha-config lmx-production \
  --health-check-interval 30s \
  --health-check-timeout 10s \
  --health-check-retries 3

# 3. Test manual failover
vantage licenses failover lmx-production \
  --from lmx-primary \
  --to lmx-secondary \
  --test-mode

# 4. Check shared storage connectivity
sudo mount | grep lmx
sudo df -h /opt/lmx/shared/

# 5. Verify synchronization between servers
sudo -u lmx /opt/lmx/bin/cross-site-sync.sh --test-mode
```

## Network and Firewall Issues

### Connectivity Problems

**Port and Network Issues**:
```bash
# Test all required ports
for port in 6200 8080 8443; do
    echo "Testing port $port:"
    telnet lmx-server.company.com $port
    nmap -p $port lmx-server.company.com
done

# Check firewall rules
sudo iptables -L | grep -E "6200|8080|8443"
sudo firewall-cmd --list-ports

# Test cross-site connectivity for geographic HA
for site in datacenter-east datacenter-west; do
    echo "Testing $site connectivity:"
    ping -c 3 lmx-$site.company.com
    traceroute lmx-$site.company.com
done
```

**Network Fixes**:
```bash
# 1. Open required ports
sudo firewall-cmd --permanent --add-port=6200/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --reload

# 2. Configure port forwarding if needed
sudo iptables -t nat -A PREROUTING -p tcp --dport 6200 \
  -j DNAT --to-destination lmx-server.company.com:6200

# 3. Set up VPN access for remote users
# (Implementation depends on your VPN solution)

# 4. Configure DNS properly
echo "192.168.1.100 lmx-server.company.com" | sudo tee -a /etc/hosts
```

## Diagnostic Tools and Scripts

### Comprehensive LMX Health Check

```bash
#!/bin/bash
# /opt/lmx/bin/lmx-comprehensive-check.sh

echo "=== LMX Comprehensive Health Check ==="
echo "Date: $(date)"
echo "Server: $(hostname -f)"
echo

# Check LMX service status
echo "1. LMX Service Status:"
if systemctl is-active --quiet lmx; then
    echo "   ✓ LMX service is running"
    systemctl status lmx --no-pager -l
else
    echo "   ✗ LMX service is not running"
    echo "   Recent logs:"
    sudo journalctl -u lmx --no-pager -l -n 10
fi

# Test license server response
echo
echo "2. License Server Response:"
if timeout 10 /opt/lmx/bin/lmxendutil -licstat -c 6200@localhost > /dev/null 2>&1; then
    echo "   ✓ License server responding"
    echo "   Available features:"
    /opt/lmx/bin/lmxendutil -licstat -c 6200@localhost | grep -E "Users of" | head -5
else
    echo "   ✗ License server not responding"
    echo "   Checking configuration:"
    sudo -u lmx /opt/lmx/bin/lmxendutil -test -c /opt/lmx/config/lmx.conf
fi

# Check web interface
echo
echo "3. Web Interface:"
if curl -k -s https://localhost:8443/ > /dev/null 2>&1; then
    echo "   ✓ Web interface accessible"
else
    echo "   ✗ Web interface not accessible"
    echo "   Checking web configuration:"
    sudo grep -E "WEBINTERFACE" /opt/lmx/config/lmx.conf
fi

# Check borrowing functionality
echo
echo "4. Borrowing Functionality:"
if /opt/lmx/bin/lmxendutil -borrowinfo -c 6200@localhost > /dev/null 2>&1; then
    echo "   ✓ Borrowing system operational"
    /opt/lmx/bin/lmxendutil -borrowinfo -c 6200@localhost | head -3
else
    echo "   ⚠ Borrowing system may not be configured"
fi

# Check Vantage integration
echo
echo "5. Vantage Integration:"
if command -v vantage &> /dev/null; then
    if vantage licenses ping lmx-server > /dev/null 2>&1; then
        echo "   ✓ Vantage can communicate with LMX server"
    else
        echo "   ✗ Vantage cannot communicate with LMX server"
    fi
else
    echo "   ? Vantage CLI not available"
fi

# Check system resources
echo
echo "6. System Resources:"
DISK_USAGE=$(df /opt/lmx | tail -1 | awk '{print $5}' | sed 's/%//')
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')

if [ $DISK_USAGE -lt 90 ]; then
    echo "   ✓ Disk space OK ($DISK_USAGE% used)"
else
    echo "   ⚠ Disk space high ($DISK_USAGE% used)"
fi

if [ $MEMORY_USAGE -lt 90 ]; then
    echo "   ✓ Memory usage OK ($MEMORY_USAGE% used)"
else
    echo "   ⚠ Memory usage high ($MEMORY_USAGE% used)"
fi

echo
echo "=== Health Check Complete ==="
```

### Performance Monitoring Script

```python
#!/usr/bin/env python3
# /opt/lmx/bin/lmx-performance-monitor.py

import subprocess
import time
import json
import sys
from datetime import datetime

class LMXPerformanceMonitor:
    def __init__(self, server_host="localhost", server_port=6200):
        self.server_host = server_host
        self.server_port = server_port
        self.server_string = f"{server_port}@{server_host}"
    
    def measure_checkout_time(self, feature, count=1):
        """Measure license checkout time"""
        start_time = time.time()
        try:
            cmd = ['/opt/lmx/bin/lmxendutil', '-checkout', feature, str(count), 
                   '-c', self.server_string]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            checkout_time = time.time() - start_time
            
            if result.returncode == 0:
                # Checkin the license
                subprocess.run(['/opt/lmx/bin/lmxendutil', '-checkin', feature, 
                               str(count), '-c', self.server_string], 
                              capture_output=True, timeout=10)
                return {'success': True, 'time': checkout_time}
            else:
                return {'success': False, 'time': checkout_time, 'error': result.stderr}
                
        except subprocess.TimeoutExpired:
            return {'success': False, 'time': 30.0, 'error': 'Timeout'}
        except Exception as e:
            return {'success': False, 'time': time.time() - start_time, 'error': str(e)}
    
    def get_server_stats(self):
        """Get current server statistics"""
        try:
            cmd = ['/opt/lmx/bin/lmxendutil', '-licstat', '-c', self.server_string]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                return {'success': True, 'output': result.stdout}
            else:
                return {'success': False, 'error': result.stderr}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def run_performance_test(self, features=['ANSYS_CFX', 'COMSOL_MULTIPHYSICS'], 
                           iterations=5):
        """Run comprehensive performance test"""
        results = {
            'timestamp': datetime.now().isoformat(),
            'server': f"{self.server_host}:{self.server_port}",
            'tests': []
        }
        
        for feature in features:
            feature_results = {
                'feature': feature,
                'checkout_times': [],
                'average_time': 0,
                'success_rate': 0
            }
            
            successful_checkouts = 0
            total_time = 0
            
            for i in range(iterations):
                print(f"Testing {feature} - iteration {i+1}/{iterations}")
                result = self.measure_checkout_time(feature)
                
                feature_results['checkout_times'].append(result)
                
                if result['success']:
                    successful_checkouts += 1
                    total_time += result['time']
                
                time.sleep(1)  # Brief pause between tests
            
            if successful_checkouts > 0:
                feature_results['average_time'] = total_time / successful_checkouts
            
            feature_results['success_rate'] = (successful_checkouts / iterations) * 100
            results['tests'].append(feature_results)
        
        return results
    
    def generate_report(self, results):
        """Generate human-readable performance report"""
        report = []
        report.append(f"LMX Performance Report")
        report.append(f"Server: {results['server']}")
        report.append(f"Timestamp: {results['timestamp']}")
        report.append("")
        
        for test in results['tests']:
            report.append(f"Feature: {test['feature']}")
            report.append(f"  Average checkout time: {test['average_time']:.3f}s")
            report.append(f"  Success rate: {test['success_rate']:.1f}%")
            
            if test['success_rate'] < 100:
                failures = [t for t in test['checkout_times'] if not t['success']]
                if failures:
                    report.append("  Failures:")
                    for failure in failures[:3]:  # Show first 3 failures
                        report.append(f"    - {failure.get('error', 'Unknown error')}")
            report.append("")
        
        return '\n'.join(report)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='LMX Performance Monitor')
    parser.add_argument('--server', default='localhost', help='LMX server hostname')
    parser.add_argument('--port', type=int, default=6200, help='LMX server port')
    parser.add_argument('--features', nargs='+', 
                       default=['ANSYS_CFX', 'COMSOL_MULTIPHYSICS'],
                       help='Features to test')
    parser.add_argument('--iterations', type=int, default=5,
                       help='Number of test iterations per feature')
    parser.add_argument('--output', help='Output file for results')
    parser.add_argument('--format', choices=['text', 'json'], default='text',
                       help='Output format')
    
    args = parser.parse_args()
    
    monitor = LMXPerformanceMonitor(args.server, args.port)
    results = monitor.run_performance_test(args.features, args.iterations)
    
    if args.format == 'json':
        output = json.dumps(results, indent=2)
    else:
        output = monitor.generate_report(results)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output)
        print(f"Results saved to {args.output}")
    else:
        print(output)
```

## Emergency Recovery Procedures

### LMX Server Recovery

**Quick Recovery Steps**:
```bash
# 1. Stop all license-consuming processes (emergency only)
# sudo pkill -f "ansys|comsol|starccm"

# 2. Restart LMX service
sudo systemctl restart lmx

# 3. Verify server is responding
/opt/lmx/bin/lmxendutil -licstat -c 6200@localhost

# 4. Check web interface
curl -k https://localhost:8443/status

# 5. Test borrowing functionality
/opt/lmx/bin/lmxendutil -borrowinfo -c 6200@localhost

# 6. Notify Vantage of server restart
vantage licenses refresh lmx-server --immediate

# 7. Monitor for several minutes
watch -n 30 '/opt/lmx/bin/lmxendutil -licstat -c 6200@localhost | head -20'
```

**Disaster Recovery**:
```bash
# If primary LMX server fails completely:

# 1. Activate secondary/backup server
vantage licenses failover lmx-production --to lmx-secondary

# 2. Update DNS or load balancer
# (Implementation depends on your infrastructure)

# 3. Verify all applications can reach new server
vantage cluster test --component licensing

# 4. Restore borrowed licenses if needed
# (Borrowed licenses should survive server failures)

# 5. Monitor new primary server
vantage licenses monitor lmx-secondary --alert-threshold 90
```

## Next Steps

- **[LMX Introduction](./)**: Return to main LMX overview
- **[High Availability Setup](/platform/licenses/how-to-guides/lmx/high-availability)**: Prevent issues with redundancy
- **[Monitoring & Analytics](/platform/licenses/how-to-guides/lmx/monitoring)**: Proactive issue detection

---

> **Emergency Contact**: For critical LMX server issues affecting production workloads, contact your Vantage support team immediately at support@vantage.com. LMX's borrowing feature often allows work to continue even during server outages, but proper monitoring and quick resolution are essential for maintaining user productivity. The web interface provides additional diagnostic capabilities beyond command-line tools.
