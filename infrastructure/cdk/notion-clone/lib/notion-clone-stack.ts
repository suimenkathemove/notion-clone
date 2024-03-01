import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { createNetwork } from "@/models/network";

export class NotionCloneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    createNetwork(this);
  }
}
