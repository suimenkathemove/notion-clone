import { AvailabilityZoneType } from "./availability-zones";

export type SubnetType = "ingress" | "app" | "db";

export const subnetIds = {
  ingress: {
    a: "notionCloneSubnetPublicIngress1A",
    c: "notionCloneSubnetPublicIngress1C",
  },
  app: {
    a: "notionCloneSubnetPrivateApp1A",
    c: "notionCloneSubnetPrivateApp1C",
  },
  db: {
    a: "notionCloneSubnetPrivateDb1A",
    c: "notionCloneSubnetPrivateDb1C",
  },
} as const satisfies Record<SubnetType, Record<AvailabilityZoneType, string>>;
