import { subnetIds } from "./subnets";
import { vpcId } from "./vpcs";

type Cidr = `${number}.${number}.${number}.${number}/${number}`;

type SubnetIds = typeof subnetIds;
type SubnetIdValues = SubnetIds[keyof SubnetIds];
type SubnetIdValueValues = SubnetIdValues[keyof SubnetIdValues];

export const cidrBlocks = {
  notionCloneVpc: "10.0.0.0/16",
  notionCloneSubnetPublicIngress1A: "10.0.0.0/24",
  notionCloneSubnetPublicIngress1C: "10.0.0.1/24",
  notionCloneSubnetPrivateApp1A: "10.0.0.8/24",
  notionCloneSubnetPrivateApp1C: "10.0.0.9/24",
  notionCloneSubnetPrivateDb1A: "10.0.0.16/24",
  notionCloneSubnetPrivateDb1C: "10.0.0.17/24",
} as const satisfies Record<typeof vpcId | SubnetIdValueValues, Cidr>;
