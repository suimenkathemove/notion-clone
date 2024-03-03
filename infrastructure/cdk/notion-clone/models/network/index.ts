import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";
import { createInternetGateway } from "./internet-gateway";
import { createRouteTable } from "./route-tables";
import {
  createPrivateSubnetSecurityGroup,
  createPublicSubnetSecurityGroup,
} from "./security-groups";
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

  const internetGateway = createInternetGateway(scope, { vpc });

  const { routeTable: subnetIngressRouteTable } = createSubnetsAndRouteTable(
    scope,
    vpc,
    "ingress",
  );
  createPublicSubnetSecurityGroup(scope, vpc, "ingress");
  new cdk.aws_ec2.CfnRoute(scope, "gateway-ingress-route", {
    gatewayId: internetGateway.ref,
    routeTableId: subnetIngressRouteTable.ref,
    destinationCidrBlock: cidrBlocks.anywhere,
  });

  const { routeTable: subnetAppRouteTable } = createSubnetsAndRouteTable(
    scope,
    vpc,
    "app",
  );
  createPrivateSubnetSecurityGroup(scope, vpc, "app");

  createSubnetsAndRouteTable(scope, vpc, "db");
  createPrivateSubnetSecurityGroup(scope, vpc, "db");

  const subnetEgressA = createSubnet(scope, vpc, "egress", "a");
  const subnetEgressC = createSubnet(scope, vpc, "egress", "c");
  createPrivateSubnetSecurityGroup(scope, vpc, "egress");

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
