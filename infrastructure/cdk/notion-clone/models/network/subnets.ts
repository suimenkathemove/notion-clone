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
  subnetId: string,
  subnetType: SubnetType,
  az: AvailabilityZoneType,
): cdk.aws_ec2.CfnSubnet => {
  const id = `${subnetId}-${az}`;
  const subnet = new cdk.aws_ec2.CfnSubnet(scope, id, {
    vpcId: vpc.ref,
    availabilityZone: availabilityZones[az],
    cidrBlock: cidrBlocks[subnetType][az],
    tags: tags(id),
  });

  return subnet;
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
  const subnetId = `${DOMAIN_NAME}-subnet-${subnetType}`;

  const subnetA = createSubnet(scope, vpc, subnetId, subnetType, "a");
  const subnetC = createSubnet(scope, vpc, subnetId, subnetType, "c");

  const routeTable = ((): cdk.aws_ec2.CfnRouteTable => {
    const id = `${subnetId}-route-table`;
    const routeTable = new cdk.aws_ec2.CfnRouteTable(scope, id, {
      vpcId: vpc.ref,
      tags: tags(id),
    });

    [subnetA, subnetC].forEach((s) => {
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
  })();

  return { subnetA, subnetC, routeTable };
};
