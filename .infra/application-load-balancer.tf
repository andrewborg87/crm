## Application Load Balancer
##################################################################

resource "aws_lb" "alb" {
  name               = "crm-${local.env}-alb"
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  security_groups    = [aws_security_group.private_sg.id]

  tags = {
    project = "crm-${local.env}"
  }
}

## Listeners
##################################################################

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sample_tg.arn
  }

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sample_tg.arn
  }

  tags = {
    project = "crm-${local.env}"
  }
}

resource "aws_lb_listener" "sample" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 8080
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sample_tg.arn
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Target Groups
##################################################################

resource "aws_lb_target_group" "sample_tg" {
  name        = "crm-${local.env}-sample-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    path                = "/"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }

  tags = {
    project = "crm-${local.env}"
  }
}

## Certificates
##################################################################

# resource "aws_acm_certificate" "alb_cert" {
#   domain_name       = local.environment_variables.domain
#   validation_method = "DNS"
#
#   subject_alternative_names = [
#     "*.${local.environment_variables.domain}"
#   ]
#
#   lifecycle {
#     create_before_destroy = true
#   }
#
#   tags = {
#     project = "crm-${local.env}"
#   }
# }
#
# resource "aws_acm_certificate_validation" "alb_cert" {
#   certificate_arn = aws_acm_certificate.alb_cert.arn
# }

