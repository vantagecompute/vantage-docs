---
id: troubleshooting
title: Troubleshooting
sidebar_position: 5
description: Diagnose and resolve common FlexLM issues in Vantage environments.
---

# FlexLM Troubleshooting

This guide helps you diagnose and resolve common FlexLM issues within Vantage environments, focusing on integration problems and license management issues.

## Vantage Integration Issues

### License Server Not Detected

**Symptoms**:
- Server appears offline in Vantage dashboard
- "Connection refused" errors in Vantage logs
- Jobs fail with license checkout errors

**Diagnosis**:
```bash
# Test connectivity from Vantage
vantage licenses test flexlm-server

# Check server status
vantage licenses status flexlm-server --verbose

# Verify network connectivity
telnet license-server.vantage.com 27000
```

**Resolution**:
```bash
# 1. Verify server configuration in Vantage
vantage licenses show flexlm-server

# 2. Update server configuration if needed
vantage licenses update flexlm-server \
  --host license-server.vantage.com \
  --port 27000 \
  --daemon ansyslmd

# 3. Test connection
vantage licenses ping flexlm-server
```

### Dashboard Shows Incorrect Usage

**Symptoms**:
- License usage doesn't match lmstat output
- Historical data shows gaps
- User attribution is incorrect

**Diagnosis**:
```bash
# Compare Vantage data with direct server query
vantage licenses usage flexlm-server --feature FLUENT
lmutil lmstat -f FLUENT -c 27000@license-server.vantage.com

# Check monitoring agent status
vantage system status --component license-monitor

# Review data collection logs
vantage logs license-monitor --tail 100
```

**Resolution**:
```bash
# 1. Restart license monitoring agent
vantage system restart license-monitor

# 2. Refresh license server data
vantage licenses refresh flexlm-server

# 3. Verify monitoring configuration
vantage licenses config flexlm-server --show-monitoring

# 4. If data is still incorrect, force full resync
vantage licenses resync flexlm-server --full
```

### Authentication Issues

**Symptoms**:
- "Access denied" errors in dashboard
- Unable to modify license settings
- Missing user attribution data

**Diagnosis**:
```bash
# Check Vantage user permissions
vantage auth check-permissions --resource licenses

# Verify license server access controls
lmutil lmstat -c 27000@license-server.vantage.com

# Check FlexLM access logs
sudo tail -f /var/log/flexlm/ansys.log | grep -i "denied\|error"
```

**Resolution**:
```yaml
# Update Vantage user role
apiVersion: auth.vantage.com/v1
kind: Role
metadata:
  name: license-administrator
rules:
- apiGroups: ["licensing"]
  resources: ["servers", "usage", "analytics"]
  verbs: ["get", "list", "watch", "update"]
```

## License Server Problems

### Server Won't Start

**Symptoms**:
- lmgrd fails to start
- "Cannot find license file" errors
- Daemon startup failures

**Diagnostic Commands**:
```bash
# Check license file syntax
lmutil lmdiag -c /opt/flexlm/licenses/ansys.lic

# Test license file manually
/opt/flexlm/bin/lmgrd -c /opt/flexlm/licenses/ansys.lic -l +

# Check file permissions
ls -la /opt/flexlm/licenses/
ls -la /opt/flexlm/bin/

# Verify network configuration
hostname -f
cat /etc/hosts | grep $(hostname)
```

**Common Fixes**:
```bash
# 1. Fix file permissions
sudo chown flexlm:flexlm /opt/flexlm/licenses/ansys.lic
sudo chmod 644 /opt/flexlm/licenses/ansys.lic

# 2. Verify hostname resolution
echo "$(hostname -I | awk '{print $1}') $(hostname -f) $(hostname)" | sudo tee -a /etc/hosts

# 3. Check license file format
# Ensure line endings are Unix format (LF, not CRLF)
dos2unix /opt/flexlm/licenses/ansys.lic

# 4. Restart with verbose logging
sudo systemctl stop flexlm-ansys
sudo /opt/flexlm/bin/lmgrd -c /opt/flexlm/licenses/ansys.lic -l /var/log/flexlm/debug.log -z
```

### License Features Not Available

**Symptoms**:
- "Feature not found" errors
- Licenses show as expired when they shouldn't be
- Vendor daemon failures

**Diagnosis**:
```bash
# Check feature definitions
lmutil lmstat -f FLUENT -c 27000@license-server.vantage.com

# Verify vendor daemon
lmutil lmstat -S ansyslmd -c 27000@license-server.vantage.com

# Check system time
date
ntpq -p  # If using NTP

# Examine daemon logs
sudo tail -f /var/log/flexlm/ansys.log
```

**Resolution Steps**:
```bash
# 1. Synchronize system time
sudo ntpdate -s time.nist.gov
sudo systemctl enable ntp
sudo systemctl start ntp

# 2. Restart vendor daemon
lmutil lmreread -c 27000@license-server.vantage.com

# 3. If features still missing, restart entire license server
sudo systemctl restart flexlm-ansys

# 4. Update Vantage feature discovery
vantage licenses discover flexlm-server --features
```

### High License Usage/Queuing

**Symptoms**:
- Long job queue times
- "All licenses in use" errors
- Users reporting license unavailability

**Investigation**:
```bash
# Identify license hogs
lmutil lmstat -a -c 27000@license-server.vantage.com | grep -A 10 "FLUENT"

# Check for stuck licenses
lmutil lmstat -i -c 27000@license-server.vantage.com

# View queue status in Vantage
vantage licenses queue flexlm-server --show-waiting
```

**Optimization Actions**:
```bash
# 1. Release stuck licenses (if user confirms)
lmutil lmremove -h hostname -u username FLUENT ansyslmd -c 27000@license-server.vantage.com

# 2. Implement license timeouts in license file
# Add to license file:
FEATURE FLUENT ansyslmd 2023.1000 permanent 50 \
        VENDOR_STRING=ANSYS \
        TIMEOUT=3600 \
        NOTICE="Auto-timeout after 1 hour idle"

# 3. Configure license borrowing for mobile users
FEATURE FLUENT ansyslmd 2023.1000 permanent 50 \
        VENDOR_STRING=ANSYS \
        BORROW=86400 \
        NOTICE="Can borrow for 24 hours"

# 4. Set up license reservations for critical users
RESERVE 5 FLUENT GROUP critical_users

# 5. Restart license server to apply changes
sudo systemctl restart flexlm-ansys

# 6. Update Vantage optimization settings
vantage licenses optimize flexlm-server \
  --enable-queuing \
  --timeout 3600 \
  --max-queue-time 1800
```

## Client-Side Issues

### Application Can't Find Licenses

**Symptoms**:
- "License server not found" errors
- Applications start without licenses
- Intermittent license failures

**Client Diagnosis**:
```bash
# Check environment variables
echo $ANSYSLMD_LICENSE_FILE
echo $LM_LICENSE_FILE

# Test license server connectivity
lmutil lmhostid
lmutil lmdiag -n -c 27000@license-server.vantage.com

# Verify application-specific settings
ansys -version  # or application-specific command
```

**Client-Side Fixes**:
```bash
# 1. Set correct environment variables
export ANSYSLMD_LICENSE_FILE="27000@license-server.vantage.com"
export LM_LICENSE_FILE="27000@license-server.vantage.com"

# 2. Add to user's shell profile
echo 'export ANSYSLMD_LICENSE_FILE="27000@license-server.vantage.com"' >> ~/.bashrc

# 3. System-wide configuration
echo 'ANSYSLMD_LICENSE_FILE=27000@license-server.vantage.com' | sudo tee -a /etc/environment

# 4. Test application license checkout
ansys licensing list
ansys licensing test

# 5. For Vantage job submissions, verify job configuration
vantage jobs validate your-job.yaml --check-licenses
```

### Slow License Checkout

**Symptoms**:
- Jobs take long time to start
- License checkout timeouts
- Intermittent connection issues

**Performance Diagnosis**:
```bash
# Measure license checkout time
time lmutil lmstat -c 27000@license-server.vantage.com

# Check network latency
ping license-server.vantage.com
traceroute license-server.vantage.com

# Monitor license server load
top -p $(pgrep lmgrd)
netstat -an | grep :27000
```

**Performance Optimization**:
```bash
# 1. Use license caching (if supported by application)
export FLEXLM_DIAGNOSTICS=3
export FLEXLM_TIMEOUT=30

# 2. Configure connection pooling in applications
# Application-specific - consult vendor documentation

# 3. Optimize license file for faster parsing
# Place most-used features first in license file

# 4. Consider local license caching proxy
# Set up license server proxy for remote locations

# 5. Update Vantage job scheduler for license pre-allocation
vantage cluster config update \
  --enable-license-precheck \
  --license-timeout 60
```

## Vantage-Specific Troubleshooting

### Jobs Failing Due to License Issues

**Common Job Failure Patterns**:
```yaml
# Job configuration troubleshooting
apiVersion: batch.vantage.com/v1
kind: Job
metadata:
  name: debug-fluent-job
spec:
  template:
    spec:
      containers:
      - name: fluent
        image: vantage/ansys-fluent:2023R1
        command: ["bash", "-c"]
        args: ["lmutil lmstat -c $ANSYSLMD_LICENSE_FILE && fluent -3d -t4 -i input.jou"]
        resources:
          requests:
            licenses:
              flexlm/FLUENT: 4
        env:
        - name: ANSYSLMD_LICENSE_FILE
          value: "27000@license-server.vantage.com"
        - name: FLEXLM_DIAGNOSTICS
          value: "3"  # Enable detailed FlexLM logging
```

**Debugging Steps**:
```bash
# 1. Check job logs for license-specific errors
vantage jobs logs debug-fluent-job --container fluent

# 2. Verify license allocation in Vantage
vantage jobs describe debug-fluent-job --show-licenses

# 3. Test license availability before job submission
vantage licenses check flexlm-server --feature FLUENT --count 4

# 4. Enable debug mode for detailed troubleshooting
vantage jobs submit debug-fluent-job.yaml --debug-licenses
```

### License Monitoring Agent Issues

**Agent Not Collecting Data**:
```bash
# Check agent status
vantage system status --component license-monitor

# View agent logs
vantage logs license-monitor --follow

# Restart monitoring agent
vantage system restart license-monitor

# Verify agent configuration
vantage system config license-monitor --show

# Test agent connectivity to license server
vantage system test license-monitor --target flexlm-server
```

**Data Collection Problems**:
```bash
# Force data refresh
vantage licenses refresh flexlm-server --immediate

# Check data pipeline health
vantage system health --pipeline license-data

# Verify database connectivity
vantage system test --component database --subsystem licensing

# Reset monitoring agent if needed
vantage system reset license-monitor --confirm
```

## Network and Connectivity Issues

### Firewall Problems

**Port Accessibility Issues**:
```bash
# Test basic connectivity
telnet license-server.vantage.com 27000

# Check if dynamic port range is accessible
nmap -p 27000-27050 license-server.vantage.com

# Verify firewall rules on license server
sudo iptables -L | grep 27000
sudo firewall-cmd --list-ports
```

**Firewall Configuration**:
```bash
# Open required ports (license server)
sudo firewall-cmd --permanent --add-port=27000/tcp  # lmgrd
sudo firewall-cmd --permanent --add-port=27001-27020/tcp  # vendor daemons
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 27000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 27001:27020 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

### DNS Resolution Issues

**Hostname Problems**:
```bash
# Test hostname resolution
nslookup license-server.vantage.com
dig license-server.vantage.com

# Check reverse DNS
dig -x $(dig +short license-server.vantage.com)

# Verify /etc/hosts entries
cat /etc/hosts | grep license-server
```

**DNS Fixes**:
```bash
# Add hostname to /etc/hosts if DNS fails
echo "192.168.1.100 license-server.vantage.com license-server" | sudo tee -a /etc/hosts

# Update license file with IP address if needed
# Temporary workaround - use IP instead of hostname
SERVER 192.168.1.100 001122334455 27000
```

## Diagnostic Tools and Scripts

### Comprehensive Health Check

```bash
#!/bin/bash
# /opt/flexlm/bin/comprehensive-check.sh

echo "=== FlexLM Comprehensive Health Check ==="
echo "Date: $(date)"
echo "Server: $(hostname -f)"
echo

# Check license server status
echo "1. License Server Status:"
if systemctl is-active --quiet flexlm-ansys; then
    echo "   ✓ FlexLM service is running"
else
    echo "   ✗ FlexLM service is not running"
    echo "   Attempting to start..."
    sudo systemctl start flexlm-ansys
    sleep 5
    if systemctl is-active --quiet flexlm-ansys; then
        echo "   ✓ FlexLM service started successfully"
    else
        echo "   ✗ Failed to start FlexLM service"
        systemctl status flexlm-ansys
    fi
fi

# Test license server response
echo
echo "2. License Server Response:"
if lmutil lmstat -c 27000@localhost > /dev/null 2>&1; then
    echo "   ✓ License server responding"
    
    # Get license usage summary
    echo "   License Usage Summary:"
    lmutil lmstat -c 27000@localhost | grep "Users of" | head -5
else
    echo "   ✗ License server not responding"
    echo "   Checking logs..."
    tail -10 /var/log/flexlm/ansys.log
fi

# Check Vantage integration
echo
echo "3. Vantage Integration:"
if command -v vantage &> /dev/null; then
    if vantage licenses ping flexlm-server > /dev/null 2>&1; then
        echo "   ✓ Vantage can communicate with license server"
    else
        echo "   ✗ Vantage cannot communicate with license server"
        echo "   Checking configuration..."
        vantage licenses show flexlm-server 2>&1 | head -10
    fi
else
    echo "   ? Vantage CLI not available"
fi

# Check disk space
echo
echo "4. System Resources:"
DISK_USAGE=$(df /opt/flexlm | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 90 ]; then
    echo "   ✓ Disk space OK ($DISK_USAGE% used)"
else
    echo "   ⚠ Disk space high ($DISK_USAGE% used)"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEMORY_USAGE -lt 90 ]; then
    echo "   ✓ Memory usage OK ($MEMORY_USAGE% used)"
else
    echo "   ⚠ Memory usage high ($MEMORY_USAGE% used)"
fi

# Check network connectivity
echo
echo "5. Network Connectivity:"
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    echo "   ✓ Internet connectivity OK"
else
    echo "   ⚠ No internet connectivity"
fi

# Test time synchronization
echo
echo "6. Time Synchronization:"
if command -v chrony &> /dev/null; then
    SYNC_STATUS=$(chronyc tracking | grep "Leap status" | awk '{print $4}')
    if [ "$SYNC_STATUS" = "Normal" ]; then
        echo "   ✓ Time synchronization OK"
    else
        echo "   ⚠ Time synchronization issue: $SYNC_STATUS"
    fi
elif command -v ntpstat &> /dev/null; then
    if ntpstat > /dev/null 2>&1; then
        echo "   ✓ Time synchronization OK"
    else
        echo "   ⚠ Time synchronization issue"
    fi
else
    echo "   ? Time synchronization status unknown"
fi

echo
echo "=== Health Check Complete ==="
```

### License Usage Reporter

```python
#!/usr/bin/env python3
# /opt/flexlm/bin/usage-reporter.py

import subprocess
import json
import csv
import sys
from datetime import datetime
import argparse

class FlexLMLicenseReporter:
    def __init__(self, server):
        self.server = server
    
    def get_current_usage(self):
        """Get current license usage"""
        try:
            cmd = ['lmutil', 'lmstat', '-a', '-c', self.server]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"lmstat failed: {result.stderr}")
            
            return self._parse_lmstat_output(result.stdout)
            
        except Exception as e:
            return {'error': str(e)}
    
    def _parse_lmstat_output(self, output):
        """Parse lmstat output into structured data"""
        usage_data = {
            'timestamp': datetime.now().isoformat(),
            'server': self.server,
            'features': {},
            'total_users': 0,
            'server_status': 'unknown'
        }
        
        lines = output.split('\n')
        current_feature = None
        
        for line in lines:
            line = line.strip()
            
            # Check server status
            if 'License server status' in line:
                if 'UP' in line:
                    usage_data['server_status'] = 'up'
                else:
                    usage_data['server_status'] = 'down'
            
            # Parse feature usage
            elif line.startswith('Users of '):
                # Extract feature name and counts
                parts = line.split()
                if len(parts) >= 10:
                    feature_name = parts[2].rstrip(':')
                    total_licenses = int(parts[5])
                    used_licenses = int(parts[10])
                    
                    usage_data['features'][feature_name] = {
                        'total': total_licenses,
                        'used': used_licenses,
                        'available': total_licenses - used_licenses,
                        'usage_percent': (used_licenses / total_licenses) * 100 if total_licenses > 0 else 0,
                        'users': []
                    }
                    current_feature = feature_name
            
            # Parse user sessions
            elif current_feature and ' ' in line and 'start' in line.lower():
                # Extract user information
                parts = line.split()
                if len(parts) >= 6:
                    username = parts[0]
                    hostname = parts[1]
                    
                    usage_data['features'][current_feature]['users'].append({
                        'username': username,
                        'hostname': hostname,
                        'session_info': ' '.join(parts[2:])
                    })
        
        # Calculate total active users
        all_users = set()
        for feature_data in usage_data['features'].values():
            for user in feature_data['users']:
                all_users.add(user['username'])
        
        usage_data['total_users'] = len(all_users)
        
        return usage_data
    
    def generate_report(self, format='text'):
        """Generate usage report in specified format"""
        usage = self.get_current_usage()
        
        if 'error' in usage:
            return f"Error: {usage['error']}"
        
        if format == 'json':
            return json.dumps(usage, indent=2)
        elif format == 'csv':
            return self._generate_csv_report(usage)
        else:
            return self._generate_text_report(usage)
    
    def _generate_text_report(self, usage):
        """Generate human-readable text report"""
        report = []
        report.append(f"FlexLM License Usage Report")
        report.append(f"Server: {usage['server']}")
        report.append(f"Status: {usage['server_status'].upper()}")
        report.append(f"Timestamp: {usage['timestamp']}")
        report.append(f"Total Active Users: {usage['total_users']}")
        report.append("")
        
        # Feature usage table
        report.append("Feature Usage:")
        report.append("-" * 60)
        report.append(f"{'Feature':<15} {'Used':<6} {'Total':<6} {'Avail':<6} {'Usage %':<8}")
        report.append("-" * 60)
        
        for feature, data in usage['features'].items():
            report.append(f"{feature:<15} {data['used']:<6} {data['total']:<6} "
                         f"{data['available']:<6} {data['usage_percent']:<8.1f}")
        
        # Active users by feature
        report.append("")
        report.append("Active Users by Feature:")
        report.append("-" * 40)
        
        for feature, data in usage['features'].items():
            if data['users']:
                report.append(f"\n{feature} ({len(data['users'])} users):")
                for user in data['users']:
                    report.append(f"  - {user['username']}@{user['hostname']}")
        
        return '\n'.join(report)
    
    def _generate_csv_report(self, usage):
        """Generate CSV format report"""
        output = []
        
        # Header
        output.append("Feature,Used,Total,Available,Usage_Percent,Active_Users")
        
        # Data rows
        for feature, data in usage['features'].items():
            user_list = ';'.join([f"{u['username']}@{u['hostname']}" for u in data['users']])
            output.append(f"{feature},{data['used']},{data['total']},{data['available']},"
                         f"{data['usage_percent']:.1f},\"{user_list}\"")
        
        return '\n'.join(output)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='FlexLM License Usage Reporter')
    parser.add_argument('--server', default='27000@localhost', 
                       help='License server (port@hostname)')
    parser.add_argument('--format', choices=['text', 'json', 'csv'], default='text',
                       help='Output format')
    parser.add_argument('--output', help='Output file (default: stdout)')
    
    args = parser.parse_args()
    
    reporter = FlexLMLicenseReporter(args.server)
    report = reporter.generate_report(args.format)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(report)
        print(f"Report saved to {args.output}")
    else:
        print(report)
```

## Emergency Procedures

### License Server Recovery

**Quick Recovery Checklist**:
```bash
# 1. Stop all license-consuming processes if needed
# (Only in emergency - will interrupt user work)
sudo pkill -f "fluent\|ansys\|cfx"

# 2. Restart license server
sudo systemctl restart flexlm-ansys

# 3. Verify server is responding
lmutil lmstat -c 27000@localhost

# 4. Notify Vantage of server restart
vantage licenses refresh flexlm-server --immediate

# 5. Check that jobs can acquire licenses
vantage licenses test flexlm-server --feature FLUENT

# 6. Monitor for a few minutes
watch -n 30 'lmutil lmstat -c 27000@localhost | head -20'
```

**Disaster Recovery**:
```bash
# If license server is completely down and cannot be recovered:

# 1. Activate backup/secondary license server
vantage licenses failover flexlm-server --to backup-server

# 2. Update DNS or load balancer to point to backup
# (Depends on your infrastructure setup)

# 3. Verify all applications can reach new server
vantage cluster test --component licensing

# 4. Monitor usage on backup server
vantage licenses monitor backup-server --alert-threshold 90
```

## Next Steps

- **[FlexLM Introduction](./)**: Return to main FlexLM overview
- **[High Availability Setup](high-availability)**: Prevent single points of failure
- **[Monitoring & Analytics](monitoring)**: Proactive monitoring setup

---

> **Emergency Contact**: For critical license server issues affecting production workloads, contact your Vantage support team immediately at support@vantage.com or use the emergency escalation procedures in your support agreement.
