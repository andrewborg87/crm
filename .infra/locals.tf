locals {
  env = terraform.workspace

  env_vars = {
    staging = {
      domain = "example.com"
    }
  }

  environment_variables = local.env_vars[local.env]
}