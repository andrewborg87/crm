## Network Load Balancer
##################################################################

resource "aws_lb" "nlb" {
  name               = "crm-${local.env}-nlb"
  load_balancer_type = "network"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.private_sg.id]

  tags = {
    project = "crm-${local.env}"
  }
}

## Listeners
##################################################################

resource "aws_lb_listener" "database_listener" {
  load_balancer_arn = aws_lb.nlb.arn
  port              = 5432
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.database_tg.arn
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Target Groups
##################################################################

resource "aws_lb_target_group" "database_tg" {
  name        = "crm-${local.env}-pg-tg"
  port        = 5432
  protocol    = "TCP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    protocol            = "TCP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    project = "crm-${local.env}"
  }
}

