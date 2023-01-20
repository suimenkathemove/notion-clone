import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "@/constants/cidr-blocks";
import { vpcId } from "@/constants/ids";

export class SlackCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_ec2.CfnVPC(this, vpcId, {
      cidrBlock: cidrBlocks.slackCloneVpc,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
  }
}
