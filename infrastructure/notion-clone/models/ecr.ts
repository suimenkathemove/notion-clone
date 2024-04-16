import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { DOMAIN_NAME, tags } from "@/models/domain";

export const createEcrRepository = (scope: Construct) => {
  const id = `${DOMAIN_NAME}-repository`;
  new cdk.aws_ecr.CfnRepository(scope, id, {
    repositoryName: DOMAIN_NAME,
    tags: tags(id),
  });
};
