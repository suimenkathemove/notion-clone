import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class LocalstackSandboxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloWorldFunction = new lambda.Function(
      this,
      "hello-world-function",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("lib/lambda"),
        handler: "hello-world.handler",
      }
    );
    new apigateway.LambdaRestApi(this, "api", { handler: helloWorldFunction });
  }
}
