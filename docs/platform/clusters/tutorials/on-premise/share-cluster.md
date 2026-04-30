---
id: on-premise-share-cluster
title: Share an On-Premise Cluster
slug: /platform/clusters/tutorials/on-premise/share-cluster
---

Learn how to securely share your on-premise clusters with team members while maintaining enterprise security standards, compliance requirements, and proper access controls.

## Overview

This tutorial guides you through sharing on-premise clusters with your organization while maintaining security best practices, compliance with enterprise policies, and integration with existing identity management systems.

## Prerequisites

Before you begin, ensure you have:

- An active on-premise cluster deployed through Vantage
- Administrative access to cluster infrastructure and security systems
- Understanding of your organization's security policies and compliance requirements
- Access to enterprise identity management and authentication systems

## Enterprise Identity Integration

### Active Directory Integration

Connect with existing enterprise identity systems:

1. **Active Directory Configuration**:
   - Configure LDAP connectivity to Active Directory servers
   - Set up secure authentication protocols (LDAPS, Kerberos)
   - Map AD groups to cluster roles and permissions
   - Implement password policy synchronization

2. **Single Sign-On (SSO) Integration**:
   - Configure SAML 2.0 or OAuth integration with enterprise SSO systems
   - Set up identity federation with existing authentication providers
   - Implement multi-factor authentication requirements
   - Configure session management and timeout policies

### Role-Based Access Control (RBAC)

Implement enterprise-grade access control:

1. **Organizational Role Mapping**:
   - Map organizational roles to cluster permissions
   - Implement department-based access controls
   - Configure project-based resource allocation
   - Set up hierarchical permission structures

2. **Permission Management**:
   - Define granular permissions for different cluster resources
   - Implement least-privilege access principles
   - Configure time-based access controls
   - Set up approval workflows for privileged access

## Security and Compliance

### Enterprise Security Policies

Implement organizational security requirements:

1. **Network Security Integration**:
   - Configure integration with enterprise firewalls and security appliances
   - Implement network segmentation according to organizational policies
   - Set up VPN access for remote users
   - Configure network monitoring and intrusion detection integration

2. **Data Classification and Protection**:
   - Implement data classification policies for different sensitivity levels
   - Configure encryption requirements for data at rest and in transit
   - Set up data loss prevention (DLP) integration
   - Implement access logging and audit trail requirements

### Compliance Management

Ensure compliance with regulatory and organizational requirements:

1. **Regulatory Compliance**:
   - Implement HIPAA, SOX, GDPR, or other regulatory requirements
   - Configure audit logging and retention policies
   - Set up compliance monitoring and reporting
   - Implement data residency and sovereignty controls

2. **Enterprise Audit Requirements**:
   - Configure comprehensive audit logging for all user activities
   - Implement change tracking and approval workflows
   - Set up automated compliance reporting
   - Maintain evidence collection for audit purposes

## Access Management and User Provisioning

### User Lifecycle Management

Implement automated user provisioning and deprovisioning:

1. **User Onboarding**:
   - Configure automated account creation based on HR systems
   - Set up new user orientation and training requirements
   - Implement role-based resource allocation for new users
   - Configure initial access approval workflows

2. **User Offboarding**:
   - Implement automated account deactivation for terminated employees
   - Configure data retention and transfer procedures
   - Set up access review and cleanup processes
   - Implement secure credential revocation procedures

### Team and Project Management

Organize access around organizational structures:

1. **Team-Based Access Control**:
   - Configure team-based resource pools and quotas
   - Implement team lead and manager approval workflows
   - Set up shared project spaces and collaboration areas
   - Configure team-based billing and cost allocation

2. **Project-Based Resource Management**:
   - Implement project-based resource allocation and tracking
   - Configure project lifecycle management and archival
   - Set up cross-functional team collaboration capabilities
   - Implement project security and access controls

## Operational Integration

### Enterprise Monitoring and Alerting

Integrate with existing operational systems:

1. **Monitoring System Integration**:
   - Configure integration with enterprise monitoring platforms (Nagios, Zabbix, SCOM)
   - Set up custom metrics and dashboards for organizational requirements
   - Implement integration with IT service management (ITSM) systems
   - Configure automated incident creation and escalation

2. **Notification and Communication**:
   - Integrate with enterprise communication platforms (Slack, Teams, email)
   - Configure escalation procedures according to organizational policies
   - Set up automated status reporting for management
   - Implement crisis communication procedures

### IT Service Management Integration

Connect with enterprise ITSM processes:

1. **Service Desk Integration**:
   - Configure ticket creation for cluster-related requests
   - Implement automated issue escalation and resolution tracking
   - Set up knowledge base integration for common issues
   - Configure service level agreement (SLA) monitoring

2. **Change Management Integration**:
   - Implement integration with enterprise change management systems
   - Configure approval workflows for cluster modifications
   - Set up automated change documentation and tracking
   - Implement rollback procedures and change validation

## Resource Sharing and Allocation

### Resource Pool Management

Implement organizational resource allocation strategies:

1. **Department-Based Allocation**:
   - Configure resource pools for different organizational departments
   - Implement chargeback and cost allocation mechanisms
   - Set up resource usage reporting and optimization recommendations
   - Configure fair-share scheduling across departments

2. **Priority and QoS Management**:
   - Implement priority-based job scheduling for critical business processes
   - Configure Quality of Service (QoS) policies for different user classes
   - Set up resource reservation capabilities for time-critical workloads
   - Implement burst capacity allocation for peak demand periods

### Cost Management and Billing

Implement enterprise cost management:

1. **Cost Allocation and Chargeback**:
   - Configure detailed cost tracking by department, project, and user
   - Implement automated chargeback reporting and billing
   - Set up budget controls and spending alerts
   - Configure cost optimization recommendations

2. **Financial Integration**:
   - Integrate with enterprise financial systems for cost tracking
   - Configure automated billing and invoicing processes
   - Set up budget approval workflows for resource allocation
   - Implement financial reporting and analysis capabilities

## Security Monitoring and Incident Response

### Security Event Management

Implement comprehensive security monitoring:

1. **Security Information and Event Management (SIEM) Integration**:
   - Configure log forwarding to enterprise SIEM systems
   - Set up correlation rules for cluster-specific security events
   - Implement automated threat detection and response
   - Configure security dashboard and reporting integration

2. **Incident Response Integration**:
   - Configure integration with enterprise incident response procedures
   - Set up automated security incident escalation
   - Implement forensic data collection and preservation procedures
   - Configure security event notification and communication

### Vulnerability Management

Maintain security posture through vulnerability management:

1. **Vulnerability Scanning Integration**:
   - Configure integration with enterprise vulnerability scanning tools
   - Set up automated vulnerability assessment and reporting
   - Implement patch management integration and automation
   - Configure security baseline compliance monitoring

2. **Security Baseline Management**:
   - Implement enterprise security baseline configurations
   - Configure automated security configuration validation
   - Set up security drift detection and remediation
   - Implement security policy enforcement and monitoring

## Best Practices for Enterprise Cluster Sharing

### Governance and Policy Management

- **Clear Governance Structure**: Establish clear ownership and responsibility for cluster resources
- **Policy Documentation**: Maintain comprehensive documentation of access policies and procedures
- **Regular Policy Reviews**: Conduct regular reviews and updates of access policies and procedures
- **Training and Awareness**: Provide regular training on cluster usage policies and security requirements

### Security Excellence

- **Defense in Depth**: Implement multiple layers of security controls and monitoring
- **Continuous Monitoring**: Maintain continuous monitoring of security events and user activities
- **Regular Security Assessments**: Conduct regular security assessments and penetration testing
- **Incident Preparedness**: Maintain comprehensive incident response and recovery procedures

### Operational Excellence

- **Service Level Management**: Establish and maintain clear service level agreements
- **Capacity Management**: Proactively manage capacity and performance requirements
- **Change Management**: Implement formal change management and approval processes
- **Documentation Management**: Maintain comprehensive operational documentation and procedures

## Troubleshooting Common Issues

### Authentication and Authorization Problems

#### Active Directory Integration Issues

- Verify LDAP connectivity and authentication credentials
- Check group membership synchronization and mapping
- Validate certificate configurations for secure connections
- Test authentication with different user accounts and roles

#### Permission and Access Control Issues

- Review role-based access control configurations and mappings
- Check resource-level permissions and inheritance
- Validate approval workflow configurations and escalation procedures
- Test access controls with different user scenarios

### Integration and Operational Challenges

#### Monitoring and Alerting Integration

- Verify connectivity to enterprise monitoring systems
- Check alert routing and escalation configurations
- Validate custom metric collection and reporting
- Test incident creation and resolution tracking

#### Cost Tracking and Financial Integration

- Verify cost allocation and chargeback calculations
- Check integration with financial systems and reporting
- Validate budget controls and spending alert configurations
- Test resource usage tracking and optimization recommendations

## Next Steps

Enhance your enterprise cluster sharing:

- Implement advanced security monitoring and analytics
- Set up comprehensive governance and policy management
- Configure advanced integration with enterprise systems
- Explore automation opportunities for operational excellence

For complex enterprise integration requirements or advanced security configurations, consult the Vantage enterprise documentation or contact our dedicated enterprise support team.
