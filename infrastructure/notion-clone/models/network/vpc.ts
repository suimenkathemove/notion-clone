import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";

import { DOMAIN_NAME, tags } from "@/models/domain";

export const createVpc = (scope: Construct): cdk.aws_ec2.CfnVPC => {
  const id = `${DOMAIN_NAME}-vpc`;
  const vpc = new cdk.aws_ec2.CfnVPC(scope, id, {
    cidrBlock: cidrBlocks.vpc,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: tags(id),
  });

  return vpc;
};
