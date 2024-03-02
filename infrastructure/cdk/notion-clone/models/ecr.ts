import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const REPOSITORY_NAME = "notion-clone";

export const createEcrRepository = (scope: Construct) => {
  new cdk.aws_ecr.CfnRepository(scope, "ecr", {
    repositoryName: REPOSITORY_NAME,
  });
};
