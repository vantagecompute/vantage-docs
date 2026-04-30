---
id: share-template
title: Share Job Template
sidebar_label: Share Template
---

Sharing job templates in Vantage enables collaboration and knowledge sharing across teams and organizations. This guide covers how to effectively share templates while maintaining security and governance.

## Understanding Template Sharing

Template sharing allows you to:

- Make templates available to team members
- Distribute best practices across projects
- Enable standardization across the organization
- Facilitate knowledge transfer and onboarding

## Sharing Models

### Personal Templates

Templates created for individual use:

- **Scope**: Private to the creator
- **Use Case**: Personal workflows and experimentation
- **Access**: Creator only, unless explicitly shared

### Team Templates

Templates shared within specific teams:

- **Scope**: Limited to team members
- **Use Case**: Team-specific workflows and standards
- **Access**: Team members with appropriate permissions

### Organization Templates

Templates available across the entire organization:

- **Scope**: All organization members
- **Use Case**: Company-wide standards and best practices
- **Access**: All users, with optional approval workflow

### Public Templates

Templates shared with the broader community:

- **Scope**: All Vantage users
- **Use Case**: Open-source workflows and community contributions
- **Access**: Public, with moderation and quality control

## Sharing a Template

### Step 1: Prepare Your Template

Before sharing, ensure your template is ready:

1. **Complete Testing**: Verify the template works correctly
2. **Documentation**: Add comprehensive descriptions and examples
3. **Parameter Validation**: Ensure all parameters have proper constraints
4. **Security Review**: Remove any sensitive information or credentials

### Step 2: Configure Sharing Settings

Access template sharing options:

1. Navigate to your template in the **Templates** section
2. Click on **Share Template** or **Sharing Settings**
3. Configure the sharing parameters

### Step 3: Set Permissions

Choose the appropriate sharing level:

```yaml
sharing_settings:
  visibility: "team"  # personal, team, organization, public
  permissions:
    read: true
    execute: true
    modify: false
    delete: false
  approval_required: true
  notifications: true
```

### Step 4: Add Collaboration Details

Provide information for collaborators:

```yaml
collaboration:
  contact_person: "jane.doe@company.com"
  documentation_url: "https://wiki.company.com/templates/ml-training"
  support_channel: "#ml-platform-support"
  update_frequency: "monthly"
```

## Permission Management

### Access Levels

Define different levels of access:

#### Read Permission

- View template configuration
- Access documentation and examples
- See usage statistics and reviews

#### Execute Permission

- Use template to create jobs
- Modify parameters within allowed ranges
- Access template outputs and results

#### Modify Permission

- Edit template configuration
- Update parameters and constraints
- Modify documentation and metadata

#### Delete Permission

- Remove template from the system
- Archive template versions
- Manage template lifecycle

### User Groups

Organize permissions by user groups:

```yaml
permissions:
  data_scientists:
    - read
    - execute
  platform_engineers:
    - read
    - execute
    - modify
  administrators:
    - read
    - execute
    - modify
    - delete
```

## Collaboration Features

### Template Reviews

Enable peer review process:

1. **Review Requests**: Submit templates for team review
2. **Feedback Collection**: Gather comments and suggestions
3. **Approval Workflow**: Require approvals before publication
4. **Version Control**: Track changes and reviewer comments

### Usage Analytics

Monitor template adoption:

- **Usage Statistics**: Track job submissions using the template
- **Performance Metrics**: Monitor success rates and resource utilization
- **User Feedback**: Collect ratings and comments from users
- **Adoption Trends**: Analyze usage patterns over time

### Notification System

Stay informed about template activity:

```yaml
notifications:
  new_users: true
  template_updates: true
  usage_milestones: true
  error_reports: true
  feedback_received: true
```

## Governance and Compliance

### Template Standards

Establish organizational standards:

#### Documentation Requirements

- Purpose and use case description
- Parameter documentation with examples
- Resource requirement guidelines
- Performance benchmarks and expectations

#### Security Standards

- No hardcoded credentials or secrets
- Appropriate resource limits and constraints
- Access control and permission validation
- Compliance with organizational policies

#### Quality Assurance

- Testing requirements and validation criteria
- Performance benchmarks and SLA compliance
- Error handling and recovery procedures
- Maintenance and update schedules

### Approval Workflows

Implement governance processes:

1. **Submission**: Creator submits template for review
2. **Technical Review**: Platform team validates configuration
3. **Security Review**: Security team checks for compliance
4. **Business Approval**: Business stakeholders approve publication
5. **Publication**: Template becomes available to target audience

## Template Marketplace

### Discovery Features

Help users find relevant templates:

#### Categorization

- **By Application**: ML, Engineering, Data Processing
- **By Resource Type**: CPU, GPU, High Memory
- **By Team**: Data Science, Engineering, Research
- **By Complexity**: Beginner, Intermediate, Advanced

#### Search and Filtering

```yaml
search_criteria:
  keywords: ["machine learning", "tensorflow"]
  resource_requirements:
    cpu_min: 4
    memory_min: 16
  execution_time: "< 2 hours"
  popularity: "high"
```

#### Ratings and Reviews

Enable community feedback:

- **Star Ratings**: 1-5 star rating system
- **Written Reviews**: Detailed feedback and use cases
- **Usage Recommendations**: Community recommendations
- **Performance Reports**: Real-world performance data

### Template Promotion

Increase template visibility:

#### Featured Templates

- Highlight high-quality, well-documented templates
- Showcase innovative use cases and workflows
- Promote templates with excellent community feedback
- Feature templates that demonstrate best practices

#### Community Contributions

- Recognize active template contributors
- Showcase community success stories
- Provide contribution guidelines and standards
- Offer incentives for high-quality contributions

## Best Practices for Sharing

### Documentation Excellence

Create comprehensive documentation:

#### Template Overview

- Clear purpose and value proposition
- Target audience and use cases
- Prerequisites and dependencies
- Expected outcomes and deliverables

#### Usage Examples

- Step-by-step tutorials
- Common parameter combinations
- Sample input and output data
- Troubleshooting guides

#### Performance Guidelines

- Resource utilization recommendations
- Scaling considerations and limits
- Cost optimization tips
- Performance tuning options

### Community Engagement

Foster active community participation:

#### Responsive Support

- Monitor questions and issues promptly
- Provide helpful responses and solutions
- Update documentation based on feedback
- Maintain template quality over time

#### Knowledge Sharing

- Share insights and lessons learned
- Contribute to community discussions
- Participate in template reviews
- Mentor new template creators

## Managing Shared Templates

### Lifecycle Management

Maintain template quality over time:

#### Regular Updates

- Keep up with software dependencies
- Update based on user feedback
- Improve performance and efficiency
- Add new features and capabilities

#### Deprecation Process

- Communicate deprecation timeline
- Provide migration paths to newer templates
- Archive deprecated versions appropriately
- Support legacy users during transition

### Security Maintenance

Ensure ongoing security:

- Regular security audits and updates
- Monitor for security vulnerabilities
- Update access controls as needed
- Respond to security incidents promptly

## Troubleshooting Sharing Issues

### Common Problems

#### Permission Errors

- Verify user group memberships
- Check template sharing settings
- Validate organizational policies
- Contact administrators for access issues

#### Discovery Problems

- Update template tags and categories
- Improve template documentation
- Increase template visibility settings
- Engage with community for feedback

#### Collaboration Challenges

- Establish clear communication channels
- Define roles and responsibilities
- Set expectations for response times
- Provide collaboration tools and training

## Next Steps

After sharing your template:

- Monitor usage and gather feedback
- Respond to user questions and issues
- Update and improve based on experience
- Consider creating additional related templates
- [Delete Job Templates](./delete-template) - Learn about template lifecycle management
