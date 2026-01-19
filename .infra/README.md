## Terraform Basics

Terraform defines the AWS infrastructure as code using configuration files written in HashiCorp Configuration Language (HCL).

### Install Terraform

On a macOS system, you can install Terraform using Homebrew:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -install-autocomplete
```

### Connecting to AWS

Ensure that your AWS credentials are configured properly. You can set them using environment variables or the AWS credentials file.

Make sure AWS CLI is installed:

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

Then configure your AWS credentials:

```bash
aws configure
```

> Obtain your AWS Access Key ID and Secret Access Key from the AWS Management Console under your IAM user settings.
> Configure the default region to `us-east-1`.

### Initializing Terraform
Before using Terraform, initialize your working directory with the following command:

```bash
cd .infra
terraform init
```

> Please navigate to `.terraform/modules/vpc/main.tf` and remove line 1044 `vpc = true`

# Using Terraform

Terraform contains the infrastructure code to manage AWS resources for the project. Everything which is in AWS is 
defined in the `.infra` folder.

Before using terraform we need to set the correct workspace. 

A workspace in terraform defines the environment in AWS, for example to manage our `staging` environment in AWS we need 
to use the terraform `staging` workspace.

```bash
terraform workspace select staging
```

> It is very important to always select the correct terraform workspace before running any terraform commands.

If a new AWS environment is required, then a new terraform workspace needs to be created. For example, if we are creating
a new environment for a brand called `brand-x` then we need to create a new terraform workspace:

```bash
terraform workspace new brand-x
```

Afterward, select the newly created workspace:

```bash
terraform workspace select brand-x
```

### Deploying a new Environment

To deploy a new environment, create a new terraform workspace as shown above and then run the following commands:

```bash
terraform apply
```

This will create all the necessary AWS resources for the new environment.


#### Caveats when creating a new environment

- Create the correct secrets in AWS Secrets Manager for the new environment, see the existing secrets for reference.
- Update any CI/CD pipelines to deploy to the new environment.

> Apply secrets required for the new environment in [AWS Secrets Manager](https://us-east-1.console.aws.amazon.com/secretsmanager/listsecrets?region=us-east-1)

**Secrets required:**

```json
{
  "DATABASE_USERNAME": "XXXXXXXXXXXX",
  "DATABASE_PASSWORD": "XXXXXXXXXXXX",
  "DATABASE_NAME": "XXXXXXXXXXXX",
  "ENCRYPTION_KEY": "XXXXXXXXXXXX",
  "SENTRY_DSN": "XXXXXXXXXXXX"
}
```

### Making changes to the existing infrastructure

If changes are made to the terraform configuration files, then you need to run the following commands to apply the changes:

```bash
terraform apply
```

It is good practice to always run `terraform plan` first to see what changes will be made before applying them.

> You can verify your changes are defined correctly by running `terraform validate`

### Deleting an Environment

To delete an environment, first select the correct terraform workspace and then run the following command:

```bash
terraform destroy
```

> Note that this will permanently delete all AWS resources associated with the selected environment.