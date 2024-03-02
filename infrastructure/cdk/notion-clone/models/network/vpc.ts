import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";

export const createVpc = (scope: Construct): cdk.aws_ec2.CfnVPC => {
  const vpc = new cdk.aws_ec2.CfnVPC(scope, "vpc", {
    cidrBlock: cidrBlocks.vpc,
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });

  return vpc;
};
