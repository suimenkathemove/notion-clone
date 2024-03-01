export const vpcId = "notionCloneVpc";

export const vpcEndpoints = {
  ecr: {
    api: "notionCloneVpcEndpointEcrApi",
    dkr: "notionCloneVpcEndpointEcrDkr",
  },
} as const;
