---
id: share-script
title: Share Job Script
sidebar_label: Share Script
---

Sharing job scripts in Vantage enables collaboration, knowledge transfer, and standardization across teams and projects. This guide covers effective strategies for sharing scripts while maintaining security and best practices.

## Understanding Script Sharing

Script sharing facilitates:

- **Knowledge Transfer**: Share expertise and computational methods across teams
- **Collaboration**: Enable team members to build upon each other's work
- **Standardization**: Establish consistent approaches to common computational tasks
- **Efficiency**: Reduce duplication of effort and development time
- **Quality Improvement**: Leverage peer review and collective expertise

## Sharing Models and Strategies

### Personal Scripts

Scripts developed for individual use:

- **Scope**: Private development and experimentation
- **Sharing**: Selective sharing with specific collaborators
- **Use Case**: Prototype development, personal research, and testing
- **Access Control**: Manual sharing through direct collaboration

### Team Scripts

Scripts shared within project teams:

- **Scope**: Team-specific workflows and standardized processes
- **Sharing**: Accessible to all team members
- **Use Case**: Collaborative projects, team standards, and shared workflows
- **Access Control**: Team-based permissions and role management

### Organization Scripts

Scripts available across the entire organization:

- **Scope**: Company-wide standards and best practices
- **Sharing**: Organization-wide accessibility with appropriate governance
- **Use Case**: Enterprise standards, cross-team collaboration, and knowledge sharing
- **Access Control**: Organization-level permissions with approval workflows

### Community Scripts

Scripts shared with the broader research or user community:

- **Scope**: Open collaboration and community contribution
- **Sharing**: Public repositories and community platforms
- **Use Case**: Open science, reproducible research, and community development
- **Access Control**: Public access with community moderation

## Preparing Scripts for Sharing

### Code Quality and Documentation

Ensure scripts meet sharing standards:

#### Code Cleanup

```bash
#!/bin/bash
# Data Processing Pipeline v2.1
# Author: Research Team
# Purpose: Standardized data processing for genomics analysis
# Last Updated: 2025-09-04

#SBATCH --job-name=genomics_pipeline
#SBATCH --cpus-per-task=16
#SBATCH --mem=64G
#SBATCH --time=08:00:00
#SBATCH --output=logs/genomics_%j.out
#SBATCH --error=logs/genomics_%j.err

# Set strict error handling
set -euo pipefail

# Configuration and parameters
INPUT_DIR="${1:-/data/raw_genomics}"
OUTPUT_DIR="${2:-/data/processed_genomics}"
REFERENCE_GENOME="${3:-/reference/hg38.fa}"
THREADS="${SLURM_CPUS_PER_TASK:-16}"

# Function definitions with clear documentation
process_genomics_data() {
    local input_file="$1"
    local output_prefix="$2"
    
    echo "Processing genomics file: $input_file"
    
    # Quality control
    fastqc "$input_file" -o "$OUTPUT_DIR/qc/"
    
    # Alignment
    bwa mem -t "$THREADS" "$REFERENCE_GENOME" "$input_file" | \
        samtools sort -@ "$THREADS" -o "${output_prefix}.bam"
    
    # Index
    samtools index "${output_prefix}.bam"
    
    echo "Completed processing: $output_prefix"
}
```

#### Comprehensive Documentation

```python
#!/usr/bin/env python3
"""
Machine Learning Training Pipeline

This script provides a standardized approach for training machine learning models
on cluster resources. It supports multiple algorithms, hyperparameter tuning,
and comprehensive experiment tracking.

Usage:
    python ml_training.py --config config.yaml --experiment experiment_name

Requirements:
    - Python 3.8+
    - scikit-learn >= 1.0
    - pandas >= 1.3
    - numpy >= 1.21

Author: Data Science Team
Version: 2.0
License: MIT
"""

import argparse
import logging
import yaml
from pathlib import Path
from typing import Dict, Any, Tuple

# Configure logging for better debugging and monitoring
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ml_training.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_configuration(config_path: str) -> Dict[str, Any]:
    """
    Load and validate configuration from YAML file.
    
    Args:
        config_path: Path to configuration file
        
    Returns:
        Configuration dictionary
        
    Raises:
        FileNotFoundError: If configuration file doesn't exist
        yaml.YAMLError: If configuration file is invalid
    """
    config_file = Path(config_path)
    
    if not config_file.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    try:
        with open(config_file, 'r') as f:
            config = yaml.safe_load(f)
        
        # Validate required configuration sections
        required_sections = ['data', 'model', 'training']
        for section in required_sections:
            if section not in config:
                raise ValueError(f"Missing required configuration section: {section}")
        
        logger.info(f"Configuration loaded successfully from {config_path}")
        return config
        
    except yaml.YAMLError as e:
        logger.error(f"Invalid YAML configuration: {e}")
        raise
```

### Parameter Documentation

Create clear parameter documentation:

```yaml
# Configuration file for ML training pipeline
# All parameters with descriptions and valid ranges

data:
  input_file: "/data/training/dataset.csv"    # Path to training dataset
  test_split: 0.2                             # Test set proportion (0.1-0.5)
  validation_split: 0.1                       # Validation set proportion (0.1-0.3)
  random_seed: 42                             # Random seed for reproducibility
  
model:
  algorithm: "random_forest"                  # Algorithm: random_forest, svm, neural_network
  hyperparameters:
    n_estimators: 100                         # Number of trees (10-1000)
    max_depth: 10                             # Maximum tree depth (1-50)
    min_samples_split: 2                      # Minimum samples to split (2-20)
    
training:
  cross_validation: 5                         # CV folds (3-10)
  scoring_metric: "accuracy"                  # Metric: accuracy, f1, roc_auc
  hyperparameter_tuning: true                 # Enable hyperparameter optimization
  
output:
  model_path: "/models/trained_model.pkl"     # Path to save trained model
  results_path: "/results/experiment/"        # Directory for results and logs
  save_predictions: true                      # Save model predictions
```

### Security and Compliance

Ensure scripts meet security requirements:

#### Remove Sensitive Information

```bash
# Security checklist for script sharing:

# ❌ NEVER include hardcoded credentials
# DATABASE_PASSWORD="secret123"

# ✅ Use environment variables or configuration files
DATABASE_PASSWORD="${DB_PASSWORD:-}"
if [[ -z "$DATABASE_PASSWORD" ]]; then
    echo "Error: DATABASE_PASSWORD environment variable not set" >&2
    exit 1
fi

# ❌ NEVER hardcode server addresses or sensitive paths
# SERVER_URL="https://internal.company.com/api"

# ✅ Use configurable parameters
SERVER_URL="${API_SERVER_URL:-https://api.example.com}"

# ❌ NEVER include personal or proprietary file paths
# INPUT_DIR="/home/john.doe/private_research/data"

# ✅ Use relative paths or configurable directories
INPUT_DIR="${INPUT_DATA_DIR:-./data}"
```

#### Input Validation and Sanitization

```python
import os
import re
from pathlib import Path

def validate_file_path(file_path: str, allowed_extensions: list = None) -> Path:
    """
    Validate and sanitize file paths for security.
    
    Args:
        file_path: Path to validate
        allowed_extensions: List of allowed file extensions
        
    Returns:
        Validated Path object
        
    Raises:
        ValueError: If path is invalid or insecure
    """
    # Convert to Path object and resolve
    path = Path(file_path).resolve()
    
    # Check for directory traversal attempts
    if '..' in path.parts:
        raise ValueError(f"Invalid path (directory traversal): {file_path}")
    
    # Validate file extension if specified
    if allowed_extensions and path.suffix.lower() not in allowed_extensions:
        raise ValueError(f"Invalid file extension. Allowed: {allowed_extensions}")
    
    # Check if path exists and is accessible
    if not path.exists():
        raise ValueError(f"File not found: {file_path}")
    
    if not os.access(path, os.R_OK):
        raise ValueError(f"File not readable: {file_path}")
    
    return path

def sanitize_job_name(job_name: str) -> str:
    """
    Sanitize job names to prevent injection attacks.
    
    Args:
        job_name: User-provided job name
        
    Returns:
        Sanitized job name
    """
    # Remove special characters and limit length
    sanitized = re.sub(r'[^a-zA-Z0-9_-]', '', job_name)
    sanitized = sanitized[:50]  # Limit length
    
    if not sanitized:
        raise ValueError("Invalid job name")
    
    return sanitized
```

## Sharing Mechanisms

### Version Control Integration

Use Git for script sharing and collaboration:

#### Repository Structure

```
scripts/
├── README.md                    # Repository documentation
├── requirements.txt             # Python dependencies
├── environment.yml              # Conda environment
├── .gitignore                   # Git ignore rules
├── data_processing/
│   ├── README.md               # Module documentation
│   ├── genomics_pipeline.sh    # Genomics processing script
│   ├── config/
│   │   ├── default.yaml        # Default configuration
│   │   └── examples/           # Example configurations
│   └── tests/
│       ├── test_pipeline.sh    # Test script
│       └── test_data/          # Test datasets
├── machine_learning/
│   ├── README.md
│   ├── train_model.py
│   ├── config/
│   └── tests/
└── utilities/
    ├── common_functions.sh     # Shared utility functions
    ├── monitoring.py           # Performance monitoring
    └── validation.py           # Input validation utilities
```

#### Git Best Practices

```bash
# Create feature branch for script development
git checkout -b feature/new-analysis-script

# Commit changes with descriptive messages
git add analysis_script.py config/analysis.yaml
git commit -m "Add molecular dynamics analysis script

- Implements trajectory analysis with GROMACS
- Supports multiple file formats (XTC, TRR)
- Includes configuration validation and error handling
- Adds comprehensive logging and progress tracking"

# Push branch and create pull request
git push origin feature/new-analysis-script

# Tag stable versions
git tag -a v1.2.0 -m "Release version 1.2.0
- Added support for GPU acceleration
- Improved memory efficiency for large datasets
- Fixed bug in output file handling"
```

### Documentation Platforms

Create comprehensive documentation:

#### Script Documentation Template

```markdown
# Genomics Data Processing Pipeline

## Overview
This script provides a standardized workflow for processing genomics sequencing data, including quality control, alignment, and variant calling.

## Features
- Automated quality control with FastQC
- Efficient read alignment using BWA
- Variant calling with GATK
- Comprehensive error handling and logging
- Resource optimization for cluster execution

## Requirements

### Software Dependencies
- BWA (>= 0.7.17)
- SAMtools (>= 1.12)
- GATK (>= 4.2.0)
- FastQC (>= 0.11.9)

### Resource Requirements
- CPU: 16-32 cores recommended
- Memory: 64GB minimum, 128GB recommended
- Storage: 500GB temporary space for large datasets
- Runtime: 2-8 hours depending on data size

## Installation and Setup

### Environment Setup
```bash
# Load required modules (adjust for your cluster)
module load bwa/0.7.17
module load samtools/1.12
module load gatk/4.2.0
module load fastqc/0.11.9

# Set up working environment
export REFERENCE_GENOME="/reference/genomes/hg38.fa"
export TEMP_DIR="/scratch/$USER"
```

### Configuration
Copy and modify the configuration file:
```bash
cp config/genomics_default.yaml config/my_analysis.yaml
# Edit configuration as needed
```

## Usage

### Basic Usage
```bash
# Submit job to cluster
sbatch genomics_pipeline.sh /path/to/input.fastq /path/to/output_dir

# Or run interactively
bash genomics_pipeline.sh /path/to/input.fastq /path/to/output_dir
```

### Advanced Usage
```bash
# Custom reference genome
bash genomics_pipeline.sh input.fastq output_dir custom_reference.fa

# With specific resource allocation
sbatch --cpus-per-task=32 --mem=128G genomics_pipeline.sh input.fastq output_dir
```

## Parameters

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| input_file | Path to input FASTQ file | - | Yes |
| output_dir | Output directory | - | Yes |
| reference | Reference genome | $REFERENCE_GENOME | No |
| threads | Number of threads | $SLURM_CPUS_PER_TASK | No |

## Output

The script generates the following outputs:
- `quality_control/`: FastQC reports and quality metrics
- `alignment/`: BAM files and alignment statistics
- `variants/`: VCF files with called variants
- `logs/`: Execution logs and performance metrics

## Examples

### Processing Single Sample
```bash
sbatch genomics_pipeline.sh \
    /data/samples/sample001.fastq \
    /results/sample001/
```

### Batch Processing Multiple Samples
```bash
for sample in /data/samples/*.fastq; do
    sample_name=$(basename "$sample" .fastq)
    sbatch genomics_pipeline.sh "$sample" "/results/$sample_name/"
done
```

## Troubleshooting

### Common Issues

**Out of Memory Errors**
- Increase memory allocation: `--mem=128G`
- Use local scratch space for temporary files
- Split large input files into smaller chunks

**Alignment Failures**
- Verify reference genome path and format
- Check input file quality and format
- Ensure sufficient disk space for temporary files

### Performance Optimization
- Use node-local storage for I/O intensive operations
- Optimize thread count based on available cores
- Monitor resource usage and adjust parameters

## Support and Contributing

### Getting Help
- Check troubleshooting section above
- Review log files in `logs/` directory
- Contact: genomics-support@organization.org

### Contributing
1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request with description

## License
MIT License - see LICENSE file for details

## Changelog

### Version 2.1 (2025-09-04)
- Added support for paired-end reads
- Improved error handling and recovery
- Enhanced logging and monitoring

### Version 2.0 (2025-08-15)
- Major rewrite for better performance
- Added configuration file support
- Implemented comprehensive testing
```

### Knowledge Sharing Platforms

Leverage organizational platforms for sharing:

#### Internal Wiki Integration

```markdown
<!-- Wiki page template for script documentation -->

# Script Library: Machine Learning Training Pipeline

**Category**: Data Science  
**Difficulty**: Intermediate  
**Maintainer**: Data Science Team  
**Last Updated**: 2025-09-04

## Quick Start
1. Clone script repository: `git clone internal-git/ml-scripts`
2. Load environment: `module load python/3.9 cuda/11.2`
3. Submit job: `sbatch train_model.py --config my_config.yaml`

## Related Scripts
- [Data Preprocessing Pipeline](./data-preprocessing)
- [Model Evaluation Tools](./model-evaluation)
- [Hyperparameter Optimization](./hyperparameter-tuning)

## Success Stories
- **Research Project Alpha**: Reduced training time by 40%
- **Product Team Beta**: Improved model accuracy by 15%
- **PhD Student Gamma**: Completed thesis analysis in 2 weeks

## Community Discussion
- [Best Practices Forum](./forums/ml-best-practices)
- [Troubleshooting Help](./forums/ml-support)
- [Feature Requests](./forums/ml-features)
```

## Collaboration Workflows

### Peer Review Process

Implement code review for shared scripts:

#### Review Checklist

```markdown
## Script Review Checklist

### Code Quality
- [ ] Code follows organization style guidelines
- [ ] Functions and variables have descriptive names
- [ ] Complex logic is properly commented
- [ ] Error handling is comprehensive
- [ ] Input validation is implemented

### Documentation
- [ ] Purpose and usage are clearly documented
- [ ] Parameters and options are explained
- [ ] Examples are provided and tested
- [ ] Dependencies and requirements are listed
- [ ] Output format is documented

### Performance
- [ ] Resource requirements are reasonable
- [ ] Script is optimized for cluster execution
- [ ] Parallel processing is used appropriately
- [ ] I/O operations are efficient
- [ ] Memory usage is optimized

### Security
- [ ] No hardcoded credentials or sensitive data
- [ ] Input validation prevents injection attacks
- [ ] File paths are properly sanitized
- [ ] Access controls are appropriate
- [ ] Logging doesn't expose sensitive information

### Testing
- [ ] Script has been tested with sample data
- [ ] Edge cases and error conditions are handled
- [ ] Performance has been validated
- [ ] Resource usage is within expected limits
- [ ] Output correctness is verified
```

#### Review Process

```bash
# Create review branch
git checkout -b review/ml-training-script

# Run automated checks
./scripts/run_linting.sh
./scripts/run_tests.sh
./scripts/security_scan.sh

# Manual review and testing
# ... perform thorough review ...

# Provide feedback
git add review_comments.md
git commit -m "Review: ML training script

Comments:
- Excellent documentation and error handling
- Suggest adding more example configurations
- Minor optimization opportunity in data loading
- All tests pass, ready for approval"

# Approve or request changes
git push origin review/ml-training-script
```

### Community Engagement

Foster active community participation:

#### User Forums and Discussion

```markdown
# Script Discussion: Genomics Pipeline v2.1

**Posted by**: @research_user  
**Category**: Genomics  
**Tags**: #pipeline #genomics #performance

## Question
I'm using the genomics pipeline for whole genome sequencing data and getting memory errors with large files. Any suggestions for optimization?

**System**: 64GB RAM, 32 cores  
**Data size**: 150GB FASTQ files  
**Error**: Out of memory during alignment step

---

**Reply by @genomics_expert**:
For large files, try these optimizations:

1. Use streaming processing:
```bash
# Instead of loading entire file
bwa mem ref.fa large_file.fastq | samtools sort -@ 16 -m 2G -o output.bam
```

2. Split input files:
```bash
# Process in chunks
split -l 40000000 large_file.fastq chunk_
for chunk in chunk_*; do
    process_chunk $chunk &
done
wait
```

3. Use local scratch space:
```bash
export TEMP_DIR="/local/scratch/$SLURM_JOB_ID"
```

---

**Reply by @pipeline_maintainer**:
Great suggestions! I'll add these optimizations to v2.2. Also consider:

- Using `--mem=128G` for very large files
- Setting `export TMPDIR=$LOCAL_SCRATCH` 
- Monitoring with `sstat` to track actual usage

Would you like to beta test the upcoming improvements?
```

#### Knowledge Base Articles

```markdown
# Knowledge Base: Script Performance Optimization

## Common Performance Issues and Solutions

### Memory Management
**Problem**: Scripts running out of memory  
**Solutions**:
- Use streaming processing instead of loading entire datasets
- Implement chunked processing for large files
- Monitor actual memory usage vs. allocated
- Use local scratch space for temporary files

**Example**: 
```python
# Instead of loading all data at once
data = pd.read_csv('large_file.csv')

# Use chunked processing
for chunk in pd.read_csv('large_file.csv', chunksize=10000):
    process_chunk(chunk)
```

### I/O Optimization
**Problem**: Slow file operations  
**Solutions**:
- Use node-local storage for intensive I/O
- Minimize data movement between storage systems
- Optimize file formats (HDF5, Parquet vs CSV)
- Use parallel I/O when possible

### CPU Utilization
**Problem**: Poor CPU utilization  
**Solutions**:
- Implement parallel processing
- Use vectorized operations
- Optimize algorithm complexity
- Balance I/O and CPU operations
```

## Support and Maintenance

### User Support Strategies

Provide comprehensive support for shared scripts:

#### Support Documentation

```markdown
# Script Support Guide

## Getting Help

### Self-Service Resources
1. **Documentation**: Check script README and inline comments
2. **FAQ**: Review frequently asked questions
3. **Examples**: Examine provided usage examples
4. **Troubleshooting**: Follow troubleshooting guide

### Community Support
1. **Forums**: Post questions in relevant discussion forums
2. **Chat**: Use team chat channels for quick questions
3. **Mentoring**: Connect with experienced users
4. **Office Hours**: Attend weekly support sessions

### Direct Support
1. **Email**: Contact script maintainers directly
2. **Tickets**: Submit formal support requests
3. **Escalation**: Escalate critical issues to administrators

## Response Time Expectations

| Issue Type | Response Time | Resolution Time |
|------------|---------------|-----------------|
| Critical | 2 hours | 24 hours |
| High | 8 hours | 72 hours |
| Medium | 24 hours | 1 week |
| Low | 3 days | 2 weeks |

## Maintenance Schedule

- **Monthly**: Dependency updates and security patches
- **Quarterly**: Performance optimization and feature updates
- **Annually**: Major version updates and architecture reviews
```

### Update and Maintenance

Manage script lifecycle effectively:

```bash
#!/bin/bash
# Script maintenance automation

# Check for dependency updates
check_dependencies() {
    echo "Checking for dependency updates..."
    
    # Python packages
    pip list --outdated
    
    # System modules
    module avail | grep -E "(python|gcc|cuda)" | \
        awk '{print $1}' | sort -V | tail -5
    
    # Container images
    singularity remote list | grep -E "(tensorflow|pytorch)"
}

# Run automated tests
run_maintenance_tests() {
    echo "Running maintenance tests..."
    
    # Functionality tests
    ./tests/test_basic_functionality.sh
    
    # Performance regression tests
    ./tests/test_performance.sh
    
    # Security scans
    ./tests/security_scan.sh
    
    # Integration tests
    ./tests/test_cluster_integration.sh
}

# Update documentation
update_documentation() {
    echo "Updating documentation..."
    
    # Generate API documentation
    python -m pydoc -w script_module
    
    # Update changelog
    git log --oneline --since="1 month ago" >> CHANGELOG.md
    
    # Update usage statistics
    ./scripts/generate_usage_stats.py
}

# Main maintenance routine
main() {
    check_dependencies
    run_maintenance_tests
    update_documentation
    
    echo "Maintenance completed at $(date)"
}

main "$@"
```

## Measuring Impact and Success

### Usage Analytics

Track script adoption and impact:

```python
import json
import sqlite3
from datetime import datetime, timedelta
from collections import defaultdict

class ScriptAnalytics:
    def __init__(self, db_path="script_analytics.db"):
        self.conn = sqlite3.connect(db_path)
        self.setup_database()
    
    def setup_database(self):
        """Initialize analytics database"""
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS script_usage (
                id INTEGER PRIMARY KEY,
                script_name TEXT,
                user_id TEXT,
                timestamp DATETIME,
                execution_time REAL,
                success BOOLEAN,
                resource_usage TEXT
            )
        """)
    
    def log_usage(self, script_name, user_id, execution_time, 
                  success, resource_usage):
        """Log script usage event"""
        self.conn.execute("""
            INSERT INTO script_usage 
            (script_name, user_id, timestamp, execution_time, success, resource_usage)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (script_name, user_id, datetime.now(), execution_time, 
              success, json.dumps(resource_usage)))
        self.conn.commit()
    
    def generate_usage_report(self, days=30):
        """Generate usage analytics report"""
        since_date = datetime.now() - timedelta(days=days)
        
        cursor = self.conn.execute("""
            SELECT script_name, COUNT(*) as usage_count,
                   AVG(execution_time) as avg_runtime,
                   SUM(CASE WHEN success THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate,
                   COUNT(DISTINCT user_id) as unique_users
            FROM script_usage 
            WHERE timestamp > ?
            GROUP BY script_name
            ORDER BY usage_count DESC
        """, (since_date,))
        
        results = cursor.fetchall()
        
        report = f"Script Usage Report (Last {days} days)\n"
        report += "=" * 50 + "\n\n"
        
        for script, count, avg_time, success_rate, users in results:
            report += f"Script: {script}\n"
            report += f"  Total Usage: {count}\n"
            report += f"  Unique Users: {users}\n"
            report += f"  Avg Runtime: {avg_time:.2f} seconds\n"
            report += f"  Success Rate: {success_rate:.1f}%\n\n"
        
        return report
```

### Feedback Collection

Gather user feedback systematically:

```python
class FeedbackCollector:
    def __init__(self):
        self.feedback_file = "script_feedback.json"
        self.load_feedback()
    
    def collect_feedback(self, script_name, user_id, rating, comments):
        """Collect user feedback on script"""
        feedback_entry = {
            'timestamp': datetime.now().isoformat(),
            'script_name': script_name,
            'user_id': user_id,
            'rating': rating,  # 1-5 scale
            'comments': comments
        }
        
        self.feedback_data.append(feedback_entry)
        self.save_feedback()
    
    def generate_feedback_summary(self, script_name=None):
        """Generate feedback summary"""
        if script_name:
            feedback = [f for f in self.feedback_data 
                       if f['script_name'] == script_name]
        else:
            feedback = self.feedback_data
        
        if not feedback:
            return "No feedback available"
        
        avg_rating = sum(f['rating'] for f in feedback) / len(feedback)
        
        summary = f"Feedback Summary for {script_name or 'All Scripts'}\n"
        summary += f"Average Rating: {avg_rating:.2f}/5.0\n"
        summary += f"Total Responses: {len(feedback)}\n\n"
        
        # Recent comments
        recent_feedback = sorted(feedback, 
                               key=lambda x: x['timestamp'], 
                               reverse=True)[:5]
        
        summary += "Recent Comments:\n"
        for f in recent_feedback:
            summary += f"- {f['comments']} (Rating: {f['rating']}/5)\n"
        
        return summary
```

## Next Steps

After establishing script sharing practices:

- Monitor adoption and gather feedback regularly
- Continuously improve documentation and examples
- Foster community engagement and contribution
- Establish governance policies for script quality
- [Delete Job Scripts](./delete-script) - Learn about script lifecycle management
- Plan for long-term maintenance and evolution
