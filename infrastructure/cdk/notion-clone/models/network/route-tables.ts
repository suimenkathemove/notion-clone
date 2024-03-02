import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { SubnetType } from "./subnets";

export const createRouteTable = (
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
