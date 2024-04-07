import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";

import { DOMAIN_NAME, tags } from "@/models/domain";

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

const createSubnet = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
  az: AvailabilityZoneType,
): cdk.aws_ec2.CfnSubnet => {
  const id = `${DOMAIN_NAME}-subnet-${subnetType}-${az}`;
  const subnet = new cdk.aws_ec2.CfnSubnet(scope, id, {
    vpcId: vpc.ref,
    availabilityZone: availabilityZones[az],
    cidrBlock: cidrBlocks[subnetType][az],
    tags: tags(id),
  });

  return subnet;
};

const createRouteTable = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
  subnets: cdk.aws_ec2.CfnSubnet[],
): cdk.aws_ec2.CfnRouteTable => {
  const routeTable = new cdk.aws_ec2.CfnRouteTable(scope, subnetType, {
    vpcId: vpc.ref,
  });

  subnets.forEach((s) => {
    new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
      scope,
      `${s.attrSubnetId}-${routeTable.attrRouteTableId}`,
      {
        subnetId: s.ref,
        routeTableId: routeTable.ref,
      },
    );
  });

  return routeTable;
};

export const createSubnets = (
  scope: Construct,
  vpc: cdk.aws_ec2.CfnVPC,
  subnetType: SubnetType,
): {
  subnetA: cdk.aws_ec2.CfnSubnet;
  subnetC: cdk.aws_ec2.CfnSubnet;
  routeTable: cdk.aws_ec2.CfnRouteTable;
} => {
  const subnetA = createSubnet(scope, vpc, subnetType, "a");
  const subnetC = createSubnet(scope, vpc, subnetType, "c");
  const routeTable = createRouteTable(scope, vpc, subnetType, [
    subnetA,
    subnetC,
  ]);

  return { subnetA, subnetC, routeTable };
};
