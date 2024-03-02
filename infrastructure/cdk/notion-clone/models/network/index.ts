import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { attachInternetGateway } from "./internet-gateway";
import { createRouteTable } from "./route-tables";
import { createSubnet } from "./subnets";
import { createVpc } from "./vpc";

export const createNetwork = (scope: Construct) => {
  const vpc = createVpc(scope);

  attachInternetGateway(scope, { vpc });

  const subnetIngressA = createSubnet(scope, vpc, "ingress", "a");
  const subnetIngressC = createSubnet(scope, vpc, "ingress", "c");
  const _subnetIngressRouteTable = createRouteTable(scope, vpc, "ingress", [
    subnetIngressA,
    subnetIngressC,
  ]);

  const subnetAppA = createSubnet(scope, vpc, "app", "a");
  const subnetAppC = createSubnet(scope, vpc, "app", "c");
  const subnetAppRouteTable = createRouteTable(scope, vpc, "app", [
    subnetAppA,
    subnetAppC,
  ]);

  const subnetDbA = createSubnet(scope, vpc, "db", "a");
  const subnetDbC = createSubnet(scope, vpc, "db", "c");
  const _subnetDbRouteTable = createRouteTable(scope, vpc, "db", [
    subnetDbA,
    subnetDbC,
  ]);

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
