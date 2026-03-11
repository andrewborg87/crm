## Redis Cache
##################################################################

resource "aws_elasticache_subnet_group" "redis_subnet" {
  name       = "crm-${local.env}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "crm-${local.env}-redis"
  engine               = "redis"
  engine_version       = "7.x"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7.x"
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet.name
  security_group_ids   = [aws_security_group.private_sg.id]

  tags = {
    project = "crm-${local.env}"
  }
}