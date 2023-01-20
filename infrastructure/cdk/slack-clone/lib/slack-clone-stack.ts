import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { availabilityZones } from "@/constants/availability-zones";
import { cidrBlocks } from "@/constants/cidr-blocks";
import { subnetIds, vpcId } from "@/constants/ids";

export class SlackCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    new cdk.aws_ec2.CfnVPC(this, vpcId, {
      cidrBlock: cidrBlocks.slackCloneVpc,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // Subnets
    {
      // ingress
      {
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.ingress.a, {
          vpcId,
          availabilityZone: availabilityZones.a,
          cidrBlock: cidrBlocks.slackCloneSubnetPublicIngress1A,
        });

        new cdk.aws_ec2.CfnSubnet(this, subnetIds.ingress.c, {
          vpcId,
          availabilityZone: availabilityZones.c,
          cidrBlock: cidrBlocks.slackCloneSubnetPublicIngress1C,
        });
      }
    }
  }
}
