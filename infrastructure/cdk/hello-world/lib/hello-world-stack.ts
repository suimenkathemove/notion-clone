import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class HelloWorldStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_s3.Bucket(this, "MyFirstBucket", { versioned: true });
  }
}
