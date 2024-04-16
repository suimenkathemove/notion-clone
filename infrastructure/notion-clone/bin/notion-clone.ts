#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";

import { NotionCloneStack } from "@/lib/notion-clone-stack";

const app = new cdk.App();

new NotionCloneStack(app, "NotionCloneStack");
