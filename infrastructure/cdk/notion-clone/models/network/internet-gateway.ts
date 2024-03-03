import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export const createInternetGateway = (
  scope: Construct,
  props: { vpc: cdk.aws_ec2.CfnVPC },
): cdk.aws_ec2.CfnInternetGateway => {
  const internetGateway = new cdk.aws_ec2.CfnInternetGateway(
    scope,
    "internet-gateway",
  );
  new cdk.aws_ec2.CfnVPCGatewayAttachment(scope, "vpc-gateway-attachment", {
    vpcId: props.vpc.ref,
    internetGatewayId: internetGateway.ref,
  });

  return internetGateway;
};
