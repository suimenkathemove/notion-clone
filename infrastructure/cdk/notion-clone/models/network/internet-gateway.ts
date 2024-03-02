import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export const attachInternetGateway = (
  scope: Construct,
  props: { vpc: cdk.aws_ec2.CfnVPC },
): void => {
  const internetGateway = new cdk.aws_ec2.CfnInternetGateway(
    scope,
    "internet-gateway",
  );
  new cdk.aws_ec2.CfnVPCGatewayAttachment(scope, "vpc-gateway-attachment", {
    vpcId: props.vpc.ref,
    internetGatewayId: internetGateway.ref,
  });
};
