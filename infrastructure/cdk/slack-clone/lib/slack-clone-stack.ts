import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { Cidr } from "@/types";

export class SlackCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cidrBlock: Cidr = "10.0.0.0/16";
    new cdk.aws_ec2.CfnVPC(this, "slackCloneVpc", {
      cidrBlock,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
  }
}
