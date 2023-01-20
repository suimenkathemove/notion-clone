import { subnetIds } from "./subnets";
import { vpcId } from "./vpc";

import { Cidr } from "@/types";

type SubnetIds = typeof subnetIds;
type SubnetIdValues = SubnetIds[keyof SubnetIds];
type SubnetIdValueValues = SubnetIdValues[keyof SubnetIdValues];

export const cidrBlocks = {
  slackCloneVpc: "10.0.0.0/16",
  slackCloneSubnetPublicIngress1A: "10.0.0.0/24",
  slackCloneSubnetPublicIngress1C: "10.0.0.1/24",
  slackCloneSubnetPrivateApp1A: "10.0.0.8/24",
  slackCloneSubnetPrivateApp1C: "10.0.0.9/24",
  slackCloneSubnetPrivateDb1A: "10.0.0.16/24",
  slackCloneSubnetPrivateDb1C: "10.0.0.17/24",
} as const satisfies Record<typeof vpcId | SubnetIdValueValues, Cidr>;
