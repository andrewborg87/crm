## Secrets Manager
##################################################################

resource "aws_secretsmanager_secret" "secrets" {
  name        = "crm-${local.env}-secrets"
  description = "CRM ${local.env} Secrets Manager"

  tags = {
    project = "crm-${local.env}"
  }
}