#!/usr/bin/env node
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import { CfnOutput, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class StaticSite extends Construct {
  constructor(
    parent: Stack,
    name: string,
    environment: 'prod' | 'staging' = 'staging'
  ) {
    super(parent, name)

    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: 'vantagehpc.io',
    })
    const siteDomain =
      environment === 'prod'
        ? 'docs.vantagehpc.io'
        : 'docs.staging.vantagehpc.io'
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      'cloudfront-OAI',
      {
        comment: `OAI for ${name}`,
      }
    )

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    })

    siteBucket.grantRead(cloudfrontOAI)

    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      validation: acm.CertificateValidation.fromDns(zone),
    })

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                maxTtl: Duration.seconds(0),
                minTtl: Duration.seconds(0),
                defaultTtl: Duration.seconds(0),
              },
            ],
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            aliases: [siteDomain],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            sslMethod: cloudfront.SSLMethod.SNI,
          }
        ),
        errorConfigurations: [
          {
            errorCode: 404,
            errorCachingMinTtl: 0,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
      }
    )

    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: zone,
    })

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('./build')],
      destinationBucket: siteBucket,
      distribution: distribution,
      memoryLimit: 512,
    })

    new CfnOutput(this, 'Site', { value: 'https://' + siteDomain })
    new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName })
    new CfnOutput(this, 'Certificate', { value: certificate.certificateArn })
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    })
    new CfnOutput(this, 'DistributionDomain', { value: siteDomain })
  }
}
