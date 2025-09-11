#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { StaticSite } from './static-site'

class DocsWebite extends cdk.Stack {
  constructor(
    parent: cdk.App,
    name: string,
    stage: 'prod' | 'staging',
    props: cdk.StackProps
  ) {
    super(parent, name, props)

    new StaticSite(this, 'StaticSite', stage)
  }
}

const app = new cdk.App()

new DocsWebite(app, 'VantageDocsWebsite', 'prod', {
  env: {
    account: '266735843730',
    region: 'us-east-1',
  },
})

new DocsWebite(app, 'VantageStagingDocsWebsite', 'staging', {
  env: {
    account: '266735843730',
    region: 'us-east-1',
  },
})

app.synth()
