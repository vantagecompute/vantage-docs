---
id: delete-submission
title: Delete Job Submission
sidebar_label: Delete Submission
---

Managing job submission lifecycle includes understanding when and how to cancel running jobs, clean up completed jobs, and maintain efficient queue management. This guide covers job deletion, cancellation, and cleanup procedures.

## Job Cancellation and Deletion

### Canceling Running Jobs

Cancel jobs that are currently executing:

```bash
# Cancel a single job
scancel 12345

# Cancel multiple jobs
scancel 12345 12346 12347

# Cancel all jobs for a user
scancel -u $USER

# Cancel jobs by name pattern
scancel --name="test_job*"

# Cancel jobs in specific state
scancel --state=PENDING -u $USER
```

### Advanced Cancellation Options

Use specific cancellation criteria:

```bash
# Cancel jobs in specific partition
scancel --partition=gpu -u $USER

# Cancel jobs submitted after specific time
scancel --starttime="2025-09-04T10:00:00" -u $USER

# Cancel array jobs
scancel 12345_[1-10]  # Cancel specific array elements
scancel 12345        # Cancel entire array job

# Interactive cancellation with confirmation
cancel_with_confirmation() {
    local job_id="$1"
    
    # Get job information
    job_info=$(scontrol show job "$job_id" 2>/dev/null)
    
    if [[ $? -ne 0 ]]; then
        echo "Job $job_id not found"
        return 1
    fi
    
    # Display job details
    echo "Job Information:"
    echo "$job_info" | grep -E "(JobId|JobName|UserId|JobState|TimeLimit|StartTime)"
    echo ""
    
    # Confirm cancellation
    read -p "Cancel this job? (yes/no): " confirmation
    
    if [[ "$confirmation" == "yes" ]]; then
        scancel "$job_id"
        echo "Job $job_id canceled"
    else
        echo "Cancellation aborted"
    fi
}
```

### Graceful Job Termination

Implement graceful shutdown in job scripts:

```bash
#!/bin/bash
#SBATCH --job-name=graceful_job
#SBATCH --time=08:00:00

# Graceful shutdown function
graceful_shutdown() {
    echo "Received termination signal, shutting down gracefully..."
    
    # Stop any background processes
    jobs -p | xargs -r kill
    
    # Save intermediate results
    if [[ -n "$INTERMEDIATE_RESULTS" ]]; then
        echo "Saving intermediate results..."
        cp -r "$INTERMEDIATE_RESULTS" "$OUTPUT_DIR/interrupted_$(date +%Y%m%d_%H%M%S)/"
    fi
    
    # Cleanup temporary files
    cleanup_temp_files
    
    echo "Graceful shutdown completed"
    exit 130  # SIGINT exit code
}

# Set up signal handlers
trap graceful_shutdown SIGTERM SIGINT

# Main job execution
main_computation() {
    # Your main computation here
    for i in {1..1000}; do
        # Process iteration
        echo "Processing iteration $i"
        
        # Save checkpoint periodically
        if [[ $((i % 10)) -eq 0 ]]; then
            save_checkpoint "$i"
        fi
        
        # Simulate work
        sleep 30
    done
}

# Save checkpoint function
save_checkpoint() {
    local iteration="$1"
    echo "Saving checkpoint at iteration $iteration"
    echo "$iteration" > checkpoint.txt
    # Save other state information
}

# Main execution
echo "Starting job with graceful shutdown support"
main_computation
echo "Job completed normally"
```

## Cleanup and Maintenance

### Automated Job Cleanup

Implement automated cleanup procedures:

```bash
#!/bin/bash
# Automated job cleanup script

cleanup_old_jobs() {
    local retention_days="${1:-30}"
    local dry_run="${2:-false}"
    
    echo "Starting job cleanup (retention: $retention_days days, dry_run: $dry_run)"
    
    # Calculate cutoff date
    cutoff_date=$(date -d "$retention_days days ago" +%Y-%m-%d)
    
    # Find old completed jobs
    old_jobs=$(sacct --starttime="$cutoff_date" --endtime="$cutoff_date" \
                    --state=COMPLETED,FAILED,TIMEOUT,CANCELLED \
                    --format=JobID --noheader --parsable2)
    
    if [[ -z "$old_jobs" ]]; then
        echo "No old jobs found for cleanup"
        return 0
    fi
    
    echo "Found $(echo "$old_jobs" | wc -l) jobs for cleanup"
    
    # Cleanup job files
    for job_id in $old_jobs; do
        # Find job output files
        output_files=$(find . -name "*${job_id}*" -type f 2>/dev/null)
        
        if [[ -n "$output_files" ]]; then
            echo "Job $job_id files:"
            echo "$output_files" | sed 's/^/  /'
            
            if [[ "$dry_run" != "true" ]]; then
                # Archive before deletion
                archive_dir="archived_jobs/$(date +%Y%m)"
                mkdir -p "$archive_dir"
                
                echo "$output_files" | while read file; do
                    if [[ -f "$file" ]]; then
                        mv "$file" "$archive_dir/"
                    fi
                done
            fi
        fi
    done
    
    # Cleanup temporary directories
    temp_dirs=$(find /tmp -name "job_*" -type d -mtime +$retention_days 2>/dev/null)
    
    if [[ -n "$temp_dirs" ]]; then
        echo "Cleaning temporary directories:"
        echo "$temp_dirs" | sed 's/^/  /'
        
        if [[ "$dry_run" != "true" ]]; then
            echo "$temp_dirs" | xargs -r rm -rf
        fi
    fi
    
    echo "Cleanup completed"
}

# Usage examples
cleanup_old_jobs 30 true   # Dry run with 30-day retention
cleanup_old_jobs 60 false  # Actual cleanup with 60-day retention
```

### Disk Space Management

Monitor and manage disk space usage:

```bash
#!/bin/bash
# Job-related disk space management

monitor_job_disk_usage() {
    echo "Job Disk Usage Report"
    echo "===================="
    
    # Check job output directories
    echo "Job Output Directories:"
    du -sh logs/ results/ scratch/ 2>/dev/null | sort -hr
    
    # Check user job files
    echo -e "\nLarge Job Files (>100MB):"
    find . -name "*.out" -o -name "*.err" -o -name "job_*" | \
        xargs ls -lh 2>/dev/null | \
        awk '$5 ~ /[0-9]+M|[0-9]+G/ {print $5, $9}' | \
        sort -hr | head -20
    
    # Check temporary files
    echo -e "\nTemporary Job Files:"
    find /tmp -name "job_*" -user $USER -exec du -sh {} \; 2>/dev/null | \
        head -10
    
    # Disk usage summary
    echo -e "\nDisk Usage Summary:"
    echo "Home directory: $(du -sh ~)"
    echo "Current directory: $(du -sh .)"
    
    # Available space
    echo -e "\nAvailable Space:"
    df -h . /tmp
}

cleanup_large_files() {
    local size_threshold="${1:-100M}"
    local interactive="${2:-true}"
    
    echo "Finding large job files (threshold: $size_threshold)"
    
    # Find large job-related files
    large_files=$(find . -name "*.out" -o -name "*.err" -o -name "job_*" | \
                  xargs ls -l 2>/dev/null | \
                  awk -v thresh="$size_threshold" '
                  {
                      size = $5
                      if (thresh ~ /M$/ && size > substr(thresh,1,length(thresh)-1) * 1024 * 1024) print $9
                      else if (thresh ~ /G$/ && size > substr(thresh,1,length(thresh)-1) * 1024 * 1024 * 1024) print $9
                  }')
    
    if [[ -z "$large_files" ]]; then
        echo "No large files found"
        return 0
    fi
    
    echo "Large files found:"
    echo "$large_files" | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  $size  $file"
    done
    
    if [[ "$interactive" == "true" ]]; then
        echo "$large_files" | while read file; do
            size=$(du -h "$file" | cut -f1)
            read -p "Delete $file ($size)? (y/n): " response
            
            if [[ "$response" == "y" ]]; then
                rm "$file"
                echo "Deleted: $file"
            fi
        done
    fi
}
```

### Archive Management

Implement job data archiving:

```python
#!/usr/bin/env python3
"""
Job data archiving system
"""

import os
import shutil
import tarfile
import json
from datetime import datetime, timedelta
from pathlib import Path

class JobArchiver:
    def __init__(self, archive_base="/archive/jobs"):
        self.archive_base = Path(archive_base)
        self.archive_base.mkdir(parents=True, exist_ok=True)
    
    def archive_job_data(self, job_id, job_directory, metadata=None):
        """Archive job data with metadata"""
        
        job_dir = Path(job_directory)
        if not job_dir.exists():
            raise ValueError(f"Job directory not found: {job_directory}")
        
        # Create archive directory structure
        archive_year = datetime.now().year
        archive_month = datetime.now().month
        archive_dir = self.archive_base / str(archive_year) / f"{archive_month:02d}"
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        # Create archive file
        archive_file = archive_dir / f"job_{job_id}.tar.gz"
        
        print(f"Archiving job {job_id} to {archive_file}")
        
        with tarfile.open(archive_file, "w:gz") as tar:
            tar.add(job_dir, arcname=f"job_{job_id}")
        
        # Create metadata file
        if metadata is None:
            metadata = {}
        
        metadata.update({
            'job_id': job_id,
            'archive_date': datetime.now().isoformat(),
            'original_path': str(job_dir),
            'archive_path': str(archive_file),
            'archive_size': archive_file.stat().st_size
        })
        
        metadata_file = archive_dir / f"job_{job_id}_metadata.json"
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Archive created: {archive_file}")
        print(f"Metadata saved: {metadata_file}")
        
        return archive_file, metadata_file
    
    def cleanup_after_archive(self, job_directory, keep_logs=True):
        """Clean up original job directory after archiving"""
        
        job_dir = Path(job_directory)
        
        if keep_logs:
            # Keep log files, remove other content
            for item in job_dir.iterdir():
                if item.is_file() and item.suffix not in ['.out', '.err', '.log']:
                    item.unlink()
                elif item.is_dir() and item.name not in ['logs']:
                    shutil.rmtree(item)
        else:
            # Remove entire directory
            shutil.rmtree(job_dir)
            print(f"Removed job directory: {job_dir}")
    
    def restore_job_data(self, job_id, restore_path=None):
        """Restore job data from archive"""
        
        # Find archive file
        archive_files = list(self.archive_base.rglob(f"job_{job_id}.tar.gz"))
        
        if not archive_files:
            raise ValueError(f"Archive not found for job {job_id}")
        
        archive_file = archive_files[0]  # Use most recent if multiple
        
        # Determine restore location
        if restore_path is None:
            restore_path = Path.cwd() / f"restored_job_{job_id}"
        else:
            restore_path = Path(restore_path)
        
        restore_path.mkdir(parents=True, exist_ok=True)
        
        print(f"Restoring job {job_id} from {archive_file} to {restore_path}")
        
        # Extract archive
        with tarfile.open(archive_file, "r:gz") as tar:
            tar.extractall(restore_path)
        
        # Load metadata
        metadata_file = archive_file.parent / f"job_{job_id}_metadata.json"
        metadata = {}
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)
        
        print(f"Job data restored to: {restore_path}")
        return restore_path, metadata
    
    def list_archived_jobs(self, start_date=None, end_date=None):
        """List archived jobs within date range"""
        
        if start_date is None:
            start_date = datetime.now() - timedelta(days=365)
        if end_date is None:
            end_date = datetime.now()
        
        archived_jobs = []
        
        for metadata_file in self.archive_base.rglob("*_metadata.json"):
            try:
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
                
                archive_date = datetime.fromisoformat(metadata['archive_date'])
                
                if start_date <= archive_date <= end_date:
                    archived_jobs.append(metadata)
                    
            except Exception as e:
                print(f"Error reading metadata from {metadata_file}: {e}")
        
        return sorted(archived_jobs, key=lambda x: x['archive_date'])

# Usage example
def main():
    archiver = JobArchiver()
    
    # Archive a job
    job_id = "123456"
    job_dir = f"results/job_{job_id}"
    
    if Path(job_dir).exists():
        metadata = {
            'user': 'researcher1',
            'project': 'protein_analysis',
            'description': 'Molecular dynamics simulation results'
        }
        
        archive_file, metadata_file = archiver.archive_job_data(
            job_id, job_dir, metadata
        )
        
        # Cleanup after archiving
        archiver.cleanup_after_archive(job_dir, keep_logs=True)
    
    # List recent archives
    recent_archives = archiver.list_archived_jobs(
        start_date=datetime.now() - timedelta(days=30)
    )
    
    print(f"\nRecent archives ({len(recent_archives)}):")
    for archive in recent_archives:
        print(f"  Job {archive['job_id']}: {archive['archive_date']}")

if __name__ == "__main__":
    main()
```

## Queue Management

### Job Priority Management

Manage job priorities and queue positions:

```bash
#!/bin/bash
# Job priority and queue management

# Check queue position and estimated start time
check_queue_position() {
    local job_id="$1"
    
    echo "Queue Information for Job $job_id"
    echo "================================"
    
    # Job details
    scontrol show job "$job_id" | grep -E "(JobId|JobName|UserId|JobState|Priority|SubmitTime)"
    
    # Queue position
    echo -e "\nQueue Position:"
    squeue -j "$job_id" --format="%.18i %.9P %.20j %.8u %.8T %.10M %.6D %R"
    
    # Estimated start time (if available)
    start_time=$(squeue -j "$job_id" --format="%S" --noheader)
    if [[ "$start_time" != "N/A" && -n "$start_time" ]]; then
        echo "Estimated start time: $start_time"
    fi
    
    # Jobs ahead in queue
    partition=$(scontrol show job "$job_id" | grep -o "Partition=[^ ]*" | cut -d= -f2)
    jobs_ahead=$(squeue --partition="$partition" --state=PENDING | wc -l)
    echo "Jobs ahead in $partition partition: $((jobs_ahead - 1))"
}

# Optimize job submission timing
optimize_submission_timing() {
    local partition="${1:-compute}"
    
    echo "Queue Analysis for Partition: $partition"
    echo "======================================="
    
    # Current queue status
    echo "Current Queue Status:"
    squeue --partition="$partition" --format="%.8T %.6D" | \
        tail -n +2 | sort | uniq -c
    
    # Node availability
    echo -e "\nNode Status:"
    sinfo --partition="$partition" --format="%.8a %.6D %N"
    
    # Historical usage patterns (simplified)
    echo -e "\nRecommendations:"
    current_hour=$(date +%H)
    
    if [[ $current_hour -ge 18 || $current_hour -le 6 ]]; then
        echo "✓ Good time to submit: Off-peak hours"
    elif [[ $current_hour -ge 12 && $current_hour -le 14 ]]; then
        echo "⚠ Lunch time: Moderate queue activity"
    else
        echo "⚠ Peak hours: Higher queue wait times expected"
    fi
}

# Batch job cancellation with criteria
cancel_jobs_by_criteria() {
    local criteria="$1"
    local dry_run="${2:-true}"
    
    echo "Finding jobs matching criteria: $criteria"
    
    case "$criteria" in
        "old_pending")
            # Jobs pending for more than 24 hours
            jobs_to_cancel=$(squeue -u $USER --state=PENDING \
                            --format="%.18i %.12L" | \
                            awk '$2 ~ /[0-9]+-/ {print $1}' | tail -n +2)
            ;;
        "failed_array")
            # Failed array job elements
            jobs_to_cancel=$(squeue -u $USER --state=FAILED \
                            --format="%.18i" | tail -n +2)
            ;;
        "test_jobs")
            # Jobs with "test" in the name
            jobs_to_cancel=$(squeue -u $USER --name="*test*" \
                            --format="%.18i" | tail -n +2)
            ;;
        *)
            echo "Unknown criteria: $criteria"
            return 1
            ;;
    esac
    
    if [[ -z "$jobs_to_cancel" ]]; then
        echo "No jobs found matching criteria"
        return 0
    fi
    
    echo "Jobs to cancel:"
    echo "$jobs_to_cancel" | while read job_id; do
        job_info=$(squeue -j "$job_id" --format="%.18i %.20j %.8T" | tail -1)
        echo "  $job_info"
    done
    
    if [[ "$dry_run" == "false" ]]; then
        echo "Canceling jobs..."
        echo "$jobs_to_cancel" | xargs scancel
        echo "Jobs canceled"
    else
        echo "Dry run mode: no jobs were actually canceled"
    fi
}
```

## Monitoring and Reporting

### Job Deletion Tracking

Track job deletions and cancellations:

```python
#!/usr/bin/env python3
"""
Job deletion tracking and reporting
"""

import sqlite3
import subprocess
import json
from datetime import datetime
from pathlib import Path

class JobDeletionTracker:
    def __init__(self, db_path="job_deletions.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize deletion tracking database"""
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS job_deletions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id TEXT,
                user TEXT,
                job_name TEXT,
                deletion_time DATETIME,
                deletion_type TEXT,  -- CANCEL, TIMEOUT, FAILED, MANUAL
                reason TEXT,
                resources_freed TEXT,
                cleanup_status TEXT
            )
        ''')
        conn.commit()
        conn.close()
    
    def log_job_deletion(self, job_id, deletion_type, reason="", cleanup_status="pending"):
        """Log a job deletion event"""
        
        # Get job information if still available
        try:
            result = subprocess.run(
                ['sacct', '-j', job_id, '--format=JobName,User,AllocCPUS,ReqMem', 
                 '--noheader', '--parsable2'],
                capture_output=True, text=True, check=True
            )
            
            if result.stdout.strip():
                job_name, user, cpus, memory = result.stdout.strip().split('|')
                resources_freed = f"CPUs: {cpus}, Memory: {memory}"
            else:
                job_name, user, resources_freed = "Unknown", "Unknown", "Unknown"
                
        except subprocess.CalledProcessError:
            job_name, user, resources_freed = "Unknown", "Unknown", "Unknown"
        
        # Log to database
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            INSERT INTO job_deletions 
            (job_id, user, job_name, deletion_time, deletion_type, reason, 
             resources_freed, cleanup_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (job_id, user, job_name, datetime.now(), deletion_type, 
              reason, resources_freed, cleanup_status))
        conn.commit()
        conn.close()
        
        print(f"Logged deletion: Job {job_id} ({deletion_type})")
    
    def update_cleanup_status(self, job_id, status):
        """Update cleanup status for a job"""
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            UPDATE job_deletions 
            SET cleanup_status = ? 
            WHERE job_id = ?
        ''', (status, job_id))
        conn.commit()
        conn.close()
    
    def generate_deletion_report(self, days=30):
        """Generate deletion activity report"""
        conn = sqlite3.connect(self.db_path)
        
        # Get recent deletions
        cursor = conn.execute('''
            SELECT deletion_type, COUNT(*) as count
            FROM job_deletions 
            WHERE deletion_time > datetime('now', '-{} days')
            GROUP BY deletion_type
            ORDER BY count DESC
        '''.format(days))
        
        deletion_stats = cursor.fetchall()
        
        # Get cleanup status
        cursor = conn.execute('''
            SELECT cleanup_status, COUNT(*) as count
            FROM job_deletions 
            WHERE deletion_time > datetime('now', '-{} days')
            GROUP BY cleanup_status
        '''.format(days))
        
        cleanup_stats = cursor.fetchall()
        
        conn.close()
        
        # Generate report
        report = f"Job Deletion Report (Last {days} days)\n"
        report += "=" * 40 + "\n\n"
        
        report += "Deletion Types:\n"
        for deletion_type, count in deletion_stats:
            report += f"  {deletion_type}: {count}\n"
        
        report += "\nCleanup Status:\n"
        for status, count in cleanup_stats:
            report += f"  {status}: {count}\n"
        
        return report

# Enhanced cancellation with tracking
def cancel_job_with_tracking(job_id, reason="Manual cancellation"):
    """Cancel job and log the deletion"""
    
    tracker = JobDeletionTracker()
    
    # Cancel the job
    result = subprocess.run(['scancel', job_id], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"Job {job_id} canceled successfully")
        tracker.log_job_deletion(job_id, "CANCEL", reason)
        
        # Initiate cleanup
        cleanup_job_files(job_id)
        tracker.update_cleanup_status(job_id, "completed")
        
    else:
        print(f"Failed to cancel job {job_id}: {result.stderr}")

def cleanup_job_files(job_id):
    """Clean up files associated with a job"""
    
    # Find and clean up job files
    job_files = subprocess.run(
        ['find', '.', '-name', f'*{job_id}*', '-type', 'f'],
        capture_output=True, text=True
    ).stdout.strip().split('\n')
    
    if job_files and job_files[0]:  # Check if any files found
        print(f"Cleaning up {len(job_files)} files for job {job_id}")
        
        for file_path in job_files:
            if file_path and Path(file_path).exists():
                # Archive small files, delete large ones
                file_size = Path(file_path).stat().st_size
                
                if file_size < 10 * 1024 * 1024:  # Less than 10MB
                    # Move to archive
                    archive_dir = Path("archived_jobs")
                    archive_dir.mkdir(exist_ok=True)
                    shutil.move(file_path, archive_dir / Path(file_path).name)
                else:
                    # Delete large files
                    Path(file_path).unlink()

# Usage example
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        job_id = sys.argv[1]
        reason = sys.argv[2] if len(sys.argv) > 2 else "Manual cleanup"
        cancel_job_with_tracking(job_id, reason)
    
    # Generate report
    tracker = JobDeletionTracker()
    print(tracker.generate_deletion_report())
```

## Best Practices Summary

### Job Cancellation

- Cancel jobs promptly when no longer needed
- Use graceful shutdown mechanisms in job scripts
- Implement checkpointing for long-running jobs
- Monitor job progress and cancel failed jobs quickly

### Cleanup and Maintenance

- Implement automated cleanup procedures
- Archive important job data before deletion
- Monitor disk space usage regularly
- Maintain proper file organization

### Queue Management

- Understand queue policies and priorities
- Submit jobs at optimal times
- Cancel old pending jobs that are no longer needed
- Monitor queue health and resource utilization

### Documentation and Tracking

- Log job deletions and reasons
- Track cleanup activities and outcomes
- Generate regular reports on deletion activities
- Maintain audit trails for compliance

## Next Steps

After implementing job deletion and cleanup procedures:

- Establish regular maintenance schedules
- Implement automated monitoring and alerts
- Create organizational policies for job lifecycle management
- Train users on proper job management practices
- Monitor and optimize cleanup procedures based on usage patterns
