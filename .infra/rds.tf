## Enhanced Monitoring
##################################################################

resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "crm-rds-enhanced-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring_attach" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

## RDS Instance
##################################################################

resource "aws_db_instance" "postgres" {
  identifier              = "crm-${local.env}-rds-subnet"
  engine                 = "postgres"
  engine_version         = "17"
  instance_class         = local.env == "staging" ? "db.r5.large" : "db.t4g.micro"
  region                 = "us-east-1"
  allocated_storage      = 20
  db_name                = "crm"
  username               = random_string.rds_username.result
  password               = random_password.rds_password.result
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet.name
  vpc_security_group_ids = [aws_security_group.private_sg.id]
  parameter_group_name   = aws_db_parameter_group.postgres_params.name

  # Backup Configuration
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sat:04:00-sat:05:00"

  # Final Snapshot Configuration
  skip_final_snapshot       = false
  final_snapshot_identifier  = "crm-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  delete_automated_backups = false # Keep automated backups after deletion

  # Accessibility Configuration
  publicly_accessible = true

  # Monitoring Configuration
  monitoring_interval = 15
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn

  #  Performance Insights Configuration
  performance_insights_enabled = true

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_db_subnet_group" "rds_subnet" {
  name        = "crm-${local.env}-rds-subnet"
  description = "Subnet group for RDS"
  subnet_ids  = module.vpc.public_subnets

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_db_parameter_group" "postgres_params" {
  name        = "crm-${local.env}-postgres-params"
  family      = "postgres17" # Must match your engine version
  description = "Custom parameter group for Postgres"

  parameter {
    name         = "max_connections"
    value        = 30
    apply_method = "pending-reboot" # Requires a reboot to apply
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Credentials
##################################################################

resource "random_password" "rds_password" {
  length           = 16
  special          = true
  override_special = "!#$%*()_-="
}

resource "random_string" "rds_username" {
  length  = 8
  special = false
}


## Backups
##################################################################

resource "aws_db_snapshot_copy" "cross_region_backup" {
  source_db_snapshot_identifier  = aws_db_instance.postgres.latest_restorable_time
  target_db_snapshot_identifier  = "crm-cross-region-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  destination_region            = "us-east-2"

  tags = {
    project = "crm-${local.env}"
  }
}