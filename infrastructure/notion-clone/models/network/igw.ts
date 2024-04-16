import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { DOMAIN_NAME, tags } from "@/models/domain";

export const createIgw = (
  scope: Construct,
  props: { vpc: cdk.aws_ec2.CfnVPC },
): cdk.aws_ec2.CfnInternetGateway => {
  const id = `${DOMAIN_NAME}-igw`;
  const igw = new cdk.aws_ec2.CfnInternetGateway(scope, id, {
    tags: tags(id),
  });
  new cdk.aws_ec2.CfnVPCGatewayAttachment(scope, `${id}-attachment`, {
    vpcId: props.vpc.ref,
    internetGatewayId: igw.ref,
  });

  return igw;
};
