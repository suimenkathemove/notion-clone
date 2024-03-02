import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";

type AvailabilityZoneType = "a" | "c";

const availabilityZones = {
  a: "ap-northeast-1a",
  c: "ap-northeast-1c",
} as const satisfies Record<AvailabilityZoneType, string>;

export type SubnetType = "ingress" | "app" | "db" | "egress";

export type SubnetConstants<T> = Record<
  SubnetType,
  Record<AvailabilityZoneType, T>
>;

export const createSubnet = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
  az: AvailabilityZoneType,
): cdk.aws_ec2.CfnSubnet => {
  const subnet = new cdk.aws_ec2.CfnSubnet(scope, `${subnetType}-${az}`, {
    vpcId: vpc.ref,
    availabilityZone: availabilityZones[az],
    cidrBlock: cidrBlocks[subnetType][az],
  });

  return subnet;
};
