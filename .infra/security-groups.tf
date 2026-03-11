## Security Groups
##################################################################

# Global private security group
resource "aws_security_group" "private_sg" {
  name        = "crm-${local.env}-sg"
  description = "Security group for CRM ${local.env}"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Allow all traffic from same security group"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    self            = true
  }

  ingress {
    description     = "Allow Postgres"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = concat(
      ["154.16.203.45/32"], # VPN IP Address
      module.vpc.private_subnets_cidr_blocks,
      module.vpc.public_subnets_cidr_blocks
    )
  }

  ingress {
    description     = "Allow HTTP"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    description     = "Allow HTTPS"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    description     = "Allow Kafka UI"
    from_port       = 8090
    to_port         = 8090
    protocol        = "tcp"
    cidr_blocks     = concat(
      ["154.16.203.45/32"], # VPN IP Address
      module.vpc.private_subnets_cidr_blocks,
      module.vpc.public_subnets_cidr_blocks
    )
  }

  ingress {
    description     = "Allow Bull Monitor"
    from_port       = 8091
    to_port         = 8091
    protocol        = "tcp"
    cidr_blocks     = concat(
      ["154.16.203.45/32"], # VPN IP Address
      module.vpc.private_subnets_cidr_blocks,
      module.vpc.public_subnets_cidr_blocks
    )
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}