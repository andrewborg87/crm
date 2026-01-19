## Service Module Declarations
## Each service is a separate module for better organization
##################################################################

## Sample Service
module "sample" {
  source = "./services/sample"

  private_subnets = module.vpc.private_subnets

  private_sg_id               = aws_security_group.private_sg.id
  ecs_cluster_arn             = aws_ecs_cluster.cluster.arn
  ecs_task_execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  service_discovery_arn       = aws_service_discovery_service.sample.arn
  secrets_manager_arn         = aws_secretsmanager_secret.secrets.arn

  aws_lb_target_group = aws_lb_target_group.sample_tg.arn
}