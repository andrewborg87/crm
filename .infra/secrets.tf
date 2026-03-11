## Secrets Manager
##################################################################

resource "aws_secretsmanager_secret" "secrets" {
  name        = "crm-${local.env}-secrets"
  description = "CRM ${local.env} Secrets Manager"

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.secrets.id
  secret_string = jsonencode({
    DATABASE_USERNAME = aws_db_instance.postgres.username
    DATABASE_PASSWORD = aws_db_instance.postgres.password
    DATABASE_NAME     = aws_db_instance.postgres.db_name
  })
}