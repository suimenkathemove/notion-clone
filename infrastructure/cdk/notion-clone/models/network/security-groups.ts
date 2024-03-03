import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { anywhereCidrIpV6, cidrBlocks } from "./cidr-blocks";
import { SubnetType } from "./subnets";

export const createSecurityGroup = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
  securityGroupIngress: cdk.aws_ec2.CfnSecurityGroup.IngressProperty[],
  securityGroupEgress: cdk.aws_ec2.CfnSecurityGroup.EgressProperty[],
): cdk.aws_ec2.CfnSecurityGroup => {
  const securityGroup = new cdk.aws_ec2.CfnSecurityGroup(scope, subnetType, {
    groupDescription: `security group for ${subnetType}`,
    securityGroupIngress,
    securityGroupEgress,
    vpcId: vpc.ref,
  });

  return securityGroup;
};

export const createPublicSubnetSecurityGroup = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
): cdk.aws_ec2.CfnSecurityGroup => {
  const securityGroup = createSecurityGroup(
    scope,
    vpc,
    subnetType,
    [
      {
        ipProtocol: "tcp",
        cidrIp: cidrBlocks.anywhere,
        fromPort: 80,
        toPort: 80,
      },
      {
        ipProtocol: "tcp",
        cidrIpv6: anywhereCidrIpV6,
        fromPort: 80,
        toPort: 80,
      },
    ],
    [
      {
        ipProtocol: "-1",
        cidrIp: cidrBlocks.anywhere,
      },
    ],
  );

  return securityGroup;
};

export const createPrivateSubnetSecurityGroup = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
): cdk.aws_ec2.CfnSecurityGroup => {
  const securityGroup = createSecurityGroup(
    scope,
    vpc,
    subnetType,
    [],
    [
      {
        ipProtocol: "-1",
        cidrIp: cidrBlocks.anywhere,
      },
    ],
  );

  return securityGroup;
};
