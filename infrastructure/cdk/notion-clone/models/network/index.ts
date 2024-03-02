import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { attachInternetGateway } from "./internet-gateway";
import { createRouteTable } from "./route-tables";
import { SubnetType, createSubnet } from "./subnets";
import { createVpc } from "./vpc";

const createSubnetsAndRouteTable = (
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

export const createNetwork = (scope: Construct) => {
  const vpc = createVpc(scope);

  attachInternetGateway(scope, { vpc });

  createSubnetsAndRouteTable(scope, vpc, "ingress");

  const { routeTable: subnetAppRouteTable } = createSubnetsAndRouteTable(
    scope,
    vpc,
    "app",
  );

  createSubnetsAndRouteTable(scope, vpc, "db");

  const subnetEgressA = createSubnet(scope, vpc, "egress", "a");
  const subnetEgressC = createSubnet(scope, vpc, "egress", "c");

  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-ecr-api", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.ecr.api",
    vpcId: vpc.ref,
    subnetIds: [subnetEgressA.ref, subnetEgressC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-ecr-dkr", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.ecr.dkr",
    vpcId: vpc.ref,
    subnetIds: [subnetEgressA.ref, subnetEgressC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-logs", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.logs",
    vpcId: vpc.ref,
    subnetIds: [subnetEgressA.ref, subnetEgressC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-s3", {
    vpcEndpointType: "Gateway",
    serviceName: "com.amazonaws.ap-northeast-1.s3",
    vpcId: vpc.ref,
    routeTableIds: [subnetAppRouteTable.ref],
  });
};
