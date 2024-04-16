import * as cdk from "aws-cdk-lib";

export const DOMAIN_NAME = "notion-clone";

export const tags = (id: string): cdk.CfnTag[] => [{ key: "Name", value: id }];
