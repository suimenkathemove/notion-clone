import { SubnetConstants } from "./subnets";

type Cidr = `${number}.${number}.${number}.${number}/${number}`;

export const cidrBlocks = {
  vpc: "10.0.0.0/16",
  ingress: {
    a: "10.0.0.0/24",
    c: "10.0.1.0/24",
  },
  app: {
    a: "10.0.8.0/24",
    c: "10.0.9.0/24",
  },
  db: {
    a: "10.0.16.0/24",
    c: "10.0.17.0/24",
  },
  egress: {
    a: "10.0.248.0/24",
    c: "10.0.249.0/24",
  },
} as const satisfies Record<"vpc", Cidr> & SubnetConstants<Cidr>;
