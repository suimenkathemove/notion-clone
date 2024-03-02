import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";

export const vpcId = "notionCloneVpc";

export const vpcEndpoints = {
  ecr: {
    api: "notionCloneVpcEndpointEcrApi",
    dkr: "notionCloneVpcEndpointEcrDkr",
  },
  s3: "notionCloneVpcEndpointS3",
  cloudWatch: "notionCloneVpcEndpointCloudWatch",
} as const;

export const createVpc = (scope: Construct): cdk.aws_ec2.CfnVPC => {
  const vpc = new cdk.aws_ec2.CfnVPC(scope, vpcId, {
    cidrBlock: cidrBlocks.notionCloneVpc,
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });

  return vpc;
};
