---
id: troubleshooting
title: Troubleshooting
sidebar_position: 5
description: Diagnose and resolve common RLM issues in Vantage environments.
---

# RLM Troubleshooting

This guide helps you diagnose and resolve common RLM (Reprise License Manager) issues within Vantage environments, focusing on integration problems and license management issues.

## Vantage Integration Issues

### License Server Not Detected

**Symptoms**:
- Server appears offline in Vantage dashboard
- "Connection refused" errors in Vantage logs
- Jobs fail with RLM license checkout errors

**Diagnosis**:
```bash
# Test connectivity from Vantage
vantage licenses test rlm-server

# Check server status
vantage licenses status rlm-server --verbose

# Verify network connectivity
telnet rlm-server.vantage.com 5053

# Test web interface
curl -k https://rlm-server.vantage.com:5054
```

**Resolution**:
```bash
# 1. Verify server configuration in Vantage
vantage licenses show rlm-server

# 2. Update server configuration if needed
vantage licenses update rlm-server \
  --host rlm-server.vantage.com \
  --port 5053 \
  --web-port 5054 \
  --vendor siemens

# 3. Test connection
vantage licenses ping rlm-server

# 4. If web interface integration fails, check SSL certificates
openssl s_client -connect rlm-server.vantage.com:5054 -verify_return_error
```

### Dashboard Shows Incorrect Usage

**Symptoms**:
- License usage doesn't match RLM web interface data
- Historical data shows gaps or inconsistencies
- User attribution is incorrect or missing

**Diagnosis**:
```bash
# Compare Vantage data with direct RLM query
vantage licenses usage rlm-server --feature STARCCM
/opt/rlm/bin/rlmutil rlmstat -f STARCCM -c 5053@rlm-server.vantage.com

# Check monitoring agent status
vantage system status --component license-monitor

# Review data collection logs
vantage logs license-monitor --tail 100

# Check RLM web interface for comparison
curl -k -u admin:password https://rlm-server.vantage.com:5054/goforms/activate_process
```

**Resolution**:
```bash
# 1. Restart license monitoring agent
vantage system restart license-monitor

# 2. Refresh license server data
vantage licenses refresh rlm-server

# 3. Verify monitoring configuration
vantage licenses config rlm-server --show-monitoring

# 4. Force full data resync
vantage licenses resync rlm-server --full --include-web-data

# 5. Check RLM log parsing configuration
vantage licenses config rlm-server --log-parser-debug
```

### Web Interface Integration Issues

**Symptoms**:
- Cannot access RLM web interface through Vantage
- Authentication failures with web interface
- SSL/TLS connection errors

**Diagnosis**:
```bash
# Check SSL certificate validity
openssl s_client -connect rlm-server.vantage.com:5054 -servername rlm-server.vantage.com

# Test web interface authentication
curl -k -u admin:password https://rlm-server.vantage.com:5054/status

# Check web interface logs
sudo tail -f /opt/rlm/logs/web.log

# Verify web interface configuration
cat /opt/rlm/rlm.conf | grep -E "WEB_INTERFACE|HTTPS"
```

**Resolution**:
```bash
# 1. Regenerate SSL certificates
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/rlm/ssl/server.key \
  -out /opt/rlm/ssl/server.crt -days 365 -nodes \
  -subj "/CN=rlm-server.vantage.com"

# 2. Update web interface configuration
sudo tee -a /opt/rlm/rlm.conf <<EOF
WEB_INTERFACE_ENABLE 1
WEB_INTERFACE_PORT 5054
WEB_INTERFACE_HTTPS 1
WEB_INTERFACE_CERT /opt/rlm/ssl/server.crt
WEB_INTERFACE_KEY /opt/rlm/ssl/server.key
EOF

# 3. Restart RLM service
sudo systemctl restart rlm

# 4. Update Vantage web interface integration
vantage licenses web-interface rlm-server --reconfigure \
  --ssl-verify false \
  --username admin \
  --password-file /etc/vantage/rlm-admin-password
```

## RLM Server Problems

### Server Won't Start

**Symptoms**:
- RLM daemon fails to start
- "Cannot bind to port" errors
- License file parsing errors

**Diagnostic Commands**:
```bash
# Check RLM startup directly
sudo -u rlm /opt/rlm/bin/rlm -c /opt/rlm/rlm.conf -dlog +

# Test license file syntax
/opt/rlm/bin/rlm -c /opt/rlm/licenses/siemens.lic -test

# Check port availability
sudo netstat -tlnp | grep :5053
sudo lsof -i :5053

# Verify file permissions
ls -la /opt/rlm/licenses/
ls -la /opt/rlm/bin/
```

**Common Fixes**:
```bash
# 1. Fix file permissions
sudo chown -R rlm:rlm /opt/rlm/
sudo chmod 644 /opt/rlm/licenses/siemens.lic
sudo chmod 755 /opt/rlm/bin/rlm

# 2. Check for port conflicts
sudo systemctl stop rlm
sudo fuser -k 5053/tcp
sudo systemctl start rlm

# 3. Verify license file format
# Ensure line endings are Unix format (LF, not CRLF)
dos2unix /opt/rlm/licenses/siemens.lic

# 4. Start with verbose logging
sudo -u rlm /opt/rlm/bin/rlm -c /opt/rlm/rlm.conf -dlog ++ -verbose
```

### License Features Not Available

**Symptoms**:
- "Feature not found" errors
- Licenses show as expired when they shouldn't be
- ISV server communication failures

**Diagnosis**:
```bash
# Check RLM status and features
/opt/rlm/bin/rlmutil rlmstat -c 5053@rlm-server.vantage.com

# Check ISV server status
/opt/rlm/bin/rlmutil rlmstat -S siemens -c 5053@rlm-server.vantage.com

# Verify system time synchronization
date
ntpq -p  # If using NTP
chronyc tracking  # If using chrony

# Check RLM logs for errors
sudo tail -f /opt/rlm/logs/rlm.log | grep -i error
```

**Resolution Steps**:
```bash
# 1. Synchronize system time
sudo ntpdate -s time.nist.gov
sudo systemctl enable ntp
sudo systemctl start ntp

# 2. Restart ISV server
/opt/rlm/bin/rlmutil rlmreread -S siemens -c 5053@rlm-server.vantage.com

# 3. If features still missing, restart RLM entirely
sudo systemctl restart rlm

# 4. Check license file for feature definitions
grep -E "LICENSE.*STARCCM|LICENSE.*NXCAE" /opt/rlm/licenses/siemens.lic

# 5. Update Vantage feature discovery
vantage licenses discover rlm-server --features --force-refresh
```

### High License Usage/Queuing

**Symptoms**:
- Long job queue times in Vantage
- "All licenses in use" errors
- Users reporting license unavailability

**Investigation**:
```bash
# Check current license usage
/opt/rlm/bin/rlmutil rlmstat -a -c 5053@rlm-server.vantage.com

# Identify users with longest sessions
/opt/rlm/bin/rlmutil rlmstat -c 5053@rlm-server.vantage.com | grep -A 20 "Users of STARCCM"

# Check for idle licenses using RLM web interface
curl -k -u admin:password "https://rlm-server.vantage.com:5054/status?feature=STARCCM"

# View queue status in Vantage
vantage licenses queue rlm-server --show-waiting
```

**Optimization Actions**:
```bash
# 1. Remove idle licenses (with user confirmation)
/opt/rlm/bin/rlmutil rlmremove -h hostname -u username STARCCM siemens \
  -c 5053@rlm-server.vantage.com

# 2. Implement license timeouts in license file
# Add timeout settings to license features:
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    TIMEOUT=7200 \
    BORROW=24 \
    SIGN=60B459C90C71ABC123

# 3. Configure automatic license reclaim for idle sessions
cat >> /opt/rlm/rlm.conf <<EOF
IDLE_TIMEOUT 3600
IDLE_CHECK_INTERVAL 300
AUTO_RECLAIM_IDLE_LICENSES 1
EOF

# 4. Set up license reservations for critical users
LICENSE siemens STARCCM 2023.1000 permanent 20 \
    HOSTID=ANY \
    PLATFORMS="x64_linux x64_win64" \
    RESERVE 5 USER critical_user1 critical_user2 \
    SIGN=60B459C90C71ABC123

# 5. Restart RLM to apply changes
sudo systemctl restart rlm

# 6. Update Vantage optimization settings
vantage licenses optimize rlm-server \
  --enable-queuing \
  --timeout 7200 \
  --max-queue-time 1800 \
  --idle-detection true
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
echo $RLM_LICENSE
echo $SIEMENS_LICENSE_FILE

# Test RLM server connectivity
/opt/rlm/bin/rlmutil rlmstat -c 5053@rlm-server.vantage.com

# Check for client-side RLM utilities
which rlmutil
ldd /path/to/application | grep rlm

# Test application-specific license checkout
starccm+ -version
comsol -license_server 5053@rlm-server.vantage.com
```

**Client-Side Fixes**:
```bash
# 1. Set correct environment variables
export RLM_LICENSE="5053@rlm-server.vantage.com"
export SIEMENS_LICENSE_FILE="5053@rlm-server.vantage.com"

# 2. Add to user's shell profile
echo 'export RLM_LICENSE="5053@rlm-server.vantage.com"' >> ~/.bashrc
echo 'export SIEMENS_LICENSE_FILE="5053@rlm-server.vantage.com"' >> ~/.bashrc

# 3. System-wide configuration
echo 'RLM_LICENSE=5053@rlm-server.vantage.com' | sudo tee -a /etc/environment

# 4. Test application license checkout
starccm+ -license 5053@rlm-server.vantage.com -test

# 5. For Vantage job submissions, verify job configuration
vantage jobs validate your-job.yaml --check-licenses --license-type rlm
```

### Slow License Checkout

**Symptoms**:
- Jobs take long time to start
- License checkout timeouts
- Intermittent connection issues

**Performance Diagnosis**:
```bash
# Measure license checkout time
time /opt/rlm/bin/rlmutil rlmstat -c 5053@rlm-server.vantage.com

# Check network latency
ping rlm-server.vantage.com
traceroute rlm-server.vantage.com

# Monitor RLM server load
top -p $(pgrep rlm)
netstat -an | grep :5053

# Check RLM response times via web interface
curl -w "@curl-format.txt" -k -u admin:password \
  "https://rlm-server.vantage.com:5054/status"
```

**Performance Optimization**:
```bash
# 1. Configure RLM client timeout settings
export RLM_CONNECT_TIMEOUT=30
export RLM_COMM_TIMEOUT=60

# 2. Use connection caching (application-specific)
# For STAR-CCM+:
export CDLMD_TIMEOUT=30
export CDLMD_RETRY_COUNT=3

# 3. Optimize RLM server configuration
cat >> /opt/rlm/rlm.conf <<EOF
CONNECTION_TIMEOUT 300
MAX_CONNECTIONS 500
THREAD_POOL_SIZE 20
KEEP_ALIVE_TIMEOUT 60
EOF

# 4. Consider license caching proxy for remote locations
# Set up RLM proxy server for geographically distributed users

# 5. Update Vantage job scheduler for license pre-allocation
vantage cluster config update \
  --enable-license-precheck \
  --license-timeout 60 \
  --license-retry-count 3
```

## Web Interface Issues

### Cannot Access Web Interface

**Symptoms**:
- Browser cannot connect to web interface
- SSL/TLS certificate errors
- Authentication failures

**Web Interface Diagnosis**:
```bash
# Check if web interface is enabled
grep -E "WEB_INTERFACE" /opt/rlm/rlm.conf

# Test web interface connectivity
curl -k https://rlm-server.vantage.com:5054

# Check SSL certificate
openssl s_client -connect rlm-server.vantage.com:5054 -servername rlm-server.vantage.com

# Check web interface logs
sudo tail -f /opt/rlm/logs/web.log

# Test authentication
curl -k -u admin:password https://rlm-server.vantage.com:5054/status
```

**Web Interface Fixes**:
```bash
# 1. Enable web interface in configuration
cat >> /opt/rlm/rlm.conf <<EOF
WEB_INTERFACE_ENABLE 1
WEB_INTERFACE_PORT 5054
WEB_INTERFACE_LOG /opt/rlm/logs/web.log
EOF

# 2. Generate new SSL certificate
sudo openssl req -x509 -newkey rsa:4096 -keyout /opt/rlm/ssl/server.key \
  -out /opt/rlm/ssl/server.crt -days 365 -nodes \
  -subj "/CN=rlm-server.vantage.com"

# 3. Set admin password
echo "admin:$(openssl passwd -1 'SecurePassword123')" | sudo tee /opt/rlm/admin_password

# 4. Update configuration for password file
echo "WEB_INTERFACE_ADMIN_PASSWORD_FILE /opt/rlm/admin_password" >> /opt/rlm/rlm.conf

# 5. Restart RLM service
sudo systemctl restart rlm

# 6. Test web interface access
curl -k -u admin:SecurePassword123 https://rlm-server.vantage.com:5054/status
```

## Network and Connectivity Issues

### Firewall Problems

**Port Accessibility Issues**:
```bash
# Test basic connectivity
telnet rlm-server.vantage.com 5053
telnet rlm-server.vantage.com 5054

# Check if ports are listening
sudo netstat -tlnp | grep -E ":5053|:5054"

# Verify firewall rules on license server
sudo iptables -L | grep -E "5053|5054"
sudo firewall-cmd --list-ports
```

**Firewall Configuration**:
```bash
# Open required ports (license server)
sudo firewall-cmd --permanent --add-port=5053/tcp  # RLM license port
sudo firewall-cmd --permanent --add-port=5054/tcp  # Web interface port
sudo firewall-cmd --permanent --add-port=5055-5060/tcp  # ISV server ports
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 5053 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5054 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5055:5060 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

### DNS Resolution Issues

**Hostname Problems**:
```bash
# Test hostname resolution
nslookup rlm-server.vantage.com
dig rlm-server.vantage.com

# Check reverse DNS
dig -x $(dig +short rlm-server.vantage.com)

# Verify /etc/hosts entries
cat /etc/hosts | grep rlm-server
```

**DNS Fixes**:
```bash
# Add hostname to /etc/hosts if DNS fails
echo "192.168.1.100 rlm-server.vantage.com rlm-server" | sudo tee -a /etc/hosts

# Update license file with IP address if needed (temporary workaround)
HOST 192.168.1.100 ANY 5053
ISV siemens
```

## Diagnostic Tools and Scripts

### Comprehensive RLM Health Check

```bash
#!/bin/bash
# /opt/rlm/bin/rlm-comprehensive-check.sh

echo "=== RLM Comprehensive Health Check ==="
echo "Date: $(date)"
echo "Server: $(hostname -f)"
echo

# Check RLM service status
echo "1. RLM Service Status:"
if systemctl is-active --quiet rlm; then
    echo "   ✓ RLM service is running"
else
    echo "   ✗ RLM service is not running"
    echo "   Attempting to start..."
    sudo systemctl start rlm
    sleep 5
    if systemctl is-active --quiet rlm; then
        echo "   ✓ RLM service started successfully"
    else
        echo "   ✗ Failed to start RLM service"
        systemctl status rlm
    fi
fi

# Test license server response
echo
echo "2. License Server Response:"
if /opt/rlm/bin/rlmutil rlmstat -c 5053@localhost > /dev/null 2>&1; then
    echo "   ✓ License server responding"
    
    # Get license usage summary
    echo "   License Usage Summary:"
    /opt/rlm/bin/rlmutil rlmstat -c 5053@localhost | grep -E "Users of|LICENSE" | head -5
else
    echo "   ✗ License server not responding"
    echo "   Checking logs..."
    tail -10 /opt/rlm/logs/rlm.log
fi

# Check web interface
echo
echo "3. Web Interface:"
if curl -k -s https://localhost:5054/ > /dev/null 2>&1; then
    echo "   ✓ Web interface accessible"
else
    echo "   ✗ Web interface not accessible"
    echo "   Checking web configuration..."
    grep -E "WEB_INTERFACE" /opt/rlm/rlm.conf
fi

# Check Vantage integration
echo
echo "4. Vantage Integration:"
if command -v vantage &> /dev/null; then
    if vantage licenses ping rlm-server > /dev/null 2>&1; then
        echo "   ✓ Vantage can communicate with RLM server"
    else
        echo "   ✗ Vantage cannot communicate with RLM server"
        echo "   Checking configuration..."
        vantage licenses show rlm-server 2>&1 | head -10
    fi
else
    echo "   ? Vantage CLI not available"
fi

# Check system resources
echo
echo "5. System Resources:"
DISK_USAGE=$(df /opt/rlm | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 90 ]; then
    echo "   ✓ Disk space OK ($DISK_USAGE% used)"
else
    echo "   ⚠ Disk space high ($DISK_USAGE% used)"
fi

MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEMORY_USAGE -lt 90 ]; then
    echo "   ✓ Memory usage OK ($MEMORY_USAGE% used)"
else
    echo "   ⚠ Memory usage high ($MEMORY_USAGE% used)"
fi

# Check network connectivity
echo
echo "6. Network Connectivity:"
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    echo "   ✓ Internet connectivity OK"
else
    echo "   ⚠ No internet connectivity"
fi

echo
echo "=== Health Check Complete ==="
```

### RLM Usage Analysis Script

```python
#!/usr/bin/env python3
# /opt/rlm/bin/rlm-usage-analyzer.py

import subprocess
import json
import csv
import sys
from datetime import datetime
import argparse
import re

class RLMUsageAnalyzer:
    def __init__(self, server):
        self.server = server
    
    def get_current_usage(self):
        """Get current RLM license usage"""
        try:
            cmd = ['/opt/rlm/bin/rlmutil', 'rlmstat', '-c', self.server]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"rlmutil failed: {result.stderr}")
            
            return self._parse_rlmstat_output(result.stdout)
            
        except Exception as e:
            return {'error': str(e)}
    
    def _parse_rlmstat_output(self, output):
        """Parse rlmutil rlmstat output into structured data"""
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
                if 'UP' in line.upper():
                    usage_data['server_status'] = 'up'
                else:
                    usage_data['server_status'] = 'down'
            
            # Parse feature usage
            elif line.startswith('Users of '):
                # Extract feature name and usage
                match = re.search(r'Users of ([^:]+):\s+\(Total of (\d+) licenses issued; Total of (\d+) licenses in use\)', line)
                if match:
                    feature_name = match.group(1)
                    total_licenses = int(match.group(2))
                    used_licenses = int(match.group(3))
                    
                    usage_data['features'][feature_name] = {
                        'total': total_licenses,
                        'used': used_licenses,
                        'available': total_licenses - used_licenses,
                        'usage_percent': (used_licenses / total_licenses) * 100 if total_licenses > 0 else 0,
                        'users': []
                    }
                    current_feature = feature_name
            
            # Parse user sessions
            elif current_feature and ' ' in line and any(keyword in line.lower() for keyword in ['start', 'user']):
                # Extract user information from RLM output format
                parts = line.split()
                if len(parts) >= 4:
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
        report.append(f"RLM License Usage Report")
        report.append(f"Server: {usage['server']}")
        report.append(f"Status: {usage['server_status'].upper()}")
        report.append(f"Timestamp: {usage['timestamp']}")
        report.append(f"Total Active Users: {usage['total_users']}")
        report.append("")
        
        # Feature usage table
        report.append("Feature Usage:")
        report.append("-" * 70)
        report.append(f"{'Feature':<20} {'Used':<6} {'Total':<6} {'Avail':<6} {'Usage %':<8}")
        report.append("-" * 70)
        
        for feature, data in usage['features'].items():
            report.append(f"{feature:<20} {data['used']:<6} {data['total']:<6} "
                         f"{data['available']:<6} {data['usage_percent']:<8.1f}")
        
        # Active users by feature
        report.append("")
        report.append("Active Users by Feature:")
        report.append("-" * 50)
        
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
    parser = argparse.ArgumentParser(description='RLM License Usage Analyzer')
    parser.add_argument('--server', default='5053@localhost', 
                       help='RLM server (port@hostname)')
    parser.add_argument('--format', choices=['text', 'json', 'csv'], default='text',
                       help='Output format')
    parser.add_argument('--output', help='Output file (default: stdout)')
    
    args = parser.parse_args()
    
    analyzer = RLMUsageAnalyzer(args.server)
    report = analyzer.generate_report(args.format)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(report)
        print(f"Report saved to {args.output}")
    else:
        print(report)
```

## Emergency Procedures

### RLM Server Recovery

**Quick Recovery Checklist**:
```bash
# 1. Stop all license-consuming processes if necessary
# (Only in emergency - will interrupt user work)
sudo pkill -f "starccm\|comsol\|lsdyna"

# 2. Restart RLM service
sudo systemctl restart rlm

# 3. Verify server is responding
/opt/rlm/bin/rlmutil rlmstat -c 5053@localhost

# 4. Check web interface
curl -k https://localhost:5054

# 5. Notify Vantage of server restart
vantage licenses refresh rlm-server --immediate

# 6. Test license checkout
vantage licenses test rlm-server --feature STARCCM

# 7. Monitor for several minutes
watch -n 30 '/opt/rlm/bin/rlmutil rlmstat -c 5053@localhost | head -20'
```

**Disaster Recovery**:
```bash
# If RLM server is completely down and cannot be recovered:

# 1. Activate backup/secondary RLM server
vantage licenses failover rlm-server --to backup-rlm-server

# 2. Update DNS or load balancer to point to backup
# (Depends on your infrastructure setup)

# 3. Verify all applications can reach new server
vantage cluster test --component licensing

# 4. Monitor usage on backup server
vantage licenses monitor backup-rlm-server --alert-threshold 90
```

## Next Steps

- **[RLM Introduction](./)**: Return to main RLM overview
- **[High Availability Setup](/platform/licenses/how-to-guides/rlm/high-availability)**: Prevent single points of failure
- **[Monitoring & Analytics](/platform/licenses/how-to-guides/rlm/monitoring)**: Proactive monitoring setup

---

> **Emergency Contact**: For critical RLM server issues affecting production workloads, contact your Vantage support team immediately at support@vantage.com or use the emergency escalation procedures in your support agreement. The RLM web interface often provides additional diagnostic information beyond command-line tools.
