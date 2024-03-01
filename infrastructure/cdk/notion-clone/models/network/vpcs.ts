export const vpcId = "notionCloneVpc";

export const vpcEndpoints = {
  ecr: {
    api: "notionCloneVpcEndpointEcrApi",
    dkr: "notionCloneVpcEndpointEcrDkr",
  },
  s3: "notionCloneVpcEndpointS3",
} as const;
