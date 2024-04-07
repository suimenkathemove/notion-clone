import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { cidrBlocks } from "./cidr-blocks";
import { createIgw } from "./igw";
import {
  createPrivateSubnetSecurityGroup,
  createPublicSubnetSecurityGroup,
} from "./security-groups";
import { createSubnets } from "./subnets";
import { createVpc } from "./vpc";

export const createNetwork = (scope: Construct) => {
  const vpc = createVpc(scope);

  const igw = createIgw(scope, { vpc });

  const ingressSubnets = createSubnets(scope, vpc, "ingress");
  new cdk.aws_ec2.CfnRoute(scope, "gateway-ingress-route", {
    gatewayId: igw.ref,
    routeTableId: ingressSubnets.routeTable.ref,
    destinationCidrBlock: cidrBlocks.anywhere,
  });
  createPublicSubnetSecurityGroup(scope, vpc, "ingress");

  const appSubnets = createSubnets(scope, vpc, "app");
  createPrivateSubnetSecurityGroup(scope, vpc, "app");

  createSubnets(scope, vpc, "db");
  createPrivateSubnetSecurityGroup(scope, vpc, "db");

  const egressSubnets = createSubnets(scope, vpc, "egress");
  createPrivateSubnetSecurityGroup(scope, vpc, "egress");

  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-ecr-api", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.ecr.api",
    vpcId: vpc.ref,
    subnetIds: [egressSubnets.subnetA.ref, egressSubnets.subnetC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-ecr-dkr", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.ecr.dkr",
    vpcId: vpc.ref,
    subnetIds: [egressSubnets.subnetA.ref, egressSubnets.subnetC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-logs", {
    vpcEndpointType: "Interface",
    serviceName: "com.amazonaws.ap-northeast-1.logs",
    vpcId: vpc.ref,
    subnetIds: [egressSubnets.subnetA.ref, egressSubnets.subnetC.ref],
  });
  new cdk.aws_ec2.CfnVPCEndpoint(scope, "vpc-endpoint-s3", {
    vpcEndpointType: "Gateway",
    serviceName: "com.amazonaws.ap-northeast-1.s3",
    vpcId: vpc.ref,
    routeTableIds: [appSubnets.routeTable.ref],
  });
};
