import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export const createEcrRepository = (scope: Construct) => {
  new cdk.aws_ecr.CfnRepository(scope, "notionClone", {
    repositoryName: "notion-clone",
  });
};
