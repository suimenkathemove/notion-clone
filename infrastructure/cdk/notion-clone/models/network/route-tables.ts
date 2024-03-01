import { AvailabilityZoneType } from "./availability-zones";
import { SubnetType } from "./subnets";

type RouteTableSubnetType = Extract<SubnetType, "ingress" | "app" | "db">;

export const routeTableIds = {
  ingress: "notionCloneRouteIngress",
  app: "notionCloneRouteApp",
  db: "notionCloneRouteDb",
} as const satisfies Record<RouteTableSubnetType, string>;

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
} as const satisfies Record<
  RouteTableSubnetType,
  Record<AvailabilityZoneType, string>
>;
