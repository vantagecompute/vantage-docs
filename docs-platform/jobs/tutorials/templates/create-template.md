---
id: create-template
title: Create Job Template
sidebar_label: Create Template
---

Creating job templates in Vantage allows you to standardize job configurations and make them reusable across your organization. This guide walks you through the process of creating effective job templates.

## Prerequisites

Before creating a job template, ensure you have:

- Access to the Vantage platform with template creation permissions
- Understanding of your job requirements and resource needs
- Familiarity with the applications or workflows you want to template

## Creating a Basic Template

### Step 1: Access Template Creator

1. Navigate to the **Jobs** section in Vantage
2. Click on **Templates** in the sidebar
3. Select **Create New Template** button

### Step 2: Define Template Metadata

Configure the basic template information:

```yaml
name: "ML Training Template"
description: "Template for machine learning model training jobs"
category: "Machine Learning"
version: "1.0"
author: "Data Science Team"
```

### Step 3: Configure Resource Requirements

Specify the computational resources:

```yaml
resources:
  cpu_cores: 8
  memory_gb: 32
  gpu_count: 1
  gpu_type: "V100"
  storage_gb: 100
  max_runtime: "24:00:00"
```

### Step 4: Set Environment Configuration

Define the software environment:

```yaml
environment:
  container_image: "tensorflow/tensorflow:2.8.0-gpu"
  modules:
    - "python/3.9"
    - "cuda/11.2"
  environment_variables:
    PYTHONPATH: "/workspace/src"
    TF_CPP_MIN_LOG_LEVEL: "1"
```

### Step 5: Configure Input/Output

Set up data handling:

```yaml
data:
  input_directory: "/data/training"
  output_directory: "/results"
  scratch_directory: "/tmp/job_scratch"
  required_files:
    - "train.py"
    - "requirements.txt"
```

## Advanced Template Features

### Parameterization

Make templates flexible with parameters:

```yaml
parameters:
  - name: "learning_rate"
    type: "float"
    default: 0.001
    description: "Learning rate for training"
  - name: "batch_size"
    type: "integer"
    default: 32
    description: "Training batch size"
  - name: "epochs"
    type: "integer"
    default: 100
    description: "Number of training epochs"
```

### Conditional Logic

Use conditional statements for dynamic configuration:

```yaml
conditions:
  - if: "gpu_count > 0"
    then:
      environment_variables:
        CUDA_VISIBLE_DEVICES: "0"
  - if: "memory_gb > 64"
    then:
      environment_variables:
        OMP_NUM_THREADS: "16"
```

### Script Templates

Include script templates with placeholders:

```bash
#!/bin/bash
#SBATCH --job-name={{job_name}}
#SBATCH --cpus-per-task={{cpu_cores}}
#SBATCH --mem={{memory_gb}}G
#SBATCH --time={{max_runtime}}

# Load environment
source activate ml_env

# Run training
python train.py \
  --learning-rate {{learning_rate}} \
  --batch-size {{batch_size}} \
  --epochs {{epochs}} \
  --output-dir {{output_directory}}
```

## Template Validation

### Step 1: Test Configuration

Validate your template configuration:

1. Use the **Validate Template** feature
2. Check for syntax errors and missing dependencies
3. Verify parameter types and constraints

### Step 2: Test Execution

Run a test job using your template:

1. Create a test job with sample parameters
2. Monitor execution for errors
3. Verify output generation and file handling

### Step 3: Performance Optimization

Optimize template performance:

1. Review resource utilization from test runs
2. Adjust resource requirements as needed
3. Optimize environment setup and data handling

## Best Practices

### Naming Conventions

Use clear, descriptive names:

- Template name: Descriptive and unique
- Parameters: Clear, consistent naming
- File paths: Use variables for flexibility

### Documentation

Include comprehensive documentation:

- Template purpose and use cases
- Parameter descriptions and valid ranges
- Example usage and expected outputs
- Troubleshooting common issues

### Version Control

Manage template versions:

- Use semantic versioning (e.g., 1.0.0)
- Document changes between versions
- Maintain backward compatibility when possible
- Archive old versions for reference

### Security Considerations

Ensure template security:

- Validate all user inputs
- Use secure default values
- Restrict access to sensitive resources
- Follow organizational security policies

## Publishing Your Template

### Step 1: Review and Approve

Before publishing:

1. Complete final testing and validation
2. Get approval from relevant stakeholders
3. Ensure documentation is complete

### Step 2: Set Permissions

Configure access permissions:

- Public: Available to all users
- Team: Restricted to specific teams
- Private: Personal use only

### Step 3: Deploy Template

Publish the template:

1. Click **Publish Template**
2. Set appropriate tags and categories
3. Configure notification settings
4. Monitor initial usage and feedback

## Troubleshooting

### Common Issues

#### Template Validation Errors

- Check YAML syntax and indentation
- Verify all required fields are present
- Ensure parameter types match expected values

#### Resource Allocation Problems

- Review resource limits and quotas
- Check cluster availability and capacity
- Validate resource requirement specifications

#### Environment Setup Failures

- Verify container image availability
- Check module dependencies and versions
- Validate environment variable settings

### Getting Help

If you encounter issues:

1. Check template validation messages
2. Review Vantage documentation
3. Contact your system administrator
4. Submit support tickets for complex problems

## Next Steps

After creating your template:

- [Share Job Templates](./share-template) - Make templates available to others
- [Delete Job Templates](./delete-template) - Manage template lifecycle
- Explore advanced templating features and best practices
