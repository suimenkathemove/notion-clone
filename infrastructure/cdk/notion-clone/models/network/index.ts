import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { availabilityZones } from "./availability-zones";
import { cidrBlocks } from "./cidr-blocks";
import { routeTableIds, subnetRouteTableAssociationIds } from "./route-tables";
import { subnetIds } from "./subnets";
import { vpcId } from "./vpcs";

const createVpc = (scope: Construct) => {
  new cdk.aws_ec2.CfnVPC(scope, vpcId, {
    cidrBlock: cidrBlocks.notionCloneVpc,
    enableDnsHostnames: true,
    enableDnsSupport: true,
  });
};

const createIngressSubnet = (scope: Construct) => {
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.ingress.a, {
    vpcId,
    availabilityZone: availabilityZones.a,
    cidrBlock: cidrBlocks.notionCloneSubnetPublicIngress1A,
  });
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.ingress.c, {
    vpcId,
    availabilityZone: availabilityZones.c,
    cidrBlock: cidrBlocks.notionCloneSubnetPublicIngress1C,
  });

  new cdk.aws_ec2.CfnRouteTable(scope, routeTableIds.ingress, { vpcId });

  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.ingress.a,
    {
      routeTableId: routeTableIds.ingress,
      subnetId: subnetIds.ingress.a,
    },
  );
  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.ingress.c,
    {
      routeTableId: routeTableIds.ingress,
      subnetId: subnetIds.ingress.c,
    },
  );
};

const createAppSubnet = (scope: Construct) => {
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.app.a, {
    vpcId,
    availabilityZone: availabilityZones.a,
    cidrBlock: cidrBlocks.notionCloneSubnetPrivateApp1A,
  });
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.app.c, {
    vpcId,
    availabilityZone: availabilityZones.c,
    cidrBlock: cidrBlocks.notionCloneSubnetPrivateApp1C,
  });

  new cdk.aws_ec2.CfnRouteTable(scope, routeTableIds.app, { vpcId });

  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.app.a,
    {
      routeTableId: routeTableIds.app,
      subnetId: subnetIds.app.a,
    },
  );
  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.app.c,
    {
      routeTableId: routeTableIds.app,
      subnetId: subnetIds.app.c,
    },
  );
};

const createDbSubnet = (scope: Construct) => {
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.db.a, {
    vpcId,
    availabilityZone: availabilityZones.a,
    cidrBlock: cidrBlocks.notionCloneSubnetPrivateDb1A,
  });
  new cdk.aws_ec2.CfnSubnet(scope, subnetIds.db.c, {
    vpcId,
    availabilityZone: availabilityZones.c,
    cidrBlock: cidrBlocks.notionCloneSubnetPrivateDb1C,
  });

  new cdk.aws_ec2.CfnRouteTable(scope, routeTableIds.db, { vpcId });

  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.db.a,
    {
      routeTableId: routeTableIds.db,
      subnetId: subnetIds.db.a,
    },
  );
  new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
    scope,
    subnetRouteTableAssociationIds.db.c,
    {
      routeTableId: routeTableIds.db,
      subnetId: subnetIds.db.c,
    },
  );
};

export const createNetwork = (scope: Construct) => {
  createVpc(scope);

  createIngressSubnet(scope);

  createAppSubnet(scope);

  createDbSubnet(scope);
};
