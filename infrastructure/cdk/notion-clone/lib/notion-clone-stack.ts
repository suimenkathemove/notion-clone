import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { availabilityZones } from "@/models/availability-zones";
import { cidrBlocks } from "@/models/cidr-blocks";
import {
  routeTableIds,
  subnetRouteTableAssociationIds,
} from "@/models/route-tables";
import { subnetIds } from "@/models/subnets";
import { vpcId } from "@/models/vpcs";

export class NotionCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    new cdk.aws_ec2.CfnVPC(this, vpcId, {
      cidrBlock: cidrBlocks.notionCloneVpc,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // Subnets
    {
      // ingress
      {
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.ingress.a, {
          vpcId,
          availabilityZone: availabilityZones.a,
          cidrBlock: cidrBlocks.notionCloneSubnetPublicIngress1A,
        });
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.ingress.c, {
          vpcId,
          availabilityZone: availabilityZones.c,
          cidrBlock: cidrBlocks.notionCloneSubnetPublicIngress1C,
        });

        new cdk.aws_ec2.CfnRouteTable(this, routeTableIds.ingress, { vpcId });

        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.ingress.a,
          {
            routeTableId: routeTableIds.ingress,
            subnetId: subnetIds.ingress.a,
          },
        );
        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.ingress.c,
          {
            routeTableId: routeTableIds.ingress,
            subnetId: subnetIds.ingress.c,
          },
        );
      }

      // app
      {
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.app.a, {
          vpcId,
          availabilityZone: availabilityZones.a,
          cidrBlock: cidrBlocks.notionCloneSubnetPrivateApp1A,
        });
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.app.c, {
          vpcId,
          availabilityZone: availabilityZones.c,
          cidrBlock: cidrBlocks.notionCloneSubnetPrivateApp1C,
        });

        new cdk.aws_ec2.CfnRouteTable(this, routeTableIds.app, { vpcId });

        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.app.a,
          {
            routeTableId: routeTableIds.app,
            subnetId: subnetIds.app.a,
          },
        );
        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.app.c,
          {
            routeTableId: routeTableIds.app,
            subnetId: subnetIds.app.c,
          },
        );
      }

      // db
      {
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.db.a, {
          vpcId,
          availabilityZone: availabilityZones.a,
          cidrBlock: cidrBlocks.notionCloneSubnetPrivateDb1A,
        });
        new cdk.aws_ec2.CfnSubnet(this, subnetIds.db.c, {
          vpcId,
          availabilityZone: availabilityZones.c,
          cidrBlock: cidrBlocks.notionCloneSubnetPrivateDb1C,
        });

        new cdk.aws_ec2.CfnRouteTable(this, routeTableIds.db, { vpcId });

        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.db.a,
          {
            routeTableId: routeTableIds.db,
            subnetId: subnetIds.db.a,
          },
        );
        new cdk.aws_ec2.CfnSubnetRouteTableAssociation(
          this,
          subnetRouteTableAssociationIds.db.c,
          {
            routeTableId: routeTableIds.db,
            subnetId: subnetIds.db.c,
          },
        );
      }
    }
  }
}