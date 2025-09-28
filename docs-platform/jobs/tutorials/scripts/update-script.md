---
title: Update Job Script
sidebar_label: Update Script
---

Updating job scripts in Vantage allows modification of existing computational workflows. This guide covers safe update practices and version management strategies, ensuring reliable evolution of computational methods while maintaining reproducibility and stability.

## Overview

Script updates enable continuous improvement through:

- **Feature Enhancement**: Adding new capabilities and computational methods
- **Bug Fixes**: Correcting errors and improving reliability
- **Performance Optimization**: Improving efficiency and resource utilization
- **Security Updates**: Addressing vulnerabilities and compliance requirements
- **Compatibility Maintenance**: Ensuring scripts work with updated dependencies and environments
- **Documentation Improvement**: Enhancing clarity and usability for team members

## Update Strategies

### Incremental Updates

Make small, focused changes that are easy to test and validate:

```bash
# Update script with version tracking
vantage job script update my-analysis.py \
  --version "1.2.0" \
  --description "Added error handling for missing data"

# Update with backup creation
vantage job script update my-analysis.py \
  --backup \
  --comment "Performance optimization for large datasets"
```

### Major Revisions

Implement significant changes while preserving previous versions:

```bash
# Create new major version
vantage job script update my-analysis.py \
  --major-version \
  --description "Rewritten algorithm for improved accuracy"

# Update with comprehensive testing
vantage job script update my-analysis.py \
  --test-mode \
  --validation-dataset /data/test-set.csv
```

### Collaborative Updates

Manage updates in team environments:

```bash
# Lock script for editing
vantage job script lock my-analysis.py --user $USER

# Update with team notification
vantage job script update my-analysis.py \
  --notify-team \
  --changelog "Fixed memory leak in data processing loop"

# Release lock after update
vantage job script unlock my-analysis.py
```

## Version Management

### Semantic Versioning

Implement structured version numbering:

```python
#!/usr/bin/env python3
"""
Data Analysis Script
Version: 2.1.3

Version History:
2.1.3 - Bug fix: Handle empty data files gracefully
2.1.0 - Feature: Added support for multiple file formats
2.0.0 - Major: Redesigned algorithm for better performance
1.x.x - Legacy versions (deprecated)
"""

__version__ = "2.1.3"
__author__ = "Research Team"
__date__ = "2024-01-15"
```

### Change Documentation

Maintain comprehensive change logs:

```markdown
# CHANGELOG.md

## [2.1.3] - 2024-01-15
### Fixed
- Handle empty input files without crashing
- Memory leak in data processing loop
- Incorrect error messages for missing dependencies

## [2.1.0] - 2024-01-10
### Added
- Support for CSV, JSON, and Parquet input formats
- Progress bar for long-running operations
- Configuration file support

### Changed
- Improved error handling and user feedback
- Optimized memory usage for large datasets

### Deprecated
- Legacy command-line options (will be removed in v3.0)
```

### Branching Strategies

Manage parallel development tracks:

```bash
# Create development branch
vantage job script branch my-analysis.py development

# Work on experimental features
vantage job script update my-analysis.py \
  --branch experimental \
  --description "Testing new algorithm approach"

# Merge successful changes
vantage job script merge my-analysis.py \
  --from experimental \
  --to main
```

## Testing and Validation

### Pre-Update Testing

Validate changes before deployment:

```python
#!/usr/bin/env python3
import unittest
import subprocess
import tempfile

class ScriptUpdateTests(unittest.TestCase):
    def setUp(self):
        """Prepare test environment"""
        self.test_data = '/path/to/test/data'
        self.temp_dir = tempfile.mkdtemp()
    
    def test_backwards_compatibility(self):
        """Ensure updated script works with existing data"""
        result = subprocess.run([
            'python', 'updated-script.py',
            '--input', self.test_data,
            '--output', self.temp_dir
        ], capture_output=True)
        
        self.assertEqual(result.returncode, 0)
        self.assertTrue(os.path.exists(f'{self.temp_dir}/results.csv'))
    
    def test_performance_regression(self):
        """Verify performance hasn't degraded"""
        import time
        
        start_time = time.time()
        result = subprocess.run([
            'python', 'updated-script.py',
            '--input', self.test_data
        ])
        execution_time = time.time() - start_time
        
        # Ensure execution time is within acceptable range
        self.assertLess(execution_time, 300)  # 5 minutes max

if __name__ == '__main__':
    unittest.main()
```

### Automated Testing

Implement continuous testing workflows:

```yaml
# .github/workflows/script-testing.yml
name: Script Testing

on:
  push:
    paths:
      - '**.py'
  pull_request:
    paths:
      - '**.py'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov
    
    - name: Run tests
      run: |
        pytest tests/ --cov=scripts/ --cov-report=xml
    
    - name: Performance test
      run: |
        python scripts/benchmark.py --quick-test
```

## Best Practices

### Safe Update Procedures

1. **Backup Creation**: Always create backups before major updates
2. **Testing Environment**: Test updates in isolated environments
3. **Gradual Rollout**: Deploy updates incrementally to minimize risk
4. **Rollback Planning**: Prepare rollback procedures for failed updates
5. **Documentation**: Update documentation alongside code changes

### Code Quality Guidelines

```python
#!/usr/bin/env python3
"""
Example: Well-structured script with update-friendly practices
"""

import argparse
import logging
import configparser
from pathlib import Path

# Configuration management
class ScriptConfig:
    def __init__(self, config_file=None):
        self.config = configparser.ConfigParser()
        if config_file:
            self.config.read(config_file)
    
    def get(self, section, key, default=None):
        return self.config.get(section, key, fallback=default)

# Modular design for easier updates
class DataProcessor:
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
    
    def process(self, input_data):
        """Main processing logic - isolated for easy updates"""
        try:
            # Processing implementation
            results = self._run_analysis(input_data)
            return results
        except Exception as e:
            self.logger.error(f"Processing failed: {e}")
            raise
    
    def _run_analysis(self, data):
        """Core analysis - separate method for easier testing"""
        # Analysis implementation
        pass

def main():
    parser = argparse.ArgumentParser(description='Data Analysis Script')
    parser.add_argument('--config', help='Configuration file')
    parser.add_argument('--input', required=True, help='Input data path')
    parser.add_argument('--output', required=True, help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize configuration
    config = ScriptConfig(args.config)
    
    # Set up logging
    logging.basicConfig(
        level=config.get('logging', 'level', 'INFO'),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Run processing
    processor = DataProcessor(config)
    processor.process(args.input)

if __name__ == '__main__':
    main()
```

## Troubleshooting Updates

### Common Update Issues

- **Dependency Conflicts**: Verify all dependencies are compatible with updates
- **Configuration Changes**: Update configuration files and environment variables
- **Data Format Changes**: Ensure input/output formats remain compatible
- **Performance Regressions**: Monitor and address performance impacts

### Rollback Procedures

```bash
# Rollback to previous version
vantage job script rollback my-analysis.py --version 1.5.2

# Emergency rollback to last known good version
vantage job script rollback my-analysis.py --emergency

# Partial rollback of specific components
vantage job script rollback my-analysis.py \
  --component data-processing \
  --version 1.4.0
```

### Recovery Strategies

- **Checkpoint Recovery**: Restore from intermediate saved states
- **Incremental Fixes**: Apply minimal patches to address critical issues
- **Feature Flags**: Temporarily disable problematic new features
- **Gradual Redeployment**: Slowly re-enable updated functionality
