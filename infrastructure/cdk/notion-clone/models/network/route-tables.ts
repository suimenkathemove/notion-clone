import { AvailabilityZoneType } from "./availability-zones";
import { SubnetType } from "./subnets";

export const routeTableIds = {
  ingress: "notionCloneRouteIngress",
  app: "notionCloneRouteApp",
  db: "notionCloneRouteDb",
} as const satisfies Record<SubnetType, string>;

export const subnetRouteTableAssociationIds = {
  ingress: {
    a: "notionCloneRouteIngressAssociation1A",
    c: "notionCloneRouteIngressAssociation1C",
  },
  app: {
    a: "notionCloneRouteAppAssociation1A",
    c: "notionCloneRouteAppAssociation1C",
  },
  db: {
    a: "notionCloneRouteDbAssociation1A",
    c: "notionCloneRouteDbAssociation1C",
  },
} as const satisfies Record<SubnetType, Record<AvailabilityZoneType, string>>;
