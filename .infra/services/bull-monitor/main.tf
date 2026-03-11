## ECR Repository
###############################################################################
resource "aws_ecr_repository" "bull_monitor" {
  name = local.env == "staging" ? "crm-${local.env}-bull_monitor" : "crm-bull-monitor"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Log Group
###############################################################################
resource "aws_cloudwatch_log_group" "bull_monitor" {
  name              = "/ecs/crm-${local.env}-bull-monitor"
  retention_in_days = 7

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Task Definition & Service
###############################################################################
resource "aws_ecs_task_definition" "bull_monitor" {
  family                   = "crm-${local.env}-bull-monitor"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_execution_role_arn

  container_definitions = templatefile("services/bull-monitor/task.json", {
    aws_region              = "us-east-1"
    image_uri               = "${aws_ecr_repository.bull_monitor.repository_url}:latest"
    logs_group              = aws_cloudwatch_log_group.bull_monitor.name
    secrets_manager_arn     = var.secrets_manager_arn
    redis_host              = var.redis_host
    redis_port              = var.redis_port
    env                     = local.env
  })

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_ecs_service" "bull_monitor" {
  name            = "bull-monitor"
  cluster         = var.ecs_cluster_arn
  task_definition = aws_ecs_task_definition.bull_monitor.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    container_name = "bull-monitor"
    container_port = 3000
    target_group_arn = var.aws_lb_target_group
  }

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [var.private_sg_id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = var.service_discovery_arn
    container_name = "bull-monitor"
  }

  tags = {
    project = "crm-${local.env}"
  }
}