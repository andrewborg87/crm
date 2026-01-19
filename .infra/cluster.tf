## ECS Cluster
##################################################################

resource "aws_ecs_cluster" "cluster" {
  name = "crm-${local.env}-cluster"

  setting {
    name  = "containerInsights"
    value = "enhanced"
  }

  tags = {
    project = "crm-${local.env}"
  }
}


## Metrics
###############################################################################
resource "aws_ecs_cluster_capacity_providers" "monitoring" {
  cluster_name = aws_ecs_cluster.cluster.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight           = 1
  }
}

## IAM Execution Role
##################################################################

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecsTaskExecutionRole-crm-${local.env}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution.json
}

data "aws_iam_policy_document" "ecs_task_execution" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

## Task Execution Role Policies
##################################################################

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "secrets_access" {
  name = "secrets-access-policy"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" = "Allow"
        "Action" = [
          "secretsmanager:GetSecretValue"
        ]
        "Resource" = aws_secretsmanager_secret.secrets.arn
      },
      {
        "Effect" = "Allow"
        "Action" = [
          "kms:Decrypt"
        ]
        "Resource" = "arn:aws:kms:us-east-1:313921724169:key/*"
        "Condition" = {
          "StringEquals" = {
            "kms:ViaService" = "secretsmanager.us-east-1.amazonaws.com"
          }
        }
      }
    ]
  })
}

