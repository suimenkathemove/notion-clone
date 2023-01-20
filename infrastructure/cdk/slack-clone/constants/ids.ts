import { AvailabilityZoneType } from "./availability-zones";
import { SubnetType } from "./subnets";

export const routeTableIds = {
  ingress: "slackCloneRouteIngress",
  app: "slackCloneRouteApp",
  db: "slackCloneRouteDb",
} as const satisfies Record<SubnetType, string>;

export const subnetRouteTableAssociationIds = {
  ingress: {
    a: "slackCloneRouteIngressAssociation1A",
    c: "slackCloneRouteIngressAssociation1C",
  },
  app: {
    a: "slackCloneRouteAppAssociation1A",
    c: "slackCloneRouteAppAssociation1C",
  },
  db: {
    a: "slackCloneRouteDbAssociation1A",
    c: "slackCloneRouteDbAssociation1C",
  },
} as const satisfies Record<SubnetType, Record<AvailabilityZoneType, string>>;
