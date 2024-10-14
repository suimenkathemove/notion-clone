# Architecture Diagram

```mermaid
flowchart TB

Client -->
Internet -->
internet-gateway -->
ALB -->
backend-api -->
Aurora
egress-vpc-endpoint <--> ECR
egress-vpc-endpoint <--> CloudWatch
gateway-vpc-endpoint <--> S3
ECS --> Fargate

subgraph aws-cloud[AWS Cloud]
  subgraph vpc[VPC]
    internet-gateway[Internet Gateway]
    subgraph ap-northeast-1a
      subgraph ingress-subnet["Ingress subnet(public)"]
        ALB
        ingress-route-table[Route table]
      end
      subgraph app-subnet[App subnet]
        subgraph Fargate
          subgraph ecs-task[ECS Task]
            backend-api[Backend API]
          end
        end
        app-route-table[Route table]
      end
      subgraph db-subnet[DB subnet]
        Aurora
        db-route-table[Route table]
      end
      subgraph egress-subnet[Egress subnet]
        egress-vpc-endpoint["VPC Endpoint(Interface)"]
        egress-route-table[Route table]
      end
      gateway-vpc-endpoint["VPC Endpoint(Gateway)"]
    end
  end
  ECR
  CloudWatch
  S3
  subgraph ECS
    subgraph Service
      Task
    end
  end
end
```
