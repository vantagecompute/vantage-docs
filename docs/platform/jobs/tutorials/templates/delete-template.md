---
id: delete-template
title: Delete Job Template
sidebar_label: Delete Template
---

Managing the lifecycle of job templates includes knowing when and how to properly delete templates that are no longer needed. This guide covers safe deletion practices and template lifecycle management.

## When to Delete Templates

Consider deleting templates in these scenarios:

### Obsolete Templates

- **Outdated Software**: Templates using deprecated software versions
- **Legacy Workflows**: Processes that have been replaced by better alternatives
- **Unused Templates**: Templates with no usage over extended periods
- **Duplicate Templates**: Multiple templates serving the same purpose

### Security Concerns

- **Security Vulnerabilities**: Templates with known security issues
- **Compliance Violations**: Templates that violate updated policies
- **Exposed Credentials**: Templates accidentally containing sensitive information
- **Unauthorized Access**: Templates with inappropriate sharing permissions

### Resource Optimization

- **Storage Cleanup**: Removing templates to free up storage space
- **System Performance**: Reducing clutter to improve system responsiveness
- **License Management**: Removing templates for unlicensed software
- **Cost Reduction**: Eliminating templates that consume expensive resources

## Pre-Deletion Checklist

Before deleting a template, complete these steps:

### Impact Assessment

1. **Check Usage Statistics**: Review recent usage patterns and frequency
2. **Identify Dependencies**: Find jobs, workflows, or other templates that depend on this template
3. **Assess User Impact**: Determine which users or teams currently use the template
4. **Review Integration**: Check if template is integrated with external systems

### Communication Plan

1. **Notify Users**: Inform current users about the planned deletion
2. **Provide Timeline**: Give adequate notice before deletion
3. **Offer Alternatives**: Suggest replacement templates or migration paths
4. **Document Reasons**: Explain why the template is being removed

### Data Preservation

1. **Export Configuration**: Save template configuration for future reference
2. **Archive Documentation**: Preserve template documentation and examples
3. **Backup Dependencies**: Save any custom scripts or configuration files
4. **Record Metadata**: Document template history and usage patterns

## Deletion Methods

### Soft Deletion (Recommended)

Soft deletion marks templates as deleted without removing them completely:

#### Benefits

- **Recovery Option**: Templates can be restored if needed
- **Audit Trail**: Deletion history is maintained
- **Gradual Cleanup**: Templates can be permanently removed later
- **Safety Net**: Protects against accidental deletions

#### Process

1. Navigate to the template in the **Templates** section
2. Select **Archive Template** or **Soft Delete**
3. Provide deletion reason and effective date
4. Confirm the action with appropriate approvals

```yaml
deletion_settings:
  type: "soft_delete"
  reason: "Replaced by updated ML template v2.0"
  effective_date: "2025-10-01"
  retention_period: "90 days"
  notification_sent: true
```

### Hard Deletion

Hard deletion permanently removes templates from the system:

#### When Appropriate

- **Security Requirements**: Immediate removal of compromised templates
- **Compliance Mandates**: Legal or regulatory requirements for data removal
- **Storage Constraints**: Critical need to free up storage space
- **Final Cleanup**: Permanent removal after soft deletion period

#### Hard Deletion Process

1. Ensure all dependencies are resolved
2. Complete final backup if needed
3. Navigate to template management
4. Select **Permanently Delete**
5. Confirm with multiple authentication steps

```yaml
hard_deletion:
  confirmation_required: true
  approval_count: 2
  backup_created: true
  dependencies_resolved: true
  final_warning: true
```

## Handling Dependencies

### Active Jobs

For templates with running jobs:

1. **Complete Running Jobs**: Allow current jobs to finish execution
2. **Prevent New Submissions**: Disable template for new job submissions
3. **Monitor Progress**: Track completion of dependent jobs
4. **Provide Support**: Assist users with job completion or migration

### Dependent Templates

For templates referenced by other templates:

1. **Identify Relationships**: Map all template dependencies
2. **Update References**: Modify dependent templates to use alternatives
3. **Test Updates**: Validate that dependent templates still work correctly
4. **Coordinate Deletion**: Plan deletion sequence to avoid breaking dependencies

### User Workflows

For templates integrated into user workflows:

1. **Migration Planning**: Help users transition to alternative solutions
2. **Training Support**: Provide guidance on replacement templates
3. **Timeline Coordination**: Align deletion with user migration schedules
4. **Feedback Collection**: Gather input on migration challenges and solutions

## Bulk Deletion Operations

### Criteria-Based Deletion

Delete multiple templates based on specific criteria:

```yaml
bulk_deletion_criteria:
  last_used_before: "2024-01-01"
  usage_count_less_than: 5
  owner_status: "inactive"
  security_risk_level: "high"
  software_version: "deprecated"
```

### Automated Cleanup

Set up automated deletion policies:

```yaml
cleanup_policies:
  unused_template_threshold: "180 days"
  deprecated_software_removal: "30 days after deprecation"
  test_template_retention: "7 days"
  security_violation_removal: "immediate"
```

### Approval Workflows

Implement governance for bulk operations:

1. **Deletion Proposal**: Submit bulk deletion requests with justification
2. **Review Process**: Technical and business review of deletion plans
3. **Approval Requirements**: Multiple approvals for significant deletions
4. **Execution Monitoring**: Track and validate bulk deletion operations

## Recovery Procedures

### Soft Delete Recovery

Restore soft-deleted templates:

1. Navigate to **Archived Templates** section
2. Select the template to recover
3. Review restoration impact and dependencies
4. Click **Restore Template**
5. Update and test restored template as needed

### Backup Recovery

Restore from system backups:

1. **Identify Backup**: Locate relevant backup containing the template
2. **Request Restoration**: Submit restoration request with justification
3. **System Recovery**: Work with administrators for backup restoration
4. **Validation**: Test restored template functionality and dependencies
5. **Update Documentation**: Record restoration and any changes made

### Partial Recovery

Recreate templates from available information:

1. **Gather Information**: Collect documentation, examples, and user input
2. **Reconstruct Configuration**: Rebuild template based on available data
3. **Test Thoroughly**: Validate recreated template functionality
4. **Document Changes**: Note differences from original template
5. **User Validation**: Have original users test and approve recreated template

## Best Practices

### Planning and Communication

#### Advance Notice

- Provide 30-60 days notice for widely-used templates
- Use multiple communication channels (email, platform notifications, meetings)
- Create migration guides and alternative recommendations
- Offer training sessions for replacement templates

#### Stakeholder Engagement

- Involve template users in deletion decisions
- Consult with platform administrators and security teams
- Coordinate with dependent system owners
- Document stakeholder feedback and concerns

### Documentation and Auditing

#### Deletion Records

- Maintain detailed logs of all deletion activities
- Record reasons, approvals, and impact assessments
- Track user notifications and migration assistance
- Document lessons learned and process improvements

#### Compliance Requirements

- Follow organizational data retention policies
- Meet regulatory requirements for data deletion
- Maintain audit trails for security and compliance reviews
- Ensure proper approval and documentation procedures

### Risk Management

#### Testing Procedures

- Test deletion procedures in non-production environments
- Validate backup and recovery processes regularly
- Verify dependency tracking and impact assessment tools
- Practice bulk deletion operations with test data

#### Rollback Planning

- Maintain rollback procedures for deletion operations
- Keep recent backups available for emergency recovery
- Document recovery time objectives and procedures
- Train staff on emergency recovery processes

## Monitoring and Metrics

### Deletion Analytics

Track deletion activities and impacts:

```yaml
deletion_metrics:
  templates_deleted_per_month: 15
  deletion_reasons:
    obsolete: 60%
    security: 20%
    duplicate: 15%
    unused: 5%
  recovery_requests: 2
  user_impact_score: "low"
```

### Performance Impact

Monitor system performance after deletions:

- **Storage Utilization**: Track freed storage space
- **System Performance**: Monitor response times and throughput
- **User Satisfaction**: Survey users about template availability
- **Migration Success**: Track successful transitions to alternative templates

## Troubleshooting

### Common Deletion Issues

#### Dependency Conflicts

- **Problem**: Cannot delete template due to active dependencies
- **Solution**: Identify and resolve dependencies before deletion
- **Prevention**: Implement dependency tracking and impact assessment

#### Permission Errors

- **Problem**: Insufficient permissions to delete template
- **Solution**: Request appropriate permissions or delegate to authorized users
- **Prevention**: Clearly define deletion roles and responsibilities

#### Recovery Failures

- **Problem**: Unable to restore accidentally deleted template
- **Solution**: Use backup recovery procedures or reconstruct from documentation
- **Prevention**: Implement soft deletion policies and regular backups

### Getting Help

When deletion issues occur:

1. Check system logs and error messages
2. Review deletion policies and procedures
3. Contact platform administrators for assistance
4. Submit support tickets for complex recovery scenarios
5. Escalate to security team for compliance-related issues

## Next Steps

After completing template deletion:

- Review and update template governance policies
- Analyze deletion patterns and improve processes
- Train team members on deletion best practices
- Consider creating new templates to replace deleted ones
- Document lessons learned for future reference
