## Service Discovery
##################################################################

resource "aws_service_discovery_private_dns_namespace" "main" {
  name        = "crm-${local.env}.local"
  description = "Private DNS namespace for Shield services"
  vpc         = module.vpc.vpc_id
}

resource "aws_service_discovery_service" "account_termination" {
  name = "account-termination"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_service_discovery_service" "sample" {
  name = "sample"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 10
      type = "A"
    }
  }

  tags = {
    project = "crm-${local.env}"
  }
}